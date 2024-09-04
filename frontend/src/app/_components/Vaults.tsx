"use client";
// nextjs
import { useState, useEffect } from "react";
import Image from "next/image";
// wagmi & viem
import { useConfig, useAccount } from "wagmi";
import { readContract, writeContract, waitForTransactionReceipt, switchChain } from "wagmi/actions";
import { parseUnits, formatUnits } from "viem";
import { useWeb3Modal } from "@web3modal/wagmi/react";
// components, constants
import ErrorModal from "@/app/_components/ErrorModal";
import TxModal from "@/app/_components/TxModal";
import { LoadingGray24, LoadingGray40 } from "@/app/_components/LoadingGray";
import { erc20Abi } from "@/constants/abis/erc20Abi";
import { depositAbi } from "@/constants/abis/depositAbi";

export type Vault = {
  id: string;
  title: string;
  src: string;
};
const allVaults: { [key: string]: Vault[] } = {
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
const rangeValues = [0, 25, 50, 75, 100];

const page = () => {
  // hooks
  const { chain, isConnected, address } = useAccount();
  const { open } = useWeb3Modal();
  const config = useConfig();

  //state
  const [selectedVault, setSelectedVault] = useState<Vault>(allVaults[chain?.id.toString() ?? "137"][0]);
  const [amount, setAmount] = useState<string | undefined>();
  const [isApproveNeeded, setIsApproveNeeded] = useState(true);
  const [txState, setTxState] = useState("initial"); // initial | approve | approving | deposit | depositing | withdraw | withdrawing | final
  const [txHash, setTxHash] = useState("");
  // balances
  const [usdcBalance, setUsdcBalance] = useState<string | undefined>();
  const [usdcAllowance, setUsdcAllowance] = useState<string | undefined>();
  const [vaultBalance, setVaultBalance] = useState<string | undefined>();
  // modal states
  const [errorModal, setErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [txModal, setTxModal] = useState(false);
  const [depositOrWithdraw, setDepositOrWithdraw] = useState("Deposit");

  // set selected vault when new chain is detected, use useEffect instead of onSuccess callback because user switching chain on Web3Modal or MetaMask will not be detected by onSuccess
  useEffect(() => {
    setSelectedVault(allVaults[chain?.id.toString() ?? "137"][0]);
    if (chain?.id === 137) {
      updateAllBalances();
    }
  }, [chain]);

  const updateUsdcBalance = async () => {
    const usdcBalanceBigInt = await readContract(config, {
      address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [address ?? "0x0"],
    });
    setUsdcBalance(formatUnits(usdcBalanceBigInt, 6));
  };

  const updateUsdcAllowance = async () => {
    const usdcAllowanceBigInt = await readContract(config, {
      address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
      abi: erc20Abi,
      functionName: "allowance",
      args: [address ?? "0x0", "0x599559Ed394ADd1117ab72667e49d1560A2124E0"],
    });
    setUsdcAllowance(formatUnits(usdcAllowanceBigInt, 6));
  };

  const updateVaultBalance = async () => {
    const vaultBalanceBigInt = await readContract(config, {
      address: "0x599559Ed394ADd1117ab72667e49d1560A2124E0",
      abi: depositAbi,
      functionName: "getBalance",
      args: [address ?? "0x0"],
    });
    setVaultBalance(formatUnits(vaultBalanceBigInt, 6));
  };

  const updateAllBalances = async () => {
    updateUsdcBalance();
    updateVaultBalance();
    updateUsdcAllowance();
  };

  const deposit = async () => {
    if (!usdcAllowance) {
      setErrorMsg("Please refresh page and try again");
      setErrorModal(true);
    }

    if (!amount || Number(amount) <= 0) {
      setErrorMsg("Please enter an amount");
      setErrorModal(true);
      return;
    }

    if (Number(amount) > Number(usdcBalance)) {
      setErrorMsg("Amount exceeds balance");
      setErrorModal(true);
      return;
    }

    // determine isApproveNeeded
    const isApproveNeededTemp = Number(amount) > Number(usdcAllowance);
    setIsApproveNeeded(isApproveNeededTemp);
    console.log("isApproveNeededTemp", isApproveNeededTemp);

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
        await waitForTransactionReceipt(config, { hash: approveHash });
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
      await waitForTransactionReceipt(config, { hash: depositHash });
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
      setErrorModal(true);
    }
    updateAllBalances();
  };

  const withdraw = async () => {
    if (!vaultBalance) {
      setErrorMsg("Please refresh page and try again");
      setErrorModal(true);
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setErrorMsg("Please enter an amount");
      setErrorModal(true);
      return;
    }

    if (Number(amount) > Number(vaultBalance)) {
      setErrorMsg("Amount exceeds balance");
      setErrorModal(true);
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
      await waitForTransactionReceipt(config, { hash: withdrawHash });
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
      setErrorModal(true);
    }
    updateAllBalances();
  };

  console.log("usdcAllowance", usdcAllowance);

  return (
    <main className="w-full min-h-[540px] lg:h-[calc(100vh-120px)] bgVaults px-[16px] pb-[16px] flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-4">
      {/*---SELECT CHAIN---*/}
      <div className="cardBg4 lg:w-[13%] h-full flex flex-col items-center p-4 rounded-xl">
        <div className="font-bold">Select chain</div>
        <div className="flex lg:block mt-2 xs:mt-4 space-x-1 lg:space-x-0 lg:space-y-[8px]">
          {myChains.map((i) => (
            <div
              id={i.chainId.toString()}
              key={i.name}
              onClick={(e) => (isConnected ? switchChain(config, { chainId: Number(e.currentTarget.id) }) : open())}
              className={`${
                chain?.id == i.chainId ? "selectGlass" : ""
              } flex flex-col items-center justify-center hover:selectGlass w-[84px] h-[88px] rounded-lg cursor-pointer`}
            >
              <Image src={`/${i.name.toLowerCase()}.svg`} alt={i.name} width={0} height={0} className="w-[50px] h-[40px] xs:w-[50px] xs:h-[50px]" />
              <div className="mt-0.5 text-xs">{i.name}</div>
            </div>
          ))}
        </div>
      </div>
      {/*---SELECT VAULT---*/}
      <div className="lg:w-[20%] h-full flex flex-col items-center p-4 cardBg4 rounded-xl">
        <div className="font-bold">Select Vault</div>
        <div className="mt-4 space-y-4">
          {chain ? (
            allVaults[chain.id.toString()].map((i) => (
              <div
                id={i.id}
                key={i.id}
                onClick={(e) => {
                  const vaultIndex = allVaults[chain.id.toString()].findIndex((i) => i.id == e.currentTarget.id);
                  setSelectedVault(allVaults[chain.id.toString()][vaultIndex]);
                }}
                className={`${
                  selectedVault.id == i.id ? "selectGlass" : ""
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
        {/*--- title ---*/}
        <div className="font-bold">{selectedVault.title}</div>
        <div className="flex-1 flex flex-col justify-evenly">
          {/*---description---*/}
          <div className="w-[340px] py-4">
            <p>Test the vault below:</p>
            <p>1. Select Polygon network (left menu)</p>
            <p>2. Approve USDC (if needed)</p>
            <p>3. Deposit native USDC</p>
            <p>4. Withdraw your USDC</p>
          </div>

          {/*--- deposit ---*/}
          <div className="w-[340px]">
            {/*--- darker blue ---*/}
            <div className="flex items-center rounded-t-xl bg-blue-300 bg-opacity-[5%]">
              {["Deposit", "Withdraw"].map((i) => (
                <div
                  key={i}
                  className={`${
                    depositOrWithdraw == i ? "border-b-2" : "text-slate-500"
                  } py-3 w-[50%] flex justify-center font-medium border-white hover:text-white cursor-pointer`}
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
            {/*--- lighter blue ---*/}
            <div className="px-[30px] py-[24px] h-[240px] flex flex-col items-center justify-center rounded-b-xl bg-blue-300 bg-opacity-[10%]">
              {(chain?.id == 137 && depositOrWithdraw == "Deposit" && usdcBalance) || (chain?.id == 137 && depositOrWithdraw == "Withdraw" && vaultBalance) ? (
                <div>
                  {/*--- info above box ---*/}
                  <div className="px-1 w-full flex justify-between items-center">
                    <div className="text-sm text-slate-400 font-medium">Amount</div>
                    <div className="text-xs">
                      Balance: {depositOrWithdraw == "Deposit" ? Number(usdcBalance)?.toFixed(2) : Number(vaultBalance)?.toFixed(2)}
                    </div>
                  </div>
                  {/*--- input box ---*/}
                  <div className="w-full flex items-center rounded-xl bg-blue1 border border-blue3 focus:border-blue4">
                    <input
                      id="amount"
                      className="mt-0.5 w-[168px] h-[48px] px-4 bg-transparent outline-none text-xl font-semibold focus:placeholder:text-transparent placeholder:text-slate-400 [&::-webkit-inner-spin-button]:appearance-none"
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
                    <div className="w-[120px] flex px-4 space-x-[6px]">
                      <Image src="/usdc.svg" alt="usdc" width={0} height={0} className="w-[24px]" />
                      <div className="text-xl font-semibold">USDC</div>
                    </div>
                  </div>
                  {/*--- input range ---*/}
                  <input
                    className="mt-2 w-full h-[6px] appearance-none bg-slate-600 accent-blue4 rounded-full"
                    type="range"
                    step="0.01"
                    value={amount ? (Number(amount) / Number(depositOrWithdraw == "Deposit" ? usdcBalance : vaultBalance)) * 100 : 0}
                    onChange={(e) =>
                      setAmount(((Number(depositOrWithdraw == "Deposit" ? usdcBalance : vaultBalance) * Number(e.currentTarget.value)) / 100).toFixed(2))
                    }
                  ></input>
                  {/*--- range values ---*/}
                  <div className="mt-1 w-full flex justify-between text-[13px] text-slate-400">
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
                    className="mt-8 buttonPrimary w-full"
                    onClick={() => (depositOrWithdraw == "Deposit" ? deposit() : withdraw())}
                    disabled={txState != "initial"}
                  >
                    {depositOrWithdraw}
                  </button>
                </div>
              ) : (
                <LoadingGray40 />
              )}
            </div>
          </div>
        </div>
      </div>
      {errorModal && <ErrorModal setErrorModal={setErrorModal} errorMsg={errorMsg} />}
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
        />
      )}
    </main>
  );
};

export default page;
