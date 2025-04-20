const InvoiceMaster = require("../models/InvoiceMaster");
const InvoiceDetail = require("../models/InvoiceDetail");

exports.createInvoice = async (req, res) => {
  try {
    const { customer_name, items } = req.body;

    if (!customer_name || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid invoice data" });
    }

    console.log("Incoming Invoice:", req.body);

    const lastInvoice = await InvoiceMaster.findOne().sort({ invoice_no: -1 });
    const invoice_no = lastInvoice ? lastInvoice.invoice_no + 1 : 1;

    const total_amount = items.reduce(
      (sum, item) => sum + (item.total_amount || 0),
      0
    );

    const invoiceMaster = await InvoiceMaster.create({
      invoice_no,
      invoice_date: new Date(),
      customer_name,
      total_amount,
    });

    const invoiceDetails = items.map((item) => ({
      invoice_id: invoiceMaster._id,
      product_id: item.product_id,
      rate: item.rate,
      unit: item.unit,
      qty: item.qty,
      disc_percentage: item.disc_percentage,
      net_amount: item.net_amount,
      total_amount: item.total_amount,
    }));

    await InvoiceDetail.insertMany(invoiceDetails);

    res.status(201).json({ message: "Invoice created successfully" });
  } catch (error) {
    console.error(" Error creating invoice:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
