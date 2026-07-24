const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactChannel: { type: String, enum: ['portal', 'ussd', 'whatsapp', 'phone'], default: 'whatsapp' },
  phone: { type: String },
  materialsSupplied: [{ type: String }],
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);
