"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
// zustand
import { useChainStore, useVaultIdStore } from "@/store";

const myChains = ["Polygon", "Optimism", "Arbitrum", "Base"];

const defaultVaultId: { [key: string]: string } = {
  Polygon: "Polygon_Stablecoin_Vault",
  Optimism: "Optimism_Stablecoin_Vault",
  Arbitrum: "Arbitrum_Stablecoin_Vault",
  Base: "Base_Stablecoin_Vault",
};

export default function SelectChain() {
  // time
  const date = new Date();
  const time = date.toLocaleTimeString("en-US", { hour12: false }) + `.${date.getMilliseconds()}`;

  // search params
  const router = useRouter();

  // zustand - use this only if switching chain is laggy
  const setChain = useChainStore((state) => state.setChain);
  const vaultId = useVaultIdStore((state) => state.vaultId);
  const setVaultId = useVaultIdStore((state) => state.setVaultId);

  // chainState
  const chainState = vaultId.split("_")[0];

  console.log("\nSelectChain.tsx", time, "\nchainState", chainState);

  return (
    <div className="px-[12px] py-[24px] xs:p-[16px] cardBg4 rounded-xl flex flex-col items-center">
      <div className="lg:text-center font-bold">Chains</div>
      <div className="mt-2 xs:mt-4 grid grid-flow-col lg:grid-flow-row gap-[12px] xs:gap-[24px]">
        {myChains.map((i) => (
          <div
            id={i}
            key={i}
            onClick={async (e) => {
              const date = new Date();
              console.log("chain clicked", date.toLocaleTimeString("en-US", { hour12: false }) + `.${date.getMilliseconds()}`);
              setVaultId(`${i}_Stablecoin_Vault`);
              router.push(`/?vault=${defaultVaultId[i]}`);
            }}
            className={`${
              chainState === i ? "selectGlass" : ""
            } flex flex-col items-center justify-center hover:selectGlass w-[68px] h-[68px] xs:w-[84px] xs:h-[88px] rounded-lg cursor-pointer`}
            suppressHydrationWarning
          >
            <Image src={`/${i.toLowerCase()}.svg`} alt={i} width={0} height={0} className="w-[30px] h-[30px] xs:w-[50px] xs:h-[50px]" />
            <div className="mt-0.5 text-xs">{i}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
