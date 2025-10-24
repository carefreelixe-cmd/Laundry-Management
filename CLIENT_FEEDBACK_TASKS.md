# Client Feedback - Implementation Tasks

**Last Updated**: October 24, 2025

## ✅ COMPLETED (Previous Work)

### 1. Password Reset & User Management ✅
- [x] Owner can reset passwords for all users
- [x] Admin can reset passwords for all users
- [x] Password reset in Owner Dashboard (Users tab)
- [x] Password reset in Admin Dashboard (User Management tab)
- [x] Email notifications on password reset

### 2. GST Compliance (10% Australian GST) ✅
- [x] All prices entered as Ex GST
- [x] GST breakdown displayed everywhere
- [x] Customer Dashboard shows: Subtotal (Ex GST), GST (10%), Total (Inc GST)
- [x] Owner Dashboard order creation shows GST breakdown
- [x] Owner Dashboard SKU cards show GST breakdown
- [x] Owner Dashboard customer pricing shows GST breakdown
- [x] Professional formatting with clear labels

### 3. Recurring Order Date Logic Fix ✅
- [x] Next occurrence calculated from DELIVERY DATE (not creation date)
- [x] Fixed in owner order creation endpoint
- [x] Fixed in customer order creation endpoint
- [x] Fixed in order update endpoint

### 4. Customer SKU Filtering ✅
- [x] Owner Dashboard only shows SKUs with custom pricing for selected customer
- [x] Customer Dashboard already working correctly
- [x] Dropdown filtered to customerSkus

### 5. Email Notifications ✅
- [x] Order created/scheduled - email sent
- [x] Order processing - email sent
- [x] Ready for delivery - email sent
- [x] Out for delivery - email sent
- [x] Delivered - email sent
- [x] Order cancelled - email sent
- [x] Professional HTML templates with status-specific colors
- [x] Complete order details in each email

### 6. Driver Assignment Fix ✅
- [x] Prevent assigning same order to driver twice
- [x] Visual "Already Assigned" badge
- [x] Backend validation prevents duplicate assignments
- [x] Unassign driver functionality added
- [x] Notifications for driver assignment/unassignment

---

## 🔴 HIGH PRIORITY - IN PROGRESS

### 7. Sort & Filter Functionality (ALL PORTALS) 🚧
**Priority**: CRITICAL
**Status**: TODO

#### Requirements:
- **Sort Options:**
  - [ ] Sort by Delivery Date (ascending/descending)
  - [ ] Sort by Order Date/Created Date (ascending/descending)
  - [ ] Sort by Order Number
  - [ ] Sort by Customer Name (A-Z, Z-A)

- **Filter Options:**
  - [ ] Filter by Order Status (scheduled, processing, ready, delivered, cancelled)
  - [ ] Filter by Customer Name (searchable dropdown)
  - [ ] Filter by Date Range (pickup date, delivery date)
  - [ ] Quick Filters: Today, This Week, This Month, This Year

- **Affected Portals:**
  - [ ] Owner Dashboard - Orders tab
  - [ ] Admin Dashboard - Orders tab
  - [ ] Customer Dashboard - My Orders
  - [ ] Driver Dashboard - My Deliveries

- **Case Management Filters:**
  - [ ] Sort by date created, priority, status
  - [ ] Filter by status, date range, customer

#### Implementation Plan:
1. Create reusable FilterSort component
2. Add backend API support for query parameters
3. Implement in each dashboard
4. Add "Clear Filters" button
5. Persist filter state in URL/localStorage

---

### 8. Order Status Rename & Locking Logic 🚧
**Priority**: CRITICAL
**Status**: TODO

#### Part A: Status Rename
- [ ] Change "completed" → "ready_for_pickup"
- [ ] Update database enum/validation
- [ ] Update all frontend displays
- [ ] Update email templates
- [ ] Update status badges colors

#### Part B: Order Locking Logic Fix
**Current**: Orders lock 8 hours after CREATION
**Required**: Orders lock 8 hours before DELIVERY

- [ ] Update locking calculation logic
- [ ] Lock should check: `current_time >= (delivery_date - 8 hours)`
- [ ] Lock only applies to CUSTOMER role
- [ ] Owner/Admin can edit anytime
- [ ] Add visual indicator: "Locked for customer" vs "Editable"

#### Implementation Files:
- `backend/server.py` - Update locking logic
- `frontend/src/pages/CustomerDashboard.js` - Check lock status
- `frontend/src/pages/OwnerDashboard.js` - Allow editing
- `frontend/src/pages/AdminDashboard.js` - Allow editing

---

### 9. Access Rights Updates 🚧
**Priority**: HIGH
**Status**: TODO

#### Owner Portal - Full Access
- [ ] Orders Management (already has)
- [ ] Driver Assignment (already has)
- [ ] Case Management ⚠️ **Need to add**
- [ ] SKU Management (already has)
- [ ] Customer Pricing (already has)
- [ ] User Management (already has)
- [ ] All Reports/Analytics

#### Admin Portal - Expanded Access
- [ ] Orders Management ⚠️ **Need to add/verify**
- [ ] Driver Assignment ⚠️ **Need to add**
- [ ] Case Management (already has)
- [ ] SKU Management ⚠️ **Need to add**
- [ ] Customer Pricing ⚠️ **Need to add**
- [ ] User Management (already has)

