// "use client";
// // nextjs
// import { useState, useEffect } from "react";
// import Image from "next/image";
// // wagmi & viem
// import { useConfig, useAccount, useSwitchChain, useReadContract, useWriteContract } from "wagmi";
// import { writeContract, waitForTransactionReceipt } from "wagmi/actions";
// import { parseUnits, formatUnits } from "viem";
// import { useWeb3Modal } from "@web3modal/wagmi/react";
// // components, constants
// import ErrorModal from "@/app/_components/ErrorModal";
// import TxModal from "@/app/_components/TxModal";
// import { erc20Abi } from "@/constants/abis/erc20Abi";
// import { depositAbi } from "@/constants/abis/depositAbi";
// import { LoadingGray24, LoadingGray40 } from "@/app/_components/LoadingGray";

// export type Vault = {
//   id: string;
//   title: string;
//   src: string;
// };
// const allVaults: { [key: string]: Vault[] } = {
//   ArbitrumOne: [
//     { id: "arb-stables1", title: "Arbitrum Stablecoin Vault", src: "/arb-stables1.svg" },
//     { id: "arb-glp", title: "Arbitrum GLP Vault", src: "/arb-glp.svg" },
//   ],
//   Polygon: [{ id: "polygon-stables1", title: "Polygon Stablecoin Vault", src: "/polygon-stables1.svg" }],
//   OPMainnet: [{ id: "op-stables1", title: "Optimism Stablecoin Vault", src: "/op-stables1.svg" }],
//   Base: [{ id: "base-stables1", title: "Base Stablecoin Vault", src: "/base-stables1.svg" }],
// };
// const myChains = ["Arbitrum", "Polygon", "Optimism", "Base"];
// const chainNameToChainId: { [key: string]: number } = { Arbitrum: 42161, Polygon: 137, Optimism: 10, Base: 8453 };
// const page = () => {
//   // hooks
//   const { switchChain } = useSwitchChain();
//   const { chain, isConnected, address } = useAccount();
//   const { open } = useWeb3Modal();
//   const config = useConfig();

//   //state
//   const [selectedVault, setSelectedVault] = useState<Vault>(allVaults[chain?.name.replace(" ", "") ?? "ArbitrumOne"][0]);
//   const [amount, setAmount] = useState<string | undefined>();
//   const [isApproveNeeded, setIsApproveNeeded] = useState(true);
//   const [txState, setTxState] = useState("initial"); // initial | approve | approving | deposit | depositing | withdraw | withdrawing | final
//   // modal states
//   const [errorModal, setErrorModal] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [txModal, setTxModal] = useState(false);
//   const [depositOrWithdraw, setDepositOrWithdraw] = useState("Deposit");

//   // useEffect
//   useEffect(() => {
//     // prompt web3Modal if not yet connected
//     if (isConnected) {
//       // getUsdcBalance();
//       // getAllowance();
//     } else {
//       open();
//     }

//     // set selected vault to 0 index whenever user switches chain
//     setSelectedVault(allVaults[chain?.name.replace(" ", "") ?? "ArbitrumOne"][0]);
//   }, [chain]);

//   // constants
//   const rangeValues = [0, 25, 50, 75, 100];

//   let usdcBalance: string | undefined;
//   let vaultBalance: string | undefined;
//   let usdcAllowance: string | undefined;

//   // hook to get usdc balance
//   const { data: usdcBalanceBigInt } = useReadContract({
//     address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
//     abi: erc20Abi,
//     functionName: "balanceOf",
//     args: [address ?? "0x0"],
//   });
//   if (usdcBalanceBigInt != undefined) usdcBalance = formatUnits(usdcBalanceBigInt, 6);

//   // hook to get usdc allowance
//   const { data: usdcAllowanceBigInt } = useReadContract({
//     address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
//     abi: erc20Abi,
//     functionName: "allowance",
//     args: [address ?? "0x0", "0x599559Ed394ADd1117ab72667e49d1560A2124E0"],
//   });
//   console.log("usdcAllowanceBigInt", usdcAllowanceBigInt);
//   if (usdcAllowanceBigInt != undefined) usdcAllowance = formatUnits(BigInt(0), 6);
//   console.log("usdcAllowance", usdcAllowance);

