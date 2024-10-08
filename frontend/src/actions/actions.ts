"use server";
import dbConnect from "@/db/dbConnect";
import UserModel from "@/db/UserModel";
import { revalidatePath } from "next/cache";

export async function changeColor(color: string) {
  // some authenticating logic
  await dbConnect();
  await UserModel.findOneAndUpdate({ user: "brianonchain" }, { color: color });

  revalidatePath("/");
}
