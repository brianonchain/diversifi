import { create } from "zustand";

type CounterStore = {
  count: number;
  increment: () => void;
  decrement: () => void;
};

type ChainStore = {
  chain: string;
  setChain: (chain: string) => void;
};

type UserVaultIndexStore = {
  userVaultIndex: number;
  setUserVaultIndex: (userVaultIndex: number) => void;
};

type VaultIndexStore = {
  vaultIndex: number;
  setVaultIndex: (vaultIndex: number) => void;
};

type ErrorMsgStore = {
  errorMsg: string;
  setErrorMsg: (errorMsg: string) => void;
};

export const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () => {
    set((state) => ({ count: state.count + 1 }));
  },
  decrement: () => {
    set((state) => ({ count: state.count - 1 }));
  },
}));

export const useChainStore = create<ChainStore>((set) => ({
  chain: "Polygon",
  setChain: (chain) => {
    set(() => ({ chain: chain }));
  },
}));

export const useUserVaultIndexStore = create<UserVaultIndexStore>((set) => ({
  userVaultIndex: 0,
  setUserVaultIndex: (userVaultIndex) => {
    set(() => ({ userVaultIndex: userVaultIndex }));
  },
}));

export const useVaultIndexStore = create<VaultIndexStore>((set) => ({
  vaultIndex: 0,
  setVaultIndex: (vaultIndex) => {
    set(() => ({ vaultIndex: vaultIndex }));
  },
}));

export const useErrorMsgStore = create<ErrorMsgStore>((set) => ({
  errorMsg: "",
  setErrorMsg: (errorMsg) => {
    set(() => ({ errorMsg: errorMsg }));
  },
}));
