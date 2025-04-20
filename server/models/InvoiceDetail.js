const mongoose = require("mongoose");

const InvoiceDetailSchema = new mongoose.Schema({
  invoice_id: { type: mongoose.Schema.Types.ObjectId, ref: "InvoiceMaster" },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  rate: Number,
  unit: String,
  qty: Number,
  disc_percentage: Number,
  net_amount: Number,
  total_amount: Number,
});

module.exports = mongoose.model("InvoiceDetail", InvoiceDetailSchema);
