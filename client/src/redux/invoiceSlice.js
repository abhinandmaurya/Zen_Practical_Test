import { createSlice } from "@reduxjs/toolkit";

const invoiceSlice = createSlice({
  name: "invoice",
  initialState: {
    customerName: "",
    items: [],
  },
  reducers: {
    setCustomerName: (state, action) => {
      state.customerName = action.payload;
    },
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action) => {
      state.items.splice(action.payload, 1);
    },
    resetInvoice: (state) => {
      state.customerName = "";
      state.items = [];
    },
  },
});

export const { setCustomerName, addItem, removeItem, resetInvoice } =
  invoiceSlice.actions;
export default invoiceSlice.reducer;
