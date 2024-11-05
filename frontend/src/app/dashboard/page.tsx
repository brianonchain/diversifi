// nextjs
import { cookies } from "next/headers";
// components
import Chart from "./_components/Chart";
import UserVaults from "./_components/UserVaults";
// db
import dbConnect from "@/db/dbConnect";
import UserModel from "@/db/UserModel";
import VaultModel from "@/db/VaultModel";

export default async function Dashboard({ searchParams }: { searchParams: { user_vault_index: number } }) {
  // Because dashboard is a view-only route, don't need fancy revalidation from mutations, so react query not needed
  // Can just fetch userInfo in page.tsx and pass it down through props

  const date1 = new Date();
  const time1 = date1.toLocaleTimeString("en-US", { hour12: false }) + `.${date1.getMilliseconds()}`;
  console.log("/dashboard page.tsx start", time1);

  // get cookies
  let userAddressFromCookies = (await cookies()).get("userAddress")?.value;
  userAddressFromCookies = "0x709D8145D21681f8287a556C67cD58Cb8A7FB3Aa"; // test app overrides value from cookie

  // get data from database
  if (userAddressFromCookies) {
    await dbConnect();
    var doc = await UserModel.findOne({ userAddress: userAddressFromCookies }); // 0x709D8145D21681f8287a556C67cD58Cb8A7FB3Aa
    var userVaults = JSON.parse(JSON.stringify(doc.userVaults));
    var chartData = JSON.parse(JSON.stringify(doc.chartData));
  }

  const date2 = new Date();
  const time2 = date2.toLocaleTimeString("en-US", { hour12: false }) + `.${date2.getMilliseconds()}`;
  console.log("/dashboard page.tsx end", time2);

  return (
    <div className="flex-1 w-full flex justify-center">
      {userAddressFromCookies ? (
        <div className="sectionSize h-full grid grid-rows-[repeat(3,600px)] lg:grid-cols-[1fr_2fr] lg:grid-rows-[1fr_1fr] gap-[24px]">
          {/*---LEFT CARD---*/}
          <div className="lg:row-span-2 cardBg h-full px-[24px] rounded-xl">
            <UserVaults userAddressFromCookies={userAddressFromCookies} userVaults={userVaults} />
          </div>
          {/*--- PERFORMANCE ---*/}
          <div className="px-6 py-4 w-full h-full rounded-xl flex flex-col items-center cardBg2 space-y-[12px]">
            <Chart userAddressFromCookies={userAddressFromCookies} userVaults={userVaults} chartData={chartData} />
          </div>
          {/*--- DETAILS ---*/}
          <div className="p-4 w-full h-full border-2 border-blue2 rounded-xl">Vault Details</div>
        </div>
      ) : (
        <div>Connect wallet</div>
      )}
    </div>
  );
}
