"use client";
import { useState } from "react";
import Image from "next/image";
import { useSwitchChain, useAccount } from "wagmi";
// import { config } from "@/config";

const page = () => {
  type VaultIcon = {
    id: string;
    title: string;
    src: string;
  };
  type AllVaults = { [key: string]: VaultIcon[] };
  const allVaults: AllVaults = {
    Optimism: [{ id: "op-stables1", title: "Optimism Stablecoin Vault", src: "/op-stables1.svg" }],
    Arbitrum: [
      { id: "arb-stables1", title: "Arbitrum Stablecoin Vault", src: "/arb-stables1.svg" },
      { id: "arb-glp", title: "Arbitrum GLP Vault", src: "/arb-glp.svg" },
    ],
    Base: [{ id: "base-stables1", title: "Base Stablecoin Vault", src: "/base-stables1.svg" }],
    zkSync: [{ id: "base-stables1", title: "zkSync Stablecoin Vault", src: "/zksync-stables1.svg" }],
    Linea: [{ id: "linea-stables1", title: "Linea Stablecoin Vault", src: "/linea-stables1.svg" }],
    Scroll: [{ id: "scroll-stables1", title: "Scroll Stablecoin Vault", src: "/scroll-stables1.svg" }],
    Sepolia: [{ id: "sepolia-stables1", title: "Sepolia Stablecoin Vault", src: "/sepolia-stables1.svg" }],
  };

  const chains = ["Arbitrum", "Base", "Linea", "Scroll", "Sepolia"];
  type Chain2Id = { [key: string]: number };
  const chain2Id = {
    Optimism: 10,
    Arbitrum: 42161,
    Base: 8453,
    zkSync: 324,
    Linea: 59144,
    Scroll: 534352,
    Sepolia: 11155111,
  } as Chain2Id;
  // wagmi names: OP Mainnet, Arbitrum One, Base, zkSync Era, Scroll, Sepolia,

  const { switchChain } = useSwitchChain();
  const account = useAccount();

  const [selectedChain, setSelectedChain] = useState(Object.keys(chain2Id).find((key) => chain2Id[key] === account.chainId) ?? "Arbitrum");
  const [selectedVault, setSelectedVault] = useState<VaultIcon>(allVaults[selectedChain][0]);

  return (
    <main className="flex flex-col lg:flex-row w-full lg:h-[calc(100vh-92px)] bg-gray-100 space-y-3 lg:space-y-0 lg:space-x-4 p-4">
      {/*---SELECT CHAIN---*/}
      <div className="lg:w-[13%] h-full flex flex-col items-center p-4 bg-white rounded-xl drop-shadow-sm border border-gray-200">
        <div className="font-bold">Select chain</div>
        <div className="flex lg:block mt-2 xs:mt-4 space-x-1 lg:space-x-0 lg:space-y-3">
          {chains.map((i) => (
            <div
              id={i}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                setSelectedChain(e.currentTarget.id);
                setSelectedVault(allVaults[e.currentTarget.id][0]);
                switchChain({ chainId: chain2Id[e.currentTarget.id] });
              }}
              className={`${
                selectedChain === i ? "bg-gray-200" : ""
              } w-full flex items-center hover:bg-gray-200 px-2 xs:px-5 py-1 xs:py-3 rounded-lg drop-shadow-md cursor-pointer overflow-hidden`}
            >
              <div className="relative flex-none w-[36px] h-[36px]">
                <Image src={`/${i.toLowerCase()}.svg`} alt={i} fill className="rounded-full" />
              </div>
              <div className="ml-3">{i}</div>
            </div>
          ))}
        </div>
      </div>
      {/*---SELECT VAULT---*/}
      <div className="lg:w-[20%] h-full flex flex-col items-center p-4 bg-white rounded-xl drop-shadow-sm border border-gray-200 ">
        <div className="font-bold">Select Vault</div>
        <div className="mt-4 space-y-4">
          {allVaults[selectedChain].map((i) => (
            <div
              id={i.id}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                const vaultIndex = allVaults[selectedChain].findIndex((i) => i.id === e.currentTarget.id);
                setSelectedVault(allVaults[selectedChain][vaultIndex]);
              }}
              className={`${
                selectedVault.id === i.id ? "bg-gray-200" : ""
              } w-[120px] h-[120px] p-4 flex justify-center items-center border-2 border-gray-200 rounded-xl drop-shadow-md cursor-pointer hover:bg-gray-200`}
            >
              <div className="text-sm text-center pb-1">{i.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/*---VAULT DETAILS & DEPOSIT---*/}
      <div className="lg:w-[65%] h-full flex flex-col items-center p-4 bg-white rounded-xl drop-shadow-sm border border-gray-200">
        <div className="h-[50px] font-bold">{selectedVault.title} Details</div>
        {/*---description---*/}
        <div className="h-[150px] lg:h-[calc(100%-200px)]">description</div>
        {/*---deposit---*/}
        <div className="h-[150px]">
          <button className="px-3 py-2 rounded-lg text-white font-bold bg-blue-500 hover:bg-blue-400 cursor-pointer">Deposit</button>
        </div>
      </div>
    </main>
  );
};

export default page;
