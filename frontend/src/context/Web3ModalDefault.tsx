"use client";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { WagmiConfig } from "wagmi";
import { arbitrum, polygon, optimism, base } from "viem/chains";
import logo from "../../public/logo.svg";

// 2. Create wagmiConfig
const chains = [arbitrum, polygon, optimism, base];
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";
const metadata = {
  name: "Diversifi",
  description: "",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata }); //defaultWagmiConfig takes type ConfigOptions and returns Config

// 3. Create modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  featuredWalletIds: [
    // "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // MetaMask
    // "a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393", // Phantom
    // "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa", // Coinbase
    // "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709", // OKX Wallet
  ],
  themeMode: "light",
  themeVariables: {
    // "--w3m-font-family": "inter",
    "--w3m-accent": "#3b82f6",
    "--w3m-color-mix": "#3b82f6",
    "--w3m-color-mix-strength": 0,
    // '--w3m-font-size-master': "16",
    // "--w3m-border-radius-master": "20",
  },
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  chainImages: { 534352: "/logo.svg" },
});

export function Web3Modal({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}

/*
ConfigOptions {
    projectId: string;
    chains: Chain[];
    metadata?: {
        name?: string;
        description?: string;
        url?: string;
        icons?: string[];
        verifyUrl?: string;
    };
    enableInjected?: boolean;
    enableEIP6963?: boolean;
    enableCoinbase?: boolean;
    enableEmail?: boolean;
    enableWalletConnect?: boolean;
}



*/
