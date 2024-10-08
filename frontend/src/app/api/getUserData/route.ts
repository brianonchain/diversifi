import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/db/dbConnect";
import UserModel from "@/db/UserModel";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const doc = await UserModel.findOne({ user: "brianonchain" });
    return NextResponse.json({ data: doc });
  } catch {
    return NextResponse.json({ error: { message: "failed to get user doc" } });
  }
}
