// nextjs
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// components
import Chart from "./_components/Chart";
import UserVaults from "./_components/UserVaults";
// db
import dbConnect from "@/db/dbConnect";
import UserModel from "@/db/UserModel";

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ user?: string }> }) {
  // Because dashboard is a view-only route, don't need fancy revalidation from React Query, can just fetch userInfo in page.tsx and pass it down through props
  console.log("page.tsx");

  const userAddress = (await searchParams).user;
  if (!userAddress) redirect("/");

  // get data from database
  if (userAddress) {
    await dbConnect();
    var doc = await UserModel.findOne({ userAddress: "0x709D8145D21681f8287a556C67cD58Cb8A7FB3Aa" }); // hardcoded to single address
    var userVaults = JSON.parse(JSON.stringify(doc.userVaults));
    var chartData = JSON.parse(JSON.stringify(doc.chartData));
  }

  return (
    <div className="flex-1 w-full flex justify-center">
      {userAddress ? (
        <div className="sectionSize h-full grid grid-rows-[repeat(3,600px)] lg:grid-cols-[1fr_2fr] lg:grid-rows-[1fr_1fr] gap-[24px]">
          {/*---LEFT CARD---*/}
          <div className="lg:row-span-2 cardBg h-full px-[24px] rounded-xl">
            <UserVaults userVaults={userVaults} />
          </div>
          {/*--- PERFORMANCE ---*/}
          <div className="px-6 py-4 w-full h-full rounded-xl flex flex-col items-center cardBg2 space-y-[12px]">
            <Chart userVaults={userVaults} chartData={chartData} />
          </div>
          {/*--- DETAILS ---*/}
          <div className="p-4 w-full h-full border-2 border-blue2 rounded-xl">Vault Details</div>
        </div>
      ) : (
        <div className="flex items-center">Connect wallet to view your dashboard</div>
      )}
    </div>
  );
}
