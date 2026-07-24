const express = require('express');
const router = express.Router();
const ProductionBatch = require('../models/ProductionBatch');
const RawMaterial = require('../models/RawMaterial');

router.post('/batches', async (req, res) => {
  try {
    const { product, batchCode, quantityProduced, rawMaterialsUsed } = req.body;

    for (const item of (rawMaterialsUsed || [])) {
      const material = await RawMaterial.findById(item.material);
      if (!material) return res.status(400).json({ error: `Raw material ${item.material} not found` });
      material.quantityOnHand -= item.quantityUsed;
      await material.save();
    }

    const batch = new ProductionBatch({ product, batchCode, quantityProduced, rawMaterialsUsed });
    await batch.save();
    res.status(201).json(batch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/batches', async (req, res) => {
  const filter = {};
  if (req.query.product) filter.product = req.query.product;
  const batches = await ProductionBatch.find(filter).sort({ producedAt: 1 });
  res.json(batches);
});

router.post('/materials', async (req, res) => {
  try {
    const material = new RawMaterial(req.body);
    await material.save();
    res.status(201).json(material);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/materials', async (req, res) => {
  const materials = await RawMaterial.find().sort({ name: 1 });
  res.json(materials);
});

router.patch('/materials/:id/restock', async (req, res) => {
  const material = await RawMaterial.findById(req.params.id);
  if (!material) return res.status(404).json({ error: 'Material not found' });
  material.quantityOnHand += req.body.quantity || 0;
  material.lastRestockedAt = new Date();
  await material.save();
  res.json(material);
});

module.exports = router;
