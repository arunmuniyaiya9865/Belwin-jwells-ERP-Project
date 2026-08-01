import { useState } from 'react';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import { Search, FileText, User, ArrowLeft, Download, Building2, Phone } from 'lucide-react';
import PageHeader from '../../../components/ui/PageHeader';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import DataTable from '../../../components/ui/DataTable';
import { TD, TR } from '../../../components/ui/Table';

const LoanAccountLedger = () => {
  const [view, setView] = useState('search'); // 'search' | 'customerDetails'
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState([]);
  const [searching, setSearching] = useState(false);

  // Customer Details State
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loans, setLoans] = useState([]);
  const [ledgerData, setLedgerData] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error('Please enter a phone number or name to search');
      return;
    }
    
    setSearching(true);
    try {
      const res = await api.get(`/customers/search?search=${searchQuery}`);
      setCustomers(res.data.data || res.data); // Adjust based on API format
    } catch (error) {
      console.error(error);
      toast.error('Failed to search customers');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectCustomer = async (customer) => {
    setSelectedCustomer(customer);
    setView('customerDetails');
    setLoadingDetails(true);
    
    try {
      // 1. Fetch Loans for this customer
      const loansRes = await api.get(`/loans/customer/${customer._id}`);
      setLoans(loansRes.data.data || loansRes.data || []);
      
      // 2. Fetch Ledger for this customer (using mobileNo as per backend logic)
      const ledgerRes = await api.get(`/reports/ledger?mobileNo=${customer.mobileNumber}`);
      
      const formattedLedger = ledgerRes.data.map(item => ({
        _id: item._id,
        loanNo: item.loanNo,
        date: new Date(item.date).toLocaleDateString(),
        description: item.description || 'Transaction',
        debit: item.debit || 0,
        credit: item.credit || 0,
        balance: `${item.balance} ${item.balance >= 0 ? 'Dr' : 'Cr'}`,
        status: item.status
      }));
      setLedgerData(formattedLedger);
      
    } catch (error) {
      console.error(error);
      toast.error('Failed to load customer details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleBack = () => {
    setView('search');
    setSelectedCustomer(null);
    setLoans([]);
    setLedgerData([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      <PageHeader 
        title="Loan Account Ledger" 
        subtitle="Search a customer to view their total loan details and ledger." 
        icon={FileText} 
        actions={view === 'customerDetails' ? <Button variant="secondary" icon={Download}>Export PDF</Button> : null}
      />
      
      {view === 'search' && (
        <div className="space-y-6">
          <Card className="p-6 shadow-sm border border-gray-100">
            <form onSubmit={handleSearch} className="flex gap-4 items-end max-w-2xl">
              <div className="flex-1">
                <Input 
                  label="Search Customer" 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                  placeholder="Enter Phone Number or Name..." 
                />
              </div>
              <Button type="submit" variant="primary" icon={Search} loading={searching}>
                Search
              </Button>
            </form>
          </Card>

          {customers.length > 0 && (
            <Card className="shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-lg font-semibold text-gray-800">Search Results</h3>
              </div>
              <DataTable
                headers={['Customer Name', 'Customer ID', 'Phone Number', 'Branch', 'Action']}
                data={customers}
                loading={searching}
                renderRow={(customer) => (
                  <TR key={customer._id}>
                    <TD className="font-semibold text-gray-800">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {customer.customerName?.charAt(0)}
                        </div>
                        {customer.customerName}
                      </div>
                    </TD>
                    <TD className="text-gray-600 font-medium">{customer.customerId}</TD>
                    <TD className="text-gray-600">
                      <div className="flex items-center gap-1">
                        <Phone size={14} className="text-gray-400" />
                        {customer.mobileNumber}
                      </div>
                    </TD>
                    <TD>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Building2 size={14} className="text-gray-400" />
                        {customer.branchName || 'Head Office'}
                      </div>
                    </TD>
                    <TD>
                      <Button variant="secondary" size="sm" onClick={() => handleSelectCustomer(customer)}>
                        View Details
                      </Button>
                    </TD>
                  </TR>
                )}
              />
            </Card>
          )}
        </div>
      )}

      {view === 'customerDetails' && selectedCustomer && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
              title="Back to Search"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{selectedCustomer.customerName}</h2>
              <p className="text-gray-500">{selectedCustomer.mobileNumber} • {selectedCustomer.customerId}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Customer Loans Table */}
            <Card className="shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-lg font-semibold text-gray-800">Total Loans ({loans.length})</h3>
              </div>
              <DataTable
                headers={['Loan ID', 'Date', 'Type', 'Amount', 'Status']}
                data={loans}
                loading={loadingDetails}
                renderRow={(loan) => (
                  <TR key={loan._id}>
                    <TD className="font-bold text-gray-800">{loan.loanId}</TD>
                    <TD>{new Date(loan.loanDate).toLocaleDateString()}</TD>
                    <TD className="text-gray-600">{loan.schemeType}</TD>
                    <TD className="font-bold text-gray-800">₹{loan.loanAmount}</TD>
                    <TD>
                      <span className={`px-2 py-1 rounded-none text-xs font-medium ${
                        loan.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {loan.status}
                      </span>
                    </TD>
                  </TR>
                )}
              />
            </Card>

            {/* Consolidated Ledger Table */}
            <Card className="shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-lg font-semibold text-gray-800">Combined Ledger Statement</h3>
              </div>
              <DataTable
                headers={['Loan No', 'Date', 'Description', 'Debit', 'Credit', 'Balance', 'Status']}
                data={ledgerData}
                loading={loadingDetails}
                renderRow={(item) => (
                  <TR key={item._id}>
                    <TD className="font-bold text-gray-800">{item.loanNo}</TD>
                    <TD>{item.date}</TD>
                    <TD className="text-gray-600 max-w-xs truncate" title={item.description}>{item.description}</TD>
                    <TD className="text-red-600 font-medium">{item.debit > 0 ? `₹${item.debit}` : '-'}</TD>
                    <TD className="text-green-600 font-medium">{item.credit > 0 ? `₹${item.credit}` : '-'}</TD>
                    <TD className="font-bold">₹{item.balance}</TD>
                    <TD>
                      <span className={`px-2 py-1 rounded-none text-xs font-medium ${
                        item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {item.status}
                      </span>
                    </TD>
                  </TR>
                )}
              />
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanAccountLedger;
