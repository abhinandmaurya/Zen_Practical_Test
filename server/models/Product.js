const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  product_name: String,
  rate: Number,
  unit: String,
});

module.exports = mongoose.model("Product", ProductSchema);
