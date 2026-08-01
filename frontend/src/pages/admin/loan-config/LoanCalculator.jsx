import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Search, Calculator, ArrowLeft } from 'lucide-react';
import api from '../../../services/api';
import PageHeader from '../../../components/ui/PageHeader';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import DataTable from '../../../components/ui/DataTable';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import { TD, TR } from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';

const LoanCalculator = () => {
  const [calculators, setCalculators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCalc, setEditingCalc] = useState(null);
  
  const [formData, setFormData] = useState({
    calculationType: 'Simple',
    loanMode: 'Monthly',
    loanAmount: 50000,
    term: 12,
    roi: 12,
    calculationEMI: 0
  });

  // Delete dialog state
  const [deleteId, setDeleteId] = useState(null);

  const fetchCalculators = async () => {
    setLoading(true);
    try {
      const res = await api.get('/loan-config/loan-calculator');
      setCalculators(res.data || []);
    } catch (err) {
      console.error('Failed to fetch loan calculators', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalculators();
  }, []);

  // Recalculate EMI whenever amount, term, or roi changes
  useEffect(() => {
    const P = parseFloat(formData.loanAmount) || 0;
    const R = parseFloat(formData.roi) || 0;
    const T = parseFloat(formData.term) || 0;
    let inst = 0;

    if (formData.calculationType === 'Simple') {
      const timeInYears = formData.loanMode === 'Monthly' ? T / 12 : (formData.loanMode === 'Weekly' ? T / 52 : T / 365);
      const interest = P * (R / 100) * timeInYears;
      const pay = P + interest;
      inst = T > 0 ? Math.round(pay / T) : pay;
    } else {
      // Reducing EMI
      const ratePerPeriod = (formData.loanMode === 'Monthly' ? R / 12 : (formData.loanMode === 'Weekly' ? R / 52 : R / 365)) / 100;
      if (ratePerPeriod > 0 && T > 0) {
        inst = Math.round((P * ratePerPeriod * Math.pow(1 + ratePerPeriod, T)) / (Math.pow(1 + ratePerPeriod, T) - 1));
      } else {
        inst = P;
      }
    }
    
    setFormData(prev => ({ ...prev, calculationEMI: inst }));
  }, [formData.loanAmount, formData.term, formData.roi, formData.calculationType, formData.loanMode]);

  const handleOpenAdd = () => {
    setEditingCalc(null);
    setFormData({
      calculationType: 'Simple',
      loanMode: 'Monthly',
      loanAmount: 50000,
      term: 12,
      roi: 12,
      calculationEMI: 0
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (calc) => {
    setEditingCalc(calc);
    setFormData({
      calculationType: calc.calculationType || 'Simple',
      loanMode: calc.loanMode || 'Monthly',
      loanAmount: calc.loanAmount || 0,
      term: calc.term || 0,
      roi: calc.roi || 0,
      calculationEMI: calc.calculationEMI || 0
    });
    setIsFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.loanAmount || !formData.term || !formData.roi) {
      return alert('Amount, Term, and ROI are required');
    }

    setLoading(true);
    try {
      if (editingCalc) {
        await api.put(`/loan-config/loan-calculator/${editingCalc._id}`, formData);
      } else {
        await api.post('/loan-config/loan-calculator', formData);
      }
      setIsFormOpen(false);
      fetchCalculators();
    } catch (err) {
      console.error(err);
      alert('Failed to save calculation setting');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      await api.delete(`/loan-config/loan-calculator/${deleteId}`);
      setDeleteId(null);
      fetchCalculators();
    } catch (err) {
      console.error(err);
      alert('Failed to delete calculation setting');
    } finally {
      setLoading(false);
    }
  };

  const filteredCalculators = calculators.filter(c =>
    c.calculationType?.toLowerCase().includes(search.toLowerCase()) ||
    c.loanMode?.toLowerCase().includes(search.toLowerCase())
  );

  if (isFormOpen) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => setIsFormOpen(false)}
            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-none transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {editingCalc ? 'Edit Calculator Preset' : 'Add New Calculator Preset'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Configure and save a predefined loan scheme calculation.
            </p>
          </div>
        </div>

        <Card className="p-8 shadow-lg border border-gray-100">
          <form onSubmit={handleSave} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Calculation Type"
                value={formData.calculationType}
                onChange={(e) => setFormData({ ...formData, calculationType: e.target.value })}
                containerClassName="bg-gray-50"
              >
                <option value="Simple">Simple Interest</option>
                <option value="EMI">EMI (Reducing Balance)</option>
              </Select>
              
              <Select
                label="Loan Mode"
                value={formData.loanMode}
                onChange={(e) => setFormData({ ...formData, loanMode: e.target.value })}
                containerClassName="bg-gray-50"
              >
                <option value="Monthly">Monthly</option>
                <option value="Weekly">Weekly</option>
                <option value="Daily">Daily</option>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Loan Amount (₹)"
                type="number"
                required
                value={formData.loanAmount}
                onChange={(e) => setFormData({ ...formData, loanAmount: Math.max(0, parseInt(e.target.value) || 0) })}
                className="bg-gray-50 text-lg font-bold"
              />
              <Input
                label={`Term (${formData.loanMode})`}
                type="number"
                required
                value={formData.term}
                onChange={(e) => setFormData({ ...formData, term: Math.max(0, parseInt(e.target.value) || 0) })}
                className="bg-gray-50"
              />
              <Input
                label="ROI (% p.a.)"
                type="number"
                step="0.01"
                required
                value={formData.roi}
                onChange={(e) => setFormData({ ...formData, roi: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="bg-gray-50"
              />
            </div>

            <div className="mt-8 p-6 bg-green-50 border border-green-200 text-center">
              <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-2">Calculated Installment (EMI)</p>
              <h2 className="text-4xl font-extrabold text-green-900">
                ₹{formData.calculationEMI.toLocaleString('en-IN')}
              </h2>
              <p className="text-sm text-green-600 mt-2 font-medium">Auto-computed and ready to save</p>
            </div>

            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
              <Button 
                type="button" 
                onClick={() => setIsFormOpen(false)} 
                variant="secondary"
                className="px-6 py-2.5"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                loading={loading}
                className="px-8 py-2.5 shadow-md hover:shadow-lg transition-all"
              >
                Save Preset
              </Button>
            </div>
            
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      <PageHeader
        title="Loan Calculator Settings"
        subtitle="Manage and save calculations for standard loan configurations."
        icon={Calculator}
        actions={
          <Button onClick={handleOpenAdd} icon={Plus} variant="primary">
            Add Preset
          </Button>
        }
      />

      <Card className="p-4 mb-6 shadow-sm border border-gray-100">
        <div className="relative max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by calculation type or mode..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-none text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-gray-50"
          />
        </div>
      </Card>

      <DataTable
        headers={[
          'Calc Type',
          'Loan Mode',
          'Loan Amount',
          'Term',
          'ROI (% p.a.)',
          'Calculated EMI',
          'Actions'
        ]}
        data={filteredCalculators}
        loading={loading}
        renderRow={(calc) => (
          <TR key={calc._id}>
            <TD className="font-bold text-gray-800">
              <Badge variant={calc.calculationType === 'Simple' ? 'primary' : 'secondary'}>
                {calc.calculationType}
              </Badge>
            </TD>
            <TD className="font-semibold text-gray-700">{calc.loanMode}</TD>
            <TD className="font-bold text-gray-900">₹{calc.loanAmount?.toLocaleString('en-IN')}</TD>
            <TD>{calc.term}</TD>
            <TD>{calc.roi}%</TD>
            <TD className="font-extrabold text-green-700">₹{calc.calculationEMI?.toLocaleString('en-IN')}</TD>
            <TD>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(calc)}
                  className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-none cursor-pointer transition-colors"
                  title="Edit"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  onClick={() => setDeleteId(calc._id)}
                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-none cursor-pointer transition-colors"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </TD>
          </TR>
        )}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Preset"
        description="Are you sure you want to delete this preset calculation? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default LoanCalculator;
