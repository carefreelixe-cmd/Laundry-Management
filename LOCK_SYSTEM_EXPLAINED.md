# 🔒 Order Lock System - Complete Explanation

## 📌 What is the Lock System?

The **8-Hour Lock System** is a business rule that **prevents customers from editing or cancelling orders** when the delivery date is **within 8 hours**.

This ensures the laundry business has enough time to prepare orders without last-minute changes.

---

## 🎯 How It Works - Step by Step

### **Timeline Example:**

```
Monday 9:00 AM - Customer creates order for Tuesday 10:00 AM delivery

Monday 9:00 AM ────────────────────► Tuesday 2:00 AM ───────────► Tuesday 10:00 AM
    [Order Created]                    [LOCKED HERE]              [Delivery]
    ✅ Can Edit/Cancel                 🔒 LOCKED                   📦 Delivered
    (25 hours until delivery)          (8 hours left)              (0 hours)
```

**Key Points:**
- ✅ **Before Lock (25 hrs → 8 hrs)**: Customer can edit/cancel freely
- 🔒 **Lock Trigger (8 hours before)**: System automatically locks the order
- ❌ **After Lock (8 hrs → 0 hrs)**: Customer CANNOT edit or cancel

---

## 💻 Technical Implementation

### **1. Frontend Lock Check (Real-time)**

**File:** `frontend/src/pages/CustomerDashboard.js`

```javascript
const canModifyOrder = (deliveryDate) => {
  const delivery = new Date(deliveryDate);  // e.g., "2024-01-16T10:00:00Z"
  const now = new Date();                    // Current time
  const hoursUntilDelivery = (delivery - now) / (1000 * 60 * 60);
  
  return hoursUntilDelivery > 8;  // TRUE if more than 8 hours, FALSE if less
};
```

**Example Calculation:**
```javascript
// Scenario 1: Order can be modified
Delivery Date: Jan 16, 10:00 AM
Current Time:  Jan 15, 6:00 PM
Hours Until:   16 hours
Result:        hoursUntilDelivery (16) > 8 → TRUE ✅ Can edit

// Scenario 2: Order is locked
Delivery Date: Jan 16, 10:00 AM
Current Time:  Jan 16, 5:00 AM
Hours Until:   5 hours
Result:        hoursUntilDelivery (5) > 8 → FALSE 🔒 Locked
```

---

### **2. Backend Scheduled Lock Job (Automatic)**

**File:** `backend/server.py` - Line 1338

```python
async def lock_orders_job():
    """Runs every 1 hour via APScheduler"""
    
    current_time = datetime.now(timezone.utc)  # e.g., Jan 16, 2:00 AM
    lock_threshold = current_time + timedelta(hours=8)  # Jan 16, 10:00 AM
    
    # Find all orders where:
    # 1. delivery_date <= lock_threshold (delivery within 8 hours)
    # 2. is_locked is not True (not already locked)
    # 3. status is not completed or cancelled
    orders_to_lock = await db.orders.find({
        "is_locked": {"$ne": True},
        "delivery_date": {"$lte": lock_threshold.isoformat()},
        "status": {"$nin": ["completed", "cancelled"]}
    }).to_list(length=None)
    
    for order in orders_to_lock:
        # Lock the order
        await db.orders.update_one(
            {"id": order["id"]},
            {"$set": {
                "is_locked": True,
                "locked_at": current_time.isoformat()
            }}
        )
        
        # Send email notification to customer
        await notify_order_locked(order)
```

**Job Schedule:**
```python
# Runs every 1 hour automatically
scheduler.add_job(
    lock_orders_job,
    IntervalTrigger(hours=1),
    id='lock_orders',
    replace_existing=True
)
```

---

### **3. Backend Lock Enforcement (API Protection)**

**File:** `backend/server.py` - Line 928

```python
@api_router.put("/orders/{order_id}")
async def update_order(order_id: str, update: OrderUpdate, current_user: dict):
    order_doc = await db.orders.find_one({"id": order_id})
    
    # ❌ REJECT if order is locked
    if order_doc.get('is_locked', False):
        raise HTTPException(
            status_code=400, 
            detail="Cannot modify order - it has been locked after 8 hours"
        )
    
    # ✅ Proceed with update if not locked
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    await db.orders.update_one({"id": order_id}, {"$set": update_data})
    
    return updated_order
```

---

## 🖼️ User Interface Examples

### **Scenario A: Order Can Be Modified (> 8 hours)**

