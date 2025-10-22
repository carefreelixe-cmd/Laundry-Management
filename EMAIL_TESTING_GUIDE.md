# Email Notification Testing Guide

## Quick Test Checklist

### Prerequisites
1. ✅ Backend server running
2. ✅ Email service configured (or development mode)
3. ✅ Test customer account created

## Test Scenarios

### Test 1: Order Creation Email
**Action**: Owner/Admin creates a new order for a customer
**Expected**: Customer receives "Order Scheduled" email

**Steps**:
1. Login as Owner/Admin
2. Go to Orders tab
3. Click "Create New Order"
4. Select a customer
5. Add items, set dates
6. Submit order
7. Check customer's email inbox

**Expected Email**:
- Subject: "Order #ORD-XXXXXX - 📅 Order Scheduled"
- Blue header color
- Order details with pickup/delivery dates
- Total amount displayed

---

### Test 2: Customer Self-Order Email
**Action**: Customer creates their own order
**Expected**: Customer receives confirmation email

**Steps**:
1. Login as Customer
2. Go to Orders section
3. Create a new order
4. Submit
5. Check email inbox

**Expected Email**:
- Same format as Test 1
- Confirms order creation

---

### Test 3: Status Change Email
**Action**: Owner/Admin changes order status
**Expected**: Customer receives status update email

**Steps**:
1. Login as Owner/Admin
2. Find an existing order
3. Click Edit
4. Change status to "Processing"
5. Save changes
6. Check customer's email

**Expected Email**:
- Subject: "Order #ORD-XXXXXX - ⚙️ Order Processing"
- Orange header color
- Updated status displayed

---

### Test 4: Driver Delivery Update Email
**Action**: Driver updates delivery status
**Expected**: Customer receives delivery update email

**Steps**:
1. Assign order to a driver (Owner/Admin)
2. Login as Driver
3. Find assigned order
4. Update status to "Out for Delivery"
5. Check customer's email

**Expected Email**:
- Subject: "Order #ORD-XXXXXX - 🚚 Out for Delivery"
- Purple header color
- Delivery status update

---

### Test 5: Order Delivered Email
**Action**: Driver marks order as delivered
**Expected**: Customer receives delivery confirmation

**Steps**:
1. Login as Driver
2. Find order in delivery
3. Update status to "Delivered"
4. Check customer's email

**Expected Email**:
- Subject: "Order #ORD-XXXXXX - 🎉 Order Delivered"
- Green header color
- Success message

---

## Email Status Matrix

| Status | Icon | Color | Email Subject |
|--------|------|-------|---------------|
| scheduled | 📅 | Blue | Order Scheduled |
| processing | ⚙️ | Orange | Order Processing |
| ready_for_delivery | ✅ | Green | Ready for Delivery |
| out_for_delivery | 🚚 | Purple | Out for Delivery |
| delivered | 🎉 | Green | Order Delivered |
| completed | ✅ | Green | Order Completed |
| cancelled | ❌ | Red | Order Cancelled |

---

## Development Mode Testing

If Gmail credentials are not configured:
- Emails won't actually send
- Check backend console logs for email content
- Look for: `INFO:utils.email_service:Order status email to...`

Example log output:
```
INFO:utils.email_service:Order status email to customer@example.com: Order ORD-000123 - scheduled
```

---

## Production Testing

With Gmail credentials configured:
1. Check actual email inbox
2. Verify HTML formatting displays correctly
3. Test on mobile devices
4. Check spam folder if not received
5. Verify all order details are correct

---

## Troubleshooting

### Emails Not Received
1. **Check Gmail credentials** in `.env` file
2. **Verify App-Specific Password** (not regular Gmail password)
3. **Check spam folder**
4. **Review backend logs** for error messages
5. **Test with different email provider**

### Email Format Issues
1. Check HTML rendering in email client
2. Test with different email clients (Gmail, Outlook, etc.)
3. Verify mobile responsiveness
4. Check for CSS compatibility

### Wrong Status Colors
1. Verify status string matches exactly (lowercase, underscores)
2. Check delivery_status vs status precedence
3. Review color mapping in `send_order_status_email()`

---

## Success Criteria

✅ All 5 test scenarios pass
✅ Emails arrive within 30 seconds
✅ HTML formatting displays correctly
✅ All order details are accurate
✅ Colors match status appropriately
✅ Mobile display is responsive
✅ No errors in backend logs

---

**Testing Completed**: _______________
**Tested By**: _______________
**Status**: _______________
