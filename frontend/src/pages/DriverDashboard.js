import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Truck, Package, CheckCircle, Clock, MapPin } from 'lucide-react';

function DriverDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-teal-600 mb-2">Driver Dashboard</h1>
        <p className="text-gray-600">Manage your delivery assignments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">{orders.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Pickup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {orders.filter(o => o.delivery_status === 'assigned').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">In Transit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {orders.filter(o => o.delivery_status === 'picked_up' || o.delivery_status === 'out_for_delivery').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.delivery_status === 'delivered').length}
            </div>
          </CardContent>
        </Card>
      </div>

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
                    <TableCell className="font-medium">{order.order_number}</TableCell>
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
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update Delivery Status</DialogTitle>
                            <DialogDescription>
                              Order #{order.order_number} - {order.customer_name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
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
                            
                            <div className="bg-gray-50 p-3 rounded space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Pickup:</span>
                                <span className="font-medium">{order.pickup_address}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Delivery:</span>
                                <span className="font-medium">{order.delivery_address}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Items:</span>
                                <span className="font-medium">{order.items?.length || 0} items</span>
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
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

export default DriverDashboard;
