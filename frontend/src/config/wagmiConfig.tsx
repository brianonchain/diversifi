import { cookieStorage, createStorage, http } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { arbitrum, polygon, optimism, base } from "@reown/appkit/networks";

export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

export const networks = [arbitrum, polygon, optimism, base];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId: projectId,
  networks: networks,
  // transports: {
  //   [arbitrum.id]: http(process.env.ARBITRUM_RPC_URL),
  //   [polygon.id]: http(process.env.POLYGON_RPC_URL),
  //   [optimism.id]: http(process.env.OPTIMISM_RPC_URL),
  //   [base.id]: http(process.env.BASE_RPC_URL),
  // },
});

export const config = wagmiAdapter.wagmiConfig;
