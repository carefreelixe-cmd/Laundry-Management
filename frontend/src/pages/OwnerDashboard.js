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

  useEffect(() => {
    if (activeTab === 'customer-pricing') {
      fetchCustomers();
    } else if (activeTab === 'frequency-templates') {
      fetchFrequencyTemplates();
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedCustomer) {
      fetchCustomerPricing(selectedCustomer);
    }
  }, [selectedCustomer]);

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

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${API}/users`);
      setCustomers(res.data.filter(u => u.role === 'customer'));
    } catch (error) {
      console.error('Failed to fetch customers', error);
    }
  };

  const fetchCustomerPricing = async (customerId) => {
    try {
      const [skusRes, pricingRes] = await Promise.all([
        axios.get(`${API}/skus-with-pricing/${customerId}`),
        axios.get(`${API}/customer-pricing/${customerId}`)
      ]);
      setSkusWithPricing(skusRes.data);
      setCustomerPricing(pricingRes.data);
    } catch (error) {
      console.error('Failed to fetch customer pricing', error);
    }
  };

  const fetchFrequencyTemplates = async () => {
    try {
      const res = await axios.get(`${API}/frequency-templates`);
      setFrequencyTemplates(res.data);
    } catch (error) {
      console.error('Failed to fetch frequency templates', error);
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

  const handleCreateOrUpdatePricing = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) {
      alert('Please select a customer first');
      return;
    }
    try {
      await axios.post(`${API}/customer-pricing`, {
        customer_id: selectedCustomer,
        sku_id: pricingForm.sku_id,
        custom_price: parseFloat(pricingForm.custom_price)
      });
      setShowPricingDialog(false);
      setPricingForm({ sku_id: '', custom_price: '' });
      fetchCustomerPricing(selectedCustomer);
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to save pricing');
    }
  };

  const handleDeletePricing = async (pricingId) => {
    if (!window.confirm('Are you sure you want to delete this custom pricing?')) return;
    try {
      await axios.delete(`${API}/customer-pricing/${pricingId}`);
      fetchCustomerPricing(selectedCustomer);
    } catch (error) {
      alert('Failed to delete pricing');
    }
  };

  const handleCreateOrUpdateTemplate = async (e) => {
    e.preventDefault();
    try {
      const templateData = {
        ...templateForm,
        frequency_value: parseInt(templateForm.frequency_value)
      };
      if (editingTemplate) {
        await axios.put(`${API}/frequency-templates/${editingTemplate.id}`, templateData);
      } else {
        await axios.post(`${API}/frequency-templates`, templateData);
      }
      setShowTemplateDialog(false);
      setTemplateForm({ name: '', frequency_type: 'daily', frequency_value: '1', description: '' });
      setEditingTemplate(null);
      fetchFrequencyTemplates();
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to save template');
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    try {
      await axios.delete(`${API}/frequency-templates/${templateId}`);
      fetchFrequencyTemplates();
    } catch (error) {
      alert('Failed to delete template');
    }
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setTemplateForm({
      name: template.name,
      frequency_type: template.frequency_type,
      frequency_value: template.frequency_value.toString(),
      description: template.description || ''
    });
    setShowTemplateDialog(true);
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
            SKU Management
          </button>
          <button
            onClick={() => setActiveTab('customer-pricing')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'customer-pricing'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            data-testid="customer-pricing-tab"
          >
            Customer Pricing
          </button>
          <button
            onClick={() => setActiveTab('frequency-templates')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'frequency-templates'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            data-testid="frequency-templates-tab"
          >
            Frequency Templates
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

        {/* Customer Pricing Tab */}
        {activeTab === 'customer-pricing' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer-Specific Pricing</h2>
              <div className="mb-4">
                <Label>Select Customer</Label>
                <Select value={selectedCustomer || ''} onValueChange={setSelectedCustomer}>
                  <SelectTrigger className="w-full max-w-md" data-testid="select-customer">
                    <SelectValue placeholder="Choose a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.full_name} ({customer.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedCustomer && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Custom Pricing for Selected Customer</h3>
                  <Dialog open={showPricingDialog} onOpenChange={setShowPricingDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-teal-500 hover:bg-teal-600" data-testid="add-pricing-btn">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Custom Price
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Set Custom Price for Customer</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCreateOrUpdatePricing} className="space-y-4">
                        <div>
                          <Label>Select SKU</Label>
                          <Select value={pricingForm.sku_id} onValueChange={(value) => setPricingForm({ ...pricingForm, sku_id: value })}>
                            <SelectTrigger data-testid="pricing-sku-select">
                              <SelectValue placeholder="Choose a SKU" />
                            </SelectTrigger>
                            <SelectContent>
                              {skus.map((sku) => (
                                <SelectItem key={sku.id} value={sku.id}>
                                  {sku.name} (Base: ${sku.price})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Custom Price ($)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={pricingForm.custom_price}
                            onChange={(e) => setPricingForm({ ...pricingForm, custom_price: e.target.value })}
                            required
                            data-testid="custom-price-input"
                          />
                        </div>
                        <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600" data-testid="pricing-submit-btn">
                          Set Custom Price
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {skusWithPricing.map((sku) => (
                    <Card key={sku.id} className="card-hover">
                      <CardHeader>
                        <CardTitle className="flex justify-between items-start">
                          <span>{sku.name}</span>
                          {sku.has_custom_pricing && (
                            <button
                              onClick={() => {
                                // Find the pricing ID from customer pricing list
                                const pricing = customerPricing.find(p => p.sku_id === sku.id);
                                if (pricing) handleDeletePricing(pricing.id);
                              }}
                              className="text-red-600 hover:text-red-800"
                              data-testid={`delete-pricing-${sku.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">Category: {sku.category}</p>
                          <div className="flex items-center gap-2">
                            {sku.has_custom_pricing ? (
                              <>
                                <p className="text-lg text-gray-400 line-through">${sku.price.toFixed(2)}</p>
                                <div className="flex items-center gap-1">
                                  <Tag className="w-4 h-4 text-teal-600" />
                                  <p className="text-2xl font-bold text-teal-600">${sku.customer_price.toFixed(2)}</p>
                                </div>
                              </>
                            ) : (
                              <p className="text-2xl font-bold text-gray-900">${sku.price.toFixed(2)}</p>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{sku.unit}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Frequency Templates Tab */}
        {activeTab === 'frequency-templates' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Frequency Templates</h2>
              <Dialog open={showTemplateDialog} onOpenChange={(open) => {
                setShowTemplateDialog(open);
                if (!open) {
                  setEditingTemplate(null);
                  setTemplateForm({ name: '', frequency_type: 'daily', frequency_value: '1', description: '' });
                }
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-teal-500 hover:bg-teal-600" data-testid="create-template-btn">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Template
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingTemplate ? 'Edit Template' : 'Create Frequency Template'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateOrUpdateTemplate} className="space-y-4">
                    <div>
                      <Label>Template Name</Label>
                      <Input
                        value={templateForm.name}
                        onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                        placeholder="e.g., Weekly Pickup"
                        required
                        data-testid="template-name-input"
                      />
                    </div>
                    <div>
                      <Label>Frequency Type</Label>
                      <Select value={templateForm.frequency_type} onValueChange={(value) => setTemplateForm({ ...templateForm, frequency_type: value })}>
                        <SelectTrigger data-testid="template-type-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Frequency Value</Label>
                      <Input
                        type="number"
                        min="1"
                        value={templateForm.frequency_value}
                        onChange={(e) => setTemplateForm({ ...templateForm, frequency_value: e.target.value })}
                        placeholder="e.g., 1 for every day, 2 for every 2 days"
                        required
                        data-testid="template-value-input"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {templateForm.frequency_type === 'daily' && `Every ${templateForm.frequency_value} day(s)`}
                        {templateForm.frequency_type === 'weekly' && `Every ${templateForm.frequency_value} week(s)`}
                        {templateForm.frequency_type === 'monthly' && `Every ${templateForm.frequency_value} month(s)`}
                      </p>
                    </div>
                    <div>
                      <Label>Description (Optional)</Label>
                      <Input
                        value={templateForm.description}
                        onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                        placeholder="Additional details"
                        data-testid="template-description-input"
                      />
                    </div>
                    <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600" data-testid="template-submit-btn">
                      {editingTemplate ? 'Update Template' : 'Create Template'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {frequencyTemplates.map((template) => (
                <Card key={template.id} className="card-hover">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      <span>{template.name}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditTemplate(template)}
                          className="text-teal-600 hover:text-teal-800"
                          data-testid={`edit-template-${template.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="text-red-600 hover:text-red-800"
                          data-testid={`delete-template-${template.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-teal-600" />
                        <p className="text-lg font-semibold text-gray-900">
                          Every {template.frequency_value} {template.frequency_type === 'daily' ? 'Day(s)' : template.frequency_type === 'weekly' ? 'Week(s)' : 'Month(s)'}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 capitalize">Type: {template.frequency_type}</p>
                      {template.description && (
                        <p className="text-sm text-gray-500 mt-2">{template.description}</p>
                      )}
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