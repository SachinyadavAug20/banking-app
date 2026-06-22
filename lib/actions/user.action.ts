"use server";

import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { parseStringify } from "../utils";

export const signIn = async (userData: signInProps) => {
  try {
  } catch (error) {
    console.error("ERROR" + error);
  }
};
export const signUp = async (userData: SignUpParams) => {
  const {
    firstName,
    lastName,
    email,
    address1,
    city,
    state,
    postalCode,
    dateOfBirth,
    ssn,
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
    return await account.get();
  } catch (error) {
    return null;
  }
}
