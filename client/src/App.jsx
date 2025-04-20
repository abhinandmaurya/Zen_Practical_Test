import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import InvoiceForm from "./components/InvoiceForm";

const App = () => {
  return (
    <Provider store={store}>
      <InvoiceForm />
    </Provider>
  );
};

export default App;
