import { createSlice } from "@reduxjs/toolkit";

const selectVaultSlice = createSlice({
  name: "selectedVaultIndex",
  initialState: 0,
  reducers: {
    selectVault: (state, action) => {
      return action.payload;
    },
  },
});

export const { selectVault } = selectVaultSlice.actions;

export default selectVaultSlice.reducer;
