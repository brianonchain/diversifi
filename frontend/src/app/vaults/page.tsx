"use client";
// nextjs
import { useState, useEffect } from "react";
import Image from "next/image";
// wagmi & viem
import { useConfig, useAccount, useReadContracts } from "wagmi";
import { readContract, writeContract, waitForTransactionReceipt, switchChain } from "wagmi/actions";
import { parseUnits, formatUnits } from "viem";
import { useAppKit } from "@reown/appkit/react";
// react query
import { useQuery } from "@tanstack/react-query";
// components
import ErrorModal from "@/app/_components/ErrorModal";
import TxModal from "@/app/_components/TxModal";
import { LoadingGray24, LoadingGray40 } from "@/app/_components/LoadingGray";
// constants
import { erc20Abi } from "@/constants/abis/erc20Abi";
import { depositAbi } from "@/constants/abis/depositAbi";

export type VaultInfo = {
  id: string;
  title: string;
  src: string;
};

const allVaults: { [key: string]: VaultInfo[] } = {
  "137": [{ id: "polygon-stables1", title: "Polygon Stablecoin Vault", src: "/polygon-stables1.svg" }],
  "10": [{ id: "op-stables1", title: "Optimism Stablecoin Vault", src: "/op-stables1.svg" }],
  "42161": [
    { id: "arb-stables1", title: "Arbitrum Stablecoin Vault", src: "/arb-stables1.svg" },
    { id: "arb-glp", title: "Arbitrum GLP Vault", src: "/arb-glp.svg" },
  ],
  "8453": [{ id: "base-stables1", title: "Base Stablecoin Vault", src: "/base-stables1.svg" }],
};
const myChains = [
  { name: "Polygon", chainId: 137 },
  { name: "Optimism", chainId: 10 },
  { name: "Arbitrum", chainId: 42161 },
  { name: "Base", chainId: 8453 },
];

const usdcAddress: { [key: string]: `0x${string}` } = {
  Polygon: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  "OP Mainnet": "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
  "Arbitrum One": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  Base: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
};
const rangeValues = [0, 25, 50, 75, 100];
type HistoryObject = {
  blockTimestamp: string;
  event: string;
  amount: string;
  transactionHash: string;
  date: string;
};

