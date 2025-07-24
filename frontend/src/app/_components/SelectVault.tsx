"use client";
// next
import { useRouter, useSearchParams } from "next/navigation";
// zustand
import { useVaultIdStore } from "@/store";

export default function SelectVault({ vaultIds }: { vaultIds: any }) {
  // zustand
  // const vaultId = useVaultIdStore((state) => state.vaultId);
  // const setVaultId = useVaultIdStore((state) => state.setVaultId);
  // const chain = vaultId.split("_")[0];

  // hooks
  const router = useRouter();
  const searchParams = useSearchParams();
  const vaultId = searchParams.get("vaultId") ?? "Sepolia_Stablecoin_Vault";
  const chain = vaultId?.split("_")[0];

  console.log("\nSelectVault.tsx", "\nvaultIds:", vaultIds, "\nvaultId", vaultId, "\nchain", chain);

  return (
    <>
      {vaultIds[chain].map((i: string) => (
        <div
          key={i}
          onClick={() => {
            // setVaultId(i);
            router.push(`/?vaultId=${i}`);
          }}
          className={`${
            vaultId === i ? "selectGlass" : ""
          } w-[90px] h-[90px] xs:w-[120px] xs:h-[120px] px-4 flex justify-center items-center rounded-xl cursor-pointer hover:selectGlass`}
        >
          <div className="text-sm text-center pb-1">{i.replaceAll("_", " ")}</div>
        </div>
      ))}
    </>
  );
}