//   // hook to get vault balance
//   const { data: vaultBalanceBigInt } = useReadContract({
//     address: "0x599559Ed394ADd1117ab72667e49d1560A2124E0",
//     abi: depositAbi,
//     functionName: "getBalance",
//     args: [address ?? "0x0"],
//   });
//   if (vaultBalanceBigInt != undefined) vaultBalance = formatUnits(vaultBalanceBigInt, 6);

//   const deposit = async () => {
//     if (!usdcAllowance) {
//       setErrorMsg("Please refresh page and try again");
//       setErrorModal(true);
//     }

//     if (!amount || Number(amount) <= 0) {
//       setErrorMsg("Please enter an amount");
//       setErrorModal(true);
//       return;
//     }

//     if (Number(amount) > Number(usdcBalance)) {
//       setErrorMsg("Amount exceeds balance");
//       setErrorModal(true);
//       return;
//     }

//     // determine the isApproveNeeded state
//     let isApproveNeededTemp = true;
//     if (Number(amount) <= Number(usdcAllowance)) {
//       isApproveNeededTemp = false;
//       setIsApproveNeeded(false);
//     }

//     setTxModal(true);

//     // change these to actions
//     try {
//       if (isApproveNeededTemp) {
//         setTxState("approve");
//         const approveHash = await writeContract(config, {
//           address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
//           abi: erc20Abi,
//           functionName: "approve",
//           args: ["0x599559Ed394ADd1117ab72667e49d1560A2124E0", parseUnits(amount, 6)],
//         });
//         setTxState("approving");
//         await waitForTransactionReceipt(config, {
//           hash: approveHash,
//         });
//         console.log("approveHash", approveHash);

//         setTxState("deposit");
//         const depositHash = await writeContract(config, {
//           address: "0x599559Ed394ADd1117ab72667e49d1560A2124E0",
//           abi: depositAbi,
//           functionName: "deposit",
//           args: [parseUnits(amount, 6)],
//         });
//         setTxState("depositing");
//         await waitForTransactionReceipt(config, {
//           hash: depositHash,
//         });
//         console.log("depositHash", depositHash);
//       } else {
//         setTxState("deposit");
//         const depositHash = await writeContract(config, {
//           address: "0x599559Ed394ADd1117ab72667e49d1560A2124E0",
//           abi: depositAbi,
//           functionName: "deposit",
//           args: [parseUnits(amount, 6)],
//         });
//         setTxState("depositing");
//         await waitForTransactionReceipt(config, {
//           hash: depositHash,
//         });
//         console.log("depositHash", depositHash);
//       }
//       setTxState("final");
//     } catch (e) {
//       console.log(e);
//       // clear statses
//       setTxState("initial");
//       setAmount(undefined);
//       (document.getElementById("amount") as HTMLInputElement).value = "";
//       setTxModal(false);
//       // set error
//       setErrorMsg("Deposit did not go through. Please try again.");
//       setErrorModal(true);
//     }
//   };

//   const withdraw = async () => {
//     if (!vaultBalance) {
//       setErrorMsg("Please refresh page and try again");
//       setErrorModal(true);
//       return;
//     }

//     if (!amount || Number(amount) <= 0) {
//       setErrorMsg("Please enter an amount");
//       setErrorModal(true);
//       return;
//     }

//     if (Number(amount) > Number(vaultBalance)) {
//       setErrorMsg("Amount exceeds balance");
//       setErrorModal(true);
//       return;
//     }

//     try {
//       setTxModal(true);
//       setTxState("withdraw");
//       const withdrawHash = await writeContract(config, {
//         address: "0x599559Ed394ADd1117ab72667e49d1560A2124E0",
//         abi: depositAbi,
//         functionName: "withdraw",
//         args: [parseUnits(amount, 6)],
//       });
//       setTxState("withdrawing");
//       await waitForTransactionReceipt(config, {
//         hash: withdrawHash,
//       });
//       console.log("withdrawHash", withdrawHash);
//       setTxState("final");
//     } catch (e) {
//       console.log(e);
//       // clear statses
//       setTxState("initial");
//       setAmount(undefined);
//       (document.getElementById("amount") as HTMLInputElement).value = "";
//       setTxModal(false);
//       // set error
//       setErrorMsg("Withdrawal was unsuccessful. Please try again.");
//       setErrorModal(true);
//     }
//   };

