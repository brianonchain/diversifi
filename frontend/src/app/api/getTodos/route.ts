import dbConnect from "@/db/dbConnect";
import UserModel from "@/db/UserModel";

export async function POST(req: Request) {
  console.log("entered getTodos");
  const { user } = await req.json();
  await dbConnect();

  try {
    const data = await UserModel.findOne({ user: user }, "todos");
    return Response.json(data.todos);
  } catch (e) {
    console.log(e);
    return Response.json("error");
  }
}
