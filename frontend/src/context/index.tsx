"use client";
import { State, WagmiProvider } from "wagmi";
import { config, projectId } from "@/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWeb3Modal } from "@web3modal/wagmi/react";

const queryClient = new QueryClient(); // setup Query client
if (!projectId) throw new Error("Project ID is not defined");

// Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeMode: "light",
  themeVariables: {
    // "--w3m-font-family": "inter",
    "--w3m-accent": "#3b82f6",
    "--w3m-color-mix": "#3b82f6",
    "--w3m-color-mix-strength": 0,
    // '--w3m-font-size-master': "16",
    "--w3m-border-radius-master": "2px",
  },
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

export const ContextProvider = ({ children, initialState }: { children: React.ReactNode; initialState?: State }) => {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};

export default ContextProvider;

/*

createWeb3Modal options
    projectId: OptionsControllerState['projectId'];
    themeMode?: ThemeMode;
    themeVariables?: ThemeVariables;
    allWallets?: OptionsControllerState['allWallets'];
    includeWalletIds?: OptionsControllerState['includeWalletIds'];
    excludeWalletIds?: OptionsControllerState['excludeWalletIds'];
    featuredWalletIds?: OptionsControllerState['featuredWalletIds'];
    defaultChain?: NetworkControllerState['caipNetwork'];
    tokens?: OptionsControllerState['tokens'];
    termsConditionsUrl?: OptionsControllerState['termsConditionsUrl'];
    privacyPolicyUrl?: OptionsControllerState['privacyPolicyUrl'];
    customWallets?: OptionsControllerState['customWallets'];
    enableAnalytics?: OptionsControllerState['enableAnalytics'];
    metadata?: OptionsControllerState['metadata'];
    _sdkVersion: OptionsControllerState['sdkVersion'];

theme-variables
    '--w3m-font-family'?: string;
    '--w3m-accent'?: string;
    '--w3m-color-mix'?: string;
    '--w3m-color-mix-strength'?: number;
    '--w3m-font-size-master'?: string;
    '--w3m-border-radius-master'?: string;
    '--w3m-z-index'?: number;

*/