//   return (
//     <main className="w-full min-h-[540px] lg:h-[calc(100vh-120px)] bgVaults px-[16px] pb-[16px] flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-4">
//       {/*---SELECT CHAIN---*/}
//       <div className="cardBg4 lg:w-[13%] h-full flex flex-col items-center p-4 rounded-xl">
//         <div className="font-bold">Select chain</div>
//         <div className="flex lg:block mt-2 xs:mt-4 space-x-1 lg:space-x-0 lg:space-y-[8px]">
//           {myChains.map((i, index) => (
//             <div
//               id={i}
//               key={i}
//               onClick={(e) => {
//                 if (isConnected) {
//                   switchChain({ chainId: chainNameToChainId[e.currentTarget.id] });
//                 } else {
//                   open();
//                 }
//               }}
//               className={`${
//                 chain?.id == chainNameToChainId[i] ? "selectGlass" : ""
//               } flex flex-col items-center justify-center hover:selectGlass w-[84px] h-[88px] rounded-lg cursor-pointer`}
//             >
//               <div className="relative flex-none w-[50px] h-[40px] xs:w-[50px] xs:h-[50px]">
//                 <Image src={`/${i.toLowerCase()}.svg`} alt={i} fill />
//               </div>
//               <div className="mt-0.5 text-xs">{i}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//       {/*---SELECT VAULT---*/}
//       <div className="lg:w-[20%] h-full flex flex-col items-center p-4 cardBg4 rounded-xl">
//         <div className="font-bold">Select Vault</div>
//         <div className="mt-4 space-y-4">
//           {chain ? (
//             allVaults[chain.name.replace(" ", "")].map((i, index) => (
//               <div
//                 id={i.id}
//                 key={index}
//                 onClick={(e) => {
//                   const vaultIndex = allVaults[chain.name.replace(" ", "")].findIndex((i) => i.id === e.currentTarget.id);
//                   setSelectedVault(allVaults[chain.name.replace(" ", "")][vaultIndex]);
//                 }}
//                 className={`${
//                   selectedVault.id === i.id ? "selectGlass" : ""
//                 } w-[120px] h-[120px] p-4 flex justify-center items-center rounded-xl cursor-pointer hover:selectGlass`}
//               >
//                 <div className="text-sm text-center pb-1">{i.title}</div>
//               </div>
//             ))
//           ) : (
//             <div className="mt-[12px] text text-text2 text-center">
//               Connect wallet to view
//               <br /> available vaults
//             </div>
//           )}
//         </div>
//       </div>
//       {/*---VAULT DETAILS & DEPOSIT---*/}
//       <div className="cardBg4 lg:w-[65%] h-full flex flex-col items-center p-4 rounded-xl">
//         {/*--- title ---*/}
//         <div className="font-bold">{selectedVault.title}</div>
//         <div className="flex-1 flex flex-col justify-evenly">
//           {/*---description---*/}
//           <div className="w-[340px] py-4">
//             <p>Test the vault below:</p>
//             <p>1. Select Polygon network (left menu)</p>
//             <p>2. Approve USDC (if needed)</p>
//             <p>3. Deposit native USDC</p>
//             <p>4. Withdraw your USDC</p>
//           </div>

