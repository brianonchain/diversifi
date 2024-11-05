import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/db/dbConnect";
import UserModel from "@/db/UserModel";

export async function POST(req: NextRequest) {
  const { address } = await req.json();

  await dbConnect();

  try {
    const doc = await UserModel.findOne({ user: "brianonchain" });
    return NextResponse.json(doc);
  } catch {
    return NextResponse.json("failed to get doc");
  }
}
