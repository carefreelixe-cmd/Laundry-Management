# Email Notifications & 8-Hour Lock Implementation

## Overview
This document summarizes the comprehensive email notification system and 8-hour order lock mechanism implemented in the Laundry Management System.

## ✅ Implemented Features

### 1. **8-Hour Order Lock Mechanism**

#### How It Works:
- Orders are automatically locked **8 hours before the delivery date**
- Once locked, customers cannot edit or cancel the order
- Frontend checks: `canModifyOrder()` function calculates hours until delivery
- Backend enforcement: `update_order` endpoint rejects locked orders with HTTP 400

#### Implementation Details:

**Scheduled Job (`lock_orders_job`):**
- Runs **every hour** via APScheduler
- Queries orders where:
  - `delivery_date <= current_time + 8 hours`
  - `is_locked != true`
  - `status not in ['completed', 'cancelled']`
- Sets `is_locked = true` and `locked_at = current_timestamp`
- Sends notification to customer about lock

**Frontend Validation:**
```javascript
const canModifyOrder = (deliveryDate) => {
  const delivery = new Date(deliveryDate);
  const now = new Date();
  const hoursUntilDelivery = (delivery - now) / (1000 * 60 * 60);
  return hoursUntilDelivery > 8;
};
```

**Backend Validation:**
```python
if order_doc.get('is_locked', False):
    raise HTTPException(status_code=400, detail="Cannot modify order - it has been locked after 8 hours")
```

---

### 2. **Comprehensive Email Notification System**

#### Architecture:
All notifications use the `send_notification()` function which:
1. Stores notification in MongoDB `notifications` collection
2. Emits Socket.IO event for real-time in-app notifications
3. **Sends email via Gmail SMTP** using `send_email()` from `utils.email_service`

#### Email Notifications for All Actions:

| Action | Customer Email | Admin/Owner Email | Details Included |
|--------|---------------|-------------------|------------------|
| **Order Created** | ✅ Yes | ✅ Yes | Order number, type (regular/recurring), customer name, total amount, items list, pickup/delivery dates & addresses |
| **Order Updated** | ✅ Yes | ✅ Yes | Order number, status, total amount, pickup/delivery dates |
| **Order Cancelled** | ✅ Yes | ✅ Yes | Order number, type, status, total amount, pickup/delivery dates |
| **Order Locked** | ✅ Yes | ✅ Yes | Order number, lock reason (8-hour rule) |
| **Case Created** | ✅ Yes | ✅ Yes | Case number, customer details, type, subject, description, priority |
| **Case Updated** | ✅ Yes | ❌ No | Case number, status, priority, type |
| **Recurring Order Cancelled** | ✅ Yes | ❌ No | Order number, recurring info |

---

### 3. **Enhanced Email Content**

#### Order Creation Email Example:
```
Subject: Order Created Successfully

Your order has been created successfully.

Order Number: ORD-000123
Order Type: Regular
Customer: John Doe
Email: john@example.com
Total Amount: $45.50

Items:
  - Shirt: 5 x $3.00 = $15.00
  - Pants: 3 x $5.50 = $16.50
  - Bedsheet: 2 x $7.00 = $14.00

Pickup:
  - Date: 2024-01-15
  - Address: 123 Main St, City, State

Delivery:
  - Date: 2024-01-17
  - Address: 123 Main St, City, State
```

#### Order Cancellation Email Example:
```
Subject: Order Cancelled

Your order #ORD-000123 has been cancelled.

Order Number: ORD-000123
Order Type: Recurring
Status: Cancelled
Total Amount: $45.50
Pickup Date: 2024-01-15
Delivery Date: 2024-01-17
```

#### Case Creation Email Example:
```
Subject: Case Created Successfully

Your case #CASE-000045 has been created and our team will review it shortly.

Case Number: CASE-000045
Customer: Jane Smith
Email: jane@example.com
Phone: +1234567890
Type: complaint
Subject: Missing item
Description: One shirt was not returned
Priority: high
```

---

### 4. **Code Changes Summary**

#### **backend/server.py** - Modified Functions:

1. **`lock_orders_job()`** (Line ~1240)
   - **FIXED**: Changed from checking `created_at` to `delivery_date`
   - Now correctly locks orders **8 hours before delivery**, not 8 hours after creation

2. **`cancel_order()`** (Line ~1016)
   - **ADDED**: Email notifications to customer and all admins/owners
   - **ADDED**: Detailed order information in email body
   - **REPLACED**: Old `create_notification()` with `send_notification()`

3. **`create_case()`** (Line ~1099)
   - **ADDED**: Email notification to customer confirming case creation
   - **ADDED**: Email notifications to all admins/owners
   - **ADDED**: Full case details in email body
   - **REPLACED**: Old `create_notification()` with `send_notification()`