//           {/*--- deposit ---*/}
//           <div className="w-[340px]">
//             {/*--- darker blue ---*/}
//             <div className="flex items-center rounded-t-xl bg-blue-300 bg-opacity-[5%]">
//               {["Deposit", "Withdraw"].map((i) => (
//                 <div
//                   key={i}
//                   className={`${
//                     depositOrWithdraw == i ? "border-b-2" : "text-slate-500"
//                   } py-3 w-[50%] flex justify-center font-medium border-white hover:text-white cursor-pointer`}
//                   onClick={() => {
//                     setDepositOrWithdraw(i);
//                     setAmount(undefined);
//                     (document.getElementById("amount") as HTMLInputElement).value = "";
//                   }}
//                 >
//                   {i}
//                 </div>
//               ))}
//             </div>
//             {/*--- lighter blue ---*/}
//             <div className="px-[30px] py-[24px] h-[240px] flex flex-col items-center justify-center rounded-b-xl bg-blue-300 bg-opacity-[10%]">
//               {(depositOrWithdraw == "Deposit" && usdcBalance) || (depositOrWithdraw == "Withdraw" && vaultBalance) ? (
//                 <div>
//                   {/*--- info above box ---*/}
//                   <div className="px-1 w-full flex justify-between items-center">
//                     <div className="text-sm text-slate-400 font-medium">Amount</div>
//                     <div className="text-xs">
//                       Balance: {depositOrWithdraw == "Deposit" ? Number(usdcBalance)?.toFixed(2) : Number(vaultBalance)?.toFixed(2)}
//                     </div>
//                   </div>
//                   {/*--- input box ---*/}
//                   <div className="w-full flex items-center rounded-xl bg-blue1 border border-blue3 focus:border-blue4">
//                     <input
//                       id="amount"
//                       className="mt-0.5 w-[168px] h-[48px] px-4 bg-transparent outline-none text-xl font-semibold focus:placeholder:text-transparent placeholder:text-slate-400 [&::-webkit-inner-spin-button]:appearance-none"
//                       type="number"
//                       step="0.000001"
//                       autoComplete="off"
//                       placeholder="0"
//                       value={amount}
//                       onChange={(e) => setAmount(e.target.value)}
//                     ></input>
//                     <div className="w-[120px] flex px-4 space-x-[6px]">
//                       <Image src="/usdc.svg" alt="usdc" width={0} height={0} className="w-[24px]" />
//                       <div className="text-xl font-semibold">USDC</div>
//                     </div>
//                   </div>
//                   {/*--- input range ---*/}
//                   <input
//                     className="mt-2 w-full h-[8px] appearance-none bg-slate-700 accent-blue4 rounded-full"
//                     type="range"
//                     step="0.01"
//                     value={amount ? (Number(amount) / Number(depositOrWithdraw == "Deposit" ? usdcBalance : vaultBalance)) * 100 : 0}
//                     onChange={(e) => {
//                       setAmount(
//                         ((Number(depositOrWithdraw == "Deposit" ? usdcBalance : vaultBalance) * Number(e.target.value)) / 100).toFixed(2)
//                       );
//                     }}
//                   ></input>
//                   {/*--- range values ---*/}
//                   <div className="w-full mt-1 flex justify-between text-[13px] text-slate-400">
//                     {rangeValues.map((i) => (
//                       <div
//                         key={i}
//                         className="hover:text-slate-300 cursor-pointer"
//                         onClick={() => {
//                           if (i == 100) {
//                             setAmount(depositOrWithdraw == "Deposit" ? usdcBalance : vaultBalance);
//                           } else {
//                             setAmount(((i / 100) * Number(depositOrWithdraw == "Deposit" ? usdcBalance : vaultBalance)).toFixed(2));
//                           }
//                         }}
//                       >
//                         {i}%
//                       </div>
//                     ))}
//                   </div>
//                   {/*--- buttons ---*/}
//                   <button
//                     className="buttonPrimary w-full mt-8"
//                     onClick={() => (depositOrWithdraw == "Deposit" ? deposit() : withdraw())}
//                     disabled={txState != "initial"}
//                   >
//                     {depositOrWithdraw == "Deposit" ? "Deposit" : "Withdraw"}
//                   </button>
//                 </div>
//               ) : (
//                 <LoadingGray40 />
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       {errorModal && <ErrorModal setErrorModal={setErrorModal} errorMsg={errorMsg} />}
//       {txModal && amount && (
//         <TxModal
//           txState={txState}
//           setTxState={setTxState}
//           setTxModal={setTxModal}
//           amount={amount}
//           setAmount={setAmount}
//           depositOrWithdraw={depositOrWithdraw}
//           isApproveNeeded={isApproveNeeded}
//           selectedVault={selectedVault}
//         />
//       )}
//     </main>
//   );
// };

// export default page;
