import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";
import selectVaultReducer from "./selectVaultSlice";

export const store = configureStore({
  reducer: { counter: counterReducer, selectedVaultIndex: selectVaultReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
