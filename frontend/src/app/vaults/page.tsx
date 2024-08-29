"use client";
// nextjs
import { useState, useEffect } from "react";
import Image from "next/image";
// wagmi
import { useAccount, useSwitchChain } from "wagmi";
import { useWeb3Modal, useWeb3ModalState } from "@web3modal/wagmi/react";

type Vault = {
  id: string;
  title: string;
  src: string;
};
type AllVaults = { [key: string]: Vault[] };
const allVaults: AllVaults = {
  ArbitrumOne: [
    { id: "arb-stables1", title: "Arbitrum Stablecoin Vault", src: "/arb-stables1.svg" },
    { id: "arb-glp", title: "Arbitrum GLP Vault", src: "/arb-glp.svg" },
  ],
  Polygon: [{ id: "polygon-stables1", title: "Polygon Stablecoin Vault", src: "/polygon-stables1.svg" }],
  OPMainnet: [{ id: "op-stables1", title: "Optimism Stablecoin Vault", src: "/op-stables1.svg" }],
  Base: [{ id: "base-stables1", title: "Base Stablecoin Vault", src: "/base-stables1.svg" }],
};
const myChains = ["Arbitrum", "Polygon", "Optimism", "Base"];
const chainNameToChainId: { [key: string]: number } = { Arbitrum: 42161, Polygon: 137, Optimism: 10, Base: 8453 };
const page = () => {
  // hooks
  const { switchChain } = useSwitchChain();
  const { chain, isConnected } = useAccount();
  const { open } = useWeb3Modal();

  //state
  const [selectedVault, setSelectedVault] = useState<Vault>(allVaults[chain?.name.replace(" ", "") ?? "ArbitrumOne"][0]);
  // useEffect
  useEffect(() => {
    // prompt web3Modal if not yet connected
    if (!isConnected) {
      open();
    }

    // set selected vault to 0 index whenever user switches chain
    setSelectedVault(allVaults[chain?.name.replace(" ", "") ?? "ArbitrumOne"][0]);
  }, [chain]);

  return (
    <main className="bgVaults px-[16px] pb-[16px] flex flex-col lg:flex-row w-full lg:h-[calc(100vh-120px)] space-y-3 lg:space-y-0 lg:space-x-4">
      {/*---SELECT CHAIN---*/}
      <div className="cardBg4 lg:w-[13%] h-full flex flex-col items-center p-4 rounded-xl">
        <div className="font-bold">Select chain</div>
        <div className="flex lg:block mt-2 xs:mt-4 space-x-1 lg:space-x-0 lg:space-y-[8px]">
          {myChains.map((i, index) => (
            <div
              id={i}
              key={i}
              onClick={(e) => {
                if (isConnected) {
                  switchChain({ chainId: chainNameToChainId[e.currentTarget.id] });
                } else {
                  open();
                }
              }}
              className={`${
                chain?.id == chainNameToChainId[i] ? "selectGlass" : ""
              } flex flex-col items-center justify-center hover:selectGlass w-[84px] h-[88px] rounded-lg cursor-pointer`}
            >
              <div className="relative flex-none w-[50px] h-[40px] xs:w-[50px] xs:h-[50px]">
                <Image src={`/${i.toLowerCase()}.svg`} alt={i} fill />
              </div>
              <div className="mt-0.5 text-xs">{i}</div>
            </div>
          ))}
        </div>
      </div>
      {/*---SELECT VAULT---*/}
      <div className="lg:w-[20%] h-full flex flex-col items-center p-4 cardBg4 rounded-xl">
        <div className="font-bold">Select Vault</div>
        <div className="mt-4 space-y-4">
          {chain ? (
            allVaults[chain.name.replace(" ", "")].map((i, index) => (
              <div
                id={i.id}
                key={index}
                onClick={(e) => {
                  const vaultIndex = allVaults[chain.name.replace(" ", "")].findIndex((i) => i.id === e.currentTarget.id);
                  setSelectedVault(allVaults[chain.name.replace(" ", "")][vaultIndex]);
                }}
                className={`${
                  selectedVault.id === i.id ? "selectGlass" : ""
                } w-[120px] h-[120px] p-4 flex justify-center items-center rounded-xl cursor-pointer hover:selectGlass`}
              >
                <div className="text-sm text-center pb-1">{i.title}</div>
              </div>
            ))
          ) : (
            <div className="mt-[12px] text text-text2 text-center">
              Connect wallet to view
              <br /> available vaults
            </div>
          )}
        </div>
      </div>

      {/*---VAULT DETAILS & DEPOSIT---*/}
      <div className="cardBg4 lg:w-[65%] h-full flex flex-col items-center p-4 rounded-xl">
        <div className="h-[50px] font-bold">{selectedVault.title}</div>
        {/*---description---*/}
        <div className="h-[150px] lg:h-[calc(100%-200px)]">(add description here)</div>
        {/*---deposit---*/}
        <div className="h-[150px]">
          <button
            className="buttonPrimary"
            onClick={() => {
              if (isConnected) {
                // TODO: writeContract
              } else {
                open();
              }
            }}
          >
            Deposit
          </button>
        </div>
      </div>
    </main>
  );
};

export default page;
