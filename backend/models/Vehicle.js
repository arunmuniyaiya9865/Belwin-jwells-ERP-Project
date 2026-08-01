const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  company: { type: String, required: true },
  vehicleName: { type: String, required: true },
  model: { type: String, required: true },
  fuelType: { type: String, required: true },
  color: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
