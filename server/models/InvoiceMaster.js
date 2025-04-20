const mongoose = require("mongoose");

const InvoiceMasterSchema = new mongoose.Schema({
  invoice_no: Number,
  invoice_date: Date,
  customer_name: String,
  total_amount: Number,
});

module.exports = mongoose.model("InvoiceMaster", InvoiceMasterSchema);
