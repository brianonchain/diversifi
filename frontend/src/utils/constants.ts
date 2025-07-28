import type { Hex } from "viem";

export type VaultInfo = {
  id: string;
  title: string;
  src: string;
};

export type HistoryItem = {
  blockTimestamp: string;
  event: string;
  amount: string;
  transactionHash: string;
  date: string;
};

export const allVaults: { [key: string]: VaultInfo[] } = {
  Polygon: [{ id: "polygon-stables1", title: "Polygon Stablecoin Vault", src: "/polygon-stables1.svg" }],
  Optimism: [{ id: "op-stables1", title: "Optimism Stablecoin Vault", src: "/op-stables1.svg" }],
  Arbitrum: [
    { id: "arb-stables1", title: "Arbitrum Stablecoin Vault", src: "/arb-stables1.svg" },
    { id: "arb-glp", title: "Arbitrum GLP Vault", src: "/arb-glp.svg" },
  ],
  Base: [{ id: "base-stables1", title: "Base Stablecoin Vault", src: "/base-stables1.svg" }],
  Sepolia: [{ id: "sepolia-stables1", title: "Sepolia Stablecoin Vault", src: "/sepolia-stables1.svg" }],
};

export const vaultIdToContractAddress: { [key: string]: Hex } = {
  Polygon_Stablecoin_Vault: "0x599559Ed394ADd1117ab72667e49d1560A2124E0",
  Base_Stablecoin_Vault: "0x599559Ed394ADd1117ab72667e49d1560A2124E0",
  Sepolia_Stablecoin_Vault: "0xd8d86fe48323Cd4A630cef4f7825fCB22dEF94E9",
};

export const chainToUsdcAddress: { [key: string]: Hex } = {
  Polygon: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  Base: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  Sepolia: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", // eth sepolia
};

export const chainNameToUsdcAddress: { [key: string]: Hex } = {
  Polygon: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  Base: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  Sepolia: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", // eth sepolia
};

const vaults = [
  {
    chain: "Polygon",
    vaults: [
      {
        title: "Polygon Stablecoin Vault",
        text: ["To test the vault:", "1. Select Polygon (left menu)", "2. Enter an amount and click Deposit", "3. Withdraw your USDC"],
      },
    ],
  },
  {
    chain: "Optimism",
    vaults: [
      {
        title: "Optimism Stablecoin Vault",
        text: ["This vault has not been activated yet"],
      },
    ],
  },
  {
    chain: "Arbitrum",
    vaults: [
      {
        title: "Arbitrum Stablecoin Vault",
        text: ["This vault has not been activated yet"],
      },
      {
        title: "Arbitrum GLP Vault",
        text: ["This vault has not been activated yet"],
      },
    ],
  },
  {
    chain: "Base",
    vaults: [
      {
        title: "Base Stablecoin Vault",
        text: ["This vault has not been activated yet"],
      },
    ],
  },
];

// for /pay and /merchantDash
import { Item, CurrencyInfo } from "@/utils/types";

export const chainNameToPayContractAddress: { [key: string]: Hex } = {
  Polygon: "0x",
  Base: "0x",
  Sepolia: "0x634a3A7cA779BBaF8287E9CbEb252676f0e11Ae1", // eth sepolia
};

// list of items for sale
export const catalog: Item[] = [
  { name: "Item 1", currencyPrice: 50n, id: 1 },
  { name: "Item 2", currencyPrice: 100n, id: 2 },
  { name: "Item 3", currencyPrice: 75n, id: 3 },
  { name: "Item 4", currencyPrice: 60n, id: 4 },
];

export const currencyIdToCurrencyInfo: { [key: string]: CurrencyInfo } = {
  "1": { code: "USD", symbol: "$", decimals: 2, rateDecimals: 0 },
  "2": { code: "TWD", symbol: "NT", decimals: 0, rateDecimals: 6 },
  "3": { code: "EUR", symbol: "€", decimals: 2, rateDecimals: 4 },
};
