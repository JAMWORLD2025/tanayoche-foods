const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { allocateOrder } = require('../services/allocation');

router.post('/', async (req, res) => {
  try {
    const { source, customerName, retailer, product, quantityOrdered } = req.body;
    const order = new Order({ source, customerName, retailer, product, quantityOrdered });

    if (retailer === 'Pick n Pay' || retailer === 'Trophies') {
      order.slaDueDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    }

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const orders = await Order.find(filter).sort({ createdAt: -1 }).populate('allocations.batch');
  res.json(orders);
});

router.get('/:id', async (req, res) => {
  const order = await Order.findById(req.params.id).populate('allocations.batch');
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

router.post('/:id/allocate', async (req, res) => {
  try {
    const order = await allocateOrder(req.params.id);
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/:id/dispatch', async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  order.quantityDispatched = order.allocations.reduce((s, a) => s + a.quantity, 0);
  order.status = 'dispatched';
  await order.save();
  res.json(order);
});

module.exports = router;
