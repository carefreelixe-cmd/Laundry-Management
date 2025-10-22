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
import { Package, AlertCircle, Plus, MapPin, Calendar, Lock, Unlock, Repeat, Edit, Truck, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

function CustomerDashboard() {
  const { API, user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [cases, setCases] = useState([]);
  const [skus, setSkus] = useState([]);
  const [frequencyTemplates, setFrequencyTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState(null);
  
  // Order form
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [orderForm, setOrderForm] = useState({
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
  
  // Case form
  const [showCaseDialog, setShowCaseDialog] = useState(false);
  const [caseForm, setCaseForm] = useState({
    type: 'inquiry',
    subject: '',
    description: '',
    order_id: '',
    priority: 'medium'
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'orders') {
        const [ordersRes, skusRes, templatesRes] = await Promise.all([
          axios.get(`${API}/orders`),
          axios.get(`${API}/skus-with-pricing/${user.id}`),
          axios.get(`${API}/frequency-templates`)
        ]);
        setOrders(ordersRes.data);
        // Filter to show only SKUs with custom pricing (starred items)
        const skusWithCustomPricing = skusRes.data.filter(sku => sku.has_custom_pricing);
        setSkus(skusWithCustomPricing);
        setFrequencyTemplates(templatesRes.data);
      } else if (activeTab === 'cases') {
        const casesRes = await axios.get(`${API}/cases`);
        setCases(casesRes.data);
      } else if (activeTab === 'delivery-tracking') {
        const ordersRes = await axios.get(`${API}/orders`);
        // Filter orders that have drivers assigned
        const ordersWithDrivers = ordersRes.data.filter(order => order.driver_id);
        setOrders(ordersWithDrivers);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (submitting) return; // Prevent duplicate submissions
    
    setSubmitting(true);
    try {
      const formData = {
        ...orderForm,
        items: orderItems.map(item => {
          const sku = skus.find(s => s.id === item.sku_id);
          return {
            sku_id: item.sku_id,
            sku_name: sku.name,
            quantity: parseInt(item.quantity),
            price: sku.customer_price // All SKUs shown have custom pricing
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
      
      await axios.post(`${API}/orders/customer`, formData);
      setShowOrderDialog(false);
      setOrderForm({
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
      toast.success('Order created successfully!');
      fetchData();
    } catch (error) {
      console.error('Failed to create order:', error);
      toast.error(error.response?.data?.detail || 'Failed to create order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditOrder = (order) => {
    setEditingOrderId(order.id);
    setOrderForm({
      pickup_date: order.pickup_date,
      delivery_date: order.delivery_date,
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

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    if (submitting) return; // Prevent duplicate submissions
    
    setSubmitting(true);
    try {
      const formData = {
        pickup_date: orderForm.pickup_date,
        delivery_date: orderForm.delivery_date,
        pickup_address: orderForm.pickup_address,
        delivery_address: orderForm.delivery_address,
        special_instructions: orderForm.special_instructions,
        items: orderItems.map(item => {
          const sku = skus.find(s => s.id === item.sku_id);
          return {
            sku_id: item.sku_id,
            sku_name: sku.name,
            quantity: parseInt(item.quantity),
            price: sku.customer_price
          };
        }),
        is_recurring: orderForm.is_recurring
      };
      
      // Include recurring data if enabled
      if (formData.is_recurring && orderForm.frequency_template_id) {
        const template = frequencyTemplates.find(t => t.id === orderForm.frequency_template_id);
        if (template) {
          formData.frequency_template_id = template.id;
          formData.recurrence_pattern = {
            frequency_type: template.frequency_type,
            frequency_value: template.frequency_value
          };
        }
      }
      
      await axios.put(`${API}/orders/${editingOrderId}`, formData);
      setShowOrderDialog(false);
      setEditingOrderId(null);
      setOrderForm({
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
      toast.success('Order updated successfully!');
      fetchData();
    } catch (error) {
      console.error('Failed to update order:', error);
      toast.error(error.response?.data?.detail || 'Failed to update order. This order may be locked.');
    } finally {
      setSubmitting(false); // Reset submitting state
    }
  };

  const handleCreateCase = async (e) => {
    e.preventDefault();
    if (submitting) return; // Prevent duplicate submissions
    
    setSubmitting(true);
    try {
      const caseData = {
        ...caseForm,
        customer_id: user.id,
        customer_name: user.full_name,
        customer_email: user.email
      };
      await axios.post(`${API}/cases`, caseData);
      setShowCaseDialog(false);
      setCaseForm({
        type: 'inquiry',
        subject: '',
        description: '',
        order_id: '',
        priority: 'medium'
      });
      toast.success('Case submitted successfully!');
      fetchData();
    } catch (error) {
      console.error('Failed to create case:', error);
      toast.error(error.response?.data?.detail || 'Failed to create case. Please try again.');
    } finally {
      setSubmitting(false);
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

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    if (cancellingOrderId) return; // Prevent duplicate submissions
    
    setCancellingOrderId(orderId);
    try {
      await axios.delete(`${API}/orders/${orderId}`);
      toast.success('Order cancelled successfully!');
      fetchData();
    } catch (error) {
      console.error('Failed to cancel order:', error);
      toast.error(error.response?.data?.detail || 'Failed to cancel order');
    } finally {
      setCancellingOrderId(null);
    }
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

  const canModifyOrder = (createdAt) => {
    if (!createdAt) return false;
    
    const created = new Date(createdAt);
    const now = new Date();
    
    // Check if date is valid
    if (isNaN(created.getTime())) {
      console.error('Invalid created_at date:', createdAt);
      return false;
    }
    
    const hoursSinceCreation = (now - created) / (1000 * 60 * 60);
    console.log('Hours since creation:', hoursSinceCreation, 'Can edit:', hoursSinceCreation < 8);
    
    return hoursSinceCreation < 8;
  };

  const formatFrequency = (template) => {
    const { frequency_type, frequency_value } = template;
    
    // Handle common cases with friendly names
    if (frequency_value === 1) {
      if (frequency_type === 'daily') return 'Daily';
      if (frequency_type === 'weekly') return 'Weekly';
      if (frequency_type === 'monthly') return 'Monthly';
    }
    
    if (frequency_value === 2 && frequency_type === 'weekly') return 'Bi-weekly';
    if (frequency_value === 2 && frequency_type === 'monthly') return 'Bi-monthly';
    
    // Default format for other cases
    const typeLabel = frequency_type === 'daily' ? 'day(s)' : 
                     frequency_type === 'weekly' ? 'week(s)' : 'month(s)';
    return `Every ${frequency_value} ${typeLabel}`;
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
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <div className="text-right">
            <p className="text-sm text-gray-600">Welcome back,</p>
            <p className="text-lg font-semibold text-gray-900">{user?.full_name}</p>
          </div>
        </div>

        {/* No Pricing Warning */}
        {skus.length === 0 && (
          <Card className="border-yellow-300 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900">No Pricing Configured</h3>
                  <p className="text-sm text-yellow-800 mt-1">
                    You don't have any custom pricing set up yet. Please contact your administrator to configure pricing for your account before placing orders.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
              <Package className="w-5 h-5 text-teal-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900" data-testid="customer-total-orders">{orders.length}</div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Orders</CardTitle>
              <Package className="w-5 h-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900" data-testid="customer-active-orders">
                {orders.filter(o => ['pending', 'processing'].includes(o.status)).length}
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Open Cases</CardTitle>
              <AlertCircle className="w-5 h-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900" data-testid="customer-open-cases">
                {cases.filter(c => ['open', 'in_progress'].includes(c.status)).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'orders'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            data-testid="customer-orders-tab"
          >
            My Orders
          </button>
          <button
            onClick={() => setActiveTab('cases')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'cases'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            data-testid="customer-cases-tab"
          >
            My Cases
          </button>
          <button
            onClick={() => setActiveTab('delivery-tracking')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'delivery-tracking'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            data-testid="customer-delivery-tracking-tab"
          >
            Delivery Tracking
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
              <Dialog open={showOrderDialog} onOpenChange={(open) => {
                setShowOrderDialog(open);
                if (!open) {
                  setEditingOrderId(null);
                  setOrderForm({
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
                  <Button className="bg-teal-500 hover:bg-teal-600" data-testid="customer-create-order-btn" onClick={() => setEditingOrderId(null)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Order
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingOrderId ? 'Edit Order' : 'Create New Order'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={editingOrderId ? handleUpdateOrder : handleCreateOrder} className="space-y-4">
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
                                <SelectItem key={sku.id} value={sku.id}>
                                  {sku.name} (${sku.customer_price.toFixed(2)} Ex GST)
                                </SelectItem>
                              ))}
                              {skus.length === 0 && (
                                <div className="p-2 text-sm text-gray-500 text-center">
                                  No items available. Contact admin to set up pricing.
                                </div>
                              )}
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
                        <Input type="datetime-local" value={orderForm.pickup_date} onChange={(e) => setOrderForm({ ...orderForm, pickup_date: e.target.value })} required data-testid="customer-pickup-date" />
                      </div>
                      <div>
                        <Label>Delivery Date</Label>
                        <Input type="datetime-local" value={orderForm.delivery_date} onChange={(e) => setOrderForm({ ...orderForm, delivery_date: e.target.value })} required data-testid="customer-delivery-date" />
                      </div>
                    </div>

                    <div>
                      <Label>Pickup Address</Label>
                      <Input value={orderForm.pickup_address} onChange={(e) => setOrderForm({ ...orderForm, pickup_address: e.target.value })} required data-testid="customer-pickup-address" />
                    </div>

                    <div>
                      <Label>Delivery Address</Label>
                      <Input value={orderForm.delivery_address} onChange={(e) => setOrderForm({ ...orderForm, delivery_address: e.target.value })} required data-testid="customer-delivery-address" />
                    </div>

                    <div>
                      <Label>Special Instructions</Label>
                      <Textarea value={orderForm.special_instructions} onChange={(e) => setOrderForm({ ...orderForm, special_instructions: e.target.value })} data-testid="customer-instructions" />
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={orderForm.is_recurring}
                          onCheckedChange={(checked) => setOrderForm({ ...orderForm, is_recurring: checked })}
                          data-testid="customer-recurring-switch"
                          disabled={editingOrderId && !canModifyOrder(orders.find(o => o.id === editingOrderId)?.created_at)}
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
                            disabled={editingOrderId && !canModifyOrder(orders.find(o => o.id === editingOrderId)?.created_at)}
                          >
                            <SelectTrigger data-testid="customer-frequency-template-select">
                              <SelectValue placeholder="Choose recurring frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              {frequencyTemplates.map((template) => (
                                <SelectItem key={template.id} value={template.id}>
                                  {template.name} - {formatFrequency(template)}
                                </SelectItem>
                              ))}
                              {frequencyTemplates.length === 0 && (
                                <div className="p-2 text-sm text-gray-500 text-center">
                                  No frequency templates available
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-500 mt-2">
                            This order will automatically repeat based on the selected frequency
                          </p>
                        </div>
                      )}
                    </div>

                    <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600" disabled={submitting} data-testid="customer-order-submit-btn">
                      {submitting ? 'Processing...' : (editingOrderId ? 'Update Order' : 'Create Order')}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid gap-4" data-testid="customer-orders-list">
              {orders.map((order) => (
                <Card key={order.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
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
                        <p className="text-sm text-gray-500">
                          Created: {new Date(order.created_at).toLocaleDateString()}
                        </p>
                        {order.is_recurring && order.next_occurrence_date && (
                          <p className="text-sm text-purple-600 font-medium">
                            Next occurrence: {new Date(order.next_occurrence_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      {order.status !== 'completed' && order.status !== 'cancelled' && canModifyOrder(order.created_at) && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditOrder(order)}
                            data-testid={`edit-order-${order.id}`}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit Order
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={cancellingOrderId === order.id}
                            data-testid={`cancel-order-${order.id}`}
                          >
                            {cancellingOrderId === order.id ? (
                              <>
                                <Clock className="w-4 h-4 mr-1 animate-spin" />
                                Cancelling...
                              </>
                            ) : (
                              'Cancel Order'
                            )}
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700">Pickup</p>
                          <p className="text-sm text-gray-600">{new Date(order.pickup_date).toLocaleString()}</p>
                          <p className="text-sm text-gray-600">{order.pickup_address}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700">Delivery</p>
                          <p className="text-sm text-gray-600">{new Date(order.delivery_date).toLocaleString()}</p>
                          <p className="text-sm text-gray-600">{order.delivery_address}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <p className="font-semibold text-gray-700 mb-2">Order Items:</p>
                      <ul className="space-y-1">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-600">{item.sku_name} x{item.quantity}</span>
                            <span className="text-gray-900 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 pt-3 border-t space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal (Ex GST)</span>
                          <span className="text-gray-900">${(order.total_amount / 1.1).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">GST (10%)</span>
                          <span className="text-gray-900">${(order.total_amount - (order.total_amount / 1.1)).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="text-lg font-bold text-gray-900">Total (Inc GST)</span>
                          <span className="text-2xl font-bold text-teal-600">${order.total_amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {order.special_instructions && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-semibold text-gray-700">Special Instructions:</p>
                        <p className="text-sm text-gray-600">{order.special_instructions}</p>
                      </div>
                    )}

                    {order.status !== 'completed' && order.status !== 'cancelled' && !canModifyOrder(order.created_at) && (
                      <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-yellow-800">⚠️ This order cannot be modified (locked after 8 hours from creation)</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              {orders.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No orders found</p>
                    <p className="text-sm text-gray-500 mt-2">Click "Create Order" to place your first order</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Cases Tab */}
        {activeTab === 'cases' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Cases</h2>
              <Dialog open={showCaseDialog} onOpenChange={setShowCaseDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-teal-500 hover:bg-teal-600" data-testid="create-case-btn">
                    <Plus className="w-4 h-4 mr-2" />
                    Raise a Case
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Raise a New Case</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateCase} className="space-y-4">
                    <div>
                      <Label>Case Type</Label>
                      <Select value={caseForm.type} onValueChange={(value) => setCaseForm({ ...caseForm, type: value })}>
                        <SelectTrigger data-testid="case-type-select">
                          <SelectValue placeholder="Select case type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inquiry">General Inquiry</SelectItem>
                          <SelectItem value="complaint">Complaint</SelectItem>
                          <SelectItem value="refund">Refund Request</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Related Order (Optional)</Label>
                      <Select value={caseForm.order_id || undefined} onValueChange={(value) => setCaseForm({ ...caseForm, order_id: value })}>
                        <SelectTrigger data-testid="case-order-select">
                          <SelectValue placeholder="Select order (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          {orders.map(order => (
                            <SelectItem key={order.id} value={order.id}>{order.order_number}</SelectItem>
                          ))}
                          {orders.length === 0 && (
                            <div className="p-2 text-sm text-gray-500">No orders available</div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Subject</Label>
                      <Input value={caseForm.subject} onChange={(e) => setCaseForm({ ...caseForm, subject: e.target.value })} required data-testid="case-subject-input" />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea value={caseForm.description} onChange={(e) => setCaseForm({ ...caseForm, description: e.target.value })} rows={5} required data-testid="case-description-input" />
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <Select value={caseForm.priority} onValueChange={(value) => setCaseForm({ ...caseForm, priority: value })}>
                        <SelectTrigger data-testid="case-priority-select">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600" disabled={submitting} data-testid="case-submit-btn">
                      {submitting ? 'Submitting...' : 'Submit Case'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4" data-testid="customer-cases-list">
              {cases.map((caseItem) => (
                <Card key={caseItem.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{caseItem.case_number}</h3>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            caseItem.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                            caseItem.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            caseItem.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {caseItem.status.replace('_', ' ')}
                          </span>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            caseItem.priority === 'high' ? 'bg-red-100 text-red-800' :
                            caseItem.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {caseItem.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">
                          Created: {new Date(caseItem.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold text-gray-700 mb-1">{caseItem.subject}</p>
                      <p className="text-sm text-gray-600 mb-3">{caseItem.description}</p>
                      <p className="text-xs text-gray-500">Type: {caseItem.type}</p>
                    </div>

                    {caseItem.resolution && (
                      <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm font-semibold text-green-800 mb-1">✓ Resolution:</p>
                        <p className="text-sm text-green-700">{caseItem.resolution}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              {cases.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No cases found</p>
                    <p className="text-sm text-gray-500 mt-2">Raise a case if you need assistance</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Delivery Tracking Tab */}
        {activeTab === 'delivery-tracking' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Delivery Tracking</h2>
              <p className="text-gray-600 mt-1">Track your order deliveries in real-time</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Panel - Order List */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Orders with Delivery</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <button
                          key={order.id}
                          onClick={() => setSelectedOrderForTracking(order)}
                          className={`w-full text-left p-4 rounded-lg border transition-all ${
                            selectedOrderForTracking?.id === order.id
                              ? 'bg-teal-50 border-teal-500 shadow-md'
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-gray-900">{order.order_number}</span>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              order.delivery_status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.delivery_status === 'out_for_delivery' ? 'bg-orange-100 text-orange-800' :
                              order.delivery_status === 'picked_up' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.delivery_status?.replace('_', ' ') || 'Assigned'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">Driver: {order.driver_name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Truck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">No deliveries in progress</p>
                        <p className="text-sm text-gray-500 mt-1">Orders with assigned drivers will appear here</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Panel - Delivery Timeline */}
              <div className="lg:col-span-2">
                {selectedOrderForTracking ? (
                  <div className="space-y-6">
                    {/* Order Info Card */}
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {selectedOrderForTracking.order_number}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Status: <span className="font-semibold">{selectedOrderForTracking.status}</span>
                            </p>
                          </div>
                          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                            selectedOrderForTracking.delivery_status === 'delivered' ? 'bg-green-100 text-green-800' :
                            selectedOrderForTracking.delivery_status === 'out_for_delivery' ? 'bg-orange-100 text-orange-800' :
                            selectedOrderForTracking.delivery_status === 'picked_up' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {selectedOrderForTracking.delivery_status?.replace('_', ' ') || 'Assigned'}
                          </span>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Driver</p>
                            <p className="font-semibold text-gray-900">{selectedOrderForTracking.driver_name}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Total Amount (Inc GST)</p>
                            <p className="font-semibold text-gray-900">${selectedOrderForTracking.total_amount?.toFixed(2)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Addresses Card */}
                    <Card>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="w-5 h-5 text-teal-600" />
                              <h4 className="font-semibold text-gray-900">Pickup Address</h4>
                            </div>
                            <p className="text-sm text-gray-600 ml-7">{selectedOrderForTracking.pickup_address}</p>
                            <p className="text-xs text-gray-500 ml-7 mt-1">
                              {new Date(selectedOrderForTracking.pickup_date).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="w-5 h-5 text-green-600" />
                              <h4 className="font-semibold text-gray-900">Delivery Address</h4>
                            </div>
                            <p className="text-sm text-gray-600 ml-7">{selectedOrderForTracking.delivery_address}</p>
                            <p className="text-xs text-gray-500 ml-7 mt-1">
                              {new Date(selectedOrderForTracking.delivery_date).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Delivery Timeline */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Delivery Timeline</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-6">
                          {/* Stage 1: Assigned */}
                          <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                selectedOrderForTracking.assigned_at ? 'bg-blue-500' : 'bg-gray-200'
                              }`}>
                                <Clock className={`w-5 h-5 ${selectedOrderForTracking.assigned_at ? 'text-white' : 'text-gray-400'}`} />
                              </div>
                              {selectedOrderForTracking.picked_up_at && (
                                <div className="w-0.5 h-12 bg-yellow-500 my-1"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">Driver Assigned</h4>
                              <p className="text-sm text-gray-600">
                                {selectedOrderForTracking.assigned_at 
                                  ? new Date(selectedOrderForTracking.assigned_at).toLocaleString()
                                  : 'Not completed yet'}
                              </p>
                            </div>
                          </div>

                          {/* Stage 2: Picked Up */}
                          <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                selectedOrderForTracking.picked_up_at ? 'bg-yellow-500' : 'bg-gray-200'
                              }`}>
                                <Package className={`w-5 h-5 ${selectedOrderForTracking.picked_up_at ? 'text-white' : 'text-gray-400'}`} />
                              </div>
                              {selectedOrderForTracking.picked_up_at && selectedOrderForTracking.delivery_status === 'out_for_delivery' && (
                                <div className="w-0.5 h-12 bg-orange-500 my-1"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">Order Picked Up</h4>
                              <p className="text-sm text-gray-600">
                                {selectedOrderForTracking.picked_up_at 
                                  ? new Date(selectedOrderForTracking.picked_up_at).toLocaleString()
                                  : 'Not completed yet'}
                              </p>
                            </div>
                          </div>

                          {/* Stage 3: Out for Delivery */}
                          <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                selectedOrderForTracking.delivery_status === 'out_for_delivery' || selectedOrderForTracking.delivery_status === 'delivered' ? 'bg-orange-500' : 'bg-gray-200'
                              }`}>
                                <Truck className={`w-5 h-5 ${
                                  selectedOrderForTracking.delivery_status === 'out_for_delivery' || selectedOrderForTracking.delivery_status === 'delivered' ? 'text-white' : 'text-gray-400'
                                }`} />
                              </div>
                              {selectedOrderForTracking.delivered_at && (
                                <div className="w-0.5 h-12 bg-green-500 my-1"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">Out for Delivery</h4>
                              <p className="text-sm text-gray-600">
                                {selectedOrderForTracking.delivery_status === 'out_for_delivery' || selectedOrderForTracking.delivery_status === 'delivered'
                                  ? 'In transit to delivery address'
                                  : 'Not completed yet'}
                              </p>
                            </div>
                          </div>

                          {/* Stage 4: Delivered */}
                          <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                selectedOrderForTracking.delivered_at ? 'bg-green-500' : 'bg-gray-200'
                              }`}>
                                <CheckCircle className={`w-5 h-5 ${selectedOrderForTracking.delivered_at ? 'text-white' : 'text-gray-400'}`} />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">Delivered</h4>
                              <p className="text-sm text-gray-600">
                                {selectedOrderForTracking.delivered_at 
                                  ? new Date(selectedOrderForTracking.delivered_at).toLocaleString()
                                  : 'Not completed yet'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Delivery Notes */}
                        {selectedOrderForTracking.delivery_notes && (
                          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-2">Delivery Notes</h4>
                            <p className="text-sm text-gray-700">{selectedOrderForTracking.delivery_notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card className="h-full">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[400px]">
                      <Truck className="w-16 h-16 text-gray-400 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Select an Order</h3>
                      <p className="text-gray-600">Choose an order from the list to view delivery tracking details</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default CustomerDashboard;