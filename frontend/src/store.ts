import { create } from "zustand";

// counter
type CounterStore = { count: number; increment: () => void; decrement: () => void };
export const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () => {
    set((state) => ({ count: state.count + 1 }));
  },
  decrement: () => {
    set((state) => ({ count: state.count - 1 }));
  },
}));

// userVaultIndex
type UserVaultIndexStore = { userVaultIndex: number; setUserVaultIndex: (userVaultIndex: number) => void };
export const useUserVaultIndexStore = create<UserVaultIndexStore>((set) => ({
  userVaultIndex: 0,
  setUserVaultIndex: (userVaultIndex) => {
    set(() => ({ userVaultIndex: userVaultIndex }));
  },
}));

// vaultId
type VaultIdStore = { vaultId: string; setVaultId: (vaultId: string) => void };
export const useVaultIdStore = create<VaultIdStore>((set) => ({
  vaultId: "Polygon_Stablecoin_Vault",
  setVaultId: (vaultId) => {
    set(() => ({ vaultId: vaultId }));
  },
}));

// errorMsg
type ErrorMsgStore = { errorMsg: string; setErrorMsg: (errorMsg: string) => void };
export const useErrorMsgStore = create<ErrorMsgStore>((set) => ({
  errorMsg: "",
  setErrorMsg: (errorMsg) => {
    set(() => ({ errorMsg: errorMsg }));
  },
}));
