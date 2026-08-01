import { useState, useEffect } from 'react';
import { FileText, Filter, Download } from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import PageHeader from '../../../components/ui/PageHeader';
import Card from '../../../components/ui/Card';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import DataTable from '../../../components/ui/DataTable';
import { TD, TR } from '../../../components/ui/Table';

const LoanOverDueReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [filters, setFilters] = useState({
    branch: '',
    overdueRange: 'All Time'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all loans to calculate overdue locally
      const res = await api.get('/reports/loan-report');
      let allLoans = res.data || [];

      // DEMO: Inject fake data if no real data is found
      if (allLoans.length === 0) {
        const today = new Date();
        allLoans = [
          { loanId: 'LN000301', customerName: 'Arun Kumar', loanAmount: 50000, remainingLoanAmount: 45000, status: 'Overdue', loanDate: new Date(new Date().setDate(today.getDate() - 45)), branch: 'Head Office', emiAmount: 5000 },
          { loanId: 'LN000305', customerName: 'Ramesh', loanAmount: 150000, remainingLoanAmount: 150000, status: 'Overdue', loanDate: new Date(new Date().setDate(today.getDate() - 70)), branch: 'Branch 1', emiAmount: 15000 },
          { loanId: 'LN000312', customerName: 'Suresh', loanAmount: 35000, remainingLoanAmount: 25000, status: 'Overdue', loanDate: new Date(new Date().setDate(today.getDate() - 110)), branch: 'Branch 2', emiAmount: 3500 },
        ];
      }
      
      // Filter Active and Overdue loans
      const activeLoans = allLoans.filter(loan => loan.status === 'Active' || loan.status === 'Overdue');

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const overdueList = [];

      activeLoans.forEach(loan => {
        // Mocking next due date based on loan issue date + 30 days intervals
        // In a real scenario, this would come from an EMI schedule or last payment date
        const startDate = new Date(loan.loanDate || loan.createdAt);
        let nextDueDate = new Date(startDate);
        
        // Fast forward the date by months until it's just past today or closest to today in the past
        while (new Date(nextDueDate).setMonth(nextDueDate.getMonth() + 1) < today) {
           nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        }

        // If the due date is strictly in the past, it's overdue
        if (nextDueDate < today) {
          
          // Calculate overdue days
          const diffTime = Math.abs(today - nextDueDate);
          const overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          // Filter by overdue range
          if (filters.overdueRange === '1-30 Days' && (overdueDays < 1 || overdueDays > 30)) return;
          if (filters.overdueRange === '31-60 Days' && (overdueDays < 31 || overdueDays > 60)) return;
          if (filters.overdueRange === '61-90 Days' && (overdueDays < 61 || overdueDays > 90)) return;
          if (filters.overdueRange === '90+ Days' && overdueDays <= 90) return;

          // Estimate overdue amount/penalty
          const dueAmount = loan.emiAmount || loan.remainingInterestAmount || (loan.loanAmount * 0.02) || 0;
          const penalty = Math.round(dueAmount * 0.1); // mock 10% penalty
          
          // Branch filter check
          const loanBranch = loan.branch || 'Head Office';
          if (filters.branch && loanBranch !== filters.branch) {
            return; // skip if branch doesn't match
          }

          overdueList.push({
            _id: loan.loanId || loan._id,
            loanNo: loan.loanId,
            borrower: loan.customerName || 'Unknown',
            dueDate: nextDueDate.toLocaleDateString(),
            dueDateRaw: nextDueDate,
            outstanding: loan.remainingLoanAmount || loan.loanAmount || 0,
            overdueDays: overdueDays,
            penalty: penalty,
            branch: loanBranch,
            status: 'Overdue'
          });
        }
      });

      // Sort by highest overdue days first
      overdueList.sort((a, b) => b.overdueDays - a.overdueDays);

      setData(overdueList);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load overdue loan data');
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

  const totalOverdueCount = data.length;
  const totalOutstanding = data.reduce((acc, curr) => acc + curr.outstanding, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      <PageHeader 
        title="Loan Overdue Report" 
        subtitle="Track customers who have crossed their due dates for recovery follow-up." 
        icon={FileText} 
        actions={<Button variant="secondary" icon={Download}>Export PDF</Button>}
      />
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6 border-l-4 border-l-red-500 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 mb-1">Total Overdue Customers</h3>
          <p className="text-3xl font-bold text-gray-800">{totalOverdueCount}</p>
        </Card>
        <Card className="p-6 border-l-4 border-l-orange-500 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 mb-1">Total Outstanding at Risk</h3>
          <p className="text-3xl font-bold text-gray-800">₹{totalOutstanding.toLocaleString('en-IN')}</p>
        </Card>
        <Card className="p-6 border-l-4 border-l-purple-500 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 mb-1">Filter Active</h3>
          <p className="text-lg font-bold text-gray-800">{filters.branch || 'All Branches'} • {filters.overdueRange}</p>
        </Card>
      </div>

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
              label="Overdue Range" 
              value={filters.overdueRange} 
              onChange={e => setFilters({...filters, overdueRange: e.target.value})}
            >
              <option value="All Time">All Time</option>
              <option value="1-30 Days">1 to 30 Days</option>
              <option value="31-60 Days">31 to 60 Days</option>
              <option value="61-90 Days">61 to 90 Days</option>
              <option value="90+ Days">90+ Days</option>
            </Select>
          </div>

          <div className="w-full md:w-1/3 flex justify-end">
             <Button type="submit" variant="primary" icon={Filter}>Apply Filters</Button>
          </div>
        </form>
      </Card>

      <Card className="shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-800">Recovery Follow-Up List</h3>
        </div>
        <DataTable
          headers={['Loan No', 'Customer', 'Due Date', 'Outstanding', 'Overdue Days', 'Penalty', 'Status', 'Action']}
          data={data}
          loading={loading}
          renderRow={(item) => (
            <TR key={item._id}>
              <TD className="font-bold text-gray-800">{item.loanNo}</TD>
              <TD className="font-semibold text-gray-700">{item.borrower}</TD>
              <TD className="font-bold text-gray-600">{item.dueDate}</TD>
              <TD className="font-bold text-orange-600">₹{item.outstanding.toLocaleString('en-IN')}</TD>
              <TD>
                <span className={`px-2 py-1 rounded border text-xs font-bold ${item.overdueDays > 90 ? 'bg-red-100 border-red-300 text-red-700' : 'bg-orange-100 border-orange-300 text-orange-700'}`}>
                  {item.overdueDays} Days
                </span>
              </TD>
              <TD className="text-red-500 font-medium">₹{item.penalty}</TD>
              <TD>
                <span className="px-2 py-1 rounded-none text-xs font-medium bg-red-100 text-red-700">
                  {item.status}
                </span>
              </TD>
              <TD>
                <Button variant="danger" size="sm" onClick={() => toast.success(`Initiating recovery for ${item.borrower}...`)}>
                  Follow-up
                </Button>
              </TD>
            </TR>
          )}
        />
      </Card>
    </div>
  );
};

export default LoanOverDueReport;
