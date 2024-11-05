"use server";
import dbConnect from "@/db/dbConnect";
import UserModel from "@/db/UserModel";
import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export async function setUserAddressCookieAction(userAddress: `0x${string}`) {
  console.log("entered setUserAddressCookieAction");
  (await cookies()).set("userAddress", userAddress);
}

export async function revalidateDashboardAction() {
  revalidatePath("/dashboard");
}

export async function addTodoAction(title: string) {
  await dbConnect();
  try {
    await UserModel.findOneAndUpdate(
      { user: "brianonchain" },
      {
        $push: {
          todos: title,
        },
      }
    );
  } catch (e) {
    console.log(e);
    revalidatePath("/test");
  }
}
