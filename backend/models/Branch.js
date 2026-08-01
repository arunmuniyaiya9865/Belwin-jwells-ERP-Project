const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
  branchCode: {
    type: String,
    required: true,
    unique: true
  },
  branchName: {
    type: String,
    required: true,
    uppercase: true
  },
  branchManager: {
    type: String
  },
  contactNumber: {
    type: String
  },
  email: {
    type: String
  },
  address: {
    type: String
  },
  city: {
    type: String,
    required: true,
    uppercase: true
  },
  state: {
    type: String,
    uppercase: true
  },
  pinCode: {
    type: String
  },
  gstNumber: {
    type: String
  },
  openingDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true,
  collection: 'branches'
});

module.exports = mongoose.model('Branch', BranchSchema);
