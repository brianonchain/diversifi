import { createSlice } from "@reduxjs/toolkit";

const vaultIndexSlice = createSlice({
  name: "vaultIndex",
  initialState: 0,
  reducers: {
    setVaultIndex: (state, action) => {
      return action.payload;
    },
  },
});

export const { setVaultIndex } = vaultIndexSlice.actions;

export default vaultIndexSlice.reducer;
