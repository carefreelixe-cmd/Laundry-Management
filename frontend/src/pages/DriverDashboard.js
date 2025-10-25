import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import OrderCalendar from '../components/OrderCalendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Truck, Package, CheckCircle, Clock, MapPin, Repeat, Calendar as CalendarIcon, DollarSign, AlertCircle,Calendar } from 'lucide-react';

function DriverDashboard() {
  const [activeTab, setActiveTab] = useState('deliveries');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

  // Calculate GST (10%)
  const calculateGST = (amount) => {
    const basePrice = amount / 1.10;
    const gst = amount - basePrice;
    return { basePrice, gst, total: amount };
  };

  useEffect(() => {
    fetchDriverOrders();
  }, []);

  const fetchDriverOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendUrl}/api/driver/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch orders');
      
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId) => {
    if (!statusUpdate) {
      alert('Please select a status');
      return;
    }

    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendUrl}/api/driver/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: statusUpdate,
          notes: notes || undefined
        })
      });

      if (!response.ok) throw new Error('Failed to update status');

      alert('Status updated successfully');
      setSelectedOrder(null);
      setStatusUpdate('');
      setNotes('');
      fetchDriverOrders();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'assigned': 'bg-blue-500',
      'picked_up': 'bg-yellow-500',
      'out_for_delivery': 'bg-orange-500',
      'delivered': 'bg-green-500'
    };
    
    return (
      <Badge className={statusColors[status] || 'bg-gray-500'}>
        {status?.replace(/_/g, ' ').toUpperCase() || 'ASSIGNED'}
      </Badge>
    );
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'assigned': return <Clock className="h-5 w-5" />;
      case 'picked_up': return <Package className="h-5 w-5" />;
      case 'out_for_delivery': return <Truck className="h-5 w-5" />;
      case 'delivered': return <CheckCircle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-teal-600 mb-2">Driver Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage your delivery assignments</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <Card>
          <CardHeader className="pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Total Assigned</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-teal-600">{orders.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Pending Pickup</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              {orders.filter(o => o.delivery_status === 'assigned').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">In Transit</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-orange-600">
              {orders.filter(o => o.delivery_status === 'picked_up' || o.delivery_status === 'out_for_delivery').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Delivered</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {orders.filter(o => o.delivery_status === 'delivered').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex gap-2 border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab('deliveries')}
            className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'deliveries'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Truck className="w-4 h-4 inline mr-2" />
            My Deliveries
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'calendar'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CalendarIcon className="w-4 h-4 inline mr-2" />
            Calendar View
          </button>
        </div>
      </div>

      {/* Deliveries Tab */}
      {activeTab === 'deliveries' && (
        <Card>
          <CardHeader>
            <CardTitle>My Deliveries</CardTitle>
            <CardDescription>Orders assigned to you for delivery</CardDescription>
          </CardHeader>
          <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Truck className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No deliveries assigned yet</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Pickup Address</TableHead>
                      <TableHead>Delivery Address</TableHead>
                      <TableHead>Pickup Date</TableHead>
                      <TableHead>Delivery Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {order.order_number}
                            {order.is_recurring && (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                <Repeat className="w-3 h-3 mr-1" />
                                Recurring
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{order.customer_name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="text-sm">{order.pickup_address}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="text-sm">{order.delivery_address}</span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(order.pickup_date).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(order.delivery_date).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(order.delivery_status)}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setStatusUpdate(order.delivery_status || 'assigned');
                                  setNotes('');
                                }}
                              >
                                Update Status
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:max-w-[95vw]">
                          <DialogHeader>
                            <DialogTitle>Update Delivery Status</DialogTitle>
                            <DialogDescription>
                              Order #{order.order_number} - {order.customer_name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            {/* Order Type Badge */}
                            {order.is_recurring && (
                              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <Repeat className="w-5 h-5 text-blue-600" />
                                <div className="flex-1">
                                  <span className="font-semibold text-blue-900">Recurring Order</span>
                                  {order.next_occurrence_date && (
                                    <p className="text-sm text-blue-700 mt-1">
                                      Next Scheduled: {new Date(order.next_occurrence_date).toLocaleDateString()}
                                    </p>
                                  )}
                                  {order.recurrence_pattern && (
                                    <p className="text-sm text-blue-700 mt-1">
                                      Pattern: {order.recurrence_pattern.frequency || 'Custom'} 
                                      {order.recurrence_pattern.interval > 1 && ` (every ${order.recurrence_pattern.interval} ${order.recurrence_pattern.frequency}s)`}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            <div>
                              <Label>Current Status</Label>
                              <div className="mt-2 flex items-center gap-2">
                                {getStatusIcon(order.delivery_status)}
                                {getStatusBadge(order.delivery_status)}
                              </div>
                            </div>
                            
                            <div>
                              <Label>New Status</Label>
                              <Select value={statusUpdate} onValueChange={setStatusUpdate}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="assigned">Assigned</SelectItem>
                                  <SelectItem value="picked_up">Picked Up</SelectItem>
                                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label>Notes (Optional)</Label>
                              <Textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add any notes about this delivery..."
                                rows={3}
                              />
                            </div>
                            
                            {/* Order Details Section */}
                            <div className="border-t pt-4 space-y-4">
                              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                Order Details
                              </h4>
                              
                              <div className="bg-gray-50 p-4 rounded space-y-3 text-sm">
                                <div className="flex items-start gap-2">
                                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <span className="text-gray-600 font-medium">Pickup Address:</span>
                                    <p className="text-gray-900 mt-1">{order.pickup_address}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-start gap-2">
                                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <span className="text-gray-600 font-medium">Delivery Address:</span>
                                    <p className="text-gray-900 mt-1">{order.delivery_address}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-start gap-2">
                                  <Calendar className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <span className="text-gray-600 font-medium">Schedule:</span>
                                    <p className="text-gray-900 mt-1">
                                      Pickup: {new Date(order.pickup_date).toLocaleString()} <br />
                                      Delivery: {new Date(order.delivery_date).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex items-start gap-2">
                                  <Package className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <span className="text-gray-600 font-medium">Items ({order.items?.length || 0}):</span>
                                    <div className="mt-2 space-y-1">
                                      {order.items?.map((item, idx) => (
                                        <div key={idx} className="flex justify-between bg-white p-2 rounded border">
                                          <span>{item.sku_name || item.sku_id}</span>
                                          <span className="text-gray-600">Qty: {item.quantity}</span>
                                          {item.price && <span className="font-medium">${item.price}</span>}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                
                                {order.total_amount && (
                                  <div className="pt-2 border-t space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-gray-600">Base Amount:</span>
                                      <span className="font-medium text-gray-900">${calculateGST(order.total_amount).basePrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-gray-600">GST (10%):</span>
                                      <span className="font-medium text-gray-900">${calculateGST(order.total_amount).gst.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t">
                                      <span className="text-gray-600 font-medium flex items-center gap-2">
                                        <DollarSign className="w-4 h-4" />
                                        Total Amount:
                                      </span>
                                      <span className="text-lg font-bold text-teal-600">${order.total_amount.toFixed(2)}</span>
                                    </div>
                                  </div>
                                )}
                                
                                {order.special_instructions && (
                                  <div className="flex items-start gap-2 pt-2 border-t">
                                    <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                      <span className="text-gray-600 font-medium">Special Instructions:</span>
                                      <p className="text-gray-900 mt-1 italic">{order.special_instructions}</p>
                                    </div>
                                  </div>
                                )}
                                
                                {order.delivery_notes && (
                                  <div className="flex items-start gap-2 pt-2 border-t">
                                    <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                      <span className="text-gray-600 font-medium">Previous Delivery Notes:</span>
                                      <p className="text-gray-900 mt-1">{order.delivery_notes}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <Button 
                              className="w-full bg-teal-500 hover:bg-teal-600" 
                              onClick={() => handleStatusUpdate(order.id)}
                              disabled={updating}
                            >
                              {updating ? 'Updating...' : 'Update Status'}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="border-l-4" style={{borderLeftColor: order.delivery_status === 'delivered' ? '#10b981' : order.delivery_status === 'out_for_delivery' ? '#f59e0b' : '#3b82f6'}}>
                <CardContent className="p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-lg">{order.order_number}</div>
                      <div className="text-sm text-gray-600 mt-1">{order.customer_name}</div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      {getStatusBadge(order.delivery_status)}
                      {order.is_recurring && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          <Repeat className="w-3 h-3 mr-1" />
                          Recurring
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Addresses */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2 bg-gray-50 p-2 rounded">
                      <MapPin className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-700">Pickup</div>
                        <div className="text-gray-600">{order.pickup_address}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 bg-gray-50 p-2 rounded">
                      <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-700">Delivery</div>
                        <div className="text-gray-600">{order.delivery_address}</div>
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                    <div>
                      <div className="text-gray-600">Pickup</div>
                      <div className="font-medium text-gray-900">{new Date(order.pickup_date).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-600">Delivery</div>
                      <div className="font-medium text-gray-900">{new Date(order.delivery_date).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setSelectedOrder(order);
                          setStatusUpdate(order.delivery_status || 'assigned');
                          setNotes('');
                        }}
                      >
                        <Truck className="w-4 h-4 mr-2" />
                        Update Status
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:max-w-[95vw] w-[95vw]">
                      <DialogHeader>
                        <DialogTitle>Update Delivery Status</DialogTitle>
                        <DialogDescription>
                          Order #{order.order_number} - {order.customer_name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        {/* Order Type Badge */}
                        {order.is_recurring && (
                          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <Repeat className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <span className="font-semibold text-blue-900 block truncate">Recurring Order</span>
                              {order.next_occurrence_date && (
                                <p className="text-sm text-blue-700 mt-1 truncate">
                                  Next Scheduled: {new Date(order.next_occurrence_date).toLocaleDateString()}
                                </p>
                              )}
                              {order.recurrence_pattern && (
                                <p className="text-sm text-blue-700 mt-1 break-words">
                                  Pattern: {order.recurrence_pattern.frequency || 'Custom'} 
                                  {order.recurrence_pattern.interval > 1 && ` (every ${order.recurrence_pattern.interval} ${order.recurrence_pattern.frequency}s)`}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <Label>Current Status</Label>
                          <div className="mt-2 flex items-center gap-2">
                            {getStatusIcon(order.delivery_status)}
                            {getStatusBadge(order.delivery_status)}
                          </div>
                        </div>
                        
                        <div>
                          <Label>New Status</Label>
                          <Select value={statusUpdate} onValueChange={setStatusUpdate}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="assigned">Assigned</SelectItem>
                              <SelectItem value="picked_up">Picked Up</SelectItem>
                              <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label>Notes (Optional)</Label>
                          <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any notes about this delivery..."
                            rows={3}
                          />
                        </div>
                        
                        {/* Order Details Section */}
                        <div className="border-t pt-4 space-y-4">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Order Details
                          </h4>
                          
                          <div className="bg-gray-50 p-3 sm:p-4 rounded space-y-3 text-sm">
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <span className="text-gray-600 font-medium block">Pickup Address:</span>
                                <p className="text-gray-900 mt-1 break-words">{order.pickup_address}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <span className="text-gray-600 font-medium block">Delivery Address:</span>
                                <p className="text-gray-900 mt-1 break-words">{order.delivery_address}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-2">
                              <Calendar className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <span className="text-gray-600 font-medium block">Schedule:</span>
                                <p className="text-gray-900 mt-1 break-words">
                                  <span className="block">Pickup: {new Date(order.pickup_date).toLocaleString()}</span>
                                  <span className="block">Delivery: {new Date(order.delivery_date).toLocaleString()}</span>
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-2">
                              <Package className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <span className="text-gray-600 font-medium block">Items ({order.items?.length || 0}):</span>
                                <div className="mt-2 space-y-1">
                                  {order.items?.map((item, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-white p-2 rounded border">
                                      <span className="break-words">{item.sku_name || item.sku_id}</span>
                                      <div className="flex justify-between sm:gap-2">
                                        <span className="text-gray-600">Qty: {item.quantity}</span>
                                        {item.price && <span className="font-medium">${item.price}</span>}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            {order.total_amount && (
                              <div className="pt-2 border-t space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">Base Amount:</span>
                                  <span className="font-medium text-gray-900">${calculateGST(order.total_amount).basePrice.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">GST (10%):</span>
                                  <span className="font-medium text-gray-900">${calculateGST(order.total_amount).gst.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t">
                                  <span className="text-gray-600 font-medium flex items-center gap-2">
                                    <DollarSign className="w-4 h-4" />
                                    Total Amount:
                                  </span>
                                  <span className="text-lg font-bold text-teal-600">${order.total_amount.toFixed(2)}</span>
                                </div>
                              </div>
                            )}
                            
                            {order.special_instructions && (
                              <div className="flex items-start gap-2 pt-2 border-t">
                                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <span className="text-gray-600 font-medium block">Special Instructions:</span>
                                  <p className="text-gray-900 mt-1 italic break-words">{order.special_instructions}</p>
                                </div>
                              </div>
                            )}
                            
                            {order.delivery_notes && (
                              <div className="flex items-start gap-2 pt-2 border-t">
                                <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <span className="text-gray-600 font-medium block">Previous Delivery Notes:</span>
                                  <p className="text-gray-900 mt-1 break-words">{order.delivery_notes}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full bg-teal-500 hover:bg-teal-600" 
                          onClick={() => handleStatusUpdate(order.id)}
                          disabled={updating}
                        >
                          {updating ? 'Updating...' : 'Update Status'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
          )}
        </CardContent>
      </Card>
      )}

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <Card>
          <CardHeader>
            <CardTitle>Delivery Calendar</CardTitle>
            <CardDescription>View your assigned deliveries on the calendar</CardDescription>
          </CardHeader>
          <CardContent>
            <OrderCalendar orders={orders} />
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}

export default DriverDashboard;
