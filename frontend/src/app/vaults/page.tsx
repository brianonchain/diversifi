"use client";
import { useState } from "react";
import Image from "next/image";

const page = () => {
  type VaultIcon = {
    id: string;
    title: string;
    src: string;
  };
  type AllVaults = { [key: string]: VaultIcon[] };
  const allVaults: AllVaults = {
    Arbitrum: [
      { id: "arb-stables1", title: "Arbitrum Stablecoin Vault", src: "/arb-stables1.svg" },
      { id: "arb-glp", title: "Arbitrum GLP Vault", src: "/arb-glp.svg" },
    ],
    Polygon: [{ id: "polygon-stables1", title: "Polygon Stablecoin Vault", src: "/polygon-stables1.svg" }],
    Optimism: [{ id: "op-stables1", title: "Optimism Stablecoin Vault", src: "/op-stables1.svg" }],
    Base: [{ id: "base-stables1", title: "Base Stablecoin Vault", src: "/base-stables1.svg" }],
  };

  const [selectedChain, setSelectedChain] = useState("Arbitrum");
  const [selectedVault, setSelectedVault] = useState<VaultIcon>(allVaults.Arbitrum[0]);

  const chains = ["Arbitrum", "Polygon", "Optimism", "Base"];

  return (
    <main className="flex flex-col lg:flex-row w-full lg:h-[calc(100vh-88px)] bg-gray-100 space-y-3 lg:space-y-0 lg:space-x-4 p-4 text-gray-700">
      {/*---SELECT CHAIN---*/}
      <div className="lg:w-[13%] h-full flex flex-col items-center p-4 bg-white rounded-xl drop-shadow-sm border border-gray-200 ">
        <div className="font-bold">Select chain</div>
        <div className="flex lg:block mt-2 xs:mt-4 space-x-1 lg:space-x-0 lg:space-y-2">
          {chains.map((i) => (
            <div
              id={i}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                setSelectedChain(e.currentTarget.id);
                setSelectedVault(allVaults[e.currentTarget.id][0]);
              }}
              className={`${
                selectedChain === i ? "bg-gray-200" : ""
              } flex flex-col items-center hover:bg-gray-200 px-2 xs:px-5 py-1 xs:py-3 rounded-lg drop-shadow-md cursor-pointer`}
            >
              <div className="relative flex-none w-[50px] h-[40px] xs:w-[50px] xs:h-[50px]">
                <Image src={`/${i.toLowerCase()}.svg`} alt={i} fill />
              </div>
              <div className="text-xs">{i}</div>
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
