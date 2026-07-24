const mongoose = require('mongoose');

const rawMaterialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: { type: String, required: true, default: 'kg' },
  quantityOnHand: { type: Number, required: true, default: 0 },
  reorderLevel: { type: Number, default: 0 },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  lastRestockedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('RawMaterial', rawMaterialSchema);
