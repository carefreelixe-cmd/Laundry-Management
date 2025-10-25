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
import { Users, Package, DollarSign, AlertCircle, Plus, Edit, Trash2, Tag, Clock, Truck, Repeat, MapPin, CheckCircle, Lock, X, Ban, CheckCircle2, Search, Filter, ArrowUpDown, Calendar,Unlock } from 'lucide-react';
import { toast } from 'sonner';
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

  // Case Management
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [showCaseDialog, setShowCaseDialog] = useState(false);
  const [caseUpdate, setCaseUpdate] = useState({ status: '', resolution: '', priority: '' });
  const [updatingCaseId, setUpdatingCaseId] = useState(null);
  
  // Cases Filter & Sort
  const [caseSearchQuery, setCaseSearchQuery] = useState('');
  const [caseSortBy, setCaseSortBy] = useState('created_at');
  const [caseSortOrder, setCaseSortOrder] = useState('desc');
  const [caseStatusFilter, setCaseStatusFilter] = useState([]);
  const [casePriorityFilter, setCasePriorityFilter] = useState([]);
  const [caseDateFrom, setCaseDateFrom] = useState('');
  const [caseDateTo, setCaseDateTo] = useState('');

  // Orders and Drivers
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState({});
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
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
  const [orderItems, setOrderItems] = useState([{ sku_id: '', quantity: 1 }]);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState(null);
  const [customerSkus, setCustomerSkus] = useState([]);

  // Addresses
  const [businessPickupAddress, setBusinessPickupAddress] = useState('');

  // Orders Filter & Sort
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderSortBy, setOrderSortBy] = useState('created_at');
  const [orderSortOrder, setOrderSortOrder] = useState('desc');
  const [orderStatusFilter, setOrderStatusFilter] = useState([]);
  const [orderDeliveryStatusFilter, setOrderDeliveryStatusFilter] = useState([]);
  const [orderDateFilter, setOrderDateFilter] = useState('all');
  const [orderDateFrom, setOrderDateFrom] = useState('');
  const [orderDateTo, setOrderDateTo] = useState('');
  const [orderTypeFilter, setOrderTypeFilter] = useState('all');

  // Users Filter & Sort
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userSortBy, setUserSortBy] = useState('created_at');
  const [userSortOrder, setUserSortOrder] = useState('desc');
  const [userRoleFilter, setUserRoleFilter] = useState([]);

  // SKUs Filter & Sort
  const [skuSearchQuery, setSkuSearchQuery] = useState('');
  const [skuSortBy, setSkuSortBy] = useState('name');
  const [skuSortOrder, setSkuSortOrder] = useState('asc');
  const [skuCategoryFilter, setSkuCategoryFilter] = useState([]);

  // Delivery Tracking Filter
  const [deliveryTrackingStatusFilter, setDeliveryTrackingStatusFilter] = useState([]);
  const [deliveryTrackingDriverFilter, setDeliveryTrackingDriverFilter] = useState('');
  const [deliveryTrackingDateFrom, setDeliveryTrackingDateFrom] = useState('');
  const [deliveryTrackingDateTo, setDeliveryTrackingDateTo] = useState('');

  // Password reset
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [resettingPasswordUserId, setResettingPasswordUserId] = useState(null);

  useEffect(() => {
    fetchData();
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await axios.get(`${API}/config/addresses`);
      setBusinessPickupAddress(res.data.business_pickup_address);
    } catch (error) {
      console.error('Failed to fetch addresses', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchData(); // Refresh users list
    } else if (activeTab === 'customer-pricing') {
      fetchCustomers();
    } else if (activeTab === 'frequency-templates') {
      fetchFrequencyTemplates();
    } else if (activeTab === 'cases') {
      fetchCases();
    } else if (activeTab === 'orders') {
      fetchOrders();
      fetchDrivers();
      fetchCustomers();
      fetchFrequencyTemplates();
    } else if (activeTab === 'delivery-tracking') {
      fetchOrders();
    }
  }, [activeTab]);

  // Fetch customer-specific SKU pricing when customer is selected in order form
  useEffect(() => {
    if (orderForm.customer_id) {
      fetchCustomerSkus(orderForm.customer_id);
    } else {
      setCustomerSkus([]);
    }
  }, [orderForm.customer_id]);

  useEffect(() => {
    if (selectedCustomer) {
      fetchCustomerPricing(selectedCustomer);
    }
  }, [selectedCustomer]);

  // Helper function to get display name for order status
  const getStatusDisplayName = (status) => {
    const statusMap = {
      'pending': 'Pending',
      'scheduled': 'Scheduled',
      'processing': 'Processing',
      'ready_for_pickup': 'Order Ready for Pickup',
      'out_for_delivery': 'Out for Delivery',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  };

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

  const fetchCases = async () => {
    try {
      const res = await axios.get(`${API}/cases`);
      setCases(res.data);
    } catch (error) {
      console.error('Failed to fetch cases', error);
      toast.error('Failed to fetch cases');
    }
  };

  const fetchCustomerSkus = async (customerId) => {
    try {
      const res = await axios.get(`${API}/skus-with-pricing/${customerId}`);
      setCustomerSkus(res.data);
    } catch (error) {
      console.error('Failed to fetch customer SKUs', error);
      setCustomerSkus(skus); // Fallback to base SKUs
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

  const handleToggleUserStatus = async (user) => {
    const action = user.is_active ? 'disable' : 'enable';
    if (!window.confirm(`Are you sure you want to ${action} ${user.full_name}'s account?`)) return;
    try {
      await axios.put(`${API}/admin/users/${user.id}/toggle-status`);
      toast.success(`User account ${action}d successfully`);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || `Failed to ${action} user`);
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

  const handleUpdateCase = async (e) => {
    e.preventDefault();
    if (updatingCaseId) return; // Prevent duplicate submissions
    
    try {
      setUpdatingCaseId(selectedCase.id);
      await axios.put(`${API}/cases/${selectedCase.id}`, caseUpdate);
      toast.success('Case updated successfully');
      setShowCaseDialog(false);
      setSelectedCase(null);
      setCaseUpdate({ status: '', resolution: '', priority: '' });
      fetchCases();
    } catch (error) {
      console.error('Failed to update case', error);
      toast.error('Failed to update case');
    } finally {
      setUpdatingCaseId(null);
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

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/orders`);
      setOrders(res.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  };

  const getFilteredAndSortedOrders = () => {
    let filtered = [...orders];

    // Search filter (order number, customer name, email)
    if (orderSearchQuery.trim()) {
      const query = orderSearchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.order_number?.toLowerCase().includes(query) ||
        order.customer_name?.toLowerCase().includes(query) ||
        order.customer_email?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (orderStatusFilter.length > 0) {
      filtered = filtered.filter(order => orderStatusFilter.includes(order.status));
    }

    // Delivery Status filter
    if (orderDeliveryStatusFilter.length > 0) {
      filtered = filtered.filter(order => 
        order.delivery_status && orderDeliveryStatusFilter.includes(order.delivery_status)
      );
    }

    // Type filter (recurring vs regular)
    if (orderTypeFilter !== 'all') {
      filtered = filtered.filter(order => 
        orderTypeFilter === 'recurring' ? order.is_recurring : !order.is_recurring
      );
    }

    // Date filter
    if (orderDateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(order => {
        const deliveryDate = new Date(order.delivery_date);
        
        switch(orderDateFilter) {
          case 'today':
            return deliveryDate.toDateString() === today.toDateString();
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return deliveryDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return deliveryDate >= monthAgo;
          case 'custom':
            // Custom date range filtering
            if (orderDateFrom && orderDateTo) {
              const fromDate = new Date(orderDateFrom);
              const toDate = new Date(orderDateTo);
              toDate.setHours(23, 59, 59, 999); // Include entire end date
              return deliveryDate >= fromDate && deliveryDate <= toDate;
            } else if (orderDateFrom) {
              const fromDate = new Date(orderDateFrom);
              return deliveryDate >= fromDate;
            } else if (orderDateTo) {
              const toDate = new Date(orderDateTo);
              toDate.setHours(23, 59, 59, 999);
              return deliveryDate <= toDate;
            }
            return true;
          default:
            return true;
        }
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;

      switch(orderSortBy) {
        case 'order_number':
          aVal = a.order_number || '';
          bVal = b.order_number || '';
          break;
        case 'customer_name':
          aVal = a.customer_name || '';
          bVal = b.customer_name || '';
          break;
        case 'status':
          aVal = a.status || '';
          bVal = b.status || '';
          break;
        case 'total_amount':
          aVal = a.total_amount || 0;
          bVal = b.total_amount || 0;
          break;
        case 'delivery_date':
          aVal = new Date(a.delivery_date || 0);
          bVal = new Date(b.delivery_date || 0);
          break;
        case 'created_at':
        default:
          aVal = new Date(a.created_at || 0);
          bVal = new Date(b.created_at || 0);
          break;
      }

      if (orderSortBy === 'total_amount' || orderSortBy === 'delivery_date' || orderSortBy === 'created_at') {
        return orderSortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      } else {
        const comparison = aVal.toString().localeCompare(bVal.toString());
        return orderSortOrder === 'asc' ? comparison : -comparison;
      }
    });

    return filtered;
  };

  const toggleStatusFilter = (status) => {
    setOrderStatusFilter(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const toggleDeliveryStatusFilter = (status) => {
    setOrderDeliveryStatusFilter(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const clearAllOrderFilters = () => {
    setOrderSearchQuery('');
    setOrderStatusFilter([]);
    setOrderDeliveryStatusFilter([]);
    setOrderDateFilter('all');
    setOrderDateFrom('');
    setOrderDateTo('');
    setOrderTypeFilter('all');
    setOrderSortBy('created_at');
    setOrderSortOrder('desc');
  };

  // Users Filter & Sort Functions
  const getFilteredAndSortedUsers = () => {
    let filtered = [...users];

    // Search filter (name, email)
    if (userSearchQuery.trim()) {
      const query = userSearchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        user.full_name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
      );
    }

    // Role filter
    if (userRoleFilter.length > 0) {
      filtered = filtered.filter(user => userRoleFilter.includes(user.role));
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;

      switch(userSortBy) {
        case 'full_name':
          aVal = a.full_name || '';
          bVal = b.full_name || '';
          break;
        case 'email':
          aVal = a.email || '';
          bVal = b.email || '';
          break;
        case 'role':
          aVal = a.role || '';
          bVal = b.role || '';
          break;
        case 'created_at':
        default:
          aVal = new Date(a.created_at || 0);
          bVal = new Date(b.created_at || 0);
          break;
      }

      if (userSortBy === 'created_at') {
        return userSortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      } else {
        const comparison = aVal.toString().localeCompare(bVal.toString());
        return userSortOrder === 'asc' ? comparison : -comparison;
      }
    });

    return filtered;
  };

  const toggleUserRoleFilter = (role) => {
    setUserRoleFilter(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const clearUserFilters = () => {
    setUserSearchQuery('');
    setUserRoleFilter([]);
    setUserSortBy('created_at');
    setUserSortOrder('desc');
  };

  // SKUs Filter & Sort Functions
  const getFilteredAndSortedSkus = () => {
    let filtered = [...skus];

    // Search filter (name, description)
    if (skuSearchQuery.trim()) {
      const query = skuSearchQuery.toLowerCase();
      filtered = filtered.filter(sku =>
        sku.name?.toLowerCase().includes(query) ||
        sku.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (skuCategoryFilter.length > 0) {
      filtered = filtered.filter(sku => skuCategoryFilter.includes(sku.category));
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;

      switch(skuSortBy) {
        case 'name':
          aVal = a.name || '';
          bVal = b.name || '';
          break;
        case 'category':
          aVal = a.category || '';
          bVal = b.category || '';
          break;
        case 'price':
          aVal = a.price || 0;
          bVal = b.price || 0;
          break;
        default:
          aVal = a.name || '';
          bVal = b.name || '';
          break;
      }

      if (skuSortBy === 'price') {
        return skuSortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      } else {
        const comparison = aVal.toString().localeCompare(bVal.toString());
        return skuSortOrder === 'asc' ? comparison : -comparison;
      }
    });

    return filtered;
  };

  const toggleSkuCategoryFilter = (category) => {
    setSkuCategoryFilter(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const clearSkuFilters = () => {
    setSkuSearchQuery('');
    setSkuCategoryFilter([]);
    setSkuSortBy('name');
    setSkuSortOrder('asc');
  };

  // Delivery Tracking Filter Functions
  const getFilteredDeliveryOrders = () => {
    let filtered = orders.filter(o => o.driver_id);

    // Delivery Status filter
    if (deliveryTrackingStatusFilter.length > 0) {
      filtered = filtered.filter(order => {
        const status = order.delivery_status || 'assigned';
        return deliveryTrackingStatusFilter.includes(status);
      });
    }

    // Driver filter
    if (deliveryTrackingDriverFilter.trim()) {
      const query = deliveryTrackingDriverFilter.toLowerCase();
      filtered = filtered.filter(order =>
        order.driver_name?.toLowerCase().includes(query)
      );
    }

    // Date range filter (by delivery date)
    if (deliveryTrackingDateFrom || deliveryTrackingDateTo) {
      filtered = filtered.filter(order => {
        const deliveryDate = new Date(order.delivery_date);
        
        if (deliveryTrackingDateFrom && deliveryTrackingDateTo) {
          const fromDate = new Date(deliveryTrackingDateFrom);
          const toDate = new Date(deliveryTrackingDateTo);
          toDate.setHours(23, 59, 59, 999);
          return deliveryDate >= fromDate && deliveryDate <= toDate;
        } else if (deliveryTrackingDateFrom) {
          const fromDate = new Date(deliveryTrackingDateFrom);
          return deliveryDate >= fromDate;
        } else if (deliveryTrackingDateTo) {
          const toDate = new Date(deliveryTrackingDateTo);
          toDate.setHours(23, 59, 59, 999);
          return deliveryDate <= toDate;
        }
        return true;
      });
    }

    return filtered;
  };

  const toggleDeliveryTrackingStatusFilter = (status) => {
    setDeliveryTrackingStatusFilter(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const clearDeliveryTrackingFilters = () => {
    setDeliveryTrackingStatusFilter([]);
    setDeliveryTrackingDriverFilter('');
    setDeliveryTrackingDateFrom('');
    setDeliveryTrackingDateTo('');
  };

  // Case Filter & Sort Functions
  const getFilteredAndSortedCases = () => {
    let filtered = [...cases];
    
    // Search filter
    if (caseSearchQuery) {
      const query = caseSearchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.case_number?.toLowerCase().includes(query) ||
        c.customer_name?.toLowerCase().includes(query) ||
        c.customer_email?.toLowerCase().includes(query) ||
        c.subject?.toLowerCase().includes(query)
      );
    }
    
    // Status filter
    if (caseStatusFilter.length > 0) {
      filtered = filtered.filter(c => caseStatusFilter.includes(c.status));
    }
    
    // Priority filter
    if (casePriorityFilter.length > 0) {
      filtered = filtered.filter(c => casePriorityFilter.includes(c.priority));
    }
    
    // Date range filter
    if (caseDateFrom || caseDateTo) {
      filtered = filtered.filter(c => {
        const caseDate = new Date(c.created_at);
        const fromDate = caseDateFrom ? new Date(caseDateFrom) : null;
        const toDate = caseDateTo ? new Date(caseDateTo + 'T23:59:59.999') : null;
        
        if (fromDate && caseDate < fromDate) return false;
        if (toDate && caseDate > toDate) return false;
        return true;
      });
    }
    
    // Sorting
    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch (caseSortBy) {
        case 'case_number':
          aVal = a.case_number || '';
          bVal = b.case_number || '';
          break;
        case 'customer_name':
          aVal = a.customer_name || '';
          bVal = b.customer_name || '';
          break;
        case 'status':
          aVal = a.status || '';
          bVal = b.status || '';
          break;
        case 'priority':
          const priorityOrder = { low: 1, medium: 2, high: 3, urgent: 4 };
          aVal = priorityOrder[a.priority] || 0;
          bVal = priorityOrder[b.priority] || 0;
          break;
        case 'created_at':
        default:
          aVal = new Date(a.created_at);
          bVal = new Date(b.created_at);
      }
      
      if (aVal < bVal) return caseSortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return caseSortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    return filtered;
  };

  const toggleCaseStatusFilter = (status) => {
    setCaseStatusFilter(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const toggleCasePriorityFilter = (priority) => {
    setCasePriorityFilter(prev => 
      prev.includes(priority) ? prev.filter(p => p !== priority) : [...prev, priority]
    );
  };

  const clearCaseFilters = () => {
    setCaseSearchQuery('');
    setCaseSortBy('created_at');
    setCaseSortOrder('desc');
    setCaseStatusFilter([]);
    setCasePriorityFilter([]);
    setCaseDateFrom('');
    setCaseDateTo('');
  };

  const getUniqueCategories = () => {
    const categories = [...new Set(skus.map(sku => sku.category).filter(Boolean))];
    return categories.sort();
  };

  const fetchDrivers = async () => {
    try {
      const res = await axios.get(`${API}/drivers`);
      setDrivers(res.data);
    } catch (error) {
      console.error('Failed to fetch drivers', error);
    }
  };

  const handleAssignDriver = async (orderId) => {
    const driverId = selectedDriver[orderId];
    if (!driverId) {
      alert('Please select a driver');
      return;
    }
    try {
      await axios.put(`${API}/orders/${orderId}/assign-driver`, { driver_id: driverId });
      alert('Driver assigned successfully');
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to assign driver');
    }
  };

  const handleUnassignDriver = async (orderId) => {
    if (!window.confirm('Are you sure you want to unassign the driver from this order?')) {
      return;
    }
    try {
      await axios.put(`${API}/orders/${orderId}/unassign-driver`);
      toast.success('Driver unassigned successfully');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to unassign driver');
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setCreatingOrder(true);
    try {
      const selectedCustomer = customers.find(c => c.id === orderForm.customer_id);
      if (!selectedCustomer) {
        alert('Please select a customer');
        setCreatingOrder(false);
        return;
      }

      // Use customerSkus if available (has custom pricing), otherwise fallback to base skus
      const skuList = customerSkus.length > 0 ? customerSkus : skus;

      // Filter valid items and add price and sku_name
      const validItems = orderItems
        .filter(item => item.sku_id && item.quantity > 0)
        .map(item => {
          const sku = skuList.find(s => s.id === item.sku_id);
          if (!sku) return null;
          
          // Use customer_price if available (from customer-specific endpoint), otherwise base price
          const price = sku.customer_price !== undefined ? sku.customer_price : sku.price;
          
          return {
            sku_id: item.sku_id,
            sku_name: sku.name,
            quantity: parseInt(item.quantity),
            price: parseFloat(price)
          };
        })
        .filter(item => item !== null);

      if (validItems.length === 0) {
        alert('Please add at least one valid item');
        setCreatingOrder(false);
        return;
      }

      const orderData = {
        customer_id: selectedCustomer.id,
        customer_name: selectedCustomer.full_name,
        customer_email: selectedCustomer.email,
        items: validItems,
        pickup_date: orderForm.pickup_date,
        delivery_date: orderForm.delivery_date,
        pickup_address: orderForm.pickup_address,
        delivery_address: orderForm.delivery_address,
        special_instructions: orderForm.special_instructions || null,
        is_recurring: orderForm.is_recurring || false
      };

      // Include recurring data only if is_recurring is true
      if (orderData.is_recurring && orderForm.frequency_template_id) {
        const template = frequencyTemplates.find(t => t.id === orderForm.frequency_template_id);
        if (template) {
          orderData.recurrence_pattern = {
            frequency_type: template.frequency_type,
            frequency_value: template.frequency_value
          };
        }
      }

      await axios.post(`${API}/orders`, orderData);
      alert('Order created successfully');
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
        special_instructions: '',
        is_recurring: false,
        frequency_template_id: ''
      });
      setOrderItems([{ sku_id: '', quantity: 1 }]);
      setCustomerSkus([]); // Clear customer SKUs
      fetchOrders();
    } catch (error) {
      console.error('Order creation error:', error.response?.data);
      alert(error.response?.data?.detail || JSON.stringify(error.response?.data) || 'Failed to create order');
    } finally {
      setCreatingOrder(false);
    }
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setOrderForm({
      customer_id: order.customer_id,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      pickup_date: order.pickup_date,
      delivery_date: order.delivery_date,
      pickup_address: order.pickup_address,
      delivery_address: order.delivery_address,
      special_instructions: order.special_instructions || '',
      is_recurring: order.is_recurring || false,
      frequency_template_id: order.recurrence_pattern ? '' : ''
    });
    setOrderItems(order.items.map(item => ({
      sku_id: item.sku_id,
      quantity: item.quantity
    })));
    setShowOrderDialog(true);
  };

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    setCreatingOrder(true);
    try {
      const skuList = customerSkus.length > 0 ? customerSkus : skus;

      const validItems = orderItems
        .filter(item => item.sku_id && item.quantity > 0)
        .map(item => {
          const sku = skuList.find(s => s.id === item.sku_id);
          if (!sku) return null;
          
          const price = sku.customer_price !== undefined ? sku.customer_price : sku.price;
          
          return {
            sku_id: item.sku_id,
            sku_name: sku.name,
            quantity: parseInt(item.quantity),
            price: parseFloat(price)
          };
        })
        .filter(item => item !== null);

      if (validItems.length === 0) {
        alert('Please add at least one valid item');
        setCreatingOrder(false);
        return;
      }

      const updateData = {
        pickup_date: orderForm.pickup_date,
        delivery_date: orderForm.delivery_date,
        pickup_address: orderForm.pickup_address,
        delivery_address: orderForm.delivery_address,
        special_instructions: orderForm.special_instructions || null,
        items: validItems
      };

      await axios.put(`${API}/orders/${editingOrder.id}`, updateData);
      alert('Order updated successfully');
      setShowOrderDialog(false);
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
      setOrderItems([{ sku_id: '', quantity: 1 }]);
      setCustomerSkus([]);
      fetchOrders();
    } catch (error) {
      console.error('Order update error:', error.response?.data);
      alert(error.response?.data?.detail || 'Failed to update order');
    } finally {
      setCreatingOrder(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    
    setDeletingOrderId(orderId);
    try {
      await axios.delete(`${API}/orders/${orderId}`);
      alert('Order deleted successfully');
      fetchOrders();
    } catch (error) {
      console.error('Order delete error:', error.response?.data);
      alert(error.response?.data?.detail || 'Failed to delete order');
    } finally {
      setDeletingOrderId(null);
    }
  };

  const handleLockOrder = async (orderId) => {
    try {
      await axios.put(`${API}/orders/${orderId}/lock`);
      toast.success('Order locked successfully');
      fetchOrders();
    } catch (error) {
      console.error('Failed to lock order:', error);
      toast.error(error.response?.data?.detail || 'Failed to lock order');
    }
  };

  const handleUnlockOrder = async (orderId) => {
    try {
      await axios.put(`${API}/orders/${orderId}/unlock`);
      toast.success('Order unlocked successfully');
      fetchOrders();
    } catch (error) {
      console.error('Failed to unlock order:', error);
      toast.error(error.response?.data?.detail || 'Failed to unlock order');
    }
  };

  const addOrderItem = () => {
    setOrderItems([...orderItems, { sku_id: '', quantity: 1 }]);
  };

  const removeOrderItem = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const updateOrderItem = (index, field, value) => {
    const updated = [...orderItems];
    updated[index][field] = field === 'quantity' ? parseInt(value) : value;
    setOrderItems(updated);
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
                <p className="text-sm text-gray-500 mt-1">Ready for pickup orders</p>
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
          <button
            onClick={() => setActiveTab('cases')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'cases'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            data-testid="cases-tab"
          >
            Case Management
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'orders'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            data-testid="orders-tab"
          >
            Orders & Drivers
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
                          <SelectItem value="driver">Driver</SelectItem>
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

            {/* Filter & Sort Controls */}
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Search and Sort Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search by name or email..."
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={userSortBy} onValueChange={setUserSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full_name">Name</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="role">Role</SelectItem>
                        <SelectItem value="created_at">Created Date</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      onClick={() => setUserSortOrder(userSortOrder === 'asc' ? 'desc' : 'asc')}
                      className="w-full"
                    >
                      <ArrowUpDown className="w-4 h-4 mr-2" />
                      {userSortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
                    </Button>
                  </div>

                  {/* Role Filter Row */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Filter by Role</Label>
                    <div className="flex flex-wrap gap-2">
                      {['owner', 'admin', 'customer', 'driver'].map(role => (
                        <Button
                          key={role}
                          variant={userRoleFilter.includes(role) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleUserRoleFilter(role)}
                          className="capitalize"
                        >
                          {role}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Results Counter and Clear Filters */}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <p className="text-sm text-gray-600">
                      Showing <span className="font-semibold">{getFilteredAndSortedUsers().length}</span> of <span className="font-semibold">{users.length}</span> users
                    </p>
                    {(userSearchQuery || userRoleFilter.length > 0 || userSortBy !== 'created_at' || userSortOrder !== 'desc') && (
                      <Button variant="ghost" size="sm" onClick={clearUserFilters}>
                        <X className="w-4 h-4 mr-1" />
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200" data-testid="users-table">
                      {getFilteredAndSortedUsers().map((user) => (
                        <tr key={user.id} className={`hover:bg-gray-50 ${!user.is_active ? 'opacity-50 bg-gray-100' : ''}`}>
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
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                              user.is_active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.is_active !== false ? (
                                <><CheckCircle2 className="w-3 h-3" /> Active</>
                              ) : (
                                <><Ban className="w-3 h-3" /> Disabled</>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.phone || '-'}</td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => openPasswordResetDialog(user)} 
                                className="text-blue-600 hover:text-blue-800"
                                title="Reset Password"
                                disabled={resettingPasswordUserId === user.id}
                              >
                                {resettingPasswordUserId === user.id ? (
                                  <Clock className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Lock className="w-4 h-4" />
                                )}
                              </button>
                              <button 
                                onClick={() => handleToggleUserStatus(user)} 
                                className={`${user.is_active !== false ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                                title={user.is_active !== false ? 'Disable User' : 'Enable User'}
                                data-testid={`toggle-status-${user.id}`}
                              >
                                {user.is_active !== false ? (
                                  <Ban className="w-4 h-4" />
                                ) : (
                                  <CheckCircle2 className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {getFilteredAndSortedUsers().length === 0 && users.length > 0 && (
              <Card className="mt-4">
                <CardContent className="p-12 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No users found matching your filters</p>
                </CardContent>
              </Card>
            )}

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

            {/* Filter & Sort Controls */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Search and Sort Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search by name or description..."
                        value={skuSearchQuery}
                        onChange={(e) => setSkuSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={skuSortBy} onValueChange={setSkuSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="category">Category</SelectItem>
                        <SelectItem value="price">Price</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      onClick={() => setSkuSortOrder(skuSortOrder === 'asc' ? 'desc' : 'asc')}
                      className="w-full"
                    >
                      <ArrowUpDown className="w-4 h-4 mr-2" />
                      {skuSortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
                    </Button>
                  </div>

                  {/* Category Filter Row */}
                  {getUniqueCategories().length > 0 && (
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Filter by Category</Label>
                      <div className="flex flex-wrap gap-2">
                        {getUniqueCategories().map(category => (
                          <Button
                            key={category}
                            variant={skuCategoryFilter.includes(category) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleSkuCategoryFilter(category)}
                          >
                            {category}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Results Counter and Clear Filters */}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <p className="text-sm text-gray-600">
                      Showing <span className="font-semibold">{getFilteredAndSortedSkus().length}</span> of <span className="font-semibold">{skus.length}</span> SKUs
                    </p>
                    {(skuSearchQuery || skuCategoryFilter.length > 0 || skuSortBy !== 'name' || skuSortOrder !== 'asc') && (
                      <Button variant="ghost" size="sm" onClick={clearSkuFilters}>
                        <X className="w-4 h-4 mr-1" />
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredAndSortedSkus().map((sku) => (
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
                      <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-sm font-semibold text-gray-900">Price</span>
                            <p className="text-xs text-gray-500">Includes 10% GST</p>
                          </div>
                          <span className="text-2xl font-bold text-teal-600">${(sku.price * 1.10).toFixed(2)}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{sku.unit}</p>
                      {sku.description && <p className="text-sm text-gray-600 mt-2">{sku.description}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {getFilteredAndSortedSkus().length === 0 && skus.length > 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No SKUs found matching your filters</p>
                </CardContent>
              </Card>
            )}

            {skus.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No SKUs found</p>
                </CardContent>
              </Card>
            )}
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
                  {skusWithPricing.filter(sku => sku.has_custom_pricing).map((sku) => (
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
                          {sku.has_custom_pricing ? (
                            <>
                              <div className="flex items-center gap-2 mb-2">
                                <p className="text-lg text-gray-400 line-through">${(sku.price * 1.10).toFixed(2)}</p>
                                <Tag className="w-4 h-4 text-teal-600" />
                                <span className="text-xs font-semibold text-teal-600">CUSTOM</span>
                              </div>
                              <div className="p-3 bg-teal-50 rounded border border-teal-200">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <span className="text-sm font-semibold text-gray-900">Custom Price</span>
                                    <p className="text-xs text-gray-500">Includes 10% GST</p>
                                  </div>
                                  <span className="text-2xl font-bold text-teal-600">${(sku.customer_price * 1.10).toFixed(2)}</span>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="p-3 bg-gray-50 rounded border border-gray-200">
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="text-sm font-semibold text-gray-900">Base Price</span>
                                  <p className="text-xs text-gray-500">Includes 10% GST</p>
                                </div>
                                <span className="text-2xl font-bold text-gray-900">${(sku.price * 1.10).toFixed(2)}</span>
                              </div>
                            </div>
                          )}
                          <p className="text-sm text-gray-500">{sku.unit}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {selectedCustomer && skusWithPricing.filter(sku => sku.has_custom_pricing).length === 0 && (
                  <Card className="mt-6">
                    <CardContent className="p-12 text-center">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">No custom pricing set for this customer</p>
                      <p className="text-sm text-gray-500">Click "Set Custom Price" above to add custom pricing for this customer</p>
                    </CardContent>
                  </Card>
                )}
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

        {/* Case Management Tab */}
        {activeTab === 'cases' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Case Management</h2>
            
            {/* Search and Filter Controls */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Search and Sort Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        Search Cases
                      </Label>
                      <Input
                        placeholder="Search by case number, customer, or subject..."
                        value={caseSearchQuery}
                        onChange={(e) => setCaseSearchQuery(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                        <ArrowUpDown className="w-4 h-4" />
                        Sort By
                      </Label>
                      <div className="flex gap-2">
                        <Select value={caseSortBy} onValueChange={setCaseSortBy}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="created_at">Created Date</SelectItem>
                            <SelectItem value="case_number">Case Number</SelectItem>
                            <SelectItem value="customer_name">Customer</SelectItem>
                            <SelectItem value="status">Status</SelectItem>
                            <SelectItem value="priority">Priority</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCaseSortOrder(caseSortOrder === 'asc' ? 'desc' : 'asc')}
                          className="px-3"
                        >
                          {caseSortOrder === 'asc' ? '↑' : '↓'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Filter by Status
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {['open', 'in_progress', 'resolved', 'closed'].map((status) => (
                        <Button
                          key={status}
                          variant={caseStatusFilter.includes(status) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleCaseStatusFilter(status)}
                          className={caseStatusFilter.includes(status) ? 'bg-blue-500 hover:bg-blue-600' : ''}
                        >
                          {status.replace('_', ' ')}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Priority Filter */}
                  <div>
                    <Label className="text-sm font-medium mb-2">Filter by Priority</Label>
                    <div className="flex flex-wrap gap-2">
                      {['low', 'medium', 'high', 'urgent'].map((priority) => (
                        <Button
                          key={priority}
                          variant={casePriorityFilter.includes(priority) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleCasePriorityFilter(priority)}
                          className={casePriorityFilter.includes(priority) ? 'bg-orange-500 hover:bg-orange-600' : ''}
                        >
                          {priority}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Date Range Filter */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        From Date
                      </Label>
                      <Input
                        type="date"
                        value={caseDateFrom}
                        onChange={(e) => setCaseDateFrom(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        To Date
                      </Label>
                      <Input
                        type="date"
                        value={caseDateTo}
                        onChange={(e) => setCaseDateTo(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Results and Clear */}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <p className="text-sm text-gray-600">
                      Showing {getFilteredAndSortedCases().length} of {cases.length} cases
                    </p>
                    {(caseSearchQuery || caseStatusFilter.length > 0 || casePriorityFilter.length > 0 || caseDateFrom || caseDateTo || caseSortBy !== 'created_at' || caseSortOrder !== 'desc') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearCaseFilters}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid gap-4" data-testid="cases-list">
              {getFilteredAndSortedCases().map((caseItem) => (
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
              {getFilteredAndSortedCases().length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      {cases.length === 0 ? 'No cases found' : 'No cases match your filters'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Case Update Dialog */}
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

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Orders & Driver Assignment</h2>
                <p className="text-gray-600 mt-1">Create orders and assign drivers for delivery</p>
              </div>
              <Dialog open={showOrderDialog} onOpenChange={(open) => {
                setShowOrderDialog(open);
                if (!open) {
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
                  setOrderItems([{ sku_id: '', quantity: 1 }]);
                  setCustomerSkus([]);
                }
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-teal-500 hover:bg-teal-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Order
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingOrder ? 'Edit Order' : 'Create New Order'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={editingOrder ? handleUpdateOrder : handleCreateOrder} className="space-y-4">
                    <div>
                      <Label>Select Customer</Label>
                      <Select value={orderForm.customer_id} onValueChange={(value) => {
                        const selectedCustomer = customers.find(c => c.id === value);
                        setOrderForm({ 
                          ...orderForm, 
                          customer_id: value,
                          pickup_address: businessPickupAddress,
                          delivery_address: selectedCustomer?.address || ''
                        });
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.full_name} - {customer.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Order Items</Label>
                      {orderItems.map((item, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <Select 
                            value={item.sku_id} 
                            onValueChange={(value) => updateOrderItem(index, 'sku_id', value)}
                            disabled={!orderForm.customer_id}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder={orderForm.customer_id ? (customerSkus.length > 0 ? "Select item" : "No custom pricing set for this customer") : "Select customer first"} />
                            </SelectTrigger>
                            <SelectContent>
                              {customerSkus.map((sku) => {
                                const price = sku.customer_price !== undefined ? sku.customer_price : sku.price;
                                const priceIncGST = price * 1.10;
                                return (
                                  <SelectItem key={sku.id} value={sku.id}>
                                    {sku.name} - ${priceIncGST.toFixed(2)}
                                    {sku.customer_price !== undefined && ' (Custom)'}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateOrderItem(index, 'quantity', e.target.value)}
                            placeholder="Qty"
                            className="w-20"
                          />
                          {orderItems.length > 1 && (
                            <Button type="button" variant="destructive" size="sm" onClick={() => removeOrderItem(index)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={addOrderItem} className="mt-2">
                        <Plus className="w-4 h-4 mr-1" /> Add Item
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Pickup Date</Label>
                        <Input
                          type="date"
                          value={orderForm.pickup_date}
                          onChange={(e) => setOrderForm({ ...orderForm, pickup_date: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Delivery Date</Label>
                        <Input
                          type="date"
                          value={orderForm.delivery_date}
                          onChange={(e) => setOrderForm({ ...orderForm, delivery_date: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Pickup Address</Label>
                      <Input
                        value={orderForm.pickup_address}
                        onChange={(e) => setOrderForm({ ...orderForm, pickup_address: e.target.value })}
                        placeholder="Enter pickup address"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">📍 Business pickup address (auto-filled when customer selected)</p>
                    </div>

                    <div>
                      <Label>Delivery Address</Label>
                      <Input
                        value={orderForm.delivery_address}
                        onChange={(e) => setOrderForm({ ...orderForm, delivery_address: e.target.value })}
                        placeholder="Enter delivery address"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">🏠 Customer's saved address (auto-filled when customer selected, can be changed)</p>
                    </div>

                    <div>
                      <Label>Special Instructions (Optional)</Label>
                      <Input
                        value={orderForm.special_instructions}
                        onChange={(e) => setOrderForm({ ...orderForm, special_instructions: e.target.value })}
                        placeholder="Any special requirements"
                      />
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <div className="flex items-center gap-3 mb-4">
                        <Switch
                          checked={orderForm.is_recurring}
                          onCheckedChange={(checked) => setOrderForm({ ...orderForm, is_recurring: checked })}
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
                            <SelectTrigger>
                              <SelectValue placeholder="Choose recurring frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              {frequencyTemplates.map((template) => (
                                <SelectItem key={template.id} value={template.id}>
                                  {template.name} - Every {template.frequency_value} {template.frequency_type}
                                </SelectItem>
                              ))}
                              {frequencyTemplates.length === 0 && (
                                <div className="p-2 text-sm text-gray-500 text-center">
                                  No templates available. Create one in Frequency Templates tab.
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    {/* Order Total with GST Breakdown */}
                    {orderItems.some(item => item.sku_id && item.quantity) && (
                      <div className="border-t pt-4 mt-4 bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
                        <div className="space-y-2">
                          {orderItems.map((item, index) => {
                            const sku = customerSkus.find(s => s.id === item.sku_id);
                            if (!sku || !item.quantity) return null;
                            const price = sku.customer_price !== undefined ? sku.customer_price : sku.price;
                            const lineTotal = price * parseInt(item.quantity || 0);
                            return (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  {sku.name} x {item.quantity}
                                </span>
                                <span className="text-gray-900 font-medium">
                                  ${lineTotal.toFixed(2)}
                                </span>
                              </div>
                            );
                          })}
                          
                          {(() => {
                            const subtotalExGST = orderItems.reduce((total, item) => {
                              const sku = customerSkus.find(s => s.id === item.sku_id);
                              if (!sku || !item.quantity) return total;
                              const price = sku.customer_price !== undefined ? sku.customer_price : sku.price;
                              return total + (price * parseInt(item.quantity || 0));
                            }, 0);
                            const gstAmount = subtotalExGST * 0.10;
                            const totalIncGST = subtotalExGST + gstAmount;
                            
                            return (
                              <div className="border-t pt-3 mt-3">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <p className="text-xs text-gray-500">Includes 10% GST</p>
                                  </div>
                                  <span className="text-2xl font-bold text-teal-600">${totalIncGST.toFixed(2)}</span>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    )}

                    <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600" disabled={creatingOrder}>
                      {creatingOrder ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          {editingOrder ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        editingOrder ? 'Update Order' : 'Create Order'
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Filter & Sort Controls */}
                <div className="mb-6 space-y-4">
                  {/* Search Bar */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search by order #, customer name, or email..."
                        value={orderSearchQuery}
                        onChange={(e) => setOrderSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {(orderSearchQuery || orderStatusFilter.length > 0 || orderDeliveryStatusFilter.length > 0 || orderDateFilter !== 'all' || orderDateFrom || orderDateTo || orderTypeFilter !== 'all') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAllOrderFilters}
                        className="whitespace-nowrap"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Clear Filters
                      </Button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Sort By */}
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium whitespace-nowrap">Sort by:</Label>
                      <Select value={orderSortBy} onValueChange={setOrderSortBy}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="created_at">Order Date</SelectItem>
                          <SelectItem value="delivery_date">Delivery Date</SelectItem>
                          <SelectItem value="order_number">Order Number</SelectItem>
                          <SelectItem value="customer_name">Customer Name</SelectItem>
                          <SelectItem value="status">Status</SelectItem>
                          <SelectItem value="total_amount">Total Amount</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setOrderSortOrder(orderSortOrder === 'asc' ? 'desc' : 'asc')}
                        title={orderSortOrder === 'asc' ? 'Ascending' : 'Descending'}
                      >
                        <ArrowUpDown className="w-4 h-4" />
                        {orderSortOrder === 'asc' ? '↑' : '↓'}
                      </Button>
                    </div>

                    {/* Date Filter */}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <Select value={orderDateFilter} onValueChange={setOrderDateFilter}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Dates</SelectItem>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="week">This Week</SelectItem>
                          <SelectItem value="month">This Month</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Custom Date Range Inputs */}
                    {orderDateFilter === 'custom' && (
                      <div className="flex items-center gap-2">
                        <Label className="text-sm whitespace-nowrap">From:</Label>
                        <Input
                          type="date"
                          value={orderDateFrom}
                          onChange={(e) => setOrderDateFrom(e.target.value)}
                          className="w-[150px]"
                        />
                        <Label className="text-sm whitespace-nowrap">To:</Label>
                        <Input
                          type="date"
                          value={orderDateTo}
                          onChange={(e) => setOrderDateTo(e.target.value)}
                          className="w-[150px]"
                        />
                      </div>
                    )}

                    {/* Type Filter */}
                    <div className="flex items-center gap-2">
                      <Repeat className="w-4 h-4 text-gray-500" />
                      <Select value={orderTypeFilter} onValueChange={setOrderTypeFilter}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="regular">Regular Only</SelectItem>
                          <SelectItem value="recurring">Recurring Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Status Filter Chips */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <Label className="text-sm font-medium">Status:</Label>
                    {['pending', 'scheduled', 'processing', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'cancelled'].map(status => (
                      <button
                        key={status}
                        onClick={() => toggleStatusFilter(status)}
                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                          orderStatusFilter.includes(status)
                            ? 'bg-teal-500 text-white border-teal-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-teal-500'
                        }`}
                      >
                        {getStatusDisplayName(status)}
                      </button>
                    ))}
                  </div>

                  {/* Delivery Status Filter Chips */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Truck className="w-4 h-4 text-gray-500" />
                    <Label className="text-sm font-medium">Delivery Status:</Label>
                    {['assigned', 'picked_up', 'out_for_delivery', 'delivered'].map(deliveryStatus => (
                      <button
                        key={deliveryStatus}
                        onClick={() => toggleDeliveryStatusFilter(deliveryStatus)}
                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                          orderDeliveryStatusFilter.includes(deliveryStatus)
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                        }`}
                      >
                        {deliveryStatus.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>

                  {/* Results Count */}
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold">{getFilteredAndSortedOrders().length}</span> of <span className="font-semibold">{orders.length}</span> orders
                  </div>
                </div>

                {getFilteredAndSortedOrders().length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>{orderSearchQuery || orderStatusFilter.length > 0 || orderDeliveryStatusFilter.length > 0 || orderDateFilter !== 'all' || orderDateFrom || orderDateTo || orderTypeFilter !== 'all' 
                      ? 'No orders match your filters' 
                      : 'No orders available'}</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Driver</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assign Driver</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {getFilteredAndSortedOrders().map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.order_number}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{order.customer_name}</td>
                            <td className="px-4 py-3">
                              {order.is_recurring ? (
                                <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 flex items-center gap-1 w-fit">
                                  <Repeat className="w-3 h-3" />
                                  Recurring
                                </span>
                              ) : (
                                <span className="text-xs text-gray-500">Regular</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                order.status === 'ready_for_pickup' ? 'bg-green-100 text-green-800' :
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {getStatusDisplayName(order.status)}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {order.delivery_status ? (
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  order.delivery_status === 'delivered' ? 'bg-green-100 text-green-800' :
                                  order.delivery_status === 'out_for_delivery' ? 'bg-orange-100 text-orange-800' :
                                  order.delivery_status === 'picked_up' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {order.delivery_status.replace(/_/g, ' ')}
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">Not assigned</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {order.driver_name || <span className="text-gray-400">-</span>}
                            </td>
                            <td className="px-4 py-3">
                              {order.driver_id ? (
                                <div className="flex items-center gap-2">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    ✓ Already Assigned
                                  </span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleUnassignDriver(order.id)}
                                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                    title="Unassign driver to reassign"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Select 
                                    value={selectedDriver[order.id] || ''} 
                                    onValueChange={(value) => setSelectedDriver({ ...selectedDriver, [order.id]: value })}
                                  >
                                    <SelectTrigger className="w-40">
                                      <SelectValue placeholder="Select driver" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {drivers.map((driver) => (
                                        <SelectItem key={driver.id} value={driver.id}>
                                          {driver.full_name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleAssignDriver(order.id)}
                                    className="bg-teal-500 hover:bg-teal-600"
                                  >
                                    Assign
                                  </Button>
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditOrder(order)}
                                  disabled={creatingOrder}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  title="Edit order (Owner can always edit)"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteOrder(order.id)}
                                  disabled={deletingOrderId === order.id}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  {deletingOrderId === order.id ? (
                                    <span className="animate-spin">⏳</span>
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </Button>
                                {order.is_locked ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleUnlockOrder(order.id)}
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                    title="Unlock order to allow customer edits"
                                  >
                                    <Unlock className="w-4 h-4" />
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleLockOrder(order.id)}
                                    className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                                    title="Lock order to prevent customer edits"
                                  >
                                    <Lock className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Driver List */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Available Drivers</CardTitle>
              </CardHeader>
              <CardContent>
                {drivers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No drivers available. Create driver accounts in User Management.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {drivers.map((driver) => (
                      <Card key={driver.id} className="border border-gray-200">
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-teal-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{driver.full_name}</p>
                              <p className="text-sm text-gray-600">{driver.email}</p>
                              {driver.phone && <p className="text-xs text-gray-500">{driver.phone}</p>}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Delivery Tracking Tab */}
        {activeTab === 'delivery-tracking' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Delivery Tracking</h2>
              <p className="text-gray-600 mt-1">Track delivery progress and view detailed timeline</p>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Driver Search and Date Range */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search by driver name..."
                        value={deliveryTrackingDriverFilter}
                        onChange={(e) => setDeliveryTrackingDriverFilter(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Label className="text-sm whitespace-nowrap">From:</Label>
                      <Input
                        type="date"
                        value={deliveryTrackingDateFrom}
                        onChange={(e) => setDeliveryTrackingDateFrom(e.target.value)}
                        className="w-[150px]"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Label className="text-sm whitespace-nowrap">To:</Label>
                      <Input
                        type="date"
                        value={deliveryTrackingDateTo}
                        onChange={(e) => setDeliveryTrackingDateTo(e.target.value)}
                        className="w-[150px]"
                      />
                    </div>

                    {(deliveryTrackingStatusFilter.length > 0 || deliveryTrackingDriverFilter || deliveryTrackingDateFrom || deliveryTrackingDateTo) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearDeliveryTrackingFilters}
                        className="whitespace-nowrap"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>

                  {/* Delivery Status Filter Chips */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Truck className="w-4 h-4 text-gray-500" />
                    <Label className="text-sm font-medium">Delivery Status:</Label>
                    {['assigned', 'picked_up', 'out_for_delivery', 'delivered'].map(status => (
                      <button
                        key={status}
                        onClick={() => toggleDeliveryTrackingStatusFilter(status)}
                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                          deliveryTrackingStatusFilter.includes(status)
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                        }`}
                      >
                        {status.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>

                  {/* Results Count */}
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold">{getFilteredDeliveryOrders().length}</span> of <span className="font-semibold">{orders.filter(o => o.driver_id).length}</span> deliveries
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Orders List */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Orders with Delivery</CardTitle>
                </CardHeader>
                <CardContent className="max-h-[600px] overflow-y-auto">
                  {getFilteredDeliveryOrders().length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Truck className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>{orders.filter(o => o.driver_id).length === 0 ? 'No orders with assigned drivers' : 'No deliveries match your filters'}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {getFilteredDeliveryOrders().map((order) => (
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
                            Driver: {order.driver_name}
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
                  <CardTitle>Delivery Timeline</CardTitle>
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
                            <p className="text-xs text-gray-600">Driver</p>
                            <p className="font-semibold">{selectedOrderForTracking.driver_name}</p>
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
                                <p className="text-sm text-gray-600">
                                  {new Date(selectedOrderForTracking.assigned_at).toLocaleString()}
                                </p>
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
                                selectedOrderForTracking.delivery_status === 'out_for_delivery' || selectedOrderForTracking.delivery_status === 'delivered' 
                                  ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'
                              }`}>
                                <Truck className="w-5 h-5" />
                              </div>
                              {(selectedOrderForTracking.delivery_status === 'out_for_delivery' || selectedOrderForTracking.delivery_status === 'delivered') && 
                                <div className="w-0.5 h-16 bg-orange-500 mt-2"></div>}
                            </div>
                            <div className="flex-1 pt-2">
                              <p className="font-semibold text-gray-900">Out for Delivery</p>
                              <p className="text-sm text-gray-600">
                                {selectedOrderForTracking.delivery_status === 'out_for_delivery' || selectedOrderForTracking.delivery_status === 'delivered'
                                  ? 'In transit to delivery address'
                                  : 'Waiting for dispatch'}
                              </p>
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
                                <>
                                  <p className="text-sm text-gray-600">
                                    {new Date(selectedOrderForTracking.delivered_at).toLocaleString()}
                                  </p>
                                  {selectedOrderForTracking.delivery_notes && (
                                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                                      <p className="text-xs text-gray-600">Delivery Notes:</p>
                                      <p className="text-gray-800">{selectedOrderForTracking.delivery_notes}</p>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <p className="text-sm text-gray-400">Not delivered yet</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default OwnerDashboard;