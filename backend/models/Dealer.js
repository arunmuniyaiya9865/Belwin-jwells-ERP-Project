const mongoose = require('mongoose');

const dealerSchema = new mongoose.Schema({
  dealerCode: { type: String, required: true, unique: true },
  dealerName: { type: String, required: true },
  phone: { type: String, required: true },
  showroom: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Dealer', dealerSchema);