4. **`update_case()`** (Line ~1182)
   - **ADDED**: Email notification to customer
   - **ADDED**: Case details in email body
   - **REPLACED**: Old `create_notification()` with `send_notification()`

5. **`create_customer_order()`** (Line ~850)
   - **ENHANCED**: Email content now includes full order details
   - **ADDED**: Items list, pickup/delivery addresses, total amount breakdown

6. **`update_order()`** (Line ~948)
   - **ENHANCED**: Email notifications now include order details
   - **ADDED**: Order status, total amount, dates

---

### 5. **Email Service Configuration**

**Environment Variables Required** (in `backend/.env`):
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
```

**Email Service** (`backend/utils/email_service.py`):
- Uses Gmail SMTP with TLS encryption
- Supports HTML email format
- Sends OTP emails for password reset
- Sends welcome emails on registration
- Sends all notification emails

---

### 6. **Scheduled Jobs**

**APScheduler Configuration:**

| Job | Schedule | Purpose |
|-----|----------|---------|
| `lock_orders_job` | Every 1 hour | Lock orders within 8 hours of delivery |
| `generate_recurring_orders_job` | Daily at midnight | Generate next occurrence of recurring orders |

**Startup Configuration** (Line ~1447):
```python
@app.on_event("startup")
async def startup_event():
    scheduler.start()
    scheduler.add_job(lock_orders_job, IntervalTrigger(hours=1), ...)
    scheduler.add_job(generate_recurring_orders_job, CronTrigger(hour=0, minute=0), ...)
```

---

## 🔍 Testing Checklist

### Test 8-Hour Lock:
1. ✅ Create an order with delivery date > 8 hours from now
2. ✅ Verify order shows "Editable" in customer dashboard
3. ✅ Create an order with delivery date < 8 hours from now
4. ✅ Wait for scheduled job to run (or manually trigger)
5. ✅ Verify order shows "Locked" and edit button is hidden
6. ✅ Try to update locked order via API - should get HTTP 400 error

### Test Email Notifications:
1. ✅ Create order → Check customer and admin emails
2. ✅ Update order → Check customer and admin emails
3. ✅ Cancel order → Check customer and admin emails
4. ✅ Create case → Check customer and admin emails
5. ✅ Update case → Check customer email
6. ✅ Wait for order to lock → Check customer email

### Verify Email Content:
1. ✅ Order emails include all items with prices
2. ✅ Order emails include pickup and delivery details
3. ✅ Case emails include full case information
4. ✅ All emails have proper formatting

---

## 📝 Business Logic Summary

### Order Lifecycle:
1. **Created** → Email sent to customer + admins (with full details)
2. **Updated** → Email sent to customer + admins (with changes)
3. **8 hours before delivery** → Auto-locked, email sent to customer
4. **Cancelled** → Email sent to customer + admins (with reason)

### Case Lifecycle:
1. **Created** → Email sent to customer (confirmation) + admins (new case alert)
2. **Updated** → Email sent to customer (status update)
3. **Resolved** → Email sent to customer (resolution details)

### Customer Experience:
- Receives email for EVERY action on their orders and cases
- Can edit orders only if delivery is more than 8 hours away
- Gets detailed breakdown of items, prices, and dates in emails

### Admin/Owner Experience:
- Receives email for ALL customer actions (new orders, cancellations)
- Gets full customer details and order information in emails
- Can track all activity via email trail

---

## 🚀 Next Steps (Optional Enhancements)

1. **SMS Notifications** - Add SMS alerts for critical actions
2. **Email Templates** - Use HTML templates for better formatting
3. **Notification Preferences** - Allow users to customize email preferences
4. **Webhook Integration** - Add webhooks for third-party integrations
5. **Push Notifications** - Add mobile push notifications

---

## 🐛 Known Issues / Limitations

1. ✅ **FIXED**: Lock job was checking `created_at` instead of `delivery_date`
2. ✅ **FIXED**: Cancel and case endpoints used old `create_notification()` without emails
3. ✅ **FIXED**: Email content was minimal, now includes full details

---

## 📌 Important Notes

- **Email Rate Limits**: Gmail has sending limits (500/day for free accounts)
- **Scheduled Jobs**: Require uvicorn server to be running continuously
- **Time Zones**: All times use UTC, ensure proper timezone conversion in frontend
- **Database Fields**: 
  - `is_locked` (boolean)
  - `locked_at` (datetime)
  - `delivery_date` (datetime)

---

**Last Updated**: January 2024
**Status**: ✅ Fully Implemented and Tested
