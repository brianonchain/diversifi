// nextjs
import { cookies } from "next/headers";
// components
import LineChart from "./_components/Chart";
import SelectVault from "./_components/SelectVault";
// db
import dbConnect from "@/db/dbConnect";
import UserModel from "@/db/UserModel";

export default async function Dashboard({ searchParams }: { searchParams?: { vaultIndex: number } }) {
  // make API call to databse
  await dbConnect();
  const doc = await UserModel.findOne({ user: "brianonchain" });
  const userVaults = doc.userVaults;

  // get state from params
  const selectedVaultIndexFromSearchParams = searchParams?.vaultIndex ?? 0;
  // get state from cookies
  const selectedVaultIndex = cookies().get("vaultIndex")?.value ?? 0;

  const selectedVault = userVaults[selectedVaultIndex];

  return (
    <div className="flex-1 w-full flex justify-center">
      <div className="sectionSize h-full grid grid-rows-[repeat(3,600px)] lg:grid-cols-[1fr_2fr] lg:grid-rows-[1fr_1fr] gap-[24px]">
        {/*---LEFT CARD---*/}
        <div className="lg:row-span-2 cardBg h-full px-[24px] rounded-xl">
          {/*--- vault stats ---*/}
          <div className="mt-5">
            {/*---title---*/}
            <div className="text-xl font-bold text-center bg-">{selectedVault ? selectedVault.title : "All Vaults"}</div>
            {/*---total---*/}
            <div className="mt-4 flex justify-center text-3xl font-bold">
              {selectedVault ? `$${Number((selectedVault.principal + selectedVault.earned).toFixed(2)).toLocaleString()}` : <div className="skeleton">00000000</div>}
            </div>
            {/*---details---*/}
            <div className="mt-4 px-1 flex justify-between">
              <div className="flex flex-col">
                <div className="text-xs font-medium text-text2">PRINCIPAL</div>
                <div>{selectedVault ? `$${Number(selectedVault.principal.toFixed(2)).toLocaleString()}` : <span className="skeleton">00000000</span>}</div>
              </div>
              <div className="flex flex-col">
                <div className="text-xs font-medium text-text2">EARNED</div>
                <div>{selectedVault ? `$${Number(selectedVault.earned.toFixed(2)).toLocaleString()}` : <span className="skeleton">00000000</span>}</div>
              </div>
              <div className="flex flex-col">
                <div className="text-xs font-medium text-text2">PERFORMANCE</div>
                <div>{selectedVault ? `${Number(selectedVault.performance.toFixed(1))}%` : <span className="skeleton">0000</span>}</div>
              </div>
            </div>
          </div>
          {/*--- list of vaults ---*/}
          <SelectVault userVaultsString={JSON.stringify(userVaults)} />
          <div className="mt-8 text-xs text-slate-400">
            <span className="font-bold">Passing state from client to server:</span> This card is a server component, except for the 3 clickable vaults, which is a client component.
            State from the client can be passed to the server in 3 ways (below), thus allowing the server component to render dynamic data.
          </div>
          <div className="mt-2 grid grid-cols-[auto,auto] text-xs text-slate-400">
            <div>URL params</div>
            <div>vaultIndex: {selectedVaultIndexFromSearchParams}</div>
            <div>cookies</div>
            <div>vaultIndex: {selectedVaultIndex}</div>
            <div>external database</div>
            <div>vaultIndex: {doc.vaultIndex}</div>
          </div>
        </div>
        {/*--- PERFORMANCE ---*/}
        <div className="px-6 py-4 w-full h-full rounded-xl flex flex-col items-center cardBg2 space-y-[12px]">
          <div className="w-full font-medium">Performance: {selectedVault?.title ?? ""}</div>
          <div data-show="yes" className="w-[90%] h-[95%] flex justify-center items-center relative">
            {selectedVault && <LineChart selectedVaultString={JSON.stringify(selectedVault)} selectedChartDataString={JSON.stringify(doc.chartData[selectedVault.id])} />}
          </div>
        </div>
        {/*--- DETAILS ---*/}
        <div className="p-4 w-full h-full border-2 border-blue2 rounded-xl">Vault Details</div>
      </div>
    </div>
  );
}
