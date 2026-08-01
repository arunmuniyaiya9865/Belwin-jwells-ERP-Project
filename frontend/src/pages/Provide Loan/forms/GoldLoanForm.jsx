import React, { useState, useEffect } from 'react';
import { Save, RefreshCcw } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const GoldLoanForm = ({ customerData, schemeData }) => {
  const [loanInfo, setLoanInfo] = useState({
    loanNumber: 'GL-' + Math.floor(100000 + Math.random() * 900000), // Mock Auto Generate
    loanDate: new Date().toISOString().split('T')[0],
    branch: '',
    loanScheme: '',
    loanType: 'EMI',
    loanOfficer: '',
    status: 'Pending'
  });

  const [goldDetails, setGoldDetails] = useState({
    ornamentType: 'Ring',
    ornamentName: '',
    numberOfItems: 1,
    grossWeight: '',
    stoneWeight: '',
    netWeight: 0,
    purity: '22K',
    hallmark: 'Yes',
    goldRatePerGram: '',
    totalGoldValue: 0
  });

  // Auto calculate net weight and total value
  useEffect(() => {
    const gross = parseFloat(goldDetails.grossWeight) || 0;
    const stone = parseFloat(goldDetails.stoneWeight) || 0;
    const rate = parseFloat(goldDetails.goldRatePerGram) || 0;
    
    const net = Math.max(0, gross - stone);
    const totalValue = net * rate;

    setGoldDetails(prev => ({
      ...prev,
      netWeight: parseFloat(net.toFixed(2)),
      totalGoldValue: parseFloat(totalValue.toFixed(2))
    }));
  }, [goldDetails.grossWeight, goldDetails.stoneWeight, goldDetails.goldRatePerGram]);

  const handleLoanInfoChange = (field, value) => {
    setLoanInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleGoldDetailsChange = (field, value) => {
    setGoldDetails(prev => ({ ...prev, [field]: value }));
  };

  const inp = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-erp-green bg-white";
  const lbl = "block text-sm font-medium text-gray-700 mb-1";

  const handleSubmit = async () => {
    if (!customerData || !customerData.customerId) {
      toast.error("Please search and select a customer first.");
      return;
    }

    try {
      const payload = {
        customerId: customerData.customerId,
        name: customerData.name,
        mobileNo: customerData.mobile,
        fatherHusbandName: customerData.fatherName,
        address: customerData.address,

        loanDate: loanInfo.loanDate,
        loanStartDate: loanInfo.loanDate,
        status: loanInfo.status,
        loanAmount: goldDetails.totalGoldValue,

        articles: [goldDetails],
        totalWt: goldDetails.grossWeight,
        
        schemeId: schemeData.schemeId,
        schemeName: schemeData.schemeName,
        interestPercent: schemeData.interestPercent ? schemeData.interestPercent.replace('%','') : 0,
        gramRate: schemeData.gramRate,
        minimumGram: schemeData.minimumGram,
        documentCharge: schemeData.documentCharges
      };

      // Since we are creating a gold loan from Employee Dashboard, we can hit the /api/loans endpoint
      // We pass the token if needed, or if protect is removed it will just work
      const response = await axios.post('http://localhost:5000/api/loans', payload, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (response.status === 201) {
        toast.success("Loan created successfully!");
        // Clear form
        setLoanInfo({
          ...loanInfo,
          loanNumber: 'GL-' + Math.floor(100000 + Math.random() * 900000)
        });
        setGoldDetails({
          ornamentType: 'Ring', ornamentName: '', numberOfItems: 1,
          grossWeight: '', stoneWeight: '', netWeight: 0,
          purity: '22K', hallmark: 'Yes', goldRatePerGram: '', totalGoldValue: 0
        });
      }
    } catch (error) {
      console.error("Error creating loan:", error);
      toast.error(error.response?.data?.message || "Failed to submit loan");
    }
  };

  return (
    <div className="w-full">
      {/* Loan Information */}
      <div className="bg-white border border-gray-100 rounded-lg shadow-sm flex flex-col mb-8 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Loan Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className={lbl}>Loan Number</label>
            <input type="text" className={`${inp} bg-gray-50`} value={loanInfo.loanNumber} readOnly />
          </div>
          <div>
            <label className={lbl}>Open Date <span className="text-red-500">*</span></label>
            <input type="date" className={inp} value={loanInfo.loanDate} onChange={(e) => handleLoanInfoChange('loanDate', e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Close Date</label>
            <input type="date" className={inp} value={loanInfo.closeDate || ''} onChange={(e) => handleLoanInfoChange('closeDate', e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Branch</label>
            <input type="text" className={inp} value={loanInfo.branch} onChange={(e) => handleLoanInfoChange('branch', e.target.value)} placeholder="e.g. Main Branch" />
          </div>
          <div>
            <label className={lbl}>Loan Scheme</label>
            <input type="text" className={`${inp} bg-gray-50`} value={schemeData?.schemeName || 'Select scheme above'} readOnly />
          </div>
          <div>
            <label className={lbl}>Loan Type</label>
            <select className={inp} value={loanInfo.loanType} onChange={(e) => handleLoanInfoChange('loanType', e.target.value)}>
              <option value="EMI">EMI</option>
              <option value="Non EMI">Non EMI</option>
            </select>
          </div>
          <div>
            <label className={lbl}>Loan Officer</label>
            <input type="text" className={inp} value={loanInfo.loanOfficer} onChange={(e) => handleLoanInfoChange('loanOfficer', e.target.value)} placeholder="Officer Name" />
          </div>
          <div>
            <label className={lbl}>Status</label>
            <select className={inp} value={loanInfo.status} onChange={(e) => handleLoanInfoChange('status', e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Gold Details */}
      <div className="bg-white border border-gray-100 rounded-lg shadow-sm flex flex-col mb-8 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Gold Ornament Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className={lbl}>Ornament Type</label>
            <select className={inp} value={goldDetails.ornamentType} onChange={(e) => handleGoldDetailsChange('ornamentType', e.target.value)}>
              <option value="Ring">Ring</option>
              <option value="Chain">Chain</option>
              <option value="Bangle">Bangle</option>
              <option value="Necklace">Necklace</option>
              <option value="Earring">Earring</option>
            </select>
          </div>
          <div>
            <label className={lbl}>Ornament Name</label>
            <input type="text" className={inp} value={goldDetails.ornamentName} onChange={(e) => handleGoldDetailsChange('ornamentName', e.target.value)} placeholder="e.g. Gold Ring 22k" />
          </div>
          <div>
            <label className={lbl}>Number of Items</label>
            <input type="number" min="1" className={inp} value={goldDetails.numberOfItems} onChange={(e) => handleGoldDetailsChange('numberOfItems', e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Purity</label>
            <select className={inp} value={goldDetails.purity} onChange={(e) => handleGoldDetailsChange('purity', e.target.value)}>
              <option value="22K">22K (916)</option>
              <option value="24K">24K (999)</option>
              <option value="18K">18K (750)</option>
            </select>
          </div>
          <div>
            <label className={lbl}>Gross Weight (g)</label>
            <input type="number" step="0.01" className={inp} value={goldDetails.grossWeight} onChange={(e) => handleGoldDetailsChange('grossWeight', e.target.value)} placeholder="0.00" />
          </div>
          <div>
            <label className={lbl}>Stone/Dust Weight (g)</label>
            <input type="number" step="0.01" className={inp} value={goldDetails.stoneWeight} onChange={(e) => handleGoldDetailsChange('stoneWeight', e.target.value)} placeholder="0.00" />
          </div>
          <div>
            <label className={lbl}>Net Weight (g)</label>
            <input type="number" step="0.01" className={inp} value={goldDetails.netWeight} onChange={(e) => handleGoldDetailsChange('netWeight', e.target.value)} placeholder="0.00" />
          </div>
          <div>
            <label className={lbl}>Gold Rate per Gram (Rs)</label>
            <input type="number" step="0.01" className={inp} value={goldDetails.goldRatePerGram} onChange={(e) => handleGoldDetailsChange('goldRatePerGram', e.target.value)} placeholder="0.00" />
          </div>
          <div className="md:col-span-2">
            <label className={lbl}>Total Gold Value (Rs)</label>
            <input type="number" step="0.01" className={`${inp} text-xl font-bold text-erp-green-dark`} value={goldDetails.totalGoldValue} onChange={(e) => handleGoldDetailsChange('totalGoldValue', e.target.value)} placeholder="0" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 mb-8">
        <button className="px-6 py-2.5 bg-gray-200 text-gray-800 text-sm font-bold rounded-lg shadow-sm hover:bg-gray-300 transition-all flex items-center gap-2">
          <RefreshCcw className="w-4 h-4" /> Clear Form
        </button>
        <button onClick={handleSubmit} className="px-8 py-2.5 bg-black text-white text-sm font-bold rounded-lg shadow-md hover:bg-gray-800 transition-all flex items-center gap-2">
          <Save className="w-4 h-4" /> Submit Loan
        </button>
      </div>

    </div>
  );
};

export default GoldLoanForm;
