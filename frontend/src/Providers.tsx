"use client";
// wagmi
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";
import { cookieStorage, createStorage, http } from "@wagmi/core";
// appkit
import { createAppKit } from "@reown/appkit/react";
import { sepolia, polygon, base } from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
// react query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
//redux
import { Provider } from "react-redux";
import { store } from "@/state/store";

// react query
const queryClient = new QueryClient();

// networks
export const networks = [sepolia, polygon, base];

// wagmi
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID!,
  networks,
});

// appkit
createAppKit({
  adapters: [wagmiAdapter],
  projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID!,
  networks: [sepolia, polygon, base],
  defaultNetwork: polygon,
  metadata: {
    name: "DiversiFi",
    description: "Earn diversified yield (test app)",
    url: "https://diversifi.vercel.app",
    icons: ["/icon-svg.svg"],
  },
  features: {
    // analytics: true, // Optional - defaults to your Cloud configuration
    email: false, // default to true
    socials: ["google", "apple"],
    emailShowWallets: true, // default to true
  },
  themeMode: "light",
});

export default function Providers({ children, cookies }: { children: React.ReactNode; cookies: string | null }) {
  console.log("Providers.tsx");
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          {children}
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
