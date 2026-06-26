"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from "plaid";
import { plaidClient } from "../plaid";
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla.action";
import { toast } from "sonner";

const {
  APPWRITE_DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID,
} = process.env;

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const { database } = await createAdminClient();
    const user = await database.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_USER_COLLECTION_ID!,
      [Query.equal("userId", userId)],
    );
    if (!user?.documents[0]) return null;
    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const signIn = async (userData: signInProps) => {
  const { email, password } = userData;
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession({
      email,
      password,
    });
    const co = await cookies();
    co.set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    const user = await getUserInfo({ userId: session.userId });
    return parseStringify(user);
  } catch (error) {
    console.error("ERROR" + error);
  }
};

export const signUp = async (userData: SignUpParams) => {
  const {
    firstName,
    lastName,
    email,
    address,
    city,
    state,
    postalCode,
    dateOfBirth,
    ssn,
    password,
  } = userData;
  let newUserAccount;
  try {
    const { account, database } = await createAdminClient();

    newUserAccount = await account.create({
      userId: ID.unique(),
      email,
      password,
      name: `${userData.firstName} ${userData.lastName}`,
    });
    if (!newUserAccount) throw new Error("Error in creating user");

    const dwollaCustomerUrl = await createDwollaCustomer({
      firstName,
      lastName,
      email,
      address1: address,
      city,
      state,
      postalCode,
      dateOfBirth,
      ssn,
      type: "personal",
    });

    if (!dwollaCustomerUrl)
      throw new Error("Error in creating dwolla customer");
    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);
    const newUser = await database.createDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_USER_COLLECTION_ID!,
      ID.unique(),
      {
        firstName,
        lastName,
        email,
        address,
        city,
        state,
        postalCode,
        dateOfBirth,
        ssn,
        name: `${firstName} ${lastName}`,
        userId: newUserAccount.$id,
        dwollaCustomerId,
        dwollaCustomerUrl,
      },
    );

    const session = await account.createEmailPasswordSession({
      email,
      password,
    });
    const co = await cookies();

    co.set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    // redirect("/account");
    return parseStringify(newUser); // as large object can't be sent so stringify and parse
  } catch (error) {
    console.error("ERROR" + error);
  }
};

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();

    const user = await getUserInfo({ userId: result.$id });

    return parseStringify(user);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const logout = async () => {
  try {
    const { account } = await createSessionClient();
    const cook = await cookies();
    cook.delete("appwrite-session");
    await account.deleteSession("current");
  } catch (error) {
    return null;
  }
};

export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: user.name,
      products: ["auth", "transactions"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };
    const response = await plaidClient.linkTokenCreate(tokenParams);
    return parseStringify({ linkToken: response.data.link_token });
  } catch (error) {
    console.log(error);
  }
};

export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    // exchange public token for access token and item id
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // get account info from plaid using access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });
    const account = accountsResponse.data.accounts[0];

    // create processor token using access token and account id
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: account.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };
    const processorTokenResponse =
      await plaidClient.processorTokenCreate(request);
    const processorToken = processorTokenResponse.data.processor_token;

    // funding source
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: account.name,
    });
    if (!fundingSourceUrl) throw new Error("Funding source not created");
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: account.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encryptId(account.account_id),
    });
    revalidatePath("/");
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    console.log("An error occurred while creating the processor token", error);
  }
};
export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}: createBankAccountProps) => {
  try {
    const { database } = await createAdminClient();
    const bankAccount = await database.createDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_BANK_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        shareableId,
      },
    );
    return parseStringify(bankAccount);
  } catch (error) {
    console.log(error);
  }
};

export const getBanks = async ({ userId }: getBanksProps) => {
  if (!userId) return [];
  try {
    const { database } = await createAdminClient();
    const banks = await database.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_BANK_COLLECTION_ID!,
      [Query.equal("userId", userId)],
    );
    return parseStringify(banks.documents);
  } catch (error) {
    console.log(error);
    return [];
  }
};
export const getBank = async ({ documentId }: getBankProps) => {
  try {
    const { database } = await createAdminClient();
    const bank = await database.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_BANK_COLLECTION_ID!,
      [Query.equal("$id", [documentId])],
    );
    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error);
  }
};
export const getBankByAccountId = async ({
  accountId,
}: getBankByAccountIdProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_BANK_COLLECTION_ID!,
      [Query.equal("accountId", [accountId])],
    );

    if (bank.total !== 1) return null;

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.error("Error", error);
    return null;
  }
};
