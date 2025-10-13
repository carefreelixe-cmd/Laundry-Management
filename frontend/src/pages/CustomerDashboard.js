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
import { Package, AlertCircle, Plus, MapPin, Calendar } from 'lucide-react';
import axios from 'axios';

function CustomerDashboard() {
  const { API, user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  
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
        const ordersRes = await axios.get(`${API}/orders`);
        setOrders(ordersRes.data);
      } else if (activeTab === 'cases') {
        const casesRes = await axios.get(`${API}/cases`);
        setCases(casesRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCase = async (e) => {
    e.preventDefault();
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
      fetchData();
    } catch (error) {
      alert('Failed to create case');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await axios.delete(`${API}/orders/${orderId}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to cancel order');
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

  const canModifyOrder = (deliveryDate) => {
    const delivery = new Date(deliveryDate);
    const now = new Date();
    const hoursUntilDelivery = (delivery - now) / (1000 * 60 * 60);
    return hoursUntilDelivery > 8;
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
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>
            <div className="grid gap-4" data-testid="customer-orders-list">
              {orders.map((order) => (
                <Card key={order.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{order.order_number}</h3>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {order.status !== 'completed' && order.status !== 'cancelled' && canModifyOrder(order.delivery_date) && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelOrder(order.id)}
                          data-testid={`cancel-order-${order.id}`}
                        >
                          Cancel Order
                        </Button>
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
                      <div className="flex justify-between items-center mt-3 pt-3 border-t">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-teal-600">${order.total_amount.toFixed(2)}</span>
                      </div>
                    </div>

                    {order.special_instructions && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-semibold text-gray-700">Special Instructions:</p>
                        <p className="text-sm text-gray-600">{order.special_instructions}</p>
                      </div>
                    )}

                    {order.status !== 'completed' && order.status !== 'cancelled' && !canModifyOrder(order.delivery_date) && (
                      <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-yellow-800">⚠️ This order cannot be modified (within 8 hours of delivery)</p>
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
                    <p className="text-sm text-gray-500 mt-2">Contact admin to create your first order</p>
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
                          <SelectValue />
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
                      <Select value={caseForm.order_id} onValueChange={(value) => setCaseForm({ ...caseForm, order_id: value })}>
                        <SelectTrigger data-testid="case-order-select">
                          <SelectValue placeholder="Select order" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {orders.map(order => (
                            <SelectItem key={order.id} value={order.id}>{order.order_number}</SelectItem>
                          ))}
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
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600" data-testid="case-submit-btn">Submit Case</Button>
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
      </div>
    </DashboardLayout>
  );
}

export default CustomerDashboard;