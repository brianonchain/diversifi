"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
// zustand
import { useVaultIdStore } from "@/store";
import { networks } from "@/Providers";
// wagmi
import { useAccount, useSwitchChain } from "wagmi";

export default function SelectChain({ defaultVaultIds }: { defaultVaultIds: { [key: string]: string } }) {
  // zustand
  const vaultId = useVaultIdStore((state) => state.vaultId);
  const setVaultId = useVaultIdStore((state) => state.setVaultId);
  console.log("vaultId", vaultId);
  const chainState = vaultId.split("_")[0];

  // hooks
  const router = useRouter();
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();

  return (
    <>
      {networks.map((i) => (
        <div
          key={i.id}
          onClick={async (e) => {
            setVaultId(defaultVaultIds[i.name]);
            router.push(`/?vaultId=${defaultVaultIds[i.name]}`);
          }}
          className={`${
            chain?.id === i.id ? "selectGlass" : ""
          } flex flex-col items-center justify-center hover:selectGlass w-[68px] h-[68px] xs:w-[84px] xs:h-[88px] rounded-lg cursor-pointer`}
        >
          <Image src={`/${i.name.toLowerCase()}.svg`} alt={i.name} width={0} height={0} className="w-[30px] h-[30px] xs:w-[50px] xs:h-[50px]" />
          <div className="mt-[2px] text-xs">{i.name}</div>
        </div>
      ))}
    </>
  );
}
