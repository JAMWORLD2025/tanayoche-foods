const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const ProductionBatch = require('../models/ProductionBatch');
const RawMaterial = require('../models/RawMaterial');

router.get('/summary', async (req, res) => {
  const [pendingOrders, allocatedOrders, dispatchedOrders, batches, materials] = await Promise.all([
    Order.countDocuments({ status: 'pending' }),
    Order.countDocuments({ status: { $in: ['allocated', 'partially_allocated'] } }),
    Order.countDocuments({ status: 'dispatched' }),
    ProductionBatch.find(),
    RawMaterial.find(),
  ]);

  const stockByProduct = batches.reduce((acc, b) => {
    const available = b.quantityProduced - b.quantityAllocated;
    acc[b.product] = (acc[b.product] || 0) + available;
    return acc;
  }, {});

  const lowStockMaterials = materials.filter(m => m.quantityOnHand <= m.reorderLevel);

  res.json({
    pendingOrders,
    allocatedOrders,
    dispatchedOrders,
    stockByProduct,
    lowStockMaterials,
  });
});

module.exports = router;
