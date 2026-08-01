import { useState, useEffect } from 'react';
import { FileText, Filter, Download, ArrowLeft, Eye } from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import PageHeader from '../../../components/ui/PageHeader';
import Card from '../../../components/ui/Card';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import DataTable from '../../../components/ui/DataTable';
import { TD, TR } from '../../../components/ui/Table';

const LoanAccountLedgerNonEMI = () => {
  const [view, setView] = useState('list'); // 'list' | 'details'
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [filters, setFilters] = useState({
    branch: '',
    dateRange: 'All Time'
  });

  // Details State
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [ledgerData, setLedgerData] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const getDateRangeParams = () => {
    const today = new Date();
    let fromDate = null;
    let toDate = null;

    if (filters.dateRange === 'Today') {
      fromDate = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      toDate = new Date(today.setHours(23, 59, 59, 999)).toISOString();
    } else if (filters.dateRange === 'This Week') {
      const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
      fromDate = new Date(firstDay.setHours(0, 0, 0, 0)).toISOString();
      toDate = new Date(new Date().setHours(23, 59, 59, 999)).toISOString();
    } else if (filters.dateRange === 'This Month') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      fromDate = new Date(firstDay.setHours(0, 0, 0, 0)).toISOString();
      toDate = new Date(new Date().setHours(23, 59, 59, 999)).toISOString();
    } else if (filters.dateRange === 'This Year') {
      const firstDay = new Date(today.getFullYear(), 0, 1);
      fromDate = new Date(firstDay.setHours(0, 0, 0, 0)).toISOString();
      toDate = new Date(new Date().setHours(23, 59, 59, 999)).toISOString();
    }

    let queryStr = '';
    if (fromDate && toDate) {
      queryStr += `?fromDate=${fromDate}&toDate=${toDate}`;
    }
    if (filters.branch) {
      queryStr += (queryStr ? '&' : '?') + `branch=${filters.branch}`;
    }
    return queryStr;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const queryStr = getDateRangeParams();
      const res = await api.get(`/reports/loan-report${queryStr}`);
      
      const allLoans = res.data || [];
      const nonEmiLoans = allLoans.filter(loan => {
         const name = (loan.schemeName || loan.schemeType || loan.customerName || '').toLowerCase();
         if (name.includes('personal') || name.includes('vehicle') || name.includes('micro') || name.includes('chit')) {
           return false;
         }
         if (name.includes('emi') && !name.includes('non emi')) {
           return false;
         }
         return true;
      });

      const tableData = nonEmiLoans.map(l => ({
        _raw: l,
        _id: l.loanId || l._id,
        loanNo: l.loanId,
        borrower: l.customerName || 'Unknown',
        mobileNo: l.mobileNo || '', 
        loanAmount: l.loanAmount || 0,
        interest: l.remainingInterestAmount || 0,
        outstanding: l.remainingLoanAmount || 0,
        status: l.status || 'Active',
        date: l.loanDate
      }));

      setData(tableData);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load ledger data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]); 

  const handleFilter = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleViewLedger = async (loan) => {
    setSelectedLoan(loan);
    setView('details');
    setLoadingDetails(true);
    
    try {
      let queryStr = loan.mobileNo ? `mobileNo=${loan.mobileNo}` : `borrowerName=${loan.borrower}`;
      const ledgerRes = await api.get(`/reports/ledger?${queryStr}`);
      
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
      
      const filteredLedger = formattedLedger.filter(item => item.loanNo === loan.loanNo);
      setLedgerData(filteredLedger);
      
    } catch (error) {
      console.error(error);
      toast.error('Failed to load ledger details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleBack = () => {
    setView('list');
    setSelectedLoan(null);
    setLedgerData([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      <PageHeader 
        title="Loan Account Ledger (Non EMI)" 
        subtitle={view === 'list' ? "Report for Non-EMI based loans." : `Ledger Details for ${selectedLoan?.loanNo}`}
        icon={FileText} 
        actions={view === 'details' ? <Button variant="secondary" icon={Download}>Export PDF</Button> : null}
      />
      
      {view === 'list' && (
        <>
          <Card className="p-6 mb-6 shadow-sm border border-gray-100">
            <form onSubmit={handleFilter} className="flex flex-col md:flex-row gap-4 items-end">
              
              <div className="w-full md:w-1/3">
                <Select 
                  label="Branch Name" 
                  value={filters.branch} 
                  onChange={e => setFilters({...filters, branch: e.target.value})}
                >
                  <option value="">All Branches</option>
                  <option value="Head Office">Head Office</option>
                  <option value="Branch 1">Branch 1</option>
                  <option value="Branch 2">Branch 2</option>
                </Select>
              </div>

              <div className="w-full md:w-1/3">
                <Select 
                  label="Date Range" 
                  value={filters.dateRange} 
                  onChange={e => setFilters({...filters, dateRange: e.target.value})}
                >
                  <option value="All Time">All Time</option>
                  <option value="Today">Today</option>
                  <option value="This Week">This Week</option>
                  <option value="This Month">This Month</option>
                  <option value="This Year">This Year</option>
                </Select>
              </div>

              <div className="w-full md:w-1/3 flex justify-end">
                 <Button type="submit" variant="primary" icon={Filter}>Apply Filters</Button>
              </div>
            </form>
          </Card>

          <Card className="shadow-sm border border-gray-100">
            <DataTable
              headers={['Loan No', 'Borrower', 'Loan Amount', 'Outstanding', 'Status', 'Action']}
              data={data}
              loading={loading}
              renderRow={(item) => (
                <TR key={item._id}>
                  <TD className="font-bold text-gray-800">{item.loanNo}</TD>
                  <TD className="font-semibold text-gray-700">{item.borrower}</TD>
                  <TD className="font-medium">₹{item.loanAmount}</TD>
                  <TD className="font-bold text-orange-600">₹{item.outstanding}</TD>
                  <TD>
                    <span className={`px-2 py-1 rounded-none text-xs font-medium ${item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {item.status}
                    </span>
                  </TD>
                  <TD>
                    <Button variant="secondary" size="sm" icon={Eye} onClick={() => handleViewLedger(item)}>
                      View Ledger
                    </Button>
                  </TD>
                </TR>
              )}
            />
          </Card>
        </>
      )}

      {view === 'details' && selectedLoan && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
              title="Back to List"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{selectedLoan.borrower}</h2>
              <p className="text-gray-500">Loan: {selectedLoan.loanNo}</p>
            </div>
          </div>

          <Card className="p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Loan Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">Start Date</p>
                <p className="font-bold text-gray-800">{selectedLoan._raw.loanStartDate ? new Date(selectedLoan._raw.loanStartDate).toLocaleDateString() : new Date(selectedLoan.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">End Date / Mature</p>
                <p className="font-bold text-gray-800">{selectedLoan._raw.loanEndDate ? new Date(selectedLoan._raw.loanEndDate).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">Total Loan Amount</p>
                <p className="font-bold text-gray-800">₹{selectedLoan.loanAmount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">Paid Principal</p>
                <p className="font-bold text-green-600">₹{(selectedLoan.loanAmount - selectedLoan.outstanding) || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">Outstanding Balance</p>
                <p className="font-bold text-orange-600">₹{selectedLoan.outstanding}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">Interest Paid</p>
                <p className="font-bold text-gray-800">₹{selectedLoan._raw.totalPaidInterestAmount || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">Status</p>
                <span className={`px-2 py-1 rounded-none text-xs font-medium ${selectedLoan.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {selectedLoan.status}
                </span>
              </div>
            </div>
          </Card>

          <Card className="shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-lg font-semibold text-gray-800">Ledger Statement</h3>
            </div>
            <DataTable
              headers={['Date', 'Description', 'Debit', 'Credit', 'Balance', 'Status']}
              data={ledgerData}
              loading={loadingDetails}
              renderRow={(item) => (
                <TR key={item._id}>
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
      )}
    </div>
  );
};

export default LoanAccountLedgerNonEMI;
