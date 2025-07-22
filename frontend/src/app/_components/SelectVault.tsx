"use client";
// next
import { useRouter } from "next/navigation";
// zustand
import { useVaultIdStore } from "@/store";

export default function SelectVault({ vaultIds }: { vaultIds: any }) {
  // time
  const date = new Date();
  const time = date.toLocaleTimeString("en-US", { hour12: false }) + `.${date.getMilliseconds()}`;

  // zustand
  const vaultId = useVaultIdStore((state) => state.vaultId);
  const setVaultId = useVaultIdStore((state) => state.setVaultId);
  const chain = vaultId.split("_")[0];

  console.log("\nSelectVaultClient.tsx", time, "\nvaultIds:", vaultIds, "\nvaultId", vaultId, "\nchain", chain);

  // router
  const router = useRouter();

  return (
    <>
      {vaultIds[chain].map((i: string) => (
        <div
          key={i}
          onClick={() => {
            setVaultId(i);
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