#### Implementation:
- [ ] Add "Cases" tab to Owner Dashboard
- [ ] Copy case management UI from Admin
- [ ] Add "Orders" tab to Admin (if not present)
- [ ] Add "Driver Assignment" to Admin Orders
- [ ] Add "SKU & Pricing" tab to Admin
- [ ] Update backend role checks

---

### 10. User Management - Disable/Enable Users 🚧
**Priority**: HIGH
**Status**: TODO

#### Requirements:
- [ ] Replace "Delete User" with "Disable/Enable" toggle
- [ ] Add `is_active` boolean field to User model
- [ ] Visual status indicator (Active/Disabled badge)
- [ ] Disabled users cannot login
- [ ] Show disabled users in gray/dimmed
- [ ] Filter: "Active Users" / "Disabled Users" / "All Users"

#### UI Changes:
- [ ] Owner Dashboard - User Management
- [ ] Admin Dashboard - User Management
- [ ] Replace Trash icon with Toggle/Switch
- [ ] Color coding: Green (Active), Red (Disabled)

#### Backend:
- [ ] Add `is_active` field to User model (default: True)
- [ ] Update login to check is_active
- [ ] Create disable/enable endpoint
- [ ] Update seed data if needed

---

### 11. Address Auto-Population 🚧
**Priority**: HIGH
**Status**: TODO

#### Requirements:
- [ ] Store default addresses in customer profile
- [ ] Add fields to User model:
  - `default_delivery_address`
  - `default_pickup_address` (optional)
- [ ] Auto-fill when creating order for customer
- [ ] Allow override if needed
- [ ] Show "Use default address" checkbox

#### Affected Forms:
- [ ] Owner Dashboard - Create Order
- [ ] Admin Dashboard - Create Order  
- [ ] Customer Dashboard - Create Order

#### Business Address:
- [ ] Store business pickup address in settings/config
- [ ] Auto-populate pickup address for all orders

---

## 🟡 MEDIUM PRIORITY - TODO

### 12. Recurring Orders Improvements 🔲
**Status**: TODO

#### Auto-Create Next Order
- [ ] After order delivered, auto-create next recurring order
- [ ] Update order number (increment)
- [ ] Copy all details from template
- [ ] Set new delivery date based on frequency
- [ ] Notify customer of new order created

#### Recurrence Calendar View
- [ ] Show upcoming recurrence dates
- [ ] Visual calendar/list of future deliveries
- [ ] Highlight next 3-5 occurrences
- [ ] Show pattern clearly (e.g., "Every Monday")

#### Customer Modification Approval
- [ ] When customer modifies recurring order, create approval request
- [ ] Owner/Admin receives notification
- [ ] Approve/Reject interface
- [ ] Changes apply to all future occurrences
- [ ] Delete should ask: "This occurrence only" or "All future"

---

### 13. Driver Portal Mobile Optimization 🔲
**Status**: TODO

#### Requirements:
- [ ] Responsive design for mobile screens
- [ ] Large touch-friendly buttons
- [ ] Simple, clean interface
- [ ] Quick status update toggles
- [ ] Today's deliveries prominent
- [ ] Easy navigation
- [ ] Minimal scrolling
- [ ] Test on actual mobile devices

---

### 14. Remove Signup Page 🔲
**Status**: TODO

- [ ] Remove/hide signup route
- [ ] Update landing page (remove signup button)
- [ ] Only show login button
- [ ] Add message: "Contact administrator to create account"
- [ ] Users can only be created by Owner/Admin

---

## 🟢 LOWER PRIORITY - BACKLOG

### 15. Case Management for Owner ⏸️
- [ ] Add Cases tab to Owner Dashboard
- [ ] Copy all case management features from Admin
- [ ] Same permissions as Admin

### 16. UI/UX Improvements ⏸️
- [ ] Better spacing and readability
- [ ] Consistent button styles
- [ ] Loading states everywhere
- [ ] Error handling improvements
- [ ] Success feedback (toasts)
- [ ] Confirmation dialogs

---

## 📊 PROGRESS TRACKER

**Total Tasks**: 16
**Completed**: 6 ✅ (37.5%)
**In Progress**: 6 🚧 (37.5%)
**TODO**: 4 🔲 (25%)

---

## 🎯 NEXT STEPS (Immediate)

1. **Sort & Filter** - Start with Owner Dashboard Orders
2. **Status Rename** - "completed" → "ready_for_pickup"
3. **Lock Logic** - Fix to 8 hours before delivery
4. **Admin Access** - Add Orders, SKUs, Pricing tabs
5. **Disable Users** - Replace delete with disable/enable

---

## 📝 NOTES

### Email Notifications Status
- Feature is implemented but client reports not receiving emails
- **Action Required**: 
  - [ ] Verify Gmail credentials in backend/.env
  - [ ] Check spam folder
  - [ ] Test with different email address
  - [ ] Review backend logs for errors
  - [ ] Confirm GMAIL_USER and GMAIL_PASSWORD are set

### Order Status Issue (Order 12)
- Client reports order shows "pending" after delivery
- **Action Required**:
  - [ ] Investigate order 12 in database
  - [ ] Check delivery_status vs status fields
  - [ ] Verify status update logic
  - [ ] Test delivery workflow end-to-end

### Locked Orders (11-16)
- Client reports orders are locked and can't be edited
- **Action Required**:
  - [ ] Check creation timestamps
  - [ ] Verify 8-hour logic is working
  - [ ] Implement new logic (8 hours before delivery)
  - [ ] Test lock/unlock scenarios

---

**Last Review**: October 24, 2025
**Next Review**: After completing HIGH PRIORITY tasks
