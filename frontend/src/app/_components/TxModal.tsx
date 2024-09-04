// nextjs
import Link from "next/link";
// images
import { FaCheck } from "react-icons/fa";
import { LoadingGray32 } from "@/app/_components/LoadingGray";
import { PiHandDepositLight, PiHandWithdrawLight } from "react-icons/pi";
import { LuExternalLink } from "react-icons/lu";
// types
import { Vault } from "./Vaults";

const TxModal = ({
  txState,
  setTxState,
  setTxModal,
  amount,
  setAmount,
  depositOrWithdraw,
  isApproveNeeded,
  selectedVault,
  txHash,
}: {
  txState: string;
  setTxState: any;
  setTxModal: any;
  amount: string;
  setAmount: any;
  depositOrWithdraw: string;
  isApproveNeeded: boolean;
  selectedVault: Vault;
  txHash: string;
}) => {
  return (
    <div className="absolute z-[200]">
      <div className="txModal text-lg">
        {/*--- content ---*/}
        <div className="w-full h-full flex flex-col items-center justify-between modalXpadding overflow-y-auto">
          {/*--- title ---*/}
          <div className="text-center font-medium text-xl leading-relaxed">
            {depositOrWithdraw == "Deposit" ? "Depositing" : "Withdrawing"} <span className="font-bold">{amount} USDC</span>
            <br />
            {depositOrWithdraw == "Deposit" ? "to" : "from"} {selectedVault.title}
          </div>
          {/*--- 3 cases ---*/}
          {depositOrWithdraw == "Deposit" && isApproveNeeded && (
            <div className="w-full flex flex-col">
              {/*--- 1 ---*/}
              <div className="flex items-center space-x-3">
                {txState == "approve" && <div className="number">1</div>}
                {txState == "approving" && <LoadingGray32 />}
                {["deposit", "depositing", "final"].includes(txState) && (
                  <div className="check">
                    <FaCheck />
                  </div>
                )}
                <div>
                  {txState == "approve" && <p>In your wallet, approve USDC</p>}
                  {txState == "approving" && <p>Approving USDC...</p>}
                  {["deposit", "depositing", "final"].includes(txState) && <p>USDC was approved</p>}
                </div>
              </div>
              {/*--- line ---*/}
              <div className={`${["initial", "approve", "approving"].includes(txState) ? "opacity-15" : ""} lineContainer`}>
                <div className="w-[3px] h-[20px] bg-slate-500 rounded-full"></div>
              </div>
              {/*--- 2 ---*/}
              <div className={`${["initial", "approve", "approving"].includes(txState) ? "opacity-15" : ""} flex items-center space-x-3`}>
                {["initial", "approve", "approving", "deposit"].includes(txState) && <div className="number">2</div>}
                {txState == "depositing" && <LoadingGray32 />}
                {txState == "final" && (
                  <div className="check">
                    <FaCheck />
                  </div>
                )}
                <div>
                  {["initial", "approve", "approving", "deposit"].includes(txState) && <p>In your wallet, confirm the transaction</p>}
                  {txState == "depositing" && <p>Transaction pending...</p>}
                  {txState == "final" && (
                    <div className="flex items-center space-x-4">
                      <p>Transaction completed</p>
                      <Link
                        className="text-sm text-blue-500 flex items-center space-x-1 hover:brightness-125"
                        href={`https://polygonscan.com/tx/${txHash}`}
                        target="_blank"
                      >
                        <p>view txn</p>
                        <LuExternalLink />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {depositOrWithdraw == "Deposit" && !isApproveNeeded && (
            <div className={`flex items-center space-x-3`}>
              {["initial", "approve", "approving", "deposit"].includes(txState) && (
                <div className="number">
                  <PiHandDepositLight className="w-[24px] h-[24px]" />
                </div>
              )}
              {txState == "depositing" && <LoadingGray32 />}
              {txState == "final" && (
                <div className="check">
                  <FaCheck />
                </div>
              )}
              <div>
                {["initial", "approve", "approving", "deposit"].includes(txState) && <p>In your wallet, confirm the transaction</p>}
                {txState == "depositing" && <p>Transaction pending...</p>}
                {txState == "final" && <p>Transaction completed</p>}
              </div>
            </div>
          )}
          {depositOrWithdraw == "Withdraw" && (
            <div className={`flex items-center space-x-3`}>
              {txState == "withdraw" && (
                <div className="number">
                  <PiHandWithdrawLight className="w-[24px] h-[24px]" />
                </div>
              )}
              {txState == "withdrawing" && <LoadingGray32 />}
              {txState == "final" && (
                <div className="check">
                  <FaCheck />
                </div>
              )}
              <div>
                {txState == "withdraw" && <p>In your wallet, confirm the transaction</p>}
                {txState == "withdrawing" && <p>Transaction pending...</p>}
                {txState == "final" && (
                  <div className="flex items-center space-x-4">
                    <p>Transaction completed</p>
                    <Link
                      className="text-sm text-blue-500 flex items-center space-x-1 hover:brightness-125"
                      href={`https://polygonscan.com/tx/${txHash}`}
                      target="_blank"
                    >
                      <p>view txn</p>
                      <LuExternalLink />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
          {/*--- completed note ---*/}
          <div className={`${txState == "final" ? "" : "invisible"} text-center`}>
            <div className=" text-xl font-bold">{depositOrWithdraw == "Deposit" ? "Deposit" : "Withdrawal"} successful!</div>
          </div>
          {/*--- button ---*/}
          <button
            className={`${txState == "final" ? "" : "invisible"} buttonPrimary w-full my-3`}
            onClick={() => {
              setTxModal(false);
              setTxState("initial");
              setAmount(undefined);
              (document.getElementById("amount") as HTMLInputElement).value = "";
            }}
          >
            Close
          </button>
        </div>
      </div>
      <div
        className="modalBlackout"
        onClick={() => {
          if (txState == "deposited" || txState == "withdrawn") {
            setTxModal(false);
            setTxState("initial");
            setAmount(undefined);
            (document.getElementById("amount") as HTMLInputElement).value = "";
          }
        }}
      ></div>
    </div>
  );
};

export default TxModal;
