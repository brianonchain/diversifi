"use client";
// nextjs
import { useState, useEffect } from "react";
// components
import LineChart from "@/app/_components/Chart";

export type VaultData = {
  id: string;
  title: string;
  principal: number;
  earned: number;
  performance: number; // in percentage
};

const Dashboard = () => {
  const [allVaultData, setAllVaultData] = useState<VaultData[] | undefined>();
  const [selectedVaultData, setSelectedVaultData] = useState<VaultData | undefined>();

  useEffect(() => {
    // call api to get "data" object
    // "all" can be calculated in frontend or backend
    const data = [
      { id: "all", title: "All Vaults", principal: 12000, earned: 1560.2462, performance: 16.8 },
      { id: "polygon-stable1", title: "Polygon Stablecoin Vault", principal: 5000, earned: 826.1231, performance: 12.4 },
      { id: "base-stable1", title: "Base Stablecoin Vault", principal: 7000, earned: 734.1231, performance: 19.2 },
    ];
    setAllVaultData(data);
    setSelectedVaultData(data[0]);
  }, []);

  return (
    <main className="w-full min-h-[540px] lg:h-[calc(100vh-120px)] px-[16px] flex flex-col lg:flex-row lg:space-x-[16px]">
      {/*---LEFT CARD---*/}
      <div className="cardBg lg:w-[30%] h-full px-4 rounded-xl">
        {/*--- vault stats ---*/}
        <div className="mt-5">
          {/*---title---*/}
          <div className="text-xl font-bold text-center bg-">{selectedVaultData ? selectedVaultData.title : "All Vaults"}</div>
          {/*---total---*/}
          <div className="mt-4 flex justify-center text-3xl font-bold">
            {selectedVaultData ? (
              `$${Number((selectedVaultData.principal + selectedVaultData.earned).toFixed(2)).toLocaleString()}`
            ) : (
              <div className="skeleton">00000000</div>
            )}
          </div>
          {/*---details---*/}
          <div className="mt-4 px-1 flex justify-between">
            <div className="flex flex-col">
              <div className="text-xs font-medium text-text2">PRINCIPAL</div>
              <div>
                {selectedVaultData ? `$${Number(selectedVaultData.principal.toFixed(2)).toLocaleString()}` : <span className="skeleton">00000000</span>}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-xs font-medium text-text2">EARNED</div>
              <div>{selectedVaultData ? `$${Number(selectedVaultData.earned.toFixed(2)).toLocaleString()}` : <span className="skeleton">00000000</span>}</div>
            </div>
            <div className="flex flex-col">
              <div className="text-xs font-medium text-text2">PERFORMANCE</div>
              <div>{selectedVaultData ? `${Number(selectedVaultData.performance.toFixed(1))}%` : <span className="skeleton">0000</span>}</div>
            </div>
          </div>
        </div>
        {/*--- list of vaults ---*/}
        {allVaultData && selectedVaultData ? (
          <div className="mt-10 mb-10 lg:mb-0 border rounded-xl overflow-hidden">
            {allVaultData.map((i, index) => (
              <div
                id={i.id}
                key={index}
                onClick={(e) => {
                  if (allVaultData != undefined) {
                    const vaultIndex = allVaultData.findIndex((i) => i.id === e.currentTarget.id);
                    setSelectedVaultData(allVaultData[vaultIndex]);
                  }
                }}
                className={`${selectedVaultData.id === i.id ? "bg-button1" : ""} ${
                  index === allVaultData.length - 1 ? "" : "border-b"
                } h-[52px] font-bold flex items-center px-4 hover:bg-blue4 transition-color duration-300 cursor-pointer`}
              >
                {i.title}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 mb-10 lg:mb-0 w-full h-[150px] skeletonArea"></div>
        )}
      </div>
      {/*--- RIGHTHAND CARDS ---*/}
      <div className="mt-[16px] lg:mt-0 lg:w-[70%] h-full flex flex-col space-y-[16px] text-sm">
        <div className="p-4 w-full h-[50%] min-h-[300px] lg:min-h-0 rounded-xl flex flex-col cardBg2 space-y-[12px]">
          <div className="font-medium">Performance: {selectedVaultData?.title ?? ""}</div>
          <div className="w-full h-full">
            <div className="w-full h-[95%] flex justify-center items-center">{selectedVaultData && <LineChart selectedVaultData={selectedVaultData} />}</div>
          </div>
        </div>
        <div className="p-4 w-full h-[50%] min-h-[300px] lg:min-h-0 border-2 border-blue2 rounded-xl">Vault Details</div>
      </div>
    </main>
  );
};

export default Dashboard;
