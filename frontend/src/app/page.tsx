"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

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
    <main className="flex flex-col lg:flex-row lg:h-[calc(100vh-92px)] bg-gray-100 p-4">
      {/*---LEFT CARD---*/}
      <div className="lg:w-[30%] h-full px-4 lg:mr-4 bg-white rounded-xl drop-shadow-sm border border-gray-200 ">
        {/*---CURRENT VIEW---*/}
        <div className="mt-5">
          {/*---title---*/}
          <div className="text-xl font-bold text-center bg-">{selectedVault ? selectedVault.title : ""}</div>
          {/*---total---*/}
          <div className="mt-4 text-3xl font-bold text-center">
            {selectedVault ? `$${Number((selectedVault.principal + selectedVault.earned).toFixed(2)).toLocaleString()}` : "..."}
          </div>
          {/*---details---*/}
          <div className="mt-2 px-1 flex justify-between">
            <div className="flex flex-col">
              <div className="text-xs font-medium text-gray-400">PRINCIPAL</div>
              <div>{selectedVault ? `$${Number(selectedVault.principal.toFixed(2)).toLocaleString()}` : "..."}</div>
            </div>
            <div className="flex flex-col">
              <div className="text-xs font-medium text-gray-400">EARNED</div>
              <div>{selectedVault ? `$${Number(selectedVault.earned.toFixed(2)).toLocaleString()}` : "..."}</div>
            </div>
            <div className="flex flex-col">
              <div className="text-xs font-medium text-gray-400">PERFORMANCE</div>
              <div>{selectedVault ? `${Number(selectedVault.performance.toFixed(1))}%` : "..."}</div>
            </div>
          </div>
        </div>
        {/*---VAULTS---*/}
        <div className="mt-10 mb-10 lg:mb-0 border rounded-xl">
          {allVaults && selectedVault ? (
            allVaults.map((i, index) => (
              <div
                id={i.id}
                onClick={onClickVault}
                className={`${
                  selectedVault.id === i.id ? "text-gray-800 bg-gray-100" : "text-gray-500"
                } h-[52px] font-bold flex items-center px-4 hover:bg-gray-100 cursor-pointer ${index === allVaults.length - 1 ? "" : "border-b"}`}
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
      <div className="lg:w-[70%] mt-4 lg:mt-0 h-full flex flex-col">
        <div className="w-full h-[250px] lg:h-[50%] bg-white p-4 rounded-xl drop-shadow-sm border border-gray-200 text-sm">performance chart</div>
        <div className="p-4 h-[250px] lg:h-auto text-sm">vault details</div>
      </div>
    </main>
  );
}
