import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Button,
  Typography,
  TextField,
  Paper,
  Box,
  MenuItem,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  setCustomerName,
  addItem,
  removeItem,
  resetInvoice,
} from "../redux/invoiceSlice";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import api from "../api";

const InvoiceForm = () => {
  const dispatch = useDispatch();
  const { customerName, items } = useSelector((state) => state.invoice);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    product: "",
    productId: "",
    rate: "",
    unit: "",
    qty: 1,
    discount: 0,
    netAmount: 0,
    totalAmount: 0,
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (formData.rate && formData.qty) {
      const rate = parseFloat(formData.rate);
      const qty = parseFloat(formData.qty);
      const discount = parseFloat(formData.discount) || 0;

      const netAmount = rate * qty;
      const totalAmount = netAmount - (netAmount * discount) / 100;

      setFormData((prev) => ({
        ...prev,
        netAmount: netAmount.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
      }));
    }
  }, [formData.rate, formData.qty, formData.discount]);

  const handleCustomerChange = (e) => {
    dispatch(setCustomerName(e.target.value));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProductSelect = (e) => {
    const productId = e.target.value;
    const selectedProduct = products.find((p) => p._id === productId);

    if (selectedProduct) {
      setFormData({
        ...formData,
        product: selectedProduct.product_name,
        productId: selectedProduct._id,
        rate: selectedProduct.rate,
        unit: selectedProduct.unit,
        qty: 1,
        discount: 0,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!customerName) newErrors.customerName = "Customer name is required";
    if (!formData.productId) newErrors.product = "Product is required";
    if (!formData.rate || formData.rate <= 0)
      newErrors.rate = "Valid rate is required";
    if (!formData.qty || formData.qty <= 0)
      newErrors.qty = "Valid quantity is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddItem = () => {
    if (!validateForm()) return;

    const newItem = {
      id: Date.now(),
      product_id: formData.productId,
      productName: formData.product,
      rate: parseFloat(formData.rate),
      unit: formData.unit,
      qty: parseInt(formData.qty),
      disc_percentage: parseFloat(formData.discount),
      net_amount: parseFloat(formData.netAmount),
      total_amount: parseFloat(formData.totalAmount),
    };

    dispatch(addItem(newItem));
    resetItemForm();
  };

  const resetItemForm = () => {
    setFormData({
      product: "",
      productId: "",
      rate: "",
      unit: "",
      qty: 1,
      discount: 0,
      netAmount: 0,
      totalAmount: 0,
    });
  };

  const handleRemoveItem = (index) => {
    dispatch(removeItem(index));
  };

  const handleSubmit = async () => {
    if (items.length === 0) {
      setErrors({ ...errors, items: "At least one item is required" });
      return;
    }

    try {
      const invoiceData = {
        customer_name: customerName,
        items,
      };

      console.log("Submitting invoice data:", invoiceData);

      const response = await api.post("/invoices", invoiceData);
      dispatch(resetInvoice());
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting invoice:", error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Create Invoice
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Invoice created successfully!
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Customer Name"
              value={customerName}
              onChange={handleCustomerChange}
              error={!!errors.customerName}
              helperText={errors.customerName}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Product"
              value={formData.productId}
              onChange={handleProductSelect}
              error={!!errors.product}
              helperText={errors.product}
              required
            >
              <MenuItem value="">
                <em>Select a product</em>
              </MenuItem>
              {loading ? (
                <MenuItem disabled>Loading products...</MenuItem>
              ) : (
                products.map((product) => (
                  <MenuItem key={product._id} value={product._id}>
                    {product.product_name}
                  </MenuItem>
                ))
              )}
            </TextField>
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              label="Rate"
              name="rate"
              value={formData.rate}
              onChange={handleChange}
              error={!!errors.rate}
              helperText={errors.rate}
              required
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              label="Unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              label="Qty"
              name="qty"
              type="number"
              value={formData.qty}
              onChange={handleChange}
              error={!!errors.qty}
              helperText={errors.qty}
              required
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              label="Discount %"
              name="discount"
              type="number"
              value={formData.discount}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6} sm={4}>
            <TextField
              fullWidth
              label="Net Amount"
              value={formData.netAmount}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={6} sm={4}>
            <TextField
              fullWidth
              label="Total Amount"
              value={formData.totalAmount}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleAddItem}
              sx={{ height: "56px" }}
            >
              + ADD
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <ProductTable items={items} onRemove={handleRemoveItem} />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={items.length === 0}
          sx={{ mr: 2 }}
        >
          Submit Invoice
        </Button>
        <Button variant="outlined" onClick={() => dispatch(resetInvoice())}>
          Reset
        </Button>
      </Box>
    </Container>
  );
};

const ProductTable = ({ items, onRemove }) => (
  <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
    <Typography variant="h6" gutterBottom>
      Added Products
    </Typography>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Product</TableCell>
          <TableCell>Rate</TableCell>
          <TableCell>Unit</TableCell>
          <TableCell>Qty</TableCell>
          <TableCell>Disc %</TableCell>
          <TableCell>Net Amt</TableCell>
          <TableCell>Total Amt</TableCell>
          <TableCell align="center">Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item, index) => (
          <TableRow key={item.id}>
            <TableCell>{item.productName}</TableCell>
            <TableCell>{item.rate}</TableCell>
            <TableCell>{item.unit}</TableCell>
            <TableCell>{item.qty}</TableCell>
            <TableCell>{item.disc_percentage}</TableCell>
            <TableCell>{item.net_amount.toFixed(2)}</TableCell>
            <TableCell>{item.total_amount.toFixed(2)}</TableCell>
            <TableCell align="center">
              <IconButton
                color="error"
                onClick={() => onRemove(index)}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Paper>
);

export default InvoiceForm;
