"use client";
import { useState, useEffect, Fragment } from "react";
// viem
import { formatUnits } from "viem";
// wagmi
import { useAccount, useReadContract } from "wagmi";
// react query
import { useQuery } from "@tanstack/react-query";
// icons
import { FaAngleDown } from "react-icons/fa6";
// components
import DetailsModal from "./DetailsModal";
// utils
import { idToSku, timestampToDate, timestampToTime, shortenAddress, getCurrencyValue } from "@/utils/functions";
import { chainNameToUsdcAddress, catalog, currencyIdToCurrencyInfo } from "@/utils/constants";
import { Item, CartItem } from "@/utils/types";
import erc20Abi from "@/utils/abis/erc20Abi.json";

export default function MerchantDash() {
  console.log("MerchantDash.tsx");
  // states
  const [detailsModal, setDetailsModal] = useState<any>(null);
  const [expandedItems, setExpandedItems] = useState<any>([]);
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
  const { data } = useQuery({
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
  console.log("data", data); //

  function getItemNameById(id: string): string | undefined {
    const item = catalog.find((item) => item.id === Number(id));
    return item?.name;
  }

  return (
    <div className="w-full px-3 py-6 flex justify-center">
      <div className="w-full max-w-[800px] space-y-6">
        {/*--- TOTAL BALANCE ---*/}
        <div className="w-full space-y-1">
          <p className="text-xl font-bold">Account USDC Balance</p>
          <div className="text-xl">{usdcBalance ? `${usdcBalance} USDC` : <div className="w-[200px] text-transparent bg-slate-500 animate-pulse rounded-md">0</div>}</div>
        </div>

        {/*--- Items ---*/}
        <div className="space-y-3">
          <p className="text-xl font-bold">Completed Orders</p>
          <div className="px-4 py-2 border-2 border-blue2 cursor-pointer rounded-xl min-h-[200px]">
            <div className="flex">
              <div className="flex-none px-2 py-4 w-[75px]">Order #</div>
              <div className="flex-none px-2 py-4 w-[100px]">Date</div>
              <div className="flex-none px-2 py-4 w-[140px]">Customer</div>
              <div className="px-2 py-4 w-full">Currency Value</div>
              <div className="px-2 py-4 w-full">USDC Received</div>
              <div className="flex-none px-2 py-4 w-[70px]"></div>
              <div className="flex-none px-2 py-4 w-[100px]"></div>
            </div>
            {data &&
              data.map((cartItem: any, index: number) => (
                <div>
                  <div key={index} className="flex border-t border-slate-800">
                    <div className="flex-none px-2 py-4 w-[75px]">{index + 1}</div>
                    <div className="flex-none px-2 py-4 w-[100px]">{timestampToDate(cartItem.blockTimestamp)}</div>
                    <div className="flex-none px-2 py-4 w-[140px]">{shortenAddress(cartItem.from)}</div>
                    <div className="px-2 py-4 w-full">
                      {currencyIdToCurrencyInfo[cartItem.items[0].currencyId].symbol} {getCurrencyValue(cartItem.items)}
                    </div>
                    <div className="px-2 py-4 w-full">$ {Number(formatUnits(BigInt(cartItem.amount), 6)).toFixed(2)}</div>
                    <button className="flex-none px-2 py-4 w-[70px] link">view tx</button>
                    <button
                      className="flex-none px-2 py-4 w-[100px] link flex justify-end"
                      onClick={() => {
                        if (detailsModal) {
                          setDetailsModal(null);
                        } else {
                          const expandedItems = [];
                          for (const item of cartItem.items) {
                            if (item.quantity > 1) {
                              for (let i = 0; i < item.quantity; i++) {
                                expandedItems.push(item);
                              }
                            } else {
                              expandedItems.push(item);
                            }
                          }
                          setExpandedItems(expandedItems);
                          setDetailsModal(cartItem);
                        }
                      }}
                    >
                      <FaAngleDown className="text-xl" />
                    </button>
                  </div>
                  <div className={`${detailsModal === cartItem ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"} grid [transition:opacity_400ms,grid_300ms]`}>
                    <div className="overflow-hidden">
                      <div className="p-4 grid grid-cols-3 gap-2 border border-blue2 rounded-xl">
                        {/*--- grid headers ---*/}
                        <div className="text-sm font-bold text-slate-500">Item</div>
                        <div className="text-sm font-bold text-slate-500">Currency Value</div>
                        <div className="text-sm font-bold text-slate-500">USDC Received</div>
                        {expandedItems.map((item: any, index: number) => (
                          <Fragment key={index}>
                            <div className="py-2">
                              <p>{getItemNameById(item.id)}</p>
                              <p className="text-xs text-slate-500">{idToSku(item.id)}</p>
                            </div>
                            <div className="py-2">
                              {currencyIdToCurrencyInfo[item.currencyId].symbol} {item.currencyPrice}
                            </div>
                            <div className="py-2">$ {item.usdcReceived}</div>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
