const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');

router.post('/', async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.status(201).json(supplier);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const suppliers = await Supplier.find().sort({ name: 1 });
  res.json(suppliers);
});

router.post('/broadcast', async (req, res) => {
  const { supplierIds, message } = req.body;
  const suppliers = await Supplier.find({ _id: { $in: supplierIds } });
  res.json({
    sent: suppliers.map(s => ({ supplier: s.name, channel: s.contactChannel, message })),
  });
});

module.exports = router;
