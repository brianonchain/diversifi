"use client";
import { useState, Fragment } from "react";
// viem
import { formatUnits } from "viem";
// wagmi
import { useAccount, useReadContract } from "wagmi";
// react query
import { useQuery } from "@tanstack/react-query";
// icons
import { FaAngleDown } from "react-icons/fa6";
// utils
import { idToSku, timestampToDate, timestampToTime, shortenAddress, getCurrencyValue } from "@/utils/functions";
import { chainNameToUsdcAddress, catalog, currencyIdToCurrencyInfo } from "@/utils/constants";
import erc20Abi from "@/utils/abis/erc20Abi.json";
import { LoadingGray40 } from "@/utils/components/LoadingGray";

export type Item = {
  version: string;
  currencyId: string;
  cashback: string;
  quantity: string;
  id: string;
  currencyPrice: string;
  usdcReceived: string;
};

export type PayEvent = {
  from: string;
  amount: string;
  items: Item[];
  blockTimestamp: string;
  txHash: string;
};

export default function MerchantDash() {
  console.log("MerchantDash.tsx");
  // states
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  // hooks
  const { chain, address } = useAccount();
  const { data: usdcBalance } = useReadContract({
    address: chain?.name ? chainNameToUsdcAddress[chain.name] : undefined,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address!],
    query: {
      enabled: chain && address ? true : false,
      select: (data) => {
        const usdcBalance = (Math.floor(Number(formatUnits(data as bigint, 6)) * 100) / 100).toFixed(2);
        return usdcBalance;
      },
    },
  });
  const { data: payEvents, isLoading: isLoadingData } = useQuery({
    queryKey: ["getMerchantPayments", address, chain],
    queryFn: async () => {
      const res = await fetch("/api/getMerchantPayments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ merchantAddress: address, chain }),
      });
      const data = await res.json();
      return data;
    },
    enabled: address ? true : false,
    staleTime: Infinity,
    gcTime: Infinity,
  });
  // logs
  console.log("address", address);
  console.log("payEvents", payEvents);

  function getItemNameById(id: string): string | undefined {
    const item = catalog.find((item) => item.id === Number(id));
    return item?.name;
  }

  return (
    <div className="w-full px-3 py-6 flex justify-center">
      <div className="w-full max-w-[800px]">
        {/*--- TOTAL BALANCE ---*/}
        <p className="text-xl font-bold">Account USDC Balance</p>
        <div className="mt-1 text-xl">{usdcBalance ? `${usdcBalance} USDC` : <div className="w-[200px] text-transparent bg-slate-600 animate-pulse rounded-md">0</div>}</div>

        {/*--- COMPLETED ORDERS ---*/}
        <p className="mt-8 text-xl font-bold">Completed Orders</p>
        <div className="mt-2 px-4 py-2 border-2 border-blue2 rounded-xl min-h-[200px] overflow-x-auto">
          {/*--- table headers ---*/}
          <div className="w-full flex">
            <div className="flex-none px-2 py-4 w-[40px]">#</div>
            <div className="flex-none px-2 py-4 w-[116px]">Date</div>
            <div className="flex-none px-2 py-4 w-[140px]">Customer</div>
            <div className="flex-none py-4 w-[120px] text-right">Currency Value</div>
            <div className="flex-none py-4 w-[150px] text-right">USDC Received</div>
            <div className="px-4 py-4 grow min-w-[100px]"></div>
            <div className="px-2 py-4 w-[40px]"></div>
          </div>
          {/*--- table rows ---*/}
          {!address ? (
            <div className="w-full min-h-[200px] flex justify-center items-center text-slate-500">Connect wallet</div>
          ) : isLoadingData ? (
            <div className="w-full min-h-[200px] flex justify-center items-center">
              <LoadingGray40 />
            </div>
          ) : payEvents.length === 0 ? (
            <div className="w-full min-h-[200px] flex justify-center items-center text-slate-500">No payments yet</div>
          ) : (
            payEvents.map((payEvent: any, index: number) => (
              <div
                key={index}
                className="w-full cursor-pointer"
                onClick={() => {
                  if (expandedRows.includes(index)) {
                    setExpandedRows(expandedRows.filter((num) => num !== index));
                  } else {
                    setExpandedRows([...expandedRows, index]);
                  }
                }}
              >
                {/*--- main data ---*/}
                <div key={index} className="w-full flex border-t border-slate-800">
                  <div className="flex-none px-2 py-4 w-[40px]">{index + 1}</div>
                  <div className="flex-none px-2 py-4 w-[116px]">{timestampToDate(payEvent.blockTimestamp)}</div>
                  <div className="flex-none px-2 py-4 w-[140px]">{shortenAddress(payEvent.from)}</div>
                  <div className="flex-none py-4 w-[120px] text-right">
                    {currencyIdToCurrencyInfo[payEvent.items[0].currencyId].symbol} {getCurrencyValue(payEvent.items)}
                  </div>
                  <div className="flex-none py-4 w-[150px] text-right">$ {Number(formatUnits(BigInt(payEvent.amount), 6)).toFixed(2)}</div>
                  <div className="px-4 py-4 grow min-w-[100px] flex justify-center">
                    <a className="link" target="_blank" href={`https://sepolia.etherscan.io/tx/${payEvent.txHash}`} onClick={(e) => e.stopPropagation()}>
                      view tx
                    </a>
                  </div>
                  <div className="flex-none px-2 py-4 w-[40px] link flex justify-end">
                    <FaAngleDown className={`text-xl ${expandedRows.includes(index) ? "rotate-180" : ""} transition-transform duration-300`} />
                  </div>
                </div>
                {/*--- details ---*/}
                <div className={`${expandedRows.includes(index) ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"} w-full grid [transition:opacity_400ms,grid_300ms]`}>
                  <div className="w-full overflow-hidden">
                    <div className="w-full p-4 grid grid-cols-3 border border-blue2 rounded-xl">
                      {/*--- details headers ---*/}
                      <div className="text-sm font-bold text-slate-500">Item</div>
                      <div className="text-sm font-bold text-slate-500">Currency Value</div>
                      <div className="text-sm font-bold text-slate-500">USDC Received</div>
                      {payEvent.items.map((item: any, index: number) => (
                        <Fragment key={index}>
                          {Array(Number(item.quantity))
                            .fill(item)
                            .map((subitem: any, index: number) => (
                              <Fragment key={index}>
                                <div className="py-2">
                                  <p>{getItemNameById(subitem.id)}</p>
                                  <p className="text-xs text-slate-500">{idToSku(subitem.id)}</p>
                                </div>
                                <div className="py-2">
                                  {currencyIdToCurrencyInfo[subitem.currencyId].symbol} {subitem.currencyPrice}
                                </div>
                                <div className="py-2">$ {subitem.usdcReceived}</div>
                              </Fragment>
                            ))}
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