```
┌─────────────────────────────────────────────────┐
│  Order #ORD-000001                              │
│  Status: Pending  |  Type: Regular              │
│  ✅ Editable                                    │
├─────────────────────────────────────────────────┤
│  📦 Pickup: Jan 15, 2024 6:00 PM                │
│  🚚 Delivery: Jan 16, 2024 10:00 AM             │
│  💰 Total: $45.50                               │
│                                                 │
│  [Edit Order]  [Cancel Order]  ← Buttons shown │
└─────────────────────────────────────────────────┘
```

### **Scenario B: Order is Locked (< 8 hours)**

```
┌─────────────────────────────────────────────────┐
│  Order #ORD-000001                              │
│  Status: Pending  |  Type: Regular              │
│  🔒 Locked                                      │
├─────────────────────────────────────────────────┤
│  📦 Pickup: Jan 15, 2024 6:00 PM                │
│  🚚 Delivery: Jan 16, 2024 10:00 AM             │
│  💰 Total: $45.50                               │
│                                                 │
│  ⚠️ This order cannot be modified               │
│  (within 8 hours of delivery)  ← Warning shown │
│                                                 │
│  [Buttons Hidden]  ← No edit/cancel buttons    │
└─────────────────────────────────────────────────┘
```

---

## 📧 Email Notification Example

**When Order Gets Locked:**

```
To: customer@example.com
Subject: Order Locked

Dear John Doe,

Your order #ORD-000001 has been automatically locked.

The delivery is scheduled within the next 8 hours, and the 
order can no longer be modified or cancelled.

Order Details:
- Pickup: Jan 15, 2024 6:00 PM
- Delivery: Jan 16, 2024 10:00 AM
- Total: $45.50

Thank you for your business!

---
Laundry Management System
```

---

## 🔄 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    ORDER LIFECYCLE                          │
└─────────────────────────────────────────────────────────────┘

Step 1: Customer Creates Order
┌──────────────────────────┐
│ Delivery: Jan 16, 10 AM  │ ← Customer selects delivery date/time
│ Created: Jan 15, 9 AM    │
│ is_locked: FALSE         │ ← Order is NOT locked initially
└──────────────────────────┘
         ↓
         
Step 2: Customer Can Edit (25 hours until delivery)
┌──────────────────────────┐
│ Current: Jan 15, 2 PM    │ ← 20 hours until delivery
│ Hours Left: 20           │
│ Can Edit: YES ✅         │ ← Edit/Cancel buttons visible
└──────────────────────────┘
         ↓
         
Step 3: Scheduled Job Runs (Every Hour)
┌──────────────────────────┐
│ Current: Jan 16, 2 AM    │ ← Scheduler runs lock_orders_job()
│ Lock Threshold: 10 AM    │ ← current_time + 8 hours
│ Check: 10 AM <= 10 AM?   │
│ Result: YES → LOCK IT 🔒 │
└──────────────────────────┘
         ↓
         
Step 4: Order Gets Locked
┌──────────────────────────┐
│ is_locked: TRUE          │ ← Database updated
│ locked_at: Jan 16, 2 AM  │ ← Timestamp saved
│ Email sent to customer   │ ← Notification sent
└──────────────────────────┘
         ↓
         
Step 5: Customer Tries to Edit
┌──────────────────────────┐
│ Frontend Check:          │
│ Hours Left: 5            │
│ 5 > 8? NO ❌             │ ← Buttons hidden in UI
│                          │
│ Backend Check:           │
│ is_locked: TRUE          │
│ HTTP 400 Error thrown    │ ← API rejects request
└──────────────────────────┘
         ↓
         
Step 6: Order Delivered
┌──────────────────────────┐
│ Time: Jan 16, 10 AM      │
│ Status: Completed        │
│ Order delivered 📦       │
└──────────────────────────┘
```

---

## 🗄️ Database Structure

**Orders Collection:**

```javascript
{
  "_id": ObjectId("..."),
  "id": "uuid-1234",
  "order_number": "ORD-000001",
  "customer_id": "customer-uuid",
  "delivery_date": "2024-01-16T10:00:00Z",  // ← Used for lock check
  "status": "pending",
  "is_locked": false,  // ← FALSE initially, TRUE after 8-hour threshold
  "locked_at": null,   // ← NULL initially, timestamp when locked
  "created_at": "2024-01-15T09:00:00Z",
  "updated_at": "2024-01-15T09:00:00Z",
  "items": [...],
  "total_amount": 45.50
}
```

**After Lock (Automatic Update):**

```javascript
{
  "is_locked": true,  // ← Changed to TRUE
  "locked_at": "2024-01-16T02:00:00Z"  // ← Timestamp added
}
```

---

## ⏰ Real-World Examples

### Example 1: Order Created Monday, Delivery Wednesday

```
Day 1 (Monday 2 PM) - Order Created
├─ Delivery: Wednesday 10 AM
├─ Hours until delivery: 44 hours
├─ Can edit? YES ✅ (44 > 8)
└─ is_locked: FALSE

