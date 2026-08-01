import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Search, Key, ArrowLeft } from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import PageHeader from '../../../components/ui/PageHeader';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import DataTable from '../../../components/ui/DataTable';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import { TD, TR } from '../../../components/ui/Table';

const STORAGE_KEY = 'bellwin_lockers';

const LockerMaster = () => {
  const [lockers, setLockers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLocker, setEditingLocker] = useState(null);
  const [formData, setFormData] = useState({
    lockerName: '',
    address: '',
    status: 'Active'
  });

  // Delete dialog state
  const [deleteId, setDeleteId] = useState(null);

  // Fetch lockers
  const fetchLockers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/loan-config/locker');
      setLockers(res.data.lockers || res.data || []);
    } catch (err) {
      console.error('Failed to fetch lockers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLockers();
  }, []);

  const handleOpenAdd = () => {
    setEditingLocker(null);
    setFormData({
      lockerName: '',
      address: '',
      status: 'Active'
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (locker) => {
    setEditingLocker(locker);
    setFormData({
      lockerName: locker.lockerName || '',
      address: locker.address || '',
      status: locker.status || 'Active'
    });
    setIsFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.lockerName || !formData.address) return alert('Name and Address are required');

    setLoading(true);
    try {
      if (editingLocker) {
        await api.put(`/loan-config/locker/${editingLocker._id}`, formData);
      } else {
        await api.post('/loan-config/locker', formData);
      }
      setIsFormOpen(false);
      fetchLockers();
      toast.success(editingLocker ? 'Locker updated successfully' : 'Locker added successfully');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save locker');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      await api.delete(`/loan-config/locker/${deleteId}`);
      setDeleteId(null);
      fetchLockers();
      toast.success('Locker deleted successfully');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to delete locker');
    } finally {
      setLoading(false);
    }
  };

  const filteredLockers = lockers.filter(l =>
    l.lockerName?.toLowerCase().includes(search.toLowerCase()) ||
    l.address?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadgeVariant = (status) => {
    if (status === 'Available') return 'success';
    if (status === 'Occupied') return 'warning';
    return 'danger';
  };

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
              {editingLocker ? 'Edit Locker Details' : 'Add New Safe Locker'}
            </h1>
          </div>
        </div>

        <Card className="p-8 shadow-lg border border-gray-100">
          <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Locker Name"
              required
              value={formData.lockerName}
              onChange={(e) => setFormData({ ...formData, lockerName: e.target.value.toUpperCase() })}
              placeholder="e.g. LKR-001"
            />
            <Input
              label="Address"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. 123 Main St, Springfield"
            />
          </div>
          
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Select>
          
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100 mt-6">
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
                Save Locker
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
        title="Locker Master"
        subtitle="Manage secure physical safe lockers, branch allocations, weight capacity limits, and availability."
        icon={Key}
        actions={
          <Button onClick={handleOpenAdd} icon={Plus} variant="primary">
            Add Locker
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
            placeholder="Search by locker number, type or branch..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-none text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-gray-50"
          />
        </div>
      </Card>

      <DataTable
        headers={[
          'Locker Name',
          'Address',
          'Status',
          'Actions'
        ]}
        data={filteredLockers}
        loading={loading}
        renderRow={(locker) => (
          <TR key={locker._id}>
            <TD className="font-bold text-gray-800">{locker.lockerName}</TD>
            <TD>{locker.address}</TD>
            <TD>
              <Badge variant={locker.status === 'Active' ? 'success' : 'danger'}>
                {locker.status}
              </Badge>
            </TD>
            <TD>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(locker)}
                  className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-none cursor-pointer transition-colors"
                  title="Edit Locker"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  onClick={() => setDeleteId(locker._id)}
                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-none cursor-pointer transition-colors"
                  title="Delete Locker"
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
        title="Delete Locker Record"
        description="Are you sure you want to delete this locker record? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default LockerMaster;