export default function Vaults() {
  // hooks
  const { chain, isConnected, address } = useAccount(); // chain.name = Polygon | OP Mainnet | Arbitrum One | Base
  const { open } = useAppKit();
  const config = useConfig();

  //state
  const [selectedVault, setSelectedVault] = useState<VaultInfo>(allVaults[chain?.id.toString() ?? "137"][0]);
  const [amount, setAmount] = useState<string | undefined>();
  const [isApproveNeeded, setIsApproveNeeded] = useState(false);
  const [txState, setTxState] = useState("initial"); // initial | approve | approving | deposit | depositing | withdraw | withdrawing | final
  const [txHash, setTxHash] = useState("0x0");
  const [history, setHistory] = useState<HistoryObject[] | undefined>();
  // modal states
  const [errorMsg, setErrorMsg] = useState("");
  const [txModal, setTxModal] = useState(false);
  const [depositOrWithdraw, setDepositOrWithdraw] = useState("Deposit");

  const getBalancesQuery = useReadContracts({
    contracts: [
      {
        address: usdcAddress[chain?.name!],
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address!],
      },
      {
        address: usdcAddress[chain?.name!],
        abi: erc20Abi,
        functionName: "allowance",
        args: [address!, "0x599559Ed394ADd1117ab72667e49d1560A2124E0"],
      },
      {
        address: "0x599559Ed394ADd1117ab72667e49d1560A2124E0",
        abi: depositAbi,
        functionName: "getBalance",
        args: [address!],
      },
    ],
    query: { enabled: chain?.name && address ? true : false },
  });
  const [usdcBalance, usdcAllowance, vaultBalance] = getBalancesQuery.data?.map((i) => (i.result != null ? formatUnits(i.result, 6) : undefined)) || [];
  console.log("usdcBalance", usdcBalance);
  console.log("usdcAllowance", usdcAllowance);
  console.log("vaultBalance", vaultBalance);

  // set selected vault when new chain is detected, use useEffect instead of onSuccess callback because user switching chain on Web3Modal or MetaMask will not be detected by onSuccess
  // useEffect(() => {
  //   setSelectedVault(allVaults[chain?.id.toString() ?? "137"][0]);
  //   if (chain?.id === 137) {
  //     // updateAllBalances();
  //     updateHistory();
  //   }
  // }, [chain]);

  const historyQuery = useQuery({
    queryKey: ["history", address],
    queryFn: async () => {
      const res = await fetch("/api/getHistory", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userAddress: address }),
      });
      const { depositEvents, withdrawalEvents } = await res.json();
      // add event type and date, combine, and sort
      depositEvents.forEach((obj: any) => {
        obj.event = "deposit";
        obj.date = new Date(obj.blockTimestamp * 1000).toLocaleDateString();
      });
      withdrawalEvents.forEach((obj: any) => {
        obj.event = "withdrawal";
        obj.date = new Date(obj.blockTimestamp * 1000).toLocaleDateString();
      });
      const allEvents = depositEvents.concat(withdrawalEvents);
      allEvents.sort((x: any, y: any) => y.blockTimestamp - x.blockTimestamp);
      return allEvents;
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });
  console.log("historyQuery.data", historyQuery.data);

  // const updateHistory = async () => {
  //   const res = await fetch("/api/getHistory", {
  //     method: "POST",
  //     headers: { "content-type": "application/json" },
  //     body: JSON.stringify({ userAddress: address }),
  //   });
  //   const { depositEvents, withdrawalEvents } = await res.json();
  //   // add event type and date, combine, and sort
  //   depositEvents.forEach((obj: any) => {
  //     obj.event = "deposit";
  //     obj.date = new Date(obj.blockTimestamp * 1000).toLocaleDateString();
  //   });
  //   withdrawalEvents.forEach((obj: any) => {
  //     obj.event = "withdrawal";
  //     obj.date = new Date(obj.blockTimestamp * 1000).toLocaleDateString();
  //   });
  //   const allEvents = depositEvents.concat(withdrawalEvents);
  //   allEvents.sort((x: any, y: any) => y.blockTimestamp - x.blockTimestamp);
  //   setHistory(allEvents);
  // };
  // console.log("history", history);

  const deposit = async () => {
    if (!usdcAllowance) {
      setErrorMsg("Please refresh page and try again");
    }

    if (!amount || Number(amount) <= 0) {
      setErrorMsg("Please enter an amount");
      return;
    }

    if (Number(amount) > Number(usdcBalance)) {
      setErrorMsg("Amount exceeds balance");
      return;
    }

    // determine isApproveNeeded
    const isApproveNeededTemp = Number(amount) > Number(usdcAllowance);
    setIsApproveNeeded(isApproveNeededTemp);

    setTxModal(true);

    try {
      // approve
      if (isApproveNeededTemp) {
        console.log("approving");
        setTxState("approve");
        const approveHash = await writeContract(config, {
          address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
          abi: erc20Abi,
          functionName: "approve",
          args: ["0x599559Ed394ADd1117ab72667e49d1560A2124E0", parseUnits(amount, 6)],
        });
        setTxState("approving");
        await waitForTransactionReceipt(config, {
          hash: approveHash,
          timeout: 60000,
          confirmations: 3,
        });
        console.log("approveHash", approveHash);
      }
      // deposit
      setTxState("deposit");
      const depositHash = await writeContract(config, {
        address: "0x599559Ed394ADd1117ab72667e49d1560A2124E0",
        abi: depositAbi,
        functionName: "deposit",
        args: [parseUnits(amount, 6)],
      });
      setTxState("depositing");
      await waitForTransactionReceipt(config, { hash: depositHash, timeout: 60000 });
      setTxHash(depositHash);
      setTxState("final");
      console.log("depositHash", depositHash);
    } catch (e) {
      console.log(e);
      // clear states
      setTxState("initial");
      setAmount(undefined);
      (document.getElementById("amount") as HTMLInputElement).value = "";
      setTxModal(false);
      // set error
      setErrorMsg("Deposit was unsuccessful. Please try again.");
    }
    getBalancesQuery.refetch();
    setTimeout(() => historyQuery.refetch(), 5000);
  };

  const withdraw = async () => {
    if (!vaultBalance) {
      setErrorMsg("Please refresh page and try again");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setErrorMsg("Please enter an amount");
      return;
    }

    if (Number(amount) > Number(vaultBalance)) {
      setErrorMsg("Amount exceeds balance");
      return;
    }

    setTxModal(true);

    try {
      setTxState("withdraw");
      const withdrawHash = await writeContract(config, {
        address: "0x599559Ed394ADd1117ab72667e49d1560A2124E0",
        abi: depositAbi,
        functionName: "withdraw",
        args: [parseUnits(amount, 6)],
      });
      setTxState("withdrawing");
      await waitForTransactionReceipt(config, { hash: withdrawHash, timeout: 60000 });
      setTxHash(withdrawHash);
      setTxState("final");
    } catch (e) {
      // clear states
      setTxState("initial");
      setAmount(undefined);
      (document.getElementById("amount") as HTMLInputElement).value = "";
      setTxModal(false);
      // set error
      setErrorMsg("Withdrawal was unsuccessful. Please try again.");
    }
    getBalancesQuery.refetch();
    setTimeout(() => historyQuery.refetch(), 5000);
  };

  return (
    <main className="w-full grow lg:min-h-0 flex justify-center lg:bgVaults">
      <div className="pb-[16px] sectionSize h-full grid grid-rows-[auto,auto,auto] lg:grid-cols-[auto_152px_1fr] lg:grid-rows-[1fr] gap-[16px]">
        {/*--- 1 SELECT CHAIN---*/}
        <div className="px-[12px] py-[24px] xs:p-[16px] cardBg4 rounded-xl flex flex-col items-center">
          <div className="lg:text-center font-bold">Chains</div>
          <div className="mt-2 xs:mt-4 grid grid-flow-col lg:grid-flow-row gap-[12px] xs:gap-[24px]">
            {myChains.map((i) => (
              <div
                id={i.chainId.toString()}
                key={i.name}
                onClick={(e) => (isConnected ? switchChain(config, { chainId: Number(e.currentTarget.id) }) : open())}
                className={`${
                  chain?.id == i.chainId ? "selectGlass" : ""
                } flex flex-col items-center justify-center hover:selectGlass w-[68px] h-[68px] xs:w-[84px] xs:h-[88px] rounded-lg cursor-pointer`}
              >
                <Image src={`/${i.name.toLowerCase()}.svg`} alt={i.name} width={0} height={0} className="w-[30px] h-[30px] xs:w-[50px] xs:h-[50px]" />
                <div className="mt-0.5 text-xs">{i.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/*--- 2 SELECT VAULT---*/}
        <div className="px-[12px] py-[24px] xs:p-[16px] cardBg4 rounded-xl flex flex-col items-center">
          <div className="lg:text-center font-bold">Vaults</div>
          <div className="mt-2 xs:mt-4 grid grid-flow-col lg:grid-flow-row gap-[12px] xs:gap-[24px]">
            {chain ? (
              allVaults[chain.id.toString()].map((i) => (
                <div
                  id={i.id}
                  key={i.id}
                  onClick={(e) => {
                    const vaultIndex = allVaults[chain.id.toString()].findIndex((i) => i.id == e.currentTarget.id); // findIndex more robust than indexOf
                    setSelectedVault(allVaults[chain.id.toString()][vaultIndex]);
                  }}
                  className={`${
                    selectedVault.id == i.id ? "selectGlass" : ""
                  } w-[90px] h-[90px] xs:w-[120px] xs:h-[120px] p-4 flex justify-center items-center rounded-xl cursor-pointer hover:selectGlass`}
                >
                  <div className="text-sm text-center pb-1">{i.title}</div>
                </div>
              ))
            ) : (
              <div className="flex items-center lg:items-start lg:mt-2 h-[90px] xs:h-[120px] text-text2 text-center">Connect wallet to see vaults</div>
            )}
          </div>
        </div>

        {/*--- DESCRIPTION, DEPOSIT, HISOTRY ---*/}
        <div className="grid grid-cols-[1fr] lg:grid-cols-[1fr_300px] lg:grid-rows-[270px_1fr] justify-items-center cardBg4 rounded-xl overflow-hidden">
          {/*--- DESCRIPTION ---*/}
          <div className="row-span-2 w-full flex flex-col items-center lg:border-r border-slate-600">
            {/*--- title ---*/}
            <div className="py-[16px] font-bold text-xl">{selectedVault.title}</div>
            {/*---description---*/}
            <div className="flex-1 flex flex-col justify-center text-base">
              <p>To test the vault:</p>
              <p>1. Select Polygon (left menu)</p>
              <p>2. Enter an amount and click "Deposit"</p>
              <p>3. Withdraw your USDC</p>
            </div>
          </div>

          {/*--- DEPOSIT ---*/}
          <div className="w-full flex flex-col h-[270px] lg:border-b border-slate-600">
            {/*--- deposit or withdraw ---*/}
            <div className="w-full flex items-center buttonHeight">
              {["Deposit", "Withdraw"].map((i) => (
                <div
                  key={i}
                  className={`${
                    depositOrWithdraw == i ? "bg-opacity-[100%] text-white" : "text-slate-500 bg-opacity-[10%] hover:text-slate-200"
                  } bg-button1 w-[50%] h-full flex items-center justify-center font-medium cursor-pointer`}
                  onClick={() => {
                    setDepositOrWithdraw(i);
                    setAmount(undefined);
                    (document.getElementById("amount") as HTMLInputElement).value = "";
                  }}
                >
                  {i}
                </div>
              ))}
            </div>
            {/*--- enter amount + button ---*/}
            <div className="grow w-full flex justify-center items-center px-[12px] lg:px-[24px]">
              {isConnected ? (
                <>
                  {usdcBalance ? (
                    <div className="w-full flex flex-col">
                      {/*--- info above box ---*/}
                      <div className="pr-[4px] pb-[5px] text-xs text-end">
                        {depositOrWithdraw == "Deposit" ? `Your wallet: ${Number(usdcBalance)?.toFixed(2)} USDC` : `Your balance: ${Number(vaultBalance)?.toFixed(2)} USDC`}
                      </div>
                      {/*--- input box ---*/}
                      <div className="w-full flex items-center relative">
                        <input
                          id="amount"
                          className="w-full buttonHeight pl-[12px] pr-[100px] rounded-lg bg-blue1 border border-blue3 focus:border-blue4 outline-none text-xl font-semibold focus:placeholder:text-transparent placeholder:text-slate-400 [&::-webkit-inner-spin-button]:appearance-none"
                          type="number"
                          autoComplete="off"
                          placeholder="0"
                          // amount ?? "" is needed as value = undefined will give "uncontrolled" error
                          value={amount ?? ""}
                          onChange={(e) => {
                            if (e.currentTarget.value.split(".")[1]?.length > 6) {
                              return;
                            }
                            setAmount(e.currentTarget.value);
                          }}
                        ></input>
                        <div className="absolute flex items-center right-[12px]">
                          <Image src="/usdc.svg" alt="usdc" width={0} height={0} className="w-[22px]" />
                          <div className="ml-[4px] text-lg font-semibold">USDC</div>
                        </div>
                      </div>
                      {/*--- input range ---*/}
                      <div className="px-[4px]">
                        <input
                          className="w-full h-[6px] appearance-none bg-slate-600 accent-button1 accent rounded-full shadow-[inset_0px_0px_2px_0px_rgba(0,0,0,0.3)]"
                          type="range"
                          step="0.01"
                          value={amount ? (Number(amount) / Number(depositOrWithdraw == "Deposit" ? usdcBalance : vaultBalance)) * 100 : 0}
                          onChange={(e) => setAmount(((Number(depositOrWithdraw == "Deposit" ? usdcBalance : vaultBalance) * Number(e.currentTarget.value)) / 100).toFixed(2))}
                        ></input>
                      </div>
                      {/*--- range values ---*/}
                      <div className="px-[4px] mt-[4px] w-full flex justify-between text-[13px] text-slate-400">
                        {rangeValues.map((i) => (
                          <div
                            key={i}
                            className="hover:text-slate-200 cursor-pointer"
                            onClick={() =>
                              i == 100
                                ? setAmount(depositOrWithdraw == "Deposit" ? usdcBalance : vaultBalance)
                                : setAmount(((i / 100) * Number(depositOrWithdraw == "Deposit" ? usdcBalance : vaultBalance)).toFixed(2))
                            }
                          >
                            {i}%
                          </div>
                        ))}
                      </div>
                      {/*--- buttons ---*/}
                      <button
                        className={`mt-8 buttonPrimary w-full ${chain?.id != 137 || txState != "initial" ? "bg-slate-600 pointer-events-none" : ""}`}
                        onClick={() => (depositOrWithdraw == "Deposit" ? deposit() : withdraw())}
                      >
                        {depositOrWithdraw}
                      </button>
                    </div>
                  ) : (
                    <LoadingGray40 />
                  )}
                </>
              ) : (
                <div className=" text-slate-500">Connect wallet to deposit</div>
              )}
            </div>
          </div>

          {/*--- HISTORY ---*/}
          <div className="pt-[12px] w-full flex flex-col text-xs lg:min-h-0">
            <div className="text-sm font-semibold text-center">History</div>
            <div className="pt-[8px] pb-[4px] grid grid-cols-3 px-[12px] gap-2 text-slate-500 underline underline-offset-4 font-medium">
              <div className="">Date</div>
              <div className="text-right">Deposit</div>
              <div className="text-right">Withdrawal</div>
            </div>
            {isConnected ? (
              <>
                {historyQuery.isLoading ? (
                  <div className="flex-1 flex items-center justify-center">Loading...</div>
                ) : (
                  <div className="grow [overflow-y:overlay] scrollbar">
                    {historyQuery.data?.map((i: any) => (
                      <div
                        key={i.transactionHash}
                        className="grid grid-cols-3 gap-2 hover:bg-blue2 cursor-pointer transition-all duration-300"
                        onClick={() => window.open(`https://polygonscan.com/tx/${i.transactionHash}`, "_blank")}
                      >
                        <div className="px-[12px] py-[8px]">{i.date.toString()}</div>
                        <div className="px-[12px] py-[8px] text-right">{i.event == "deposit" ? formatUnits(BigInt(i.amount), 6) : ""}</div>
                        <div className="px-[12px] py-[8px] text-right">{i.event == "withdrawal" ? formatUnits(BigInt(i.amount), 6) : ""}</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="grow"></div>
            )}
            <div className="pb-1 w-full px-4 flex justify-end items-center">
              <div className="text-xs font-medium text-[#77798F]">powered by</div>
              <Image src="/thegraph.svg" alt="thegraph" width={0} height={0} className="ml-2 pt-1 w-[80px] opacity-50" />
            </div>
          </div>
        </div>

        {errorMsg && <ErrorModal setErrorMsg={setErrorMsg} errorMsg={errorMsg} />}

        {txModal && amount && (
          <TxModal
            txState={txState}
            setTxState={setTxState}
            setTxModal={setTxModal}
            amount={amount}
            setAmount={setAmount}
            depositOrWithdraw={depositOrWithdraw}
            isApproveNeeded={isApproveNeeded}
            selectedVault={selectedVault}
            txHash={txHash}
          />
        )}
      </div>
    </main>
  );
}
