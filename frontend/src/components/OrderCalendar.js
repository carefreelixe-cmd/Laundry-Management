import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Package, Repeat, Clock, MapPin, DollarSign } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, parseISO, addMonths, subMonths } from 'date-fns';

const OrderCalendar = ({ orders = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);

  // Get days in current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Group orders by date
  const ordersByDate = useMemo(() => {
    const grouped = {};
    
    orders.forEach(order => {
      // Add pickup date
      if (order.pickup_date) {
        const pickupDate = format(parseISO(order.pickup_date), 'yyyy-MM-dd');
        if (!grouped[pickupDate]) grouped[pickupDate] = { pickup: [], delivery: [] };
        grouped[pickupDate].pickup.push(order);
      }
      
      // Add delivery date
      if (order.delivery_date) {
        const deliveryDate = format(parseISO(order.delivery_date), 'yyyy-MM-dd');
        if (!grouped[deliveryDate]) grouped[deliveryDate] = { pickup: [], delivery: [] };
        grouped[deliveryDate].delivery.push(order);
      }
    });
    
    return grouped;
  }, [orders]);

  // Get orders for a specific date
  const getOrdersForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return ordersByDate[dateStr] || { pickup: [], delivery: [] };
  };

  // Navigate months
  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Handle date click
  const handleDateClick = (date) => {
    setSelectedDate(date);
    const dayOrders = getOrdersForDate(date);
    if (dayOrders.pickup.length > 0 || dayOrders.delivery.length > 0) {
      // Show dialog with orders for this date
    }
  };

  // Handle order click
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowOrderDialog(true);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-orange-100 text-orange-800';
      case 'in_progress': return 'bg-amber-100 text-amber-800';
      case 'ready_for_pickup': return 'bg-purple-100 text-purple-800';
      case 'out_for_delivery': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-emerald-100 text-emerald-800 font-semibold';
      case 'completed': return 'bg-green-100 text-green-800 font-semibold';
      case 'cancelled': return 'bg-red-500 text-white font-bold border-2 border-red-600 animate-pulse';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-teal-600" />
              Order Calendar
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={goToNextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <div className="ml-4 font-semibold text-lg">
                {format(currentDate, 'MMMM yyyy')}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm">Pickup</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm">Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-sm font-semibold text-red-700">Cancelled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-sm text-emerald-700">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-sm text-amber-700">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <Repeat className="w-4 h-4 text-purple-600" />
              <span className="text-sm">Recurring Order</span>
            </div>
            <div className="flex items-center gap-2 ml-4 px-2 py-1 bg-red-50 rounded border border-red-200">
              <span className="text-xs text-red-700">🔴 Red shadow = Cancelled orders on this date</span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-semibold text-gray-600 bg-gray-50 rounded">
                {day}
              </div>
            ))}

            {/* Empty cells for days before month starts */}
            {Array.from({ length: monthStart.getDay() }).map((_, index) => (
              <div key={`empty-${index}`} className="p-2 min-h-[120px] bg-gray-50 rounded"></div>
            ))}

            {/* Calendar Days */}
            {daysInMonth.map(date => {
              const dayOrders = getOrdersForDate(date);
              const hasOrders = dayOrders.pickup.length > 0 || dayOrders.delivery.length > 0;
              const isCurrentMonth = isSameMonth(date, currentDate);
              const isTodayDate = isToday(date);
              
              // Check for cancelled orders on this date
              const hasCancelledOrders = [...dayOrders.pickup, ...dayOrders.delivery].some(
                order => order.status === 'cancelled'
              );
              
              // Check for completed orders
              const hasCompletedOrders = [...dayOrders.pickup, ...dayOrders.delivery].some(
                order => ['delivered', 'completed'].includes(order.status)
              );
              
              // Check for in-progress orders
              const hasInProgressOrders = [...dayOrders.pickup, ...dayOrders.delivery].some(
                order => ['in_progress', 'processing', 'out_for_delivery'].includes(order.status)
              );

              return (
                <div
                  key={date.toString()}
                  onClick={() => handleDateClick(date)}
                  className={`
                    p-2 min-h-[120px] border rounded cursor-pointer transition-all relative
                    ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                    ${isTodayDate ? 'border-teal-500 border-2 bg-teal-50' : 'border-gray-200'}
                    ${hasOrders ? 'hover:shadow-md' : 'hover:bg-gray-50'}
                    ${hasCancelledOrders ? 'shadow-[inset_0_0_25px_rgba(239,68,68,0.2)] bg-red-50/40' : ''}
                    ${hasCompletedOrders && !hasCancelledOrders ? 'shadow-[inset_0_0_20px_rgba(16,185,129,0.1)] bg-emerald-50/30' : ''}
                  `}
                >
                  <div className={`text-sm font-semibold mb-1 ${isTodayDate ? 'text-teal-600' : 'text-gray-900'}`}>
                    {format(date, 'd')}
                  </div>
                  
                  {/* Order indicators */}
                  <div className="space-y-1">
                    {/* Cancelled orders indicator - show first with high priority */}
                    {hasCancelledOrders && (
                      <div className="text-xs p-1 bg-red-100 text-red-800 rounded border border-red-300">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                          <span className="font-bold">
                            {[...dayOrders.pickup, ...dayOrders.delivery].filter(o => o.status === 'cancelled').length} Cancelled
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Completed orders indicator */}
                    {hasCompletedOrders && (
                      <div className="text-xs p-1 bg-emerald-100 text-emerald-800 rounded">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          <span className="font-medium">
                            {[...dayOrders.pickup, ...dayOrders.delivery].filter(o => ['delivered', 'completed'].includes(o.status)).length} Completed
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* In Progress orders indicator */}
                    {hasInProgressOrders && (
                      <div className="text-xs p-1 bg-amber-100 text-amber-800 rounded">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                          <span className="font-medium">
                            {[...dayOrders.pickup, ...dayOrders.delivery].filter(o => ['in_progress', 'processing', 'out_for_delivery'].includes(o.status)).length} In Progress
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Pickup orders */}
                    {dayOrders.pickup.length > 0 && (
                      <div 
                        className="text-xs p-1 bg-blue-100 text-blue-800 rounded cursor-pointer hover:bg-blue-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (dayOrders.pickup.length === 1) {
                            handleOrderClick(dayOrders.pickup[0]);
                          }
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <Package className="w-3 h-3" />
                          <span className="font-medium">{dayOrders.pickup.length} Pickup{dayOrders.pickup.length > 1 ? 's' : ''}</span>
                        </div>
                        {dayOrders.pickup.slice(0, 2).map((order, idx) => (
                          <div key={idx} className="flex items-center gap-1 mt-0.5">
                            {order.is_recurring && <Repeat className="w-2 h-2" />}
                            <span className="truncate">{order.order_number}</span>
                          </div>
                        ))}
                        {dayOrders.pickup.length > 2 && (
                          <div className="text-xs text-blue-600">+{dayOrders.pickup.length - 2} more</div>
                        )}
                      </div>
                    )}
                    
                    {/* Delivery orders */}
                    {dayOrders.delivery.length > 0 && (
                      <div 
                        className="text-xs p-1 bg-green-100 text-green-800 rounded cursor-pointer hover:bg-green-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (dayOrders.delivery.length === 1) {
                            handleOrderClick(dayOrders.delivery[0]);
                          }
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <Package className="w-3 h-3" />
                          <span className="font-medium">{dayOrders.delivery.length} Deliver{dayOrders.delivery.length > 1 ? 'ies' : 'y'}</span>
                        </div>
                        {dayOrders.delivery.slice(0, 2).map((order, idx) => (
                          <div key={idx} className="flex items-center gap-1 mt-0.5">
                            {order.is_recurring && <Repeat className="w-2 h-2" />}
                            <span className="truncate">{order.order_number}</span>
                          </div>
                        ))}
                        {dayOrders.delivery.length > 2 && (
                          <div className="text-xs text-green-600">+{dayOrders.delivery.length - 2} more</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              {/* Order Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedOrder.order_number}</h3>
                  <p className="text-gray-600">{selectedOrder.customer_name}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusBadgeClass(selectedOrder.status)}>
                    {selectedOrder.status?.replace('_', ' ').toUpperCase()}
                  </Badge>
                  {selectedOrder.is_recurring && (
                    <Badge className="bg-purple-100 text-purple-800">
                      <Repeat className="w-3 h-3 mr-1" />
                      Recurring
                    </Badge>
                  )}
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-800 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-semibold">Pickup</span>
                  </div>
                  <p className="text-sm text-blue-900">
                    {format(parseISO(selectedOrder.pickup_date), 'MMM dd, yyyy h:mm a')}
                  </p>
                  <div className="flex items-start gap-2 mt-2">
                    <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                    <p className="text-sm text-blue-800">{selectedOrder.pickup_address}</p>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-semibold">Delivery</span>
                  </div>
                  <p className="text-sm text-green-900">
                    {format(parseISO(selectedOrder.delivery_date), 'MMM dd, yyyy h:mm a')}
                  </p>
                  <div className="flex items-start gap-2 mt-2">
                    <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                    <p className="text-sm text-green-800">{selectedOrder.delivery_address}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Order Items</h4>
                <div className="border rounded-lg divide-y">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{item.sku_name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center p-4 bg-teal-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-teal-600" />
                  <span className="font-semibold text-gray-900">Total Amount</span>
                </div>
                <span className="text-2xl font-bold text-teal-600">
                  ${selectedOrder.total_amount?.toFixed(2)}
                </span>
              </div>

              {/* Special Instructions */}
              {selectedOrder.special_instructions && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Special Instructions</h4>
                  <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                    {selectedOrder.special_instructions}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderCalendar;
