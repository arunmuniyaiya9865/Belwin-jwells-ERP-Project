import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Save, RefreshCcw, XCircle, ChevronDown } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import GoldLoanForm from './forms/GoldLoanForm';
import PersonalLoanForm from './forms/PersonalLoanForm';
import ChitFundForm from './forms/ChitFundForm';
import MicroFinanceForm from './forms/MicroFinanceForm';
import VehicleLoanForm from './forms/VehicleLoanForm';

const EditLoan = () => {
  const location = useLocation();
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState(location.state?.loanId || '');
  const [loanType, setLoanType] = useState('gold_loan');
  const [customerLoans, setCustomerLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);

  const [customerData, setCustomerData] = useState({
    name: '',
    mobile: '',
    fatherName: '',
    address: '',
    customerId: ''
  });

  const [schemeData] = useState({
    schemeName: 'Gold Scheme A',
    interestPercent: '1.5%',
    amountRs: '100000',
    gramRate: '4500',
    minimumGram: '2',
    maturePeriodMonths: '12',
    interestRepaymentMonths: '1',
    documentCharges: '500',
    penaltyPercent: '2%'
  });

  const handleSearch = async () => {
    if (searchQuery.trim() === '') return;
    
    try {
      // 1. Fetch Customer
      const response = await api.get(`/customers/search?search=${searchQuery}`);
      
      if (response.data && response.data.data && response.data.data.length > 0) {
        const customer = response.data.data[0];
        
        const fullAddress = [
          customer.doorStreet, customer.area, customer.city, 
          customer.district, customer.state, customer.postalCode
        ].filter(Boolean).join(', ');

        setCustomerData({
          name: customer.customerName || '',
          mobile: customer.mobileNumber || '',
          fatherName: customer.guardianName || '',
          address: fullAddress || '',
          customerId: customer._id || customer.customerId || ''
        });

        toast.success("Customer found! Fetching their loans...");
        setHasSearched(true);

        // 2. Fetch Loans for this customer
        const custIdToUse = customer.customerId || customer._id;
        try {
          const loansRes = await api.get(`/loans/customer/${custIdToUse}`);
          if (loansRes.data && loansRes.data.length > 0) {
            setCustomerLoans(loansRes.data);
            setSelectedLoan(loansRes.data[0]);
            // Attempt to infer loan type from scheme name or defaults
            const sName = (loansRes.data[0].schemeName || '').toLowerCase();
            if (sName.includes('gold')) setLoanType('gold_loan');
            else if (sName.includes('vehicle')) setLoanType('vehicle_loan');
            else if (sName.includes('personal')) setLoanType('personal_loan');
            else if (sName.includes('chit')) setLoanType('chit_fund');
            else if (sName.includes('micro')) setLoanType('micro_finance');
          } else {
            setCustomerLoans([]);
            setSelectedLoan(null);
            toast.error("This customer has no loans.");
          }
        } catch (loanErr) {
          console.error("Error fetching loans", loanErr);
          toast.error("Error fetching loans.");
        }

      } else {
        toast.error("Customer not found.");
        setHasSearched(false);
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
      toast.error("Error fetching customer details.");
    }
  };

  useEffect(() => {
    if (location.state?.loanId && !hasSearched) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.loanId]);

  const [articles, setArticles] = useState([
    { category: '', details: '', qty: '', totWt: '', stoneWt: '', nettWt: '', purity: '', gramRate: '', total: '' },
    { category: '', details: '', qty: '', totWt: '', stoneWt: '', nettWt: '', purity: '', gramRate: '', total: '' }
  ]);
  const [loanAmount, setLoanAmount] = useState('');
  const [totalWt, setTotalWt] = useState('');

  const handleArticleChange = (index, field, value) => {
    const newArticles = [...articles];
    const article = { ...newArticles[index], [field]: value };

    if (field === 'totWt' || field === 'stoneWt') {
      const tot = parseFloat(article.totWt) || 0;
      const stone = parseFloat(article.stoneWt) || 0;
      if (tot > 0) {
        article.nettWt = (tot - stone).toFixed(2);
      }
    }

    const nett = parseFloat(article.nettWt) || 0;
    const rate = parseFloat(article.gramRate) || 0;
    if (nett > 0 && rate > 0) {
      article.total = (nett * rate).toFixed(2);
    } else {
      article.total = '';
    }

    newArticles[index] = article;
    setArticles(newArticles);

    const sumTotal = newArticles.reduce((sum, art) => sum + (parseFloat(art.total) || 0), 0);
    const sumWt = newArticles.reduce((sum, art) => sum + (parseFloat(art.totWt) || 0), 0);
    
    setLoanAmount(sumTotal > 0 ? sumTotal.toFixed(2) : '');
    setTotalWt(sumWt > 0 ? sumWt.toFixed(2) : '');
  };

  const inp = "w-full px-3 py-1.5 bg-white border border-gray-400 rounded-md text-lg text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors";
  const lbl = "text-base font-medium text-black w-64 shrink-0 self-center whitespace-nowrap mb-0";
  const row = "flex flex-row items-center gap-4 mb-3";

  // Table header styles
  const thStyle = "px-4 py-2 text-base font-medium text-white bg-black border border-gray-600 tracking-wider text-center whitespace-nowrap";
  const tdStyle = "p-1 border border-gray-300";
  const tableInp = "w-full px-2 py-1 text-lg text-black bg-white border-none focus:outline-none focus:ring-1 focus:ring-black rounded text-center";
  
  // Empty array for mapping empty table rows
  const emptyArticleRows = Array(2).fill(null);
  const emptyPaymentRows = Array(2).fill(null);

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
      {/* Title & Tabs */}
      <div className="mb-4 shrink-0 flex flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-black">Edit Loan</h2>
          <p className="text-sm text-text-secondary mt-1">Manage Receipts and Repledging.</p>
        </div>
        


        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-4">
          <div className="flex items-center bg-white border border-gray-400 rounded-lg overflow-hidden shadow-sm">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter') handleSearch(); }}
              placeholder="Search Customer ID, Loan No or Mobile..." 
              className="w-full px-4 py-2 text-base text-black focus:outline-none"
            />
            <button 
              onClick={handleSearch}
              className="px-6 py-2 bg-black text-white text-base hover:bg-gray-800 transition-colors"
            >
              Search
            </button>
          </div>
        </div>
        
      </div>

      <div className="flex-1 overflow-y-auto">
        {!hasSearched ? (
          <div className="h-full w-full flex items-center justify-center pb-32">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <h3 className="text-xl font-bold text-gray-600">Search for a Loan</h3>
              <p className="mt-2 text-sm font-semibold text-gray-400">Enter a Customer ID or Loan Number above to view and edit details.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Common Read-Only Details */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col mb-6 p-6 mt-2">
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Customer Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none cursor-not-allowed" value={customerData.name} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile No</label>
                  <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none cursor-not-allowed" value={customerData.mobile} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Father/Husband Name</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none cursor-not-allowed" value={customerData.fatherName} readOnly />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none cursor-not-allowed resize-none" value={customerData.address} rows="2" readOnly />
                </div>
              </div>
            </div>

            {/* Scheme Details */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col mb-6 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Scheme Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scheme Name</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none cursor-not-allowed" value={selectedLoan?.schemeName || 'N/A'} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interest %</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none cursor-not-allowed" value={selectedLoan?.interestPercent || 'N/A'} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gram Rate</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none cursor-not-allowed" value={selectedLoan?.gramRate || 'N/A'} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Gram</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none cursor-not-allowed" value={selectedLoan?.minimumGram || 'N/A'} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mature Period (Months)</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none cursor-not-allowed" value={selectedLoan?.maturePeriod || 'N/A'} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interest Repayment (Months)</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none cursor-not-allowed" value={selectedLoan?.interestRepaymentMonths || 'N/A'} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Document Charges</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none cursor-not-allowed" value={selectedLoan?.documentCharge || selectedLoan?.documentCharges || 'N/A'} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Penalty %</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none cursor-not-allowed" value={selectedLoan?.penaltyPercent || 'N/A'} readOnly />
                </div>
              </div>
            </div>

            {/* Dynamic Specific Loan Form */}
            {renderLoanForm()}
          </>
        )}
      </div>
    </div>
  );
};

export default EditLoan;
