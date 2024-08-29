"use client";

import React, { ReactNode } from "react";
import { config, projectId, metadata } from "@/config";

import { createWeb3Modal } from "@web3modal/wagmi/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { State, WagmiProvider } from "wagmi";

// Setup queryClient
const queryClient = new QueryClient();

if (!projectId) throw new Error("Project ID is not defined");

// Create modal
createWeb3Modal({
  metadata,
  wagmiConfig: config,
  projectId,
  // excludeWalletIds: [
  //   '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369',
  //   '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0'
  // ],
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  themeMode: "light",
  // themeVariables: {
  //   "--w3m-font-family": "inter",
  //   "--w3m-accent": "#3b82f6",
  //   "--w3m-color-mix": "#3b82f6",
  //   "--w3m-color-mix-strength": 0,
  //   '--w3m-font-size-master': "16",
  //   "--w3m-border-radius-master": "20",
  // },
  // featuredWalletIds: [
  // "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // MetaMask
  // "a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393", // Phantom
  // "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa", // Coinbase
  // "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709", // OKX Wallet
  // ],
  // chainImages: { 534352: "/logo.svg" },
});

export default function AppKitProvider({ children, initialState }: { children: ReactNode; initialState?: State }) {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
