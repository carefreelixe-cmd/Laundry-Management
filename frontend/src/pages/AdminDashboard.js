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
import { Package, Users, AlertCircle, Plus, Edit, Lock, Unlock, Repeat } from 'lucide-react';
import axios from 'axios';

function AdminDashboard() {
  const { API, user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [cases, setCases] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [skus, setSkus] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [frequencyTemplates, setFrequencyTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Order form
  const [showOrderDialog, setShowOrderDialog] = useState(false);
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
        const [ordersRes, customersRes, skusRes] = await Promise.all([
          axios.get(`${API}/orders`),
          axios.get(`${API}/users`),
          axios.get(`${API}/skus`)
        ]);
        setOrders(ordersRes.data);
        setCustomers(customersRes.data.filter(u => u.role === 'customer'));
        setSkus(skusRes.data);
      } else if (activeTab === 'cases') {
        const casesRes = await axios.get(`${API}/cases`);
        setCases(casesRes.data);
      } else if (activeTab === 'deliveries') {
        const deliveriesRes = await axios.get(`${API}/deliveries`);
        setDeliveries(deliveriesRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
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
      await axios.post(`${API}/orders`, formData);
      setShowOrderDialog(false);
      setOrderForm({
        customer_id: '',
        customer_name: '',
        customer_email: '',
        items: [],
        pickup_date: '',
        delivery_date: '',
        pickup_address: '',
        delivery_address: '',
        special_instructions: ''
      });
      setOrderItems([{ sku_id: '', sku_name: '', quantity: 1, price: 0 }]);
      fetchData();
    } catch (error) {
      alert('Failed to create order');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${API}/orders/${orderId}`, { status: newStatus });
      fetchData();
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  const handleUpdateCase = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/cases/${selectedCase.id}`, caseUpdate);
      setShowCaseDialog(false);
      setSelectedCase(null);
      setCaseUpdate({ status: '', resolution: '', priority: '' });
      fetchData();
    } catch (error) {
      alert('Failed to update case');
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
            onClick={() => setActiveTab('deliveries')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'deliveries'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            data-testid="deliveries-tab"
          >
            Deliveries
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
              <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-teal-500 hover:bg-teal-600" data-testid="create-order-btn">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Order
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Order</DialogTitle>
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

                    <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600" data-testid="order-submit-btn">Create Order</Button>
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
                        <Select value={order.status} onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
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
                  <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600" data-testid="case-update-submit-btn">Update Case</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Deliveries Tab */}
        {activeTab === 'deliveries' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Management</h2>
            <div className="grid gap-4">
              {deliveries.map((delivery) => (
                <Card key={delivery.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delivery #{delivery.id.substring(0, 8)}</h3>
                        <p className="text-gray-600">Order ID: {delivery.order_id.substring(0, 8)}</p>
                        <div className="mt-3 space-y-1 text-sm">
                          <p className="text-gray-700"><span className="font-semibold">Driver:</span> {delivery.driver_name || 'Not assigned'}</p>
                          <p className="text-gray-700"><span className="font-semibold">Phone:</span> {delivery.driver_phone || 'N/A'}</p>
                          <p className="text-gray-700"><span className="font-semibold">Vehicle:</span> {delivery.vehicle_number || 'N/A'}</p>
                          <p className="text-gray-700"><span className="font-semibold">Status:</span> {delivery.status}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {deliveries.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No deliveries found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;