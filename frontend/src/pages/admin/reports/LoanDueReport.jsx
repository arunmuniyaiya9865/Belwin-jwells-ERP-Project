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

const LoanDueReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [filters, setFilters] = useState({
    branch: '',
    dateRange: 'Next 7 Days'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all loans to calculate dues locally since we don't have a dedicated due date endpoint
      const res = await api.get('/reports/loan-report');
      let allLoans = res.data || [];

      // DEMO: Inject fake data if no real data is found
      if (allLoans.length === 0) {
        const today = new Date();
        allLoans = [
          { loanId: 'LN000401', customerName: 'Arun Kumar', loanAmount: 50000, status: 'Active', loanDate: new Date(new Date().setDate(today.getDate() - 30)), branch: 'Head Office', emiAmount: 5000 },
          { loanId: 'LN000405', customerName: 'Ramesh', loanAmount: 150000, status: 'Active', loanDate: new Date(new Date().setDate(today.getDate() - 28)), branch: 'Branch 1', emiAmount: 15000 },
          { loanId: 'LN000412', customerName: 'Suresh', loanAmount: 35000, status: 'Active', loanDate: new Date(new Date().setDate(today.getDate() - 25)), branch: 'Branch 2', emiAmount: 3500 },
        ];
      }
      
      // Filter only Active loans
      const activeLoans = allLoans.filter(loan => loan.status === 'Active');

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Determine the target date range for dues
      let rangeEnd = new Date(today);
      if (filters.dateRange === 'Today') {
        rangeEnd.setDate(today.getDate());
      } else if (filters.dateRange === 'Next 3 Days') {
        rangeEnd.setDate(today.getDate() + 3);
      } else if (filters.dateRange === 'Next 7 Days') {
        rangeEnd.setDate(today.getDate() + 7);
      } else if (filters.dateRange === 'This Month') {
        rangeEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      } else if (filters.dateRange === 'All Time') {
        rangeEnd = new Date(today.getFullYear() + 10, 0, 1); // 10 years ahead
      }

      const dueList = [];

      activeLoans.forEach(loan => {
        // Mocking next due date based on loan issue date + 30 days intervals
        // In a real scenario, this would come from an EMI schedule or last payment date
        const startDate = new Date(loan.loanDate || loan.createdAt);
        let nextDueDate = new Date(startDate);
        
        // Fast forward the date by months until it's on or after today
        while (nextDueDate < today) {
           nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        }

        // Check if the next due date falls within our selected filter range
        if (nextDueDate >= today && nextDueDate <= rangeEnd) {
          
          // Calculate days until due
          const diffTime = Math.abs(nextDueDate - today);
          const daysDue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          // Estimate due amount: Use EMI if exists, else fallback to average interest or static amount
          const dueAmount = loan.emiAmount || loan.remainingInterestAmount || (loan.loanAmount * 0.02) || 0;

          // Branch filter check
          const loanBranch = loan.branch || 'Head Office';
          if (filters.branch && loanBranch !== filters.branch) {
            return; // skip if branch doesn't match
          }

          dueList.push({
            _id: loan.loanId || loan._id,
            loanNo: loan.loanId,
            borrower: loan.customerName || 'Unknown',
            dueDate: nextDueDate.toLocaleDateString(),
            dueDateRaw: nextDueDate,
            dueAmount: Math.round(dueAmount),
            daysDue: daysDue,
            branch: loanBranch
          });
        }
      });

      // Sort by soonest due date
      dueList.sort((a, b) => a.dueDateRaw - b.dueDateRaw);

      setData(dueList);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load loan due data');
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

  const totalDueAmount = data.reduce((acc, curr) => acc + curr.dueAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      <PageHeader 
        title="Loan Due Report" 
        subtitle="Track upcoming dues and payment reminders for customers." 
        icon={FileText} 
        actions={<Button variant="secondary" icon={Download}>Export PDF</Button>}
      />
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6 border-l-4 border-l-orange-500 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 mb-1">Upcoming Dues Count ({filters.dateRange})</h3>
          <p className="text-3xl font-bold text-gray-800">{data.length}</p>
        </Card>
        <Card className="p-6 border-l-4 border-l-red-500 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 mb-1">Total Expected Amount</h3>
          <p className="text-3xl font-bold text-gray-800">₹{totalDueAmount.toLocaleString('en-IN')}</p>
        </Card>
        <Card className="p-6 border-l-4 border-l-purple-500 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 mb-1">Filter Active</h3>
          <p className="text-lg font-bold text-gray-800">{filters.branch || 'All Branches'} • {filters.dateRange}</p>
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
              label="Date Range" 
              value={filters.dateRange} 
              onChange={e => setFilters({...filters, dateRange: e.target.value})}
            >
              <option value="Today">Today (Due Today)</option>
              <option value="Next 3 Days">Next 3 Days</option>
              <option value="Next 7 Days">Next 7 Days</option>
              <option value="This Month">This Month</option>
              <option value="All Time">All Time</option>
            </Select>
          </div>

          <div className="w-full md:w-1/3 flex justify-end">
             <Button type="submit" variant="primary" icon={Filter}>Apply Filters</Button>
          </div>
        </form>
      </Card>

      <Card className="shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-800">Customers to Follow-Up</h3>
        </div>
        <DataTable
          headers={['Loan No', 'Customer', 'Due Date', 'Due Amount', 'Days Until Due', 'Action']}
          data={data}
          loading={loading}
          renderRow={(item) => (
            <TR key={item._id}>
              <TD className="font-bold text-gray-800">{item.loanNo}</TD>
              <TD className="font-semibold text-gray-700">{item.borrower}</TD>
              <TD className="font-bold text-red-600">{item.dueDate}</TD>
              <TD className="font-bold text-gray-800">₹{item.dueAmount.toLocaleString('en-IN')}</TD>
              <TD>
                <span className={`px-2 py-1 rounded border text-xs font-medium ${item.daysDue === 0 ? 'bg-red-100 border-red-200 text-red-700' : 'bg-orange-50 border-orange-200 text-orange-700'}`}>
                  {item.daysDue === 0 ? 'Due Today' : `${item.daysDue} Days`}
                </span>
              </TD>
              <TD>
                <Button variant="secondary" size="sm" onClick={() => toast.success(`Calling ${item.borrower}...`)}>
                  Call Reminder
                </Button>
              </TD>
            </TR>
          )}
        />
      </Card>
    </div>
  );
};

export default LoanDueReport;
