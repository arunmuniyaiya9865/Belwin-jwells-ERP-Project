import { useState } from 'react';
import { Save, RefreshCcw, XCircle, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import GoldLoanForm from './forms/GoldLoanForm';
import PersonalLoanForm from './forms/PersonalLoanForm';
import ChitFundForm from './forms/ChitFundForm';
import MicroFinanceForm from './forms/MicroFinanceForm';
import VehicleLoanForm from './forms/VehicleLoanForm';

const ProvideLoan = () => {
  const [loanType, setLoanType] = useState('gold_loan');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [customerData, setCustomerData] = useState({
    name: '',
    mobile: '',
    fatherName: '',
    address: ''
  });

  const handleSearch = async () => {
    if (searchQuery.trim() === '') return;
    
    try {
      // Assuming your backend runs on port 5000 and has this endpoint
      const response = await axios.get(`http://localhost:5000/api/customers/search?search=${searchQuery}`);
      
      if (response.data && response.data.data && response.data.data.length > 0) {
        const customer = response.data.data[0]; // Get the first matching customer
        
        // Construct the full address
        const fullAddress = [
          customer.doorStreet,
          customer.area,
          customer.city,
          customer.district,
          customer.state,
          customer.postalCode
        ].filter(Boolean).join(', ');

        setCustomerData({
          ...customerData,
          name: customer.customerName || '',
          mobile: customer.mobileNumber || '',
          fatherName: customer.guardianName || '',
          address: fullAddress || '',
          customerId: customer._id || customer.customerId || ''
        });
        toast.success("Customer details fetched!");
      } else {
        toast.error("Customer not found.");
        setCustomerData({
          ...customerData,
          name: '',
          mobile: searchQuery,
          fatherName: '',
          address: '',
          customerId: ''
        });
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
      toast.error("Error fetching customer details.");
    }
  };

  const handleCustomerChange = (field, value) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
  };

  const [schemeSearchQuery, setSchemeSearchQuery] = useState('');
  const [schemeData, setSchemeData] = useState({
    schemeId: '',
    schemeName: '',
    interestPercent: '',
    amountRs: '',
    gramRate: '',
    minimumGram: '',
    maturePeriodMonths: '',
    interestRepaymentMonths: '',
    documentCharges: '',
    penaltyPercent: ''
  });

  const handleSchemeSearch = async () => {
    if (schemeSearchQuery.trim() === '') return;
    
    try {
      const response = await axios.get(`http://localhost:5000/api/schemes?schemeId=${schemeSearchQuery}`);
      if (response.data && response.data.length > 0) {
        const scheme = response.data[0];
        setSchemeData({
          schemeId: scheme.schemeId || '',
          schemeName: scheme.schemeName || '',
          interestPercent: scheme.interestRate ? `${scheme.interestRate}%` : '',
          amountRs: scheme.amountLimit || '',
          gramRate: scheme.gramRate || '',
          minimumGram: scheme.minimumGram || '',
          maturePeriodMonths: scheme.maturePeriodMonths || '',
          interestRepaymentMonths: scheme.interestRepaymentMonths || '',
          documentCharges: scheme.documentCharges || '',
          penaltyPercent: scheme.penalty ? `${scheme.penalty}%` : ''
        });
        toast.success("Scheme details fetched!");
      } else {
        toast.error("Scheme not found.");
        setSchemeData({
          schemeId: '',
          schemeName: '',
          interestPercent: '',
          amountRs: '',
          gramRate: '',
          minimumGram: '',
          maturePeriodMonths: '',
          interestRepaymentMonths: '',
          documentCharges: '',
          penaltyPercent: ''
        });
      }
    } catch (error) {
      console.error("Error fetching scheme:", error);
      toast.error("Error fetching scheme details.");
    }
  };

  const inp = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-erp-green bg-white";
  const lbl = "block text-sm font-medium text-gray-700 mb-1";

  // Map to dynamically render the correct form
  const renderLoanForm = () => {
    switch (loanType) {
      case 'gold_loan':
        return <GoldLoanForm customerData={customerData} schemeData={schemeData} />;
      case 'personal_loan':
        return <PersonalLoanForm customerData={customerData} schemeData={schemeData} />;
      case 'chit_fund':
        return <ChitFundForm customerData={customerData} schemeData={schemeData} />;
      case 'micro_finance':
        return <MicroFinanceForm customerData={customerData} schemeData={schemeData} />;
      case 'vehicle_loan':
        return <VehicleLoanForm customerData={customerData} schemeData={schemeData} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full flex flex-col p-8">
      {/* Title & Loan Type Selector */}
      <div className="mb-6 shrink-0 flex flex-row items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-black">Loan</h2>
          <p className="text-sm text-text-secondary mt-1">Select a loan type and provide details.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="text-sm font-bold text-gray-700">Select Loan Type:</label>
          <div className="relative">
            <select 
              value={loanType}
              onChange={(e) => setLoanType(e.target.value)}
              className="appearance-none bg-white border-2 border-gray-200 text-gray-800 text-sm font-bold rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-erp-green focus:border-transparent cursor-pointer shadow-sm"
            >
              <option value="gold_loan">Gold Loan</option>
              <option value="personal_loan">Personal Loan</option>
              <option value="chit_fund">Chit Fund</option>
              <option value="micro_finance">Micro Finance</option>
              <option value="vehicle_loan">Vehicle Loan</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Customer Details Section (Common) */}
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm flex flex-col mb-8 p-6">
          <div className="flex items-center justify-between mb-4 pb-2 border-b">
            <h3 className="text-lg font-bold text-gray-800">Customer Details</h3>
            
            {/* Search Bar */}
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Search Name or Phone..." 
                className="w-64 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-erp-green"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                onClick={handleSearch}
                className="px-4 py-1.5 bg-black text-white text-sm font-bold rounded-md hover:bg-gray-800 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={lbl}>Name <span className="text-red-500">*</span></label>
              <input type="text" className={inp} value={customerData.name} onChange={(e) => handleCustomerChange('name', e.target.value)} placeholder="Enter full name" />
            </div>
            <div>
              <label className={lbl}>Mobile No <span className="text-red-500">*</span></label>
              <input type="tel" className={inp} value={customerData.mobile} onChange={(e) => handleCustomerChange('mobile', e.target.value)} placeholder="Enter mobile number" />
            </div>
            <div>
              <label className={lbl}>Father/Husband Name <span className="text-red-500">*</span></label>
              <input type="text" className={inp} value={customerData.fatherName} onChange={(e) => handleCustomerChange('fatherName', e.target.value)} placeholder="Enter relative name" />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className={lbl}>Address <span className="text-red-500">*</span></label>
              <textarea className={`${inp} resize-none`} value={customerData.address} onChange={(e) => handleCustomerChange('address', e.target.value)} rows="2" placeholder="Enter complete address" />
            </div>
          </div>
        </div>

        {/* Scheme Details Section */}
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm flex flex-col mb-8 p-6">
          <div className="flex items-center justify-between mb-4 pb-2 border-b">
            <h3 className="text-lg font-bold text-gray-800">Scheme Details</h3>
            
            {/* Scheme Search Bar */}
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Enter Scheme ID..." 
                className="w-64 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-erp-green"
                value={schemeSearchQuery}
                onChange={(e) => setSchemeSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSchemeSearch()}
              />
              <button 
                onClick={handleSchemeSearch}
                className="px-4 py-1.5 bg-black text-white text-sm font-bold rounded-md hover:bg-gray-800 transition-colors"
              >
                Search Scheme
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className={lbl}>Scheme Name</label>
              <input type="text" className={`${inp} bg-gray-50`} value={schemeData.schemeName} readOnly />
            </div>
            <div>
              <label className={lbl}>Interest %</label>
              <input type="text" className={`${inp} bg-gray-50`} value={schemeData.interestPercent} readOnly />
            </div>
            <div>
              <label className={lbl}>Amount Rs</label>
              <input type="text" className={`${inp} bg-gray-50`} value={schemeData.amountRs} readOnly />
            </div>
            <div>
              <label className={lbl}>Gram Rate</label>
              <input type="text" className={`${inp} bg-gray-50`} value={schemeData.gramRate} readOnly />
            </div>
            <div>
              <label className={lbl}>Minimum Gram</label>
              <input type="text" className={`${inp} bg-gray-50`} value={schemeData.minimumGram} readOnly />
            </div>
            <div>
              <label className={lbl}>Mature Period (Months)</label>
              <input type="text" className={`${inp} bg-gray-50`} value={schemeData.maturePeriodMonths} readOnly />
            </div>
            <div>
              <label className={lbl}>Interest Repayment (Months)</label>
              <input type="text" className={`${inp} bg-gray-50`} value={schemeData.interestRepaymentMonths} readOnly />
            </div>
            <div>
              <label className={lbl}>Document Charges</label>
              <input type="text" className={`${inp} bg-gray-50`} value={schemeData.documentCharges} readOnly />
            </div>
            <div>
              <label className={lbl}>Penalty %</label>
              <input type="text" className={`${inp} bg-gray-50`} value={schemeData.penaltyPercent} readOnly />
            </div>
          </div>
        </div>

        {/* Dynamic Specific Loan Form */}
        {renderLoanForm()}
      </div>
    </div>
  );
};

export default ProvideLoan;
