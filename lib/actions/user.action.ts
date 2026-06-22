"use server";

import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";

export const signIn = async (userData: signInProps) => {
  const { email, password } = userData;
  try {
    const { account } = await createAdminClient();
    const response = await account.createEmailPasswordSession({
      email,
      password,
    });
    return parseStringify(response);
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
    addharCardNumber,
    password,
  } = userData;
  try {
    const { account } = await createAdminClient();

    const newUserAccount = await account.create({
      userId: ID.unique(),
      email,
      password,
      name: `${userData.firstName} ${userData.lastName}`,
    });
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
    return parseStringify(newUserAccount); // as large object can't be sent so stringify and parse
  } catch (error) {
    console.error("ERROR" + error);
  }
};
export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    // return await account.get(); GIVES NULL AS BIG OBJECT
    const user = await account.get();
    return parseStringify(user);
  } catch (error) {
    return null;
  }
}

export const logout = async () => {
  try {
    const {account} = await createSessionClient();
    const cook=await cookies();
    cook.delete('appwrite-session');
    await account.deleteSession('current');
  } catch (error) {
    return null;
  }
};
