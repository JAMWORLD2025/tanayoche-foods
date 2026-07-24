const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  source: { type: String, enum: ['manual', 'b2b_api', 'whatsapp'], default: 'manual' },
  customerName: { type: String, required: true },
  retailer: { type: String, enum: ['Pick n Pay', 'Trophies', 'Other', null], default: null },
  product: { type: String, enum: ['ginger', 'mabuyu'], required: true },
  quantityOrdered: { type: Number, required: true },
  quantityDispatched: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'partially_allocated', 'allocated', 'dispatched', 'cancelled'],
    default: 'pending',
  },
  slaDueDate: { type: Date },
  allocations: [{
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductionBatch' },
    quantity: Number,
    allocatedAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
