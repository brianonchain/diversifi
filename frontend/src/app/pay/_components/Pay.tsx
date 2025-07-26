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

const items: Item[] = [
  { name: "Item 1", currencyPrice: 50n, id: 1 },
  { name: "Item 2", currencyPrice: 100n, id: 2 },
  { name: "Item 3", currencyPrice: 75n, id: 3 },
  { name: "Item 4", currencyPrice: 60n, id: 4 },
];
const merchantAddress = "0xf3D49126A9E25724CFE2Ca00bEAa34317543f9aC";
const localToUsdc = "0.033333";
const rateDecimals = 6;
const currency = "TWD";
const currencyDecimals = 0; // TWD=0, USD=2, EUR=2
const cashback = "2";

export default function Pay() {
  console.log("Pay.tsx");
  // states
  const [currencyAmount, setCurrencyAmount] = useState<string | null>(null);
  const [usdcAmount, setUsdcAmount] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [txState, setTxState] = useState<string>("initial"); // initial, waitingForApprove, approving, waitingForDeposit, depositing, final
  // hooks
  const config = useConfig();
  const { chain, address } = useAccount();
  const { switchChain } = useSwitchChain();
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
  // logs
  console.log("cartItems", cartItems);
  console.log("chain", chain);

  // change to sepolia on mount
  useEffect(() => {
    if (chain?.name !== "Sepolia") {
      switchChain({ chainId: 11155111 });
    }
  }, []);

  // calculate usdcSentTotal whenever cartItems changes
  useEffect(() => {
    let usdcSentTotal = 0;
    let currencyTotalInteger = 0;
    for (const cartItem of cartItems) {
      currencyTotalInteger += Math.round(Number(cartItem.item.currencyPrice) * 10 ** currencyDecimals) * cartItem.quantity;
      // usdc
      const usdcSentPerItem = (Number(cartItem.item.currencyPrice) * Number(localToUsdc) * (1 - Number(cashback) / 100)).toFixed(2); // CANONICAL FORMULA. localToUsdc = usdcSendPerItem/(currencyPrice * (1 - cashback/100))
      usdcSentTotal = Number((usdcSentTotal + Number(usdcSentPerItem) * cartItem.quantity).toFixed(2));
      console.log(usdcSentPerItem, usdcSentTotal);
    }
    setCurrencyAmount((currencyTotalInteger / 10 ** currencyDecimals).toFixed(currencyDecimals));
    setUsdcAmount(usdcSentTotal.toString());
  }, [cartItems]);

  // when user clicks "Add" button below item
  async function addItem(item: Item) {
    if (cartItems.find((cartItem) => cartItem.item.id === item.id)) {
      setCartItems(cartItems.map((cartItem) => (cartItem.item.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem)));
    } else {
      setCartItems([...cartItems, { item, quantity: 1 }]);
    }
  }

  async function minusOne(item: Item) {
    setCartItems(cartItems.map((cartItem) => (cartItem.item.id === item.id ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem)));
  }

  async function plusOne(item: Item) {
    setCartItems(cartItems.map((cartItem) => (cartItem.item.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem)));
  }

  async function deleteAll(itemId: number) {
    setCartItems(cartItems.filter((cartItem) => cartItem.item.id !== itemId));
  }

  async function pay() {
    if (cartItems.length === 0) {
      alert("Please select an item");
      return;
    }
    if (!chain) {
      alert("Please connect your wallet");
      return;
    }
    if (Number(usdcBalance) < Number(usdcAmount)) {
      alert("Insufficient balance");
      return;
    }
    // TODO: check for overflows
    setTxState("waitingForApprove");

    // iterate cartItems
    const itemsBytes32Array: string[] = [];
    let usdcSentTotal = 0;
    for (const cartItem of cartItems) {
      // calculate usdc to to send
      const usdcSentPerItem = (Number(cartItem.item.currencyPrice) * Number(localToUsdc) * (1 - Number(cashback) / 100)).toFixed(2); // CANONICAL FORMULA. localToUsdc = usdcSendPerItem/(currencyPrice * (1 - cashback/100))
      usdcSentTotal = Number((usdcSentTotal + Number(usdcSentPerItem) * cartItem.quantity).toFixed(2));
      console.log("usdcSentPerItem", usdcSentPerItem);
      console.log("usdcSentTotal", usdcSentTotal);

      // define itemsBytes32Array
      const cartItemEncoded = encodePacked(
        ["uint8", "uint8", "uint8", "uint16", "uint32", "uint64", "uint64"],
        [
          1, // 1 byte, version
          currencyToCurrencyId[currency], // 1 byte,currencyId
          Number(cashback) * 10 * 1, // 1 byte, cashback (decimals=1), max=25.5%
          cartItem.quantity, // 2 bytes, quantity
          cartItem.item.id, // 4 bytes, id
          parseUnits(cartItem.item.currencyPrice.toString(), currencyDecimals), // 8 bytes, currencyPrice
          parseUnits(usdcSentPerItem.toString(), 6), // 8 bytes, also called usdcReceived
        ]
      );
      const itemBytes32 = padHex(cartItemEncoded, { size: 32 }); // used 25 bytes, 7 bytes left
      itemsBytes32Array.push(itemBytes32);
    }
    console.log("usdcSentTotal", usdcSentTotal);
    console.log("itemsBytes32Array", itemsBytes32Array);

    // approve usdc and call "pay" on our contract
    try {
      // approve
      const approveHash = await writeContract(config, {
        address: chainNameToUsdcAddress[chain.name],
        abi: erc20Abi,
        functionName: "approve",
        args: [chainNameToPayContractAddress[chain.name], parseUnits(usdcSentTotal.toString(), 6)],
      });
      setTxState("approving");
      await waitForTransactionReceipt(config, { hash: approveHash, timeout: 60000 });
      console.log("approveHash", approveHash);

      // pay
      setTxState("waitingToSend");
      const payHash = await writeContract(config, {
        address: chainNameToPayContractAddress[chain.name],
        abi: payAbi,
        functionName: "pay",
        args: [{ to: merchantAddress, amount: parseUnits(usdcSentTotal.toString(), 6), items: itemsBytes32Array }],
      });
      setTxState("sending");
      const txReceipt = await waitForTransactionReceipt(config, { hash: payHash, timeout: 60000 });
      console.log("payHash", payHash);
      console.log("txReceipt", txReceipt);
      setTxState("final");
    } catch (e) {
      console.log(e);
      alert("Payment failed");
      setTxState("initial");
    }
  }

  return (
    <div className="w-full px-3 py-6 flex justify-center">
      <div className="w-full max-w-[500px] space-y-6">
        {/*--- USER BALANCE ---*/}
        <div className="w-full space-y-1">
          <p className="text-xl font-bold">Your Wallet's USDC Balance</p>
          <p className="text-xl">{usdcBalance} USDC</p>
        </div>
        {/*--- SELECT ITEM ---*/}
        <div className="w-full space-y-4">
          <div className="text-xl font-bold">Items For Sale</div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
            {items.map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="px-3 w-full h-[100px] text-white bg-blue1 rounded-xl border-2 border-blue2 flex flex-col justify-center items-start">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm font-semibold text-slate-400">NT {item.currencyPrice.toString()}</div>
                  <div className="text-xs text-slate-500 italic">SKU: {idToSku(item.id)}</div>
                </div>
                <button className="w-full buttonPrimary" type="button" onClick={() => addItem(item)}>
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>

        {/*--- CHECKOUT ---*/}
        <div className="w-full space-y-4">
          <div className="text-xl font-bold">Checkout</div>
          {/*--- blue border container ---*/}
          <div className="p-4 border-2 border-blue2 rounded-xl space-y-8">
            {cartItems.length > 0 ? (
              <>
                {/*--- cart items ---*/}
                <div className="grid grid-cols-[auto_1fr_1fr_auto] items-center gap-8">
                  <div className="text-sm font-bold text-slate-500">Item</div>
                  <div className="text-center text-sm font-bold text-slate-500">Quantity</div>
                  <div></div>
                  <div className="text-right text-sm font-bold text-slate-500">Price</div>
                  {cartItems.map((cartItem) => (
                    <Fragment key={cartItem.item.id}>
                      {/*--- col1, item description ---*/}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                        <div>{cartItem.item.name}</div>
                        <div className="text-xs text-slate-500">
                          <div>NT {cartItem.item.currencyPrice.toString()}</div>
                          <div className="whitespace-nowrap">{idToSku(cartItem.item.id)}</div>
                        </div>
                      </div>
                      {/*--- col2, item quantity ---*/}
                      <div className="w-full flex justify-center items-center gap-3">
                        <button
                          type="button"
                          className="w-7 h-7 flex items-center justify-center text-blue3 border-[1.5px] border-blue3 rounded-md hover:border-slate-600 hover:text-slate-600"
                          onClick={() => minusOne(cartItem.item)}
                        >
                          <FaMinus className="text-xs" />
                        </button>
                        <p>{cartItem.quantity}</p>
                        <button
                          type="button"
                          className="w-7 h-7 flex items-center justify-center text-blue3 border-[1.5px] border-blue3 rounded-md hover:border-slate-600 hover:text-slate-600"
                          onClick={() => plusOne(cartItem.item)}
                        >
                          <FaPlus className="text-xs" />
                        </button>
                      </div>
                      {/*--- col3, remove ---*/}
                      <div>
                        <button className="text-xs link" onClick={() => deleteAll(cartItem.item.id)}>
                          delete
                        </button>
                      </div>
                      {/*--- col4, subtotal ---*/}
                      <div className="text-right">NT {Number(cartItem.item.currencyPrice * BigInt(cartItem.quantity)).toFixed(currencyDecimals)}</div>
                    </Fragment>
                  ))}
                </div>
                {/*--- total price ---*/}
                <div className="pt-8 grid grid-cols-[1fr_auto] border-t border-slate-700">
                  <p>Total Price</p>
                  <div className="relative flex items-center justify-center">
                    <p>NT {currencyAmount}</p>
                    <div className="absolute w-[120%] h-[1.5px] bg-white"></div>
                  </div>
                  <p>After 2% Instant Cashback</p>
                  <p>NT {(Number(currencyAmount) * ((100 - Number(cashback)) / 100)).toFixed(currencyDecimals)}</p>
                </div>
                {/*--- usdc to be sent ---*/}
                <div className="text-center space-y-1">
                  <p className="text-xl font-medium">{usdcAmount} USDC will be sent</p>
                  <p className="text-sm text-center text-slate-500 font-medium">(1 TWD = {localToUsdc} USDC)</p>
                </div>
              </>
            ) : (
              <div className="min-h-[100px] flex items-center justify-center text-slate-400 italic">empty cart</div>
            )}
            {/*--- pay button ---*/}
            <button className="w-full buttonPrimary" type="button" onClick={pay} disabled={cartItems.length === 0 || txState !== "initial" ? true : false}>
              {txState === "initial" && "Send"}
              {txState === "waitingForApprove" && "Waiting for wallet action..."}
              {txState === "approving" && "Approving..."}
              {txState === "waitingToSend" && "Waiting for wallet action..."}
              {txState === "sending" && "Sending USDC..."}
              {txState === "final" && "Payment Successful!"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
