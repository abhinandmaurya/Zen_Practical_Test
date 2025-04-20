import React, { useState } from "react";
import { TextField, Grid, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setCustomerName, resetInvoice } from "../redux/invoiceSlice";
import axios from "axios";

const SummaryForm = () => {
  const dispatch = useDispatch();
  const { customerName, items } = useSelector((state) => state.invoice);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const invoiceData = {
      customerName,
      items,
      totalAmount: items.reduce((sum, item) => sum + item.totalAmount, 0),
    };

    try {
      const response = await axios.post("/api/invoices", invoiceData);

      if (response.status === 200) {
        alert("Invoice submitted successfully");
      }
    } catch (err) {
      setError("Failed to submit the invoice. Please try again.");
      console.error("Error submitting invoice:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    dispatch(resetInvoice());
  };

  const totalAmount = items.reduce((sum, item) => sum + item.totalAmount, 0);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          label="Customer Name"
          value={customerName}
          onChange={(e) => dispatch(setCustomerName(e.target.value))}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <h3>Total Amount: {totalAmount}</h3>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "SUBMIT"}
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleReset}>
          RESET
        </Button>
      </Grid>
      {error && (
        <Grid item xs={12}>
          <p style={{ color: "red" }}>{error}</p>
        </Grid>
      )}
    </Grid>
  );
};

export default SummaryForm;
