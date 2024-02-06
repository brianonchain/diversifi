"use client";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { WagmiConfig } from "wagmi";
import { arbitrum, polygon, optimism, base } from "viem/chains";
import logo from "../../public/logo.svg";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";
console.log(projectId);

// 2. Create wagmiConfig
const metadata = {
  name: "Diversifi Finance",
  description: "",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [arbitrum, polygon, optimism, base];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// 3. Create modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
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