Day 2 (Tuesday 10 AM) - Still Editable
├─ Delivery: Wednesday 10 AM
├─ Hours until delivery: 24 hours
├─ Can edit? YES ✅ (24 > 8)
└─ is_locked: FALSE

Day 3 (Wednesday 2 AM) - Gets Locked
├─ Scheduler runs lock_orders_job()
├─ Delivery: Wednesday 10 AM (8 hours away)
├─ Can edit? NO 🔒 (8 <= 8)
├─ is_locked: TRUE ← LOCKED HERE
├─ locked_at: Wednesday 2 AM
└─ Email sent to customer

Day 3 (Wednesday 5 AM) - Customer Tries to Edit
├─ Delivery: Wednesday 10 AM
├─ Hours until delivery: 5 hours
├─ Frontend: Buttons hidden (5 < 8)
├─ Backend: HTTP 400 error if API called
└─ Result: CANNOT EDIT ❌

Day 3 (Wednesday 10 AM) - Delivered
└─ Order completed and delivered 📦
```

---

### Example 2: Urgent Same-Day Order

```
Today 9 AM - Order Created for Today 3 PM Delivery
├─ Delivery: Today 3 PM
├─ Hours until delivery: 6 hours
├─ Can edit? NO 🔒 (6 < 8)
└─ LOCKED IMMEDIATELY (next scheduler run)

Today 10 AM - Scheduler Runs
├─ lock_orders_job() checks all orders
├─ Finds this order: delivery_date <= current_time + 8 hours
├─ Sets is_locked = TRUE
├─ Sends email notification
└─ Customer CANNOT edit from this point

Today 11 AM - Customer Tries to Edit
└─ HTTP 400 Error: "Cannot modify order - locked after 8 hours"
```

---

## 🛡️ Security Features

### **Triple Protection:**

1. **Frontend Check** (UX)
   - `canModifyOrder()` hides edit/cancel buttons
   - Shows warning message
   - Prevents accidental clicks

2. **Backend Validation** (API)
   - `update_order()` checks `is_locked` flag
   - Returns HTTP 400 error
   - Prevents API manipulation

3. **Scheduled Job** (Automation)
   - Runs every hour
   - Locks orders automatically
   - Sends notifications

---

## ❓ FAQ

**Q: What if customer needs to change urgent order?**
A: Contact admin/owner directly. They have override permissions.

**Q: Can admin edit locked orders?**
A: Yes, the lock only applies to customers, not admin/owner roles.

**Q: What if delivery is less than 8 hours when created?**
A: Order will be locked on the next scheduler run (within 1 hour).

**Q: What happens if order is already completed?**
A: Lock system ignores completed and cancelled orders.

**Q: Can customer cancel locked orders?**
A: No, cancel is also blocked. Same 8-hour rule applies.

**Q: Does recurring order follow same rule?**
A: Yes, each occurrence is treated as a separate order with its own lock.

---

## 🔧 Configuration

### Change Lock Duration:

**In `lock_orders_job()`:**
```python
# Change from 8 hours to 12 hours
lock_threshold = current_time + timedelta(hours=12)
```

**In `canModifyOrder()`:**
```javascript
// Change from 8 hours to 12 hours
return hoursUntilDelivery > 12;
```

**⚠️ Important:** Both frontend and backend must use the same value!

---

## 📊 System Status Check

**To verify lock system is working:**

1. Check scheduler is running:
```bash
# Look for log message on server startup
INFO: Scheduler started with jobs: lock_orders, generate_recurring_orders
```

2. Check locked orders in database:
```javascript
db.orders.find({ is_locked: true })
```

3. Test frontend:
```
Create order with delivery < 8 hours
Wait for scheduler (or set delivery_date manually in DB)
Verify edit buttons disappear
```

---

**Last Updated:** October 2025  
**Status:** ✅ Fully Operational
