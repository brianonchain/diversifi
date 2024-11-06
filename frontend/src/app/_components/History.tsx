"use client";
// wagim & viem
import { useAccount } from "wagmi";
import { formatUnits } from "viem";
// react query
import { useQuery } from "@tanstack/react-query";
// utils
import { vaultIdToContractAddress, chainToUsdcAddress } from "@/utils/constants";
import { HistoryItem } from "@/utils/constants";

export default function History({ vaultId }: { vaultId: string }) {
  // time
  const date = new Date();
  const time = date.toLocaleTimeString("en-US", { hour12: false }) + `.${date.getMilliseconds()}`;
  console.log("HistoryClient.tsx", time, "vaultId", vaultId);

  const { address } = useAccount();

  // get contract address
  const contractAddress = vaultIdToContractAddress[vaultId];

  // get chain
  const chain = vaultId.split("_")[0];

  // react query
  const historyQuery = useQuery({
    queryKey: ["history", address, contractAddress, chain],
    queryFn: async () => {
      const res = await fetch("/api/getHistory", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userAddress: address, contractAddress: contractAddress, chain: chain }),
      });
      const data = await res.json();
      return data;
    },
    enabled: address ? true : false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return (
    <div className="grow w-full [overflow-y:overlay] scrollbar">
      {historyQuery.data &&
        historyQuery.data.map((i: any) => (
          <div
            key={i.transactionHash}
            className="grid grid-cols-3 gap-2 hover:bg-blue2 cursor-pointer rounded-md"
            onClick={() => window.open(`https://polygonscan.com/tx/${i.transactionHash}`, "_blank")}
          >
            <div className="pl-[16px] py-[8px]">{i.date.toString()}</div>
            <div className="py-[8px] text-right">{i.event == "deposit" ? formatUnits(BigInt(i.amount), 6) : ""}</div>
            <div className="pr-[16px] py-[8px] text-right">{i.event == "withdrawal" ? formatUnits(BigInt(i.amount), 6) : ""}</div>
          </div>
        ))}
    </div>
  );
}
