import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";
import selectVaultReducer from "./vaultIndexSlice";

export const store = configureStore({
  reducer: { counter: counterReducer, vaultIndex: selectVaultReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
