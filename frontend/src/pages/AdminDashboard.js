import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import DashboardLayout from '../components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Package, Users, AlertCircle, Plus, Edit, Lock, Unlock, Repeat, Truck, MapPin, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

function AdminDashboard() {
  const { API, user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [cases, setCases] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [skus, setSkus] = useState([]);
  const [frequencyTemplates, setFrequencyTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState(null);
  
  // Loading states for operations
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [updatingCaseId, setUpdatingCaseId] = useState(null);
  const [updatingStatusOrderId, setUpdatingStatusOrderId] = useState(null);
  const [resettingPasswordUserId, setResettingPasswordUserId] = useState(null);
  
  // Password reset
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  
  // Order form
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [orderForm, setOrderForm] = useState({
    customer_id: '',
    customer_name: '',
    customer_email: '',
    items: [],
    pickup_date: '',
    delivery_date: '',
    pickup_address: '',
    delivery_address: '',
    special_instructions: '',
    is_recurring: false,
    frequency_template_id: ''
  });
  const [orderItems, setOrderItems] = useState([{ sku_id: '', sku_name: '', quantity: 1, price: 0 }]);
  
  // Case update
  const [selectedCase, setSelectedCase] = useState(null);
  const [showCaseDialog, setShowCaseDialog] = useState(false);
  const [caseUpdate, setCaseUpdate] = useState({ status: '', resolution: '', priority: '' });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'orders') {
        const [ordersRes, customersRes, skusRes, templatesRes] = await Promise.all([
          axios.get(`${API}/orders`),
          axios.get(`${API}/users`),
          axios.get(`${API}/skus`),
          axios.get(`${API}/frequency-templates`)
        ]);
        setOrders(ordersRes.data);
        setCustomers(customersRes.data.filter(u => u.role === 'customer'));
        setSkus(skusRes.data);
        setFrequencyTemplates(templatesRes.data);
      } else if (activeTab === 'cases') {
        const casesRes = await axios.get(`${API}/cases`);
        setCases(casesRes.data);
      } else if (activeTab === 'users') {
        const usersRes = await axios.get(`${API}/users`);
        setCustomers(usersRes.data);
      } else if (activeTab === 'delivery-tracking') {
        const ordersRes = await axios.get(`${API}/orders`);
        setOrders(ordersRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (creatingOrder || editingOrderId) return; // Prevent duplicate submissions
    
    try {
      if (isEditMode && editingOrder) {
        setEditingOrderId(editingOrder.id);
      } else {
        setCreatingOrder(true);
      }
      
      const customer = customers.find(c => c.id === orderForm.customer_id);
      const formData = {
        ...orderForm,
        customer_name: customer.full_name,
        customer_email: customer.email,
        items: orderItems.map(item => {
          const sku = skus.find(s => s.id === item.sku_id);
          return {
            sku_id: item.sku_id,
            sku_name: sku.name,
            quantity: parseInt(item.quantity),
            price: sku.price
          };
        })
      };
      
      // Include recurring data only if is_recurring is true
      if (formData.is_recurring && formData.frequency_template_id) {
        const template = frequencyTemplates.find(t => t.id === formData.frequency_template_id);
        formData.recurrence_pattern = {
          frequency_type: template.frequency_type,
          frequency_value: template.frequency_value
        };
      }
      
      if (isEditMode && editingOrder) {
        await axios.put(`${API}/orders/${editingOrder.id}`, formData);
      } else {
        await axios.post(`${API}/orders`, formData);
      }
      
      setShowOrderDialog(false);
      setIsEditMode(false);
      setEditingOrder(null);
      setOrderForm({
        customer_id: '',
        customer_name: '',
        customer_email: '',
        items: [],
        pickup_date: '',
        delivery_date: '',
        pickup_address: '',
        delivery_address: '',
        special_instructions: '',
        is_recurring: false,
        frequency_template_id: ''
      });
      setOrderItems([{ sku_id: '', sku_name: '', quantity: 1, price: 0 }]);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.detail || `Failed to ${isEditMode ? 'update' : 'create'} order`);
    } finally {
      setCreatingOrder(false);
      setEditingOrderId(null);
    }
  };

  const handleEditOrder = (order) => {
    setIsEditMode(true);
    setEditingOrder(order);
    setOrderForm({
      customer_id: order.customer_id,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      pickup_date: order.pickup_date.slice(0, 16),
      delivery_date: order.delivery_date.slice(0, 16),
      pickup_address: order.pickup_address,
      delivery_address: order.delivery_address,
      special_instructions: order.special_instructions || '',
      is_recurring: order.is_recurring || false,
      frequency_template_id: order.frequency_template_id || ''
    });
    setOrderItems(order.items.map(item => ({
      sku_id: item.sku_id,
      sku_name: item.sku_name,
      quantity: item.quantity,
      price: item.price
    })));
    setShowOrderDialog(true);
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    if (deletingOrderId) return; // Prevent duplicate deletions
    
    try {
      setDeletingOrderId(orderId);
      await axios.delete(`${API}/orders/${orderId}`);
      fetchData();
    } catch (error) {
      alert('Failed to delete order');
    } finally {
      setDeletingOrderId(null);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    if (updatingStatusOrderId) return; // Prevent duplicate updates
    
    try {
      setUpdatingStatusOrderId(orderId);
      await axios.put(`${API}/orders/${orderId}`, { status: newStatus });
      fetchData();
    } catch (error) {
      alert('Failed to update order status');
    } finally {
      setUpdatingStatusOrderId(null);
    }
  };

  const handleUpdateCase = async (e) => {
    e.preventDefault();
    if (updatingCaseId) return; // Prevent duplicate submissions
    
    try {
      setUpdatingCaseId(selectedCase.id);
      await axios.put(`${API}/cases/${selectedCase.id}`, caseUpdate);
      setShowCaseDialog(false);
      setSelectedCase(null);
      setCaseUpdate({ status: '', resolution: '', priority: '' });
      fetchData();
    } catch (error) {
      alert('Failed to update case');
    } finally {
      setUpdatingCaseId(null);
    }
  };

  const addOrderItem = () => {
    setOrderItems([...orderItems, { sku_id: '', sku_name: '', quantity: 1, price: 0 }]);
  };

  const removeOrderItem = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const updateOrderItem = (index, field, value) => {
    const newItems = [...orderItems];
    newItems[index][field] = value;
    setOrderItems(newItems);
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'pending': return 'badge-pending';
      case 'processing': return 'badge-processing';
      case 'completed': return 'badge-completed';
      case 'cancelled': return 'badge-cancelled';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    if (!window.confirm(`Are you sure you want to reset the password for ${selectedUser?.full_name}?`)) {
      return;
    }
    
    setResettingPasswordUserId(selectedUser.id);
    try {
      await axios.put(`${API}/admin/reset-password/${selectedUser.id}`, {
        new_password: newPassword
      });
      toast.success('Password reset successfully');
      setShowPasswordDialog(false);
      setSelectedUser(null);
      setNewPassword('');
    } catch (error) {
      console.error('Failed to reset password:', error);
      toast.error(error.response?.data?.detail || 'Failed to reset password');
    } finally {
      setResettingPasswordUserId(null);
    }
  };

  const openPasswordResetDialog = (user) => {
    setSelectedUser(user);
    setNewPassword('');
    setShowPasswordDialog(true);
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
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'orders'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            data-testid="orders-tab"
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('cases')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'cases'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            data-testid="cases-tab"
          >
            Cases
          </button>
          <button
            onClick={() => setActiveTab('delivery-tracking')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'delivery-tracking'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            data-testid="delivery-tracking-tab"
          >
            Delivery Tracking
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
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
              <Dialog open={showOrderDialog} onOpenChange={(open) => {
                setShowOrderDialog(open);
                if (!open) {
                  setIsEditMode(false);
                  setEditingOrder(null);
                  setOrderForm({
                    customer_id: '',
                    customer_name: '',
                    customer_email: '',
                    items: [],
                    pickup_date: '',
                    delivery_date: '',
                    pickup_address: '',
                    delivery_address: '',
                    special_instructions: '',
                    is_recurring: false,
                    frequency_template_id: ''
                  });
                  setOrderItems([{ sku_id: '', sku_name: '', quantity: 1, price: 0 }]);
                }
              }}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-teal-500 hover:bg-teal-600" 
                    onClick={() => {
                      setIsEditMode(false);
                      setEditingOrder(null);
                    }}
                    data-testid="create-order-btn"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Order
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Edit Order' : 'Create New Order'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateOrder} className="space-y-4">
                    <div>
                      <Label>Customer</Label>
                      <Select value={orderForm.customer_id} onValueChange={(value) => setOrderForm({ ...orderForm, customer_id: value })} required>
                        <SelectTrigger data-testid="order-customer-select">
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map(customer => (
                            <SelectItem key={customer.id} value={customer.id}>{customer.full_name} ({customer.email})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Order Items</Label>
                      {orderItems.map((item, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <Select value={item.sku_id} onValueChange={(value) => updateOrderItem(index, 'sku_id', value)} required>
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Select item" />
                            </SelectTrigger>
                            <SelectContent>
                              {skus.map(sku => (
                                <SelectItem key={sku.id} value={sku.id}>{sku.name} (${sku.price})</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateOrderItem(index, 'quantity', e.target.value)}
                            className="w-20"
                            placeholder="Qty"
                            required
                          />
                          {orderItems.length > 1 && (
                            <Button type="button" variant="destructive" onClick={() => removeOrderItem(index)}>Remove</Button>
                          )}
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={addOrderItem} className="mt-2">Add Item</Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Pickup Date</Label>
                        <Input type="datetime-local" value={orderForm.pickup_date} onChange={(e) => setOrderForm({ ...orderForm, pickup_date: e.target.value })} required data-testid="order-pickup-date" />
                      </div>
                      <div>
                        <Label>Delivery Date</Label>
                        <Input type="datetime-local" value={orderForm.delivery_date} onChange={(e) => setOrderForm({ ...orderForm, delivery_date: e.target.value })} required data-testid="order-delivery-date" />
                      </div>
                    </div>

                    <div>
                      <Label>Pickup Address</Label>
                      <Input value={orderForm.pickup_address} onChange={(e) => setOrderForm({ ...orderForm, pickup_address: e.target.value })} required data-testid="order-pickup-address" />
                    </div>

                    <div>
                      <Label>Delivery Address</Label>
                      <Input value={orderForm.delivery_address} onChange={(e) => setOrderForm({ ...orderForm, delivery_address: e.target.value })} required data-testid="order-delivery-address" />
                    </div>

                    <div>
                      <Label>Special Instructions</Label>
                      <Textarea value={orderForm.special_instructions} onChange={(e) => setOrderForm({ ...orderForm, special_instructions: e.target.value })} data-testid="order-instructions" />
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <Switch
                          checked={orderForm.is_recurring}
                          onCheckedChange={(checked) => setOrderForm({ ...orderForm, is_recurring: checked })}
                          data-testid="recurring-switch"
                        />
                        <Label className="flex items-center gap-2 cursor-pointer">
                          <Repeat className="w-4 h-4 text-teal-600" />
                          Make this a recurring order
                        </Label>
                      </div>
                      
                      {orderForm.is_recurring && (
                        <div>
                          <Label>Select Frequency Template</Label>
                          <Select 
                            value={orderForm.frequency_template_id} 
                            onValueChange={(value) => setOrderForm({ ...orderForm, frequency_template_id: value })}
                          >
                            <SelectTrigger data-testid="frequency-template-select">
                              <SelectValue placeholder="Choose recurring frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              {frequencyTemplates.map((template) => (
                                <SelectItem key={template.id} value={template.id}>
                                  {template.name} - Every {template.frequency_value} {template.frequency_type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-500 mt-2">
                            This order will automatically repeat based on the selected frequency
                          </p>
                        </div>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-teal-500 hover:bg-teal-600" 
                      disabled={creatingOrder || editingOrderId !== null}
                      data-testid="order-submit-btn"
                    >
                      {creatingOrder || editingOrderId ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          {isEditMode ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        isEditMode ? 'Update Order' : 'Create Order'
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4" data-testid="orders-list">
              {orders.map((order) => (
                <Card key={order.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{order.order_number}</h3>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                            {order.status}
                          </span>
                          {order.is_recurring && (
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 flex items-center gap-1">
                              <Repeat className="w-3 h-3" />
                              Recurring
                            </span>
                          )}
                          {order.is_locked ? (
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              Locked
                            </span>
                          ) : (
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 flex items-center gap-1">
                              <Unlock className="w-3 h-3" />
                              Editable
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{order.customer_name} - {order.customer_email}</p>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Pickup: {new Date(order.pickup_date).toLocaleString()}</p>
                            <p className="text-gray-500">From: {order.pickup_address}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Delivery: {new Date(order.delivery_date).toLocaleString()}</p>
                            <p className="text-gray-500">To: {order.delivery_address}</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="font-semibold text-gray-700">Items:</p>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {order.items.map((item, idx) => (
                              <li key={idx}>{item.sku_name} x{item.quantity} - ${(item.price * item.quantity).toFixed(2)}</li>
                            ))}
                          </ul>
                          <p className="mt-2 text-lg font-bold text-teal-600">Total: ${order.total_amount.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Select 
                          value={order.status} 
                          onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                          disabled={updatingStatusOrderId === order.id}
                        >
                          <SelectTrigger className="w-40">
                            {updatingStatusOrderId === order.id ? (
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-2 animate-spin" />
                                Updating...
                              </span>
                            ) : (
                              <SelectValue />
                            )}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {!order.is_locked && (
                          <div className="flex gap-2 mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditOrder(order)}
                              disabled={editingOrderId === order.id}
                              className="flex-1 border-teal-300 text-teal-600 hover:bg-teal-50 hover:text-teal-700"
                            >
                              {editingOrderId === order.id ? (
                                <>
                                  <Clock className="w-4 h-4 mr-1 animate-spin" />
                                  Editing...
                                </>
                              ) : (
                                <>
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteOrder(order.id)}
                              disabled={deletingOrderId === order.id}
                              className="flex-1 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              {deletingOrderId === order.id ? (
                                <>
                                  <Clock className="w-4 h-4 mr-1 animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                'Delete'
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {orders.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No orders found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Cases Tab */}
        {activeTab === 'cases' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Case Management</h2>
            <div className="grid gap-4" data-testid="cases-list">
              {cases.map((caseItem) => (
                <Card key={caseItem.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{caseItem.case_number}</h3>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            caseItem.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                            caseItem.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {caseItem.status}
                          </span>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            caseItem.priority === 'high' ? 'bg-red-100 text-red-800' :
                            caseItem.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {caseItem.priority}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{caseItem.customer_name} - {caseItem.customer_email}</p>
                        <p className="font-semibold text-gray-700">{caseItem.subject}</p>
                        <p className="text-sm text-gray-600 mt-2">{caseItem.description}</p>
                        {caseItem.resolution && (
                          <div className="mt-3 p-3 bg-green-50 rounded-lg">
                            <p className="text-sm font-semibold text-green-800">Resolution:</p>
                            <p className="text-sm text-green-700">{caseItem.resolution}</p>
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={() => {
                          setSelectedCase(caseItem);
                          setCaseUpdate({
                            status: caseItem.status,
                            resolution: caseItem.resolution || '',
                            priority: caseItem.priority
                          });
                          setShowCaseDialog(true);
                        }}
                        className="bg-teal-500 hover:bg-teal-600"
                        data-testid={`update-case-${caseItem.id}`}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Update
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {cases.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No cases found</p>
                  </CardContent>
                </Card>
              )}
            </div>

            <Dialog open={showCaseDialog} onOpenChange={setShowCaseDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Case</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdateCase} className="space-y-4">
                  <div>
                    <Label>Status</Label>
                    <Select value={caseUpdate.status} onValueChange={(value) => setCaseUpdate({ ...caseUpdate, status: value })}>
                      <SelectTrigger data-testid="case-status-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select value={caseUpdate.priority} onValueChange={(value) => setCaseUpdate({ ...caseUpdate, priority: value })}>
                      <SelectTrigger data-testid="case-priority-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Resolution</Label>
                    <Textarea value={caseUpdate.resolution} onChange={(e) => setCaseUpdate({ ...caseUpdate, resolution: e.target.value })} rows={4} data-testid="case-resolution-input" />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-teal-500 hover:bg-teal-600" 
                    disabled={updatingCaseId !== null}
                    data-testid="case-update-submit-btn"
                  >
                    {updatingCaseId ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Case'
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Delivery Tracking Tab */}
        {activeTab === 'delivery-tracking' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Delivery Tracking</h2>
              <p className="text-gray-600 mt-1">Track delivery progress and view detailed timeline with driver information</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Orders List */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Orders with Delivery</CardTitle>
                </CardHeader>
                <CardContent className="max-h-[600px] overflow-y-auto">
                  {orders.filter(o => o.driver_id).length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Truck className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No orders with assigned drivers</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {orders.filter(o => o.driver_id).map((order) => (
                        <div
                          key={order.id}
                          onClick={() => setSelectedOrderForTracking(order)}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedOrderForTracking?.id === order.id
                              ? 'border-teal-500 bg-teal-50'
                              : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-sm">{order.order_number}</p>
                              <p className="text-xs text-gray-600">{order.customer_name}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              order.delivery_status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.delivery_status === 'out_for_delivery' ? 'bg-orange-100 text-orange-800' :
                              order.delivery_status === 'picked_up' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.delivery_status?.replace(/_/g, ' ') || 'assigned'}
                            </span>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            <p><strong>Driver:</strong> {order.driver_name || 'Not assigned'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Delivery Details */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Delivery Timeline & Driver Info</CardTitle>
                </CardHeader>
                <CardContent>
                  {!selectedOrderForTracking ? (
                    <div className="text-center py-16 text-gray-500">
                      <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Select an order to view delivery details</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Order Info */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-600">Order Number</p>
                            <p className="font-semibold">{selectedOrderForTracking.order_number}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Customer</p>
                            <p className="font-semibold">{selectedOrderForTracking.customer_name}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Driver Assigned</p>
                            <p className="font-semibold text-teal-600">{selectedOrderForTracking.driver_name || 'Not assigned'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Current Status</p>
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              selectedOrderForTracking.delivery_status === 'delivered' ? 'bg-green-100 text-green-800' :
                              selectedOrderForTracking.delivery_status === 'out_for_delivery' ? 'bg-orange-100 text-orange-800' :
                              selectedOrderForTracking.delivery_status === 'picked_up' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {selectedOrderForTracking.delivery_status?.replace(/_/g, ' ').toUpperCase() || 'ASSIGNED'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Addresses */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border border-gray-200 p-4 rounded-lg">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Pickup Address</p>
                              <p className="text-sm font-medium">{selectedOrderForTracking.pickup_address}</p>
                              <p className="text-xs text-gray-500 mt-1">Date: {new Date(selectedOrderForTracking.pickup_date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        <div className="border border-gray-200 p-4 rounded-lg">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-5 h-5 text-green-600 mt-1" />
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Delivery Address</p>
                              <p className="text-sm font-medium">{selectedOrderForTracking.delivery_address}</p>
                              <p className="text-xs text-gray-500 mt-1">Date: {new Date(selectedOrderForTracking.delivery_date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Delivery Progress</h3>
                        <div className="space-y-4">
                          {/* Assigned */}
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                selectedOrderForTracking.assigned_at ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-400'
                              }`}>
                                <Clock className="w-5 h-5" />
                              </div>
                              {selectedOrderForTracking.assigned_at && <div className="w-0.5 h-16 bg-teal-500 mt-2"></div>}
                            </div>
                            <div className="flex-1 pt-2">
                              <p className="font-semibold text-gray-900">Assigned to Driver</p>
                              {selectedOrderForTracking.assigned_at ? (
                                <>
                                  <p className="text-sm text-gray-600">
                                    {new Date(selectedOrderForTracking.assigned_at).toLocaleString()}
                                  </p>
                                  <p className="text-sm text-teal-600 mt-1">
                                    Driver: {selectedOrderForTracking.driver_name}
                                  </p>
                                </>
                              ) : (
                                <p className="text-sm text-gray-400">Not assigned yet</p>
                              )}
                            </div>
                          </div>

                          {/* Picked Up */}
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                selectedOrderForTracking.picked_up_at ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-400'
                              }`}>
                                <Package className="w-5 h-5" />
                              </div>
                              {selectedOrderForTracking.picked_up_at && <div className="w-0.5 h-16 bg-yellow-500 mt-2"></div>}
                            </div>
                            <div className="flex-1 pt-2">
                              <p className="font-semibold text-gray-900">Picked Up</p>
                              {selectedOrderForTracking.picked_up_at ? (
                                <p className="text-sm text-gray-600">
                                  {new Date(selectedOrderForTracking.picked_up_at).toLocaleString()}
                                </p>
                              ) : (
                                <p className="text-sm text-gray-400">Not picked up yet</p>
                              )}
                            </div>
                          </div>

                          {/* Out for Delivery */}
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                selectedOrderForTracking.delivery_status === 'out_for_delivery' || selectedOrderForTracking.delivery_status === 'delivered' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'
                              }`}>
                                <Truck className="w-5 h-5" />
                              </div>
                              {(selectedOrderForTracking.delivery_status === 'out_for_delivery' || selectedOrderForTracking.delivery_status === 'delivered') && <div className="w-0.5 h-16 bg-orange-500 mt-2"></div>}
                            </div>
                            <div className="flex-1 pt-2">
                              <p className="font-semibold text-gray-900">Out for Delivery</p>
                              {selectedOrderForTracking.delivery_status === 'out_for_delivery' || selectedOrderForTracking.delivery_status === 'delivered' ? (
                                <p className="text-sm text-gray-600">In transit</p>
                              ) : (
                                <p className="text-sm text-gray-400">Not started yet</p>
                              )}
                            </div>
                          </div>

                          {/* Delivered */}
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                selectedOrderForTracking.delivered_at ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                              }`}>
                                <CheckCircle className="w-5 h-5" />
                              </div>
                            </div>
                            <div className="flex-1 pt-2">
                              <p className="font-semibold text-gray-900">Delivered</p>
                              {selectedOrderForTracking.delivered_at ? (
                                <p className="text-sm text-gray-600">
                                  {new Date(selectedOrderForTracking.delivered_at).toLocaleString()}
                                </p>
                              ) : (
                                <p className="text-sm text-gray-400">Not delivered yet</p>
                              )}
                              {selectedOrderForTracking.delivery_notes && (
                                <p className="text-sm text-gray-600 mt-2 italic bg-gray-50 p-2 rounded">
                                  Note: {selectedOrderForTracking.delivery_notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                        <div className="space-y-2">
                          {selectedOrderForTracking.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between bg-gray-50 p-3 rounded">
                              <span className="text-sm">{item.sku_name || item.sku_id}</span>
                              <div className="text-sm text-gray-600">
                                <span>Qty: {item.quantity}</span>
                                {item.price && <span className="ml-4 font-medium">${(item.price * item.quantity).toFixed(2)}</span>}
                              </div>
                            </div>
                          ))}
                          {selectedOrderForTracking.total_amount && (
                            <div className="flex justify-between pt-2 border-t font-semibold text-teal-600">
                              <span>Total Amount:</span>
                              <span>${selectedOrderForTracking.total_amount.toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
            </div>
            
            <div className="grid gap-4">
              {customers.map((customer) => (
                <Card key={customer.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold text-gray-900">{customer.full_name}</h3>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            customer.role === 'owner' ? 'bg-purple-100 text-purple-800' :
                            customer.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                            customer.role === 'driver' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {customer.role.charAt(0).toUpperCase() + customer.role.slice(1)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-gray-600">Email</p>
                            <p className="font-medium text-gray-900">{customer.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Phone</p>
                            <p className="font-medium text-gray-900">{customer.phone || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">User ID</p>
                            <p className="font-mono text-xs text-gray-600">{customer.id}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Created</p>
                            <p className="font-medium text-gray-900">
                              {new Date(customer.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => openPasswordResetDialog(customer)}
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          disabled={resettingPasswordUserId === customer.id}
                        >
                          {resettingPasswordUserId === customer.id ? (
                            <>
                              <Clock className="w-4 h-4 mr-1 animate-spin" />
                              Resetting...
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4 mr-1" />
                              Reset Password
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Password Reset Dialog */}
            <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset Password</DialogTitle>
                </DialogHeader>
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div>
                    <Label className="text-gray-700">User</Label>
                    <p className="text-lg font-semibold text-gray-900">{selectedUser?.full_name}</p>
                    <p className="text-sm text-gray-600">{selectedUser?.email}</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="text"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 6 characters)"
                      required
                      minLength={6}
                      autoComplete="off"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Password must be at least 6 characters long
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Warning:</strong> This will immediately change the user's password. 
                      The user will need to use this new password to log in.
                    </p>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowPasswordDialog(false)}
                      disabled={resettingPasswordUserId}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={resettingPasswordUserId}
                    >
                      {resettingPasswordUserId ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Resetting...
                        </>
                      ) : (
                        'Reset Password'
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;