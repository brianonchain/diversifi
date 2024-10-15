"use server";
import dbConnect from "@/db/dbConnect";
import UserModel from "@/db/UserModel";
import { revalidatePath } from "next/cache";

export async function changeSelectedVaultIndex(vaultIndex: number) {
  // some authenticating logic
  await dbConnect();
  await UserModel.findOneAndUpdate({ user: "brianonchain" }, { vaultIndex: vaultIndex });

  revalidatePath("/");
}
