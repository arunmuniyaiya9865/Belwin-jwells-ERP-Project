import { useState, useEffect } from 'react';
import { Search, FileText, Filter, Download } from 'lucide-react';
import api from '../../../services/api';
import PageHeader from '../../../components/ui/PageHeader';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import DataTable from '../../../components/ui/DataTable';
import { TD, TR } from '../../../components/ui/Table';

const LedgerReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [filters, setFilters] = useState({
    ledgerName: '',
    branch: '',
    fromDate: '',
    toDate: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/accounts/ledger-report');
      setData(res.data.data || res.data || []);
    } catch (err) {
      console.error('Failed to fetch ledger report', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      <PageHeader 
        title="Ledger Report" 
        subtitle="Complete transaction history for a specific ledger." 
        icon={FileText} 
        actions={
          <Button variant="secondary" icon={Download}>Export PDF</Button>
        }
      />
      
      <Card className="p-6 mb-6 shadow-sm border border-gray-100">
        <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <Input label="Ledger Name" value={filters.ledgerName} onChange={e => setFilters({...filters, ledgerName: e.target.value})} placeholder="Search Ledger..." />
          <Select label="Branch" value={filters.branch} onChange={e => setFilters({...filters, branch: e.target.value})}>
            <option value="">All Branches</option>
            <option value="Head Office">Head Office</option>
          </Select>
          <Input label="From Date" type="date" value={filters.fromDate} onChange={e => setFilters({...filters, fromDate: e.target.value})} />
          <Input label="To Date" type="date" value={filters.toDate} onChange={e => setFilters({...filters, toDate: e.target.value})} />
          
          <div className="lg:col-span-4 flex justify-end">
             <Button type="submit" variant="primary" icon={Filter}>Apply Filters</Button>
          </div>
        </form>
      </Card>

      <DataTable
        headers={['Date', 'Voucher No', 'Particulars', 'Debit (Dr)', 'Credit (Cr)', 'Balance']}
        data={data}
        loading={loading}
        renderRow={(item) => (
          <TR key={item._id}>
            <TD>{item.date}</TD>
            <TD className="font-bold text-gray-800">{item.voucherNo}</TD>
            <TD className="font-medium text-gray-700">{item.particulars}</TD>
            <TD className="text-red-600 font-medium">{item.debit > 0 ? `₹${item.debit}` : '-'}</TD>
            <TD className="text-green-600 font-medium">{item.credit > 0 ? `₹${item.credit}` : '-'}</TD>
            <TD className="font-bold">₹{item.balance}</TD>
          </TR>
        )}
      />
    </div>
  );
};
export default LedgerReport;
