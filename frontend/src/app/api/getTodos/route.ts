import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/db/dbConnect";
import UserModel from "@/db/UserModel";

export async function GET(request: NextRequest) {
  console.log("entered getTodos");
  await dbConnect();

  try {
    const data = await UserModel.findOne({ user: "brianonchain" }, "todos");
    return NextResponse.json(data.todos);
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: { message: e } });
  }
}
