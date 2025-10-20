import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import DashboardLayout from '../components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Package, DollarSign, AlertCircle, Plus, Edit, Trash2, Tag, Clock } from 'lucide-react';
import axios from 'axios';

function OwnerDashboard() {
  const { API } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [skus, setSkus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // User form
  const [userForm, setUserForm] = useState({ email: '', password: '', full_name: '', role: 'customer', phone: '', address: '' });
  const [showUserDialog, setShowUserDialog] = useState(false);
  
  // SKU form
  const [skuForm, setSkuForm] = useState({ name: '', category: '', price: '', unit: '', description: '' });
  const [showSkuDialog, setShowSkuDialog] = useState(false);
  const [editingSku, setEditingSku] = useState(null);
  
  // Customer Pricing
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerPricing, setCustomerPricing] = useState([]);
  const [skusWithPricing, setSkusWithPricing] = useState([]);
  const [showPricingDialog, setShowPricingDialog] = useState(false);
  const [pricingForm, setPricingForm] = useState({ sku_id: '', custom_price: '' });
  
  // Frequency Templates
  const [frequencyTemplates, setFrequencyTemplates] = useState([]);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    frequency_type: 'daily',
    frequency_value: '1',
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, skusRes] = await Promise.all([
        axios.get(`${API}/analytics/dashboard`),
        axios.get(`${API}/users`),
        axios.get(`${API}/skus`)
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setSkus(skusRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/auth/register`, userForm);
      setShowUserDialog(false);
      setUserForm({ email: '', password: '', full_name: '', role: 'customer', phone: '', address: '' });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to create user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${API}/users/${userId}`);
      fetchData();
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const handleCreateOrUpdateSku = async (e) => {
    e.preventDefault();
    try {
      const skuData = { ...skuForm, price: parseFloat(skuForm.price) };
      if (editingSku) {
        await axios.put(`${API}/skus/${editingSku.id}`, skuData);
      } else {
        await axios.post(`${API}/skus`, skuData);
      }
      setShowSkuDialog(false);
      setSkuForm({ name: '', category: '', price: '', unit: '', description: '' });
      setEditingSku(null);
      fetchData();
    } catch (error) {
      alert('Failed to save SKU');
    }
  };

  const handleDeleteSku = async (skuId) => {
    if (!window.confirm('Are you sure you want to delete this SKU?')) return;
    try {
      await axios.delete(`${API}/skus/${skuId}`);
      fetchData();
    } catch (error) {
      alert('Failed to delete SKU');
    }
  };

  const handleEditSku = (sku) => {
    setEditingSku(sku);
    setSkuForm({
      name: sku.name,
      category: sku.category,
      price: sku.price.toString(),
      unit: sku.unit,
      description: sku.description || ''
    });
    setShowSkuDialog(true);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="spinner"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
        </div>

        {/* Stats Cards */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
                <Package className="w-5 h-5 text-teal-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900" data-testid="total-orders-stat">{stats?.total_orders || 0}</div>
                <p className="text-sm text-gray-500 mt-1">All time</p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Customers</CardTitle>
                <Users className="w-5 h-5 text-teal-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900" data-testid="total-customers-stat">{stats?.total_customers || 0}</div>
                <p className="text-sm text-gray-500 mt-1">Active accounts</p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                <DollarSign className="w-5 h-5 text-teal-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900" data-testid="total-revenue-stat">${stats?.total_revenue?.toFixed(2) || 0}</div>
                <p className="text-sm text-gray-500 mt-1">Completed orders</p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Open Cases</CardTitle>
                <AlertCircle className="w-5 h-5 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900" data-testid="open-cases-stat">{stats?.open_cases || 0}</div>
                <p className="text-sm text-gray-500 mt-1">Requires attention</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            data-testid="overview-tab"
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'users'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            data-testid="users-tab"
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab('skus')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'skus'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            data-testid="skus-tab"
          >
            SKU & Pricing
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-teal-500 hover:bg-teal-600" data-testid="create-user-btn">
                    <Plus className="w-4 h-4 mr-2" />
                    Create User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input value={userForm.full_name} onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })} required data-testid="user-fullname-input" />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} required data-testid="user-email-input" />
                    </div>
                    <div>
                      <Label>Password</Label>
                      <Input type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} required data-testid="user-password-input" />
                    </div>
                    <div>
                      <Label>Role</Label>
                      <Select value={userForm.role} onValueChange={(value) => setUserForm({ ...userForm, role: value })}>
                        <SelectTrigger data-testid="user-role-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="customer">Customer</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="owner">Owner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input value={userForm.phone} onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })} data-testid="user-phone-input" />
                    </div>
                    <div>
                      <Label>Address</Label>
                      <Input value={userForm.address} onChange={(e) => setUserForm({ ...userForm, address: e.target.value })} data-testid="user-address-input" />
                    </div>
                    <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600" data-testid="user-submit-btn">Create User</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200" data-testid="users-table">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{user.full_name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'owner' ? 'bg-purple-100 text-purple-800' :
                              user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.phone || '-'}</td>
                          <td className="px-6 py-4 text-sm">
                            <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-800" data-testid={`delete-user-${user.id}`}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* SKUs Tab */}
        {activeTab === 'skus' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">SKU & Pricing Management</h2>
              <Dialog open={showSkuDialog} onOpenChange={(open) => {
                setShowSkuDialog(open);
                if (!open) {
                  setEditingSku(null);
                  setSkuForm({ name: '', category: '', price: '', unit: '', description: '' });
                }
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-teal-500 hover:bg-teal-600" data-testid="create-sku-btn">
                    <Plus className="w-4 h-4 mr-2" />
                    Add SKU
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingSku ? 'Edit SKU' : 'Create New SKU'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateOrUpdateSku} className="space-y-4">
                    <div>
                      <Label>Item Name</Label>
                      <Input value={skuForm.name} onChange={(e) => setSkuForm({ ...skuForm, name: e.target.value })} required data-testid="sku-name-input" />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Input value={skuForm.category} onChange={(e) => setSkuForm({ ...skuForm, category: e.target.value })} required data-testid="sku-category-input" />
                    </div>
                    <div>
                      <Label>Price ($)</Label>
                      <Input type="number" step="0.01" value={skuForm.price} onChange={(e) => setSkuForm({ ...skuForm, price: e.target.value })} required data-testid="sku-price-input" />
                    </div>
                    <div>
                      <Label>Unit</Label>
                      <Input placeholder="e.g., per item, per kg" value={skuForm.unit} onChange={(e) => setSkuForm({ ...skuForm, unit: e.target.value })} required data-testid="sku-unit-input" />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input value={skuForm.description} onChange={(e) => setSkuForm({ ...skuForm, description: e.target.value })} data-testid="sku-description-input" />
                    </div>
                    <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600" data-testid="sku-submit-btn">{editingSku ? 'Update SKU' : 'Create SKU'}</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skus.map((sku) => (
                <Card key={sku.id} className="card-hover">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      <span>{sku.name}</span>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditSku(sku)} className="text-teal-600 hover:text-teal-800" data-testid={`edit-sku-${sku.id}`}>
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteSku(sku.id)} className="text-red-600 hover:text-red-800" data-testid={`delete-sku-${sku.id}`}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Category: {sku.category}</p>
                      <p className="text-2xl font-bold text-teal-600">${sku.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{sku.unit}</p>
                      {sku.description && <p className="text-sm text-gray-600 mt-2">{sku.description}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default OwnerDashboard;