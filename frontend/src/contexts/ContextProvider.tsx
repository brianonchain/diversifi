"use client";
// wagmi
import { wagmiAdapter, projectId } from "@/config/wagmiConfig";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";
// reown
import { createAppKit } from "@reown/appkit/react";
import { arbitrum, polygon, optimism, base } from "@reown/appkit/networks";
// react query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
//redux
import { Provider } from "react-redux";
import { store } from "@/state/store";

// queryClient
const queryClient = new QueryClient();

// reown
export const metadata = {
  name: "DiversiFi",
  description: "Earn diversified yield (test app)",
  url: "https://diversifi.vercel.app",
  icons: ["/icon-svg.svg"],
};

if (!projectId) throw new Error("Project ID is not defined");

// Create the modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [arbitrum, polygon, optimism, base],
  defaultNetwork: polygon,
  metadata: metadata,
  features: {
    // analytics: true, // Optional - defaults to your Cloud configuration
    email: false, // default to true
    socials: ["google", "apple"],
    emailShowWallets: true, // default to true
  },
  themeMode: "light",
});

export default function ContextProvider({ children, cookies }: { children: React.ReactNode; cookies: string | null }) {
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
