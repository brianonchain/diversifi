"use client";
// zustaand
import { useUserVaultIndexStore } from "@/store";

export default function UserVaults({ userAddressFromCookies, userVaults }: { userAddressFromCookies: string; userVaults: any }) {
  const date = new Date();
  const time = date.toLocaleTimeString("en-US", { hour12: false }) + `.${date.getMilliseconds()}`;
  console.log("/dashboard UserVaults.tsx", time);

  // zustand
  const userVaultIndex = useUserVaultIndexStore((state) => state.userVaultIndex);
  const setUserVaultIndex = useUserVaultIndexStore((state) => state.setUserVaultIndex);

  // select info
  const selectedUserVault = userVaults[userVaultIndex];

  return (
    <>
      <div className="mt-5">
        {/*---title---*/}
        <div className="text-xl font-bold text-center bg-">{selectedUserVault ? selectedUserVault.title : "All Vaults"}</div>
        {/*---total---*/}
        <div className="mt-4 flex justify-center text-3xl font-bold">
          {selectedUserVault ? `$${Number((selectedUserVault.principal + selectedUserVault.earned).toFixed(2)).toLocaleString()}` : <div className="skeleton">00000000</div>}
        </div>
        {/*---details---*/}
        <div className="mt-4 px-1 flex justify-between">
          <div className="flex flex-col">
            <div className="text-xs font-medium text-text2">PRINCIPAL</div>
            <div>{selectedUserVault ? `$${Number(selectedUserVault.principal.toFixed(2)).toLocaleString()}` : <span className="skeleton">00000000</span>}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-xs font-medium text-text2">EARNED</div>
            <div>{selectedUserVault ? `$${Number(selectedUserVault.earned.toFixed(2)).toLocaleString()}` : <span className="skeleton">00000000</span>}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-xs font-medium text-text2">PERFORMANCE</div>
            <div>{selectedUserVault ? `${Number(selectedUserVault.performance.toFixed(1))}%` : <span className="skeleton">0000</span>}</div>
          </div>
        </div>
      </div>

      <div className="mt-10 mb-10 lg:mb-0 border border-slate-500 rounded-xl overflow-hidden">
        {userVaults.map((i: any, index: number) => (
          <div
            id={i.id}
            key={index}
            onClick={() => setUserVaultIndex(index)}
            className={`${userVaultIndex === index ? "bg-button1" : ""} ${
              index === userVaults.length - 1 ? "" : "border-b"
            } h-[52px] font-bold flex items-center px-4 hover:bg-blue4 border-slate-500 transition-color duration-300 cursor-pointer`}
          >
            {i.title}
          </div>
        ))}
      </div>
    </>
  );
}
