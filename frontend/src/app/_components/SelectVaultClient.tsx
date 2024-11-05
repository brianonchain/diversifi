"use client";
// next
import { useRouter } from "next/navigation";
// components
import { LoadingGray40 } from "@/utils/components/LoadingGray";

export default function SelectVault({ vaultIds, vaultId }: { vaultIds: string[]; vaultId: string }) {
  // time
  const date = new Date();
  const time = date.toLocaleTimeString("en-US", { hour12: false }) + `.${date.getMilliseconds()}`;
  console.log("\nSelectVaultClient.tsx", time, "\nvaultIds:", vaultIds, "\nvaultId", vaultId);

  // search params
  const router = useRouter();

  return (
    <>
      <div className="mb-2 xs:mb-4 font-bold">Vaults</div>
      {vaultIds ? (
        <div className="grid grid-flow-col lg:grid-flow-row gap-[12px] xs:gap-[24px]">
          {vaultIds.map((i) => (
            <div
              id={i}
              key={i}
              onClick={(e) => router.push(`/?vault=${e.currentTarget.id}`)}
              className={`${
                vaultId === i ? "selectGlass" : ""
              } w-[90px] h-[90px] xs:w-[120px] xs:h-[120px] px-4 flex justify-center items-center rounded-xl cursor-pointer hover:selectGlass`}
            >
              <div className="text-sm text-center pb-1">{i.replaceAll("_", " ")}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="lg:grow flex items-center justify-center h-[90px] xs:h-[120px] lg:h-auto lg:w-[120px]">
          <LoadingGray40 />
        </div>
      )}
    </>
  );
}
