"use client";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { WagmiConfig } from "wagmi";
import { arbitrum, mainnet } from "viem/chains";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";
console.log(projectId);

// 2. Create wagmiConfig
const metadata = {
  name: "Antica Finance",
  description: "",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [mainnet, arbitrum];
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
});

export function Web3Modal({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
