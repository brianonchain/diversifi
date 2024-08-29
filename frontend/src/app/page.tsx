"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import LineChart from "./_components/Chart";

export default function Home() {
  type Vault = {
    id: string;
    title: string;
    principal: number;
    earned: number;
    performance: number; // in percentage
  };
  const [allVaults, setAllVaults] = useState<Vault[] | null>(null);
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null);

  useEffect(() => {
    // call api to get "data" object. "all" can be calculated in frontend or backend.
    const data = [
      { id: "all", title: "All Vaults", principal: 12000, earned: 1560.2462, performance: 16.8 },
      { id: "sol-jlp", title: "SOLANA: JLP Vault", principal: 5000, earned: 826.1231, performance: 12.4 },
      { id: "base-stable1", title: "BASE: Stablecoin Vault", principal: 7000, earned: 734.1231, performance: 19.2 },
    ];
    setAllVaults(data);
    setSelectedVault(data[0]);
  }, []);

  const onClickVault = (e: React.MouseEvent<HTMLElement>) => {
    if (allVaults != undefined) {
      const vaultIndex = allVaults.findIndex((i) => i.id === e.currentTarget.id);
      setSelectedVault(allVaults[vaultIndex]);
    }
  };

  return (
    <main className="px-[16px] flex flex-col lg:flex-row lg:space-x-[16px] lg:h-[calc(100vh-120px)] bg-blue1">
      {/*---LEFT CARD---*/}
      <div className="cardBg lg:w-[30%] h-full px-4 rounded-xl">
        {/*---CURRENT VIEW---*/}
        <div className="mt-5">
          {/*---title---*/}
          <div className="text-xl font-bold text-center bg-">{selectedVault ? selectedVault.title : ""}</div>
          {/*---total---*/}
          <div className="mt-4 text-3xl font-bold text-center">
            {selectedVault ? `$${Number((selectedVault.principal + selectedVault.earned).toFixed(2)).toLocaleString()}` : "..."}
          </div>
          {/*---details---*/}
          <div className="mt-4 px-1 flex justify-between">
            <div className="flex flex-col">
              <div className="text-xs font-medium text-text2">PRINCIPAL</div>
              <div>{selectedVault ? `$${Number(selectedVault.principal.toFixed(2)).toLocaleString()}` : "..."}</div>
            </div>
            <div className="flex flex-col">
              <div className="text-xs font-medium text-text2">EARNED</div>
              <div>{selectedVault ? `$${Number(selectedVault.earned.toFixed(2)).toLocaleString()}` : "..."}</div>
            </div>
            <div className="flex flex-col">
              <div className="text-xs font-medium text-text2">PERFORMANCE</div>
              <div>{selectedVault ? `${Number(selectedVault.performance.toFixed(1))}%` : "..."}</div>
            </div>
          </div>
        </div>
        {/*---VAULTS---*/}
        <div className="mt-10 mb-10 lg:mb-0 border rounded-xl overflow-hidden">
          {allVaults && selectedVault ? (
            allVaults.map((i, index) => (
              <div
                id={i.id}
                key={index}
                onClick={onClickVault}
                className={`${selectedVault.id === i.id ? "bg-button1" : ""} ${
                  index === allVaults.length - 1 ? "" : "border-b"
                } h-[52px] font-bold flex items-center px-4 hover:bg-blue4 cursor-pointer`}
              >
                {i.title}
              </div>
            ))
          ) : (
            <div>...</div>
          )}
        </div>
      </div>
      {/*---right menu---*/}
      <div className="mt-4 lg:mt-0 lg:w-[70%] h-full flex flex-col space-y-[16px] text-sm">
        <div className="cardBg2 p-4 w-full h-[50%] rounded-xl flex flex-col space-y-[12px]">
          <div className="font-medium">Performance: {selectedVault?.title ?? ""}</div>
          {selectedVault && <LineChart selectedVault={selectedVault} />}
        </div>
        <div className="p-4 w-full h-[50%] border-2 border-blue2 rounded-xl">Vault Details</div>
      </div>
    </main>
  );
}
