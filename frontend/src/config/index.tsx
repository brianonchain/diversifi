import { cookieStorage, createStorage, createConfig, http } from "wagmi";
import { optimism, arbitrum, base, linea, zkSync, scroll, sepolia } from "viem/chains";
import { injected, walletConnect, coinbaseWallet } from "wagmi/connectors";

// Project ID
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
  name: "Diversifi",
  description: "",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// Create wagmiConfig
export const config = createConfig({
  chains: [optimism, arbitrum, linea, base, zkSync, scroll, sepolia],
  transports: {
    [optimism.id]: http(), // must include or type error
    [arbitrum.id]: http(),
    [base.id]: http(),
    [linea.id]: http(),
    [zkSync.id]: http(),
    [scroll.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    walletConnect({ projectId, metadata, showQrModal: false }), // appears as WalletConnect (1st) and All Wallets (last)
    coinbaseWallet({
      appName: metadata.name,
      appLogoUrl: metadata.icons[0],
    }), // appears as Coinbase
    // injected({ shimDisconnect: true }), // appears as Browser Wallet (2nd), not needed as we already have All Wallets
  ],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
