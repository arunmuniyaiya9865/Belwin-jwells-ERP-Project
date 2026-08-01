const mongoose = require('mongoose');

const loanCalculatorSchema = new mongoose.Schema({
  calculationType: { type: String, required: true },
  loanMode: { type: String, required: true },
  loanAmount: { type: Number, required: true },
  term: { type: Number, required: true },
  roi: { type: Number, required: true },
  calculationEMI: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('LoanCalculator', loanCalculatorSchema);
