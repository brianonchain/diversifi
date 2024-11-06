"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
// zustand
import { useVaultIdStore } from "@/store";

const myChains = ["Polygon", "Optimism", "Arbitrum", "Base"];

export default function SelectChain({ defaultVaultIds }: { defaultVaultIds: { [key: string]: string } }) {
  // time
  const date = new Date();
  const time = date.toLocaleTimeString("en-US", { hour12: false }) + `.${date.getMilliseconds()}`;

  // zustand
  const vaultId = useVaultIdStore((state) => state.vaultId);
  const setVaultId = useVaultIdStore((state) => state.setVaultId);
  const chainState = vaultId.split("_")[0];

  // hooks
  const router = useRouter();

  console.log("\nSelectChain.tsx", time, "\nchainState", chainState);

  return (
    <>
      {myChains.map((i) => (
        <div
          id={i}
          key={i}
          onClick={async (e) => {
            const date = new Date();
            console.log("chain clicked", date.toLocaleTimeString("en-US", { hour12: false }) + `.${date.getMilliseconds()}`);
            setVaultId(defaultVaultIds[i]);
            router.push(`/?vault=${defaultVaultIds[i]}`);
          }}
          className={`${
            chainState === i ? "selectGlass" : ""
          } flex flex-col items-center justify-center hover:selectGlass w-[68px] h-[68px] xs:w-[84px] xs:h-[88px] rounded-lg cursor-pointer`}
        >
          <Image src={`/${i.toLowerCase()}.svg`} alt={i} width={0} height={0} className="w-[30px] h-[30px] xs:w-[50px] xs:h-[50px]" />
          <div className="mt-[2px] text-xs">{i}</div>
        </div>
      ))}
    </>
  );
}
