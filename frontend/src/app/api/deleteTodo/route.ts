import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/db/dbConnect";
import UserModel from "@/db/UserModel";

export async function POST(request: NextRequest) {
  const { titleToDelete } = await request.json();
  await dbConnect();

  try {
    await UserModel.findOneAndUpdate(
      {
        user: "brianonchain",
      },
      {
        $pull: {
          todos: titleToDelete,
        },
      }
    );
    return NextResponse.json({ data: { success: true } });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: { message: e } });
  }
}

export const dynamic = "force-dynamic";
