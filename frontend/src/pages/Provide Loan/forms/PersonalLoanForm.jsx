import React, { useState, useEffect } from 'react';
import { Save, RefreshCcw } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const PersonalLoanForm = ({ customerData, schemeData }) => {
  const [formData, setFormData] = useState({
    // Additional Customer Details
    aadhaarNumber: '',
    panNumber: '',
    dateOfBirth: '',

    // Employment Details
    employmentType: 'Salaried',
    companyName: '',
    occupation: '',
    monthlyIncome: '',

    // Loan Details
    applicationNo: 'PL-' + Math.floor(100000 + Math.random() * 900000),
    applicationDate: new Date().toISOString().split('T')[0],
    loanAmountRequested: '',
    approvedLoanAmount: '',
    interestRate: '',
    loanTenure: '',
    emiAmount: 0,
    processingFee: '',
    netDisbursementAmount: 0,
    loanPurpose: '',

    // Bank Details
    bankName: '',
    accountNumber: '',
    ifscCode: '',

    // Guarantor Details
    guarantorName: '',
    guarantorMobile: '',
    guarantorRelationship: ''
  });

  const [documents, setDocuments] = useState({
    customerPhoto: null,
    aadhaar: null,
    panCard: null,
    salarySlip: null,
    bankStatement: null
  });

  // Auto calculate EMI and Net Disbursement
  useEffect(() => {
    const approvedAmt = parseFloat(formData.approvedLoanAmount) || 0;
    const rate = parseFloat(formData.interestRate) || 0;
    const tenure = parseInt(formData.loanTenure) || 0;
    const fee = parseFloat(formData.processingFee) || 0;

    // Simple EMI calc (P * r * (1+r)^n / ((1+r)^n - 1)) - or just simple interest for now
    let calculatedEmi = 0;
    if (approvedAmt > 0 && tenure > 0) {
      const monthlyRate = rate / 12 / 100;
      if (monthlyRate > 0) {
        calculatedEmi = (approvedAmt * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
      } else {
        calculatedEmi = approvedAmt / tenure;
      }
    }

    const netAmount = Math.max(0, approvedAmt - fee);

    setFormData(prev => ({
      ...prev,
      emiAmount: Math.round(calculatedEmi),
      netDisbursementAmount: netAmount
    }));
  }, [formData.approvedLoanAmount, formData.interestRate, formData.loanTenure, formData.processingFee]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field, file) => {
    setDocuments(prev => ({ ...prev, [field]: file }));
  };

  const inp = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-erp-green bg-white";
  const lbl = "block text-sm font-medium text-gray-700 mb-1";

  const handleSubmit = async () => {
    if (!customerData || !customerData.customerId) {
      toast.error("Please search and select a customer first.");
      return;
    }
    toast.success("Personal Loan Form Submitted (Demo)");
  };

  const handleClear = () => {
    setFormData({
      ...formData,
      applicationNo: 'PL-' + Math.floor(100000 + Math.random() * 900000),
      aadhaarNumber: '', panNumber: '', dateOfBirth: '',
      companyName: '', occupation: '', monthlyIncome: '',
      loanAmountRequested: '', approvedLoanAmount: '', interestRate: '', loanTenure: '',
      processingFee: '', loanPurpose: '', bankName: '', accountNumber: '', ifscCode: '',
      guarantorName: '', guarantorMobile: '', guarantorRelationship: ''
    });
    toast.success("Form cleared!");
  };

  return (
    <div className="w-full bg-white rounded-lg p-6 space-y-8">
      {/* Customer Additional Details */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Additional Customer Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={lbl}>Aadhaar Number</label>
            <input type="text" className={inp} value={formData.aadhaarNumber} onChange={(e) => handleChange('aadhaarNumber', e.target.value)} placeholder="12-digit Aadhaar" />
          </div>
          <div>
            <label className={lbl}>PAN Number</label>
            <input type="text" className={inp} value={formData.panNumber} onChange={(e) => handleChange('panNumber', e.target.value)} placeholder="ABCDE1234F" />
          </div>
          <div>
            <label className={lbl}>Date of Birth</label>
            <input type="date" className={inp} value={formData.dateOfBirth} onChange={(e) => handleChange('dateOfBirth', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Employment Details */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Employment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className={lbl}>Employment Type</label>
            <select className={inp} value={formData.employmentType} onChange={(e) => handleChange('employmentType', e.target.value)}>
              <option value="Salaried">Salaried</option>
              <option value="Self Employed">Self Employed</option>
            </select>
          </div>
          <div>
            <label className={lbl}>Company / Business Name</label>
            <input type="text" className={inp} value={formData.companyName} onChange={(e) => handleChange('companyName', e.target.value)} placeholder="Company Name" />
          </div>
          <div>
            <label className={lbl}>Occupation</label>
            <input type="text" className={inp} value={formData.occupation} onChange={(e) => handleChange('occupation', e.target.value)} placeholder="Occupation" />
          </div>
          <div>
            <label className={lbl}>Monthly Income (Rs)</label>
            <input type="number" className={inp} value={formData.monthlyIncome} onChange={(e) => handleChange('monthlyIncome', e.target.value)} placeholder="0" />
          </div>
        </div>
      </div>

      {/* Loan Details */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Loan Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className={lbl}>Application No (Auto)</label>
            <input type="text" className={`${inp} bg-gray-50`} value={formData.applicationNo} readOnly />
          </div>
          <div>
            <label className={lbl}>Application Date</label>
            <input type="date" className={inp} value={formData.applicationDate} onChange={(e) => handleChange('applicationDate', e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Amount Requested</label>
            <input type="number" className={inp} value={formData.loanAmountRequested} onChange={(e) => handleChange('loanAmountRequested', e.target.value)} placeholder="0" />
          </div>
          <div>
            <label className={lbl}>Approved Loan Amount</label>
            <input type="number" className={inp} value={formData.approvedLoanAmount} onChange={(e) => handleChange('approvedLoanAmount', e.target.value)} placeholder="0" />
          </div>
          <div>
            <label className={lbl}>Interest Rate (%)</label>
            <input type="number" step="0.01" className={inp} value={formData.interestRate} onChange={(e) => handleChange('interestRate', e.target.value)} placeholder="0.00" />
          </div>
          <div>
            <label className={lbl}>Loan Tenure (Months)</label>
            <input type="number" className={inp} value={formData.loanTenure} onChange={(e) => handleChange('loanTenure', e.target.value)} placeholder="0" />
          </div>
          <div>
            <label className={lbl}>Processing Fee</label>
            <input type="number" className={inp} value={formData.processingFee} onChange={(e) => handleChange('processingFee', e.target.value)} placeholder="0" />
          </div>
          <div>
            <label className={lbl}>Loan Purpose</label>
            <input type="text" className={inp} value={formData.loanPurpose} onChange={(e) => handleChange('loanPurpose', e.target.value)} placeholder="Purpose" />
          </div>
          <div className="md:col-span-2">
            <label className={lbl}>EMI Amount (Auto)</label>
            <input type="number" className={`${inp} bg-gray-50 font-bold text-erp-green-dark`} value={formData.emiAmount} readOnly />
          </div>
          <div className="md:col-span-2">
            <label className={lbl}>Net Disbursement Amount</label>
            <input type="number" className={`${inp} bg-gray-50 font-bold text-erp-green-dark`} value={formData.netDisbursementAmount} readOnly />
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Bank Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={lbl}>Bank Name</label>
            <input type="text" className={inp} value={formData.bankName} onChange={(e) => handleChange('bankName', e.target.value)} placeholder="Bank Name" />
          </div>
          <div>
            <label className={lbl}>Account Number</label>
            <input type="text" className={inp} value={formData.accountNumber} onChange={(e) => handleChange('accountNumber', e.target.value)} placeholder="Account No" />
          </div>
          <div>
            <label className={lbl}>IFSC Code</label>
            <input type="text" className={inp} value={formData.ifscCode} onChange={(e) => handleChange('ifscCode', e.target.value)} placeholder="IFSC Code" />
          </div>
        </div>
      </div>

      {/* Guarantor Details */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Guarantor Details (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={lbl}>Guarantor Name</label>
            <input type="text" className={inp} value={formData.guarantorName} onChange={(e) => handleChange('guarantorName', e.target.value)} placeholder="Name" />
          </div>
          <div>
            <label className={lbl}>Mobile Number</label>
            <input type="tel" className={inp} value={formData.guarantorMobile} onChange={(e) => handleChange('guarantorMobile', e.target.value)} placeholder="Mobile" />
          </div>
          <div>
            <label className={lbl}>Relationship</label>
            <input type="text" className={inp} value={formData.guarantorRelationship} onChange={(e) => handleChange('guarantorRelationship', e.target.value)} placeholder="Relationship" />
          </div>
        </div>
      </div>

      {/* Document Upload */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Document Upload</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['bankStatement'].map(doc => (
            <div key={doc} className="border p-4 rounded-md flex flex-col items-center justify-center space-y-2 bg-gray-50">
              <label className="text-sm font-medium text-gray-700 capitalize text-center h-10">
                {doc.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input type="file" className="text-xs w-full" onChange={(e) => handleFileChange(doc, e.target.files[0])} />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button onClick={handleClear} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
          <RefreshCcw size={16} className="mr-2" /> Clear Form
        </button>
        <button onClick={handleSubmit} className="flex items-center px-6 py-2 bg-black text-white font-bold rounded-md hover:bg-gray-800">
          <Save size={16} className="mr-2" /> Submit Loan
        </button>
      </div>
    </div>
  );
};

export default PersonalLoanForm;
