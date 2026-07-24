const mongoose = require('mongoose');

const productionBatchSchema = new mongoose.Schema({
  product: { type: String, enum: ['ginger', 'mabuyu'], required: true },
  batchCode: { type: String, required: true, unique: true },
  quantityProduced: { type: Number, required: true },
  quantityAllocated: { type: Number, default: 0 },
  rawMaterialsUsed: [{
    material: { type: mongoose.Schema.Types.ObjectId, ref: 'RawMaterial' },
    quantityUsed: Number,
  }],
  producedAt: { type: Date, default: Date.now },
}, { timestamps: true });

productionBatchSchema.virtual('quantityAvailable').get(function () {
  return this.quantityProduced - this.quantityAllocated;
});
productionBatchSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('ProductionBatch', productionBatchSchema);
