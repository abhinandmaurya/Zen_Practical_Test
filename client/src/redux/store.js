import { configureStore } from "@reduxjs/toolkit";
import invoiceReducer from "./invoiceSlice";

export default configureStore({
  reducer: {
    invoice: invoiceReducer,
  },
});
