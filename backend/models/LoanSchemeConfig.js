const mongoose = require('mongoose');

const loanSchemeConfigSchema = new mongoose.Schema({
  schemeId: { type: String, required: true, unique: true },
  schemeCode: { type: String },
  schemeName: { type: String, required: true },
  interestRate: { type: Number, required: true },
  amountLimit: { type: Number, required: true },
  gramRate: { type: Number, required: false },
  minimumGram: { type: Number, required: false },
  maturePeriodMonths: { type: Number, required: true },
  interestRepaymentMonths: { type: Number, required: false },
  documentCharges: { type: Number, required: true },
  penalty: { type: Number, required: true },
  schemeType: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('LoanSchemeConfig', loanSchemeConfigSchema);
