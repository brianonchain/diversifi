"use client";
// next
import { useState } from "react";
import Image from "next/image";
// wagmi & viem
import { useConfig, useAccount, useReadContracts } from "wagmi";
import { writeContract, waitForTransactionReceipt } from "wagmi/actions";
import { parseUnits, formatUnits } from "viem";
// components
import TxModal from "./TxModal";
// utils
import { LoadingGray40 } from "@/utils/components/LoadingGray";
import { erc20Abi } from "@/utils/abis/erc20Abi";
import { depositAbi } from "@/utils/abis/depositAbi";
import { vaultIdToContractAddress, chainToUsdcAddress } from "@/utils/constants";
// react query
import { useQueryClient } from "@tanstack/react-query";
// zustand
import { useErrorMsgStore } from "@/store";
// actions
import { revalidateDashboardAction } from "@/actions";

const chainToId: { [key: string]: number } = {
  Polygon: 137,
  Optimism: 10,
  Arbitrum: 42161,
  Base: 8453,
};

const rangeValues = [0, 25, 50, 75, 100];

export default function Deposit({ vaultId }: { vaultId: string }) {
  // chainState
  const chainState = vaultId.split("_")[0];
  console.log("Deposit.tsx", "chainState", chainState);

  // deposit states
  const [amount, setAmount] = useState<string | undefined>();
  const [isApproveNeeded, setIsApproveNeeded] = useState(false);
  const [txState, setTxState] = useState("initial"); // initial | approve | approving | deposit | depositing | withdraw | withdrawing | final
  const [txHash, setTxHash] = useState("0x0");
  // modal states
  // const [errorMsg, setErrorMsg] = useState("");
  const [txModal, setTxModal] = useState(false);
  const [depositOrWithdraw, setDepositOrWithdraw] = useState("Deposit");

  // zustand
  const setErrorMsg = useErrorMsgStore((state) => state.setErrorMsg);

  // hooks
  const { address, isConnected } = useAccount(); // chain.name = Polygon | OP Mainnet | Arbitrum One | Base
  const config = useConfig();
  const queryClient = useQueryClient();

  const getBalancesQuery = useReadContracts({
    contracts: [
      {
        address: chainToUsdcAddress[chainState!],
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address!],
        chainId: chainToId[chainState!],
      },
      {
        address: chainToUsdcAddress[chainState!],
        abi: erc20Abi,
        functionName: "allowance",
        args: [address!, vaultIdToContractAddress[vaultId]],
        chainId: chainToId[chainState!],
      },
      {
        address: vaultIdToContractAddress[vaultId],
        abi: depositAbi,
        functionName: "getBalance",
        args: [address!],
        chainId: chainToId[chainState!],
      },
    ],
    query: { enabled: chainState && address ? true : false },
  });
  const [usdcBalance, usdcAllowance, vaultBalance] = getBalancesQuery.data?.map((i) => (i.result != null ? formatUnits(i.result, 6) : undefined)) || [];

  console.log(
    "\nDeposit.tsx",
    "\nvaultId:",
    vaultId,
    "\nchainState:",
    chainState,
    "\naddress:",
    address,
    "\nusdcBalance:",
    usdcBalance,
    "\nusdcAllowance:",
    usdcAllowance,
    "\nvaultBalance:",
    vaultBalance
  );

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
        setTxState("approve");
        const approveHash = await writeContract(config, {
          address: chainToUsdcAddress[chainState],
          abi: erc20Abi,
          functionName: "approve",
          args: [vaultIdToContractAddress[vaultId], parseUnits(amount, 6)],
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
        address: vaultIdToContractAddress[vaultId],
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
    getBalancesQuery.refetch(); // re-fetch balances
    revalidateDashboardAction(); // re-fetch all dashboard stats
    await new Promise((resolve) => setTimeout(resolve, 3000));
    queryClient.invalidateQueries({ queryKey: ["history", address, vaultIdToContractAddress[vaultId], chainState] }); // re-fetch history after 3s
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
    revalidateDashboardAction();
    await new Promise((resolve) => setTimeout(resolve, 3000));
    queryClient.invalidateQueries({ queryKey: ["history", address, vaultIdToContractAddress[vaultId], chainState] });
  };

  return (
    <>
      <div className="w-[300px] lg:w-full flex items-center buttonHeight rounded-lg lg:rounded-none overflow-hidden">
        {["Deposit", "Withdraw"].map((i) => (
          <div
            key={i}
            className={`${
              depositOrWithdraw == i ? "bg-opacity-[100%] text-white" : "text-slate-500 bg-opacity-[10%] hover:text-slate-200"
            } bg-button1 w-[50%] h-full flex items-center justify-center font-medium cursor-pointer`}
            onClick={() => {
              setDepositOrWithdraw(i);
              setAmount(undefined);
              try {
                (document.getElementById("amount") as HTMLInputElement).value = "";
              } catch {}
            }}
          >
            {i}
          </div>
        ))}
      </div>
      {/*--- enter amount + button ---*/}
      <div className="pt-[32px] lg:pt-0 grow lg:px-[24px] w-[300px] lg:w-full flex flex-col items-center justify-center">
        {isConnected ? (
          <>
            {usdcBalance ? (
              <>
                {/*--- balance info ---*/}
                <div className="w-full text-xs text-end">
                  {depositOrWithdraw === "Deposit" ? `Your wallet: ${Number(usdcBalance)?.toFixed(2)} USDC` : `Your balance: ${Number(vaultBalance)?.toFixed(2)} USDC`}
                </div>
                {/*--- input box ---*/}
                <div className="mt-[4px] w-full flex items-center relative">
                  <input
                    id="amount"
                    className="w-full buttonHeight pl-[12px] pr-[100px] rounded-lg bg-blue1 border-2 border-blue2 focus:border-blue4 outline-none text-xl font-semibold focus:placeholder:text-transparent placeholder:text-slate-400 [transition:border_300ms] [&::-webkit-inner-spin-button]:appearance-none"
                    type="number"
                    autoComplete="off"
                    placeholder="0"
                    value={amount ?? ""} // amount ?? "" is needed as value = undefined will give "uncontrolled" error
                    onChange={(e) => {
                      if (e.currentTarget.value.split(".")[1]?.length > 6) return;
                      setAmount(e.currentTarget.value);
                    }}
                  ></input>
                  <div className="absolute flex items-center right-[12px] space-x-[4px] text-lg font-semibold">
                    <Image src="/usdc.svg" alt="usdc" width={0} height={0} className="w-[22px]" />
                    <p>USDC</p>
                  </div>
                </div>
                {/*--- input range ---*/}
                <input
                  className="mt-[12px] w-full h-[6px] appearance-none bg-slate-600 accent-button1 accent rounded-full shadow-[inset_0px_0px_2px_0px_rgba(0,0,0,0.3)]"
                  type="range"
                  step="0.01"
                  value={amount ? (Number(amount) / Number(depositOrWithdraw == "Deposit" ? usdcBalance : vaultBalance)) * 100 : 0}
                  onChange={(e) => setAmount(((Number(depositOrWithdraw == "Deposit" ? usdcBalance : vaultBalance) * Number(e.currentTarget.value)) / 100).toFixed(2))}
                ></input>
                {/*--- range values ---*/}
                <div className="mt-[4px] px-[4px] w-full flex justify-between text-[13px] text-slate-400">
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
                  className={`mt-[32px] buttonPrimary w-full ${chainState != "Polygon" || txState != "initial" ? "bg-slate-600 border-slate-600 pointer-events-none" : ""}`}
                  onClick={() => (depositOrWithdraw == "Deposit" ? deposit() : withdraw())}
                >
                  {depositOrWithdraw}
                </button>
              </>
            ) : (
              <LoadingGray40 />
            )}
          </>
        ) : (
          <div className=" text-slate-500">Connect wallet to deposit</div>
        )}
      </div>

      {/* {errorMsg && <ErrorModal setErrorMsg={setErrorMsg} errorMsg={errorMsg} />} */}

      {txModal && amount && (
        <TxModal
          txState={txState}
          setTxState={setTxState}
          setTxModal={setTxModal}
          amount={amount}
          setAmount={setAmount}
          depositOrWithdraw={depositOrWithdraw}
          isApproveNeeded={isApproveNeeded}
          vaultId={vaultId}
          txHash={txHash}
        />
      )}
    </>
  );
}
