"use client";
import { useState, useEffect, Fragment } from "react";
// viem
import { encodePacked, padHex, toHex, parseUnits, formatUnits } from "viem";
import type { Hex } from "viem";
// wagmi
import { writeContract, waitForTransactionReceipt } from "wagmi/actions";
import { useConfig, useAccount, useReadContract, useSwitchChain } from "wagmi";
// images
import { FaPlus, FaMinus } from "react-icons/fa6";
// utils
import { Item, CartItem } from "@/utils/types";
import { idToSku } from "@/utils/functions";
import { currencyToCurrencyId } from "@/utils/constants";
import erc20Abi from "@/utils/abis/erc20Abi.json";
import payAbi from "@/utils/abis/payAbi.json";
import { chainNameToUsdcAddress, chainNameToPayContractAddress } from "@/utils/constants";

const merchantAddress = "0xf3D49126A9E25724CFE2Ca00bEAa34317543f9aC";
const localToUsdc = "0.033333";
const rateDecimals = 6;
const currency = "TWD";
const currencyDecimals = 0; // TWD=0, USD=2, EUR=2
const cashback = "2";

export default function Pay() {
  console.log("Pay.tsx");
  // states

  // hooks
  const { chain, address } = useAccount();
  const { data: usdcBalance } = useReadContract({
    address: chainNameToUsdcAddress[chain!.name],
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address!],
    query: {
      enabled: chain && address ? true : false,
      select: (data) => {
        const usdcBalance = formatUnits(data as bigint, 6);
        return usdcBalance;
      },
    },
  });

  return (
    <div className="w-full px-3 py-6 flex justify-center">
      <div className="w-full max-w-[500px] space-y-6">
        {/*--- TOTAL BALANCE ---*/}
        <div className="w-full space-y-1">
          <p className="text-xl font-bold">Your Wallet's USDC Balance</p>
          <p className="text-xl">{usdcBalance} USDC</p>
        </div>

        {/*--- Items ---*/}
        <div className="p-4 grid grid-cols-4 gap-2 border-2 border-blue2 cursor-pointer rounded-xl min-h-[200px]">
          <div className="">Item ID</div>
          <div className="">Quantity</div>
          <div className="">Price Per Item</div>
          <div className="">USDC Received</div>
        </div>
      </div>
    </div>
  );
}
