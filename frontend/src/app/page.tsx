// nextjs
import { Suspense } from "react";
import Image from "next/image";
import { cookies } from "next/headers";
import { unstable_cache } from "next/cache";
// components
import SelectChain from "./_components/SelectChain";
import Deposit from "./_components/Deposit";
import HistoryClient from "./_components/HistoryClient";
import VaultDetails from "./_components/VaultDetails";
import SelectVaultClient from "./_components/SelectVaultClient";
import DetectUserAddress from "./_components/DetectUserAddress";
import ErrorModal from "./_components/ErrorModal";
// utils
import { LoadingGray24, LoadingGray40 } from "@/utils/components/LoadingGray";
// db
import dbConnect from "@/db/dbConnect";
import VaultModel from "@/db/VaultModel";

const getCachedVaultIds = unstable_cache(async () => getVaultIds(), ["vaultIds"]);

async function getVaultIds() {
  await dbConnect();
  const vaults = await VaultModel.find({}, { chain: 1, "vaults.title": 1 });
  let vaultIds: any = {};
  for (const vault of vaults) {
    const chain: string = vault.chain;
    vaultIds[chain] = vault.vaults.map((i: any) => i.title.replaceAll(" ", "_"));
  }
  return vaultIds;
}

export default async function Vaults({ searchParams }: { searchParams: Promise<{ vault: string }> }) {
  const date = new Date();
  const time = date.toLocaleTimeString("en-US", { hour12: false }) + `.${date.getMilliseconds()}`;

  const vaultIds = await getCachedVaultIds();

  // get states from search params
  const vaultId = (await searchParams)?.vault ?? "Polygon_Stablecoin_Vault";

  // get states from cookies
  const userAddressFromCookies = (await cookies()).get("userAddress")?.value;

  console.log("page.tsx", time, "vaultId:", vaultId, "userAddressFromCookies:", userAddressFromCookies, "vaultIds", vaultIds);

  return (
    <main className="w-full grow lg:min-h-0 flex justify-center lg:bgVaults">
      <DetectUserAddress />
      <ErrorModal />
      <div className="pb-[16px] sectionSize h-full grid grid-rows-[auto,auto,auto] lg:grid-cols-[auto_152px_1fr] lg:grid-rows-[1fr] gap-[16px]">
        <SelectChain />
        <div className="px-[12px] py-[24px] xs:p-[16px] cardBg4 rounded-xl flex flex-col items-center">
          <SelectVaultClient vaultIds={vaultIds} />
        </div>

        {/*--- DESCRIPTION, DEPOSIT, HISOTRY ---*/}
        <div className="grid grid-cols-[1fr] grid-rows-[auto_360px_360px] lg:grid-cols-[1fr_300px] lg:grid-rows-[270px_1fr] justify-items-center cardBg4 rounded-xl overflow-hidden bg-red-300">
          {/*--- DESCRIPTION ---*/}
          <div className="py-[40px] lg:py-0 lg:row-span-2 w-full flex flex-col items-center border-b lg:border-r border-slate-600">
            <Suspense
              fallback={
                <div className="grow flex items-center justify-center">
                  <LoadingGray40 />
                </div>
              }
              key={vaultId}
            >
              <VaultDetails vaultId={vaultId} />
            </Suspense>
          </div>

          {/*--- DEPOSIT ---*/}
          <div className="py-[40px] lg:py-0 w-full h-full flex flex-col items-center border-b border-slate-600">
            <Deposit vaultId={vaultId} />
          </div>

          {/*--- HISTORY ---*/}
          <div className="py-[40px] lg:py-0 lg:!pt-[12px] w-[300px] lg:w-full flex flex-col items-center text-xs lg:min-h-0">
            <div className="text-sm font-semibold">History</div>
            <div className="pt-[8px] pb-[4px] px-[16px] w-full grid grid-cols-3 gap-2 text-slate-500 underline underline-offset-4 font-medium">
              <div className="">Date</div>
              <div className="text-right">Deposit</div>
              <div className="text-right">Withdrawal</div>
            </div>
            {userAddressFromCookies ? <HistoryClient userAddressFromCookies={userAddressFromCookies} vaultId={vaultId} /> : <div className="grow"></div>}
            <div className="pt-[8px] lg:pt-0 pb-1 w-full lg:px-4 flex justify-end items-center">
              <div className="text-xs font-medium text-[#77798F]">powered by</div>
              <Image src="/thegraph.svg" alt="thegraph" width={0} height={0} className="ml-2 pt-1 w-[80px] opacity-50" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
