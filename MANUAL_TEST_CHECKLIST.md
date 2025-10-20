# 🧪 Manual Testing Checklist

## Test Environment Setup
- [ ] Backend running: `sudo supervisorctl status backend`
- [ ] Frontend running: `sudo supervisorctl status frontend`
- [ ] MongoDB running: `sudo supervisorctl status mongodb`
- [ ] Check logs: `tail -f /var/log/supervisor/backend.err.log`

---

## 1. Raise Case Feature Test

### Test Case 1.1: Customer Can Create Case
**Steps:**
1. Navigate to https://laundry-manager-11.preview.emergentagent.com/login
2. Login as: `customer@clienty.com` / `customer123`
3. Click "My Cases" tab
4. Click "Raise a Case" button
5. Select Case Type: "Complaint"
6. Enter Subject: "Test Issue"
7. Enter Description: "This is a test case"
8. Select Priority: "Medium"
9. Click "Submit Case"

**Expected Results:**
- [ ] Dialog opens without errors
- [ ] All Select dropdowns show options
- [ ] Form submits successfully
- [ ] Green toast notification appears: "Case submitted successfully!"
- [ ] Dialog closes
- [ ] New case appears in the list
- [ ] Case has correct case number (CASE-XXXXXX)

**Actual Results:** _______________________

**Status:** [ ] Pass [ ] Fail

---

### Test Case 1.2: Case with Related Order
**Steps:**
1. Same login as above
2. Click "Raise a Case"
3. Select an order from "Related Order" dropdown
4. Fill other fields
5. Submit

**Expected Results:**
- [ ] Order dropdown shows existing orders
- [ ] Case links to selected order
- [ ] Submission successful

**Status:** [ ] Pass [ ] Fail

---

### Test Case 1.3: Validation Errors
**Steps:**
1. Click "Raise a Case"
2. Leave Subject empty
3. Try to submit

**Expected Results:**
- [ ] Form validation prevents submission
- [ ] Required field highlighted

**Status:** [ ] Pass [ ] Fail

---

## 2. OTP Email Delivery Test

### Test Case 2.1: Email OTP (Development Mode)
**Steps:**
1. Navigate to signup page
2. Fill form: 
   - Name: "Test User"
   - Email: "testuser@example.com"
   - Phone: "+61400123456"
   - Password: "test123"
3. Click "Sign Up"
4. Check backend logs: `tail -f /var/log/supervisor/backend.err.log`

**Expected Results:**
- [ ] Signup successful
- [ ] OTP verification page shown
- [ ] Log shows: "OTP for testuser@example.com: XXXXXX"
- [ ] Success message displayed

**Actual OTP:** _______________________

**Status:** [ ] Pass [ ] Fail

---

### Test Case 2.2: Email OTP (Production Mode)
**Prerequisites:**
- Gmail credentials configured in `.env`

**Steps:**
1. Same as above with different email
2. Check email inbox
3. Verify email received

**Expected Results:**
- [ ] Email received within 30 seconds
- [ ] Subject: "Your OTP for Infinite Laundry Solutions"
- [ ] HTML template displays correctly
- [ ] OTP code visible and clear
- [ ] Teal gradient header present
- [ ] Expiry warning shown

**Status:** [ ] Pass [ ] Fail [ ] N/A (No Gmail config)

---

### Test Case 2.3: OTP Verification
**Steps:**
1. Complete signup
2. Enter correct OTP
3. Click "Verify Email"

**Expected Results:**
- [ ] Verification successful
- [ ] Success message shown
- [ ] Redirected to login page after 2 seconds
- [ ] User can login with credentials
- [ ] Welcome email sent (if configured)

**Status:** [ ] Pass [ ] Fail

---

### Test Case 2.4: Invalid OTP
**Steps:**
1. Enter wrong OTP: "000000"
2. Click "Verify Email"

**Expected Results:**
- [ ] Error message: "Invalid OTP code"
- [ ] Red error toast/alert shown
- [ ] User stays on OTP page

**Status:** [ ] Pass [ ] Fail

---

### Test Case 2.5: Expired OTP
**Steps:**
1. Wait 11 minutes after signup (or modify expiry time)
2. Try to verify

**Expected Results:**
- [ ] Error: "OTP has expired"
- [ ] Resend OTP button works

**Status:** [ ] Pass [ ] Fail

---

### Test Case 2.6: Resend OTP
**Steps:**
1. On OTP page, click "Resend OTP"
2. Check logs for new OTP

**Expected Results:**
- [ ] New OTP generated
- [ ] Success message: "New OTP sent to your email"
- [ ] Old OTP no longer valid
- [ ] New OTP works

**Status:** [ ] Pass [ ] Fail

---

## 3. SMS OTP Delivery Test

### Test Case 3.1: SMS OTP (Development Mode)
**Steps:**
1. Signup with phone number: "+61400123456"
2. Check backend logs

**Expected Results:**
- [ ] Log shows: "SMS OTP for +61400123456: XXXXXX"
- [ ] Twilio warning shown (if not configured)
- [ ] Signup still successful

**Status:** [ ] Pass [ ] Fail

---

### Test Case 3.2: SMS OTP (Production Mode)
**Prerequisites:**
- Twilio credentials configured

**Steps:**
1. Signup with verified phone number
2. Check phone for SMS

**Expected Results:**
- [ ] SMS received within 30 seconds
- [ ] Message format correct
- [ ] OTP visible
- [ ] From Twilio number

**Status:** [ ] Pass [ ] Fail [ ] N/A (No Twilio config)

---

## 4. Responsive Design Test

### Test Case 4.1: Mobile View (375px)
**Steps:**
1. Open browser dev tools
2. Set viewport to 375x667 (iPhone SE)
3. Test all pages

**Expected Results:**
- [ ] Logo scales correctly (h-12 on mobile)
- [ ] Navbar shows mobile menu button
- [ ] Login button visible on mobile
- [ ] Forms fit without horizontal scroll
- [ ] All touch targets >= 44px
- [ ] Text readable (not too small)

**Pages to Test:**
- [ ] Landing page
- [ ] Login page
- [ ] Signup page
- [ ] Dashboard

**Status:** [ ] Pass [ ] Fail

---

### Test Case 4.2: Tablet View (768px)
**Steps:**
1. Set viewport to 768x1024 (iPad)
2. Test all pages

**Expected Results:**
- [ ] Logo: h-14 size
- [ ] Full navbar visible (not mobile menu)
- [ ] 2-column layouts work
- [ ] Cards stack properly

**Status:** [ ] Pass [ ] Fail

---

### Test Case 4.3: Desktop View (1920px)
**Steps:**
1. Set viewport to 1920x1080
2. Test all pages

**Expected Results:**
- [ ] Logo: h-16 size
- [ ] Full navigation visible
- [ ] Multi-column layouts work
- [ ] No stretched content
- [ ] Proper max-widths applied

**Status:** [ ] Pass [ ] Fail

---

## 5. Database Connectivity Test

### Test Case 5.1: MongoDB Connection
**Steps:**
1. Check MongoDB status: `sudo supervisorctl status mongodb`
2. Try to login
3. Create a case

**Expected Results:**
- [ ] MongoDB running
- [ ] Login successful (queries users collection)
- [ ] Case created (inserts to cases collection)
- [ ] Data persists after page refresh

**Status:** [ ] Pass [ ] Fail

---

### Test Case 5.2: Data Persistence
**Steps:**
1. Create a new user via signup
2. Restart backend: `sudo supervisorctl restart backend`
3. Try to login with new user

**Expected Results:**
- [ ] Login successful after restart
- [ ] User data persisted
- [ ] JWT tokens work

**Status:** [ ] Pass [ ] Fail

---

## 6. Error Handling Test

### Test Case 6.1: Network Error
**Steps:**
1. Stop backend: `sudo supervisorctl stop backend`
2. Try to login from frontend

**Expected Results:**
- [ ] Error toast shown
- [ ] User-friendly message
- [ ] No console errors break UI

**Status:** [ ] Pass [ ] Fail

---

### Test Case 6.2: Invalid Input
**Steps:**
1. Try to login with invalid email format
2. Try short password

**Expected Results:**
- [ ] HTML5 validation works
- [ ] Clear error messages

**Status:** [ ] Pass [ ] Fail

---

## 7. Toast Notifications Test

### Test Case 7.1: Success Toast
**Steps:**
1. Create a case successfully

**Expected Results:**
- [ ] Green toast appears top-right
- [ ] Message: "Case submitted successfully!"
- [ ] Auto-dismisses after 5 seconds
- [ ] Can be manually dismissed

**Status:** [ ] Pass [ ] Fail

---

### Test Case 7.2: Error Toast
**Steps:**
1. Try invalid action

**Expected Results:**
- [ ] Red/error toast appears
- [ ] Clear error message
- [ ] Auto-dismisses

**Status:** [ ] Pass [ ] Fail

---

## 8. End-to-End Test

### Test Case 8.1: Complete User Journey
**Steps:**
1. Visit landing page
2. Click "Sign Up"
3. Fill signup form
4. Receive OTP (check logs)
5. Verify OTP
6. Login
7. Navigate to "My Cases"
8. Create a case
9. Logout
10. Login again

**Expected Results:**
- [ ] All steps work smoothly
- [ ] No errors in console
- [ ] Data persists
- [ ] Notifications work

**Status:** [ ] Pass [ ] Fail

---

## 9. API Testing (curl commands)

### Test Case 9.1: Signup API
```bash
curl -X POST https://laundry-manager-11.preview.emergentagent.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "apitest@example.com",
    "password": "test123",
    "full_name": "API Test User",
    "phone": "+61400123456",
    "address": "123 Test St"
  }'
```

**Expected Response:**
```json
{
  "message": "OTP sent to your email and phone. Please verify to complete registration.",
  "email": "apitest@example.com",
  "phone": "+61400123456"
}
```

**Status:** [ ] Pass [ ] Fail

---

### Test Case 9.2: Verify OTP API
```bash
curl -X POST https://laundry-manager-11.preview.emergentagent.com/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "apitest@example.com",
    "otp": "123456"
  }'
```

**Expected Response:**
```json
{
  "message": "Email verified successfully! You can now log in.",
  "email": "apitest@example.com"
}
```

**Status:** [ ] Pass [ ] Fail

---

### Test Case 9.3: Login API
```bash
curl -X POST https://laundry-manager-11.preview.emergentagent.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@clienty.com",
    "password": "customer123"
  }'
```

**Expected Response:**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": {...}
}
```

**Status:** [ ] Pass [ ] Fail

---

### Test Case 9.4: Create Case API
```bash
TOKEN="your-jwt-token-here"

curl -X POST https://laundry-manager-11.preview.emergentagent.com/api/cases \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "customer_id": "customer-id",
    "customer_name": "Test User",
    "customer_email": "test@example.com",
    "type": "complaint",
    "subject": "API Test Case",
    "description": "Testing via API",
    "priority": "medium"
  }'
```

**Expected Response:**
```json
{
  "id": "...",
  "case_number": "CASE-000001",
  "status": "open",
  ...
}
```

**Status:** [ ] Pass [ ] Fail

---

## 📊 Test Summary

**Total Test Cases:** 30
**Passed:** _____
**Failed:** _____
**Not Applicable:** _____

**Critical Issues Found:** _____________________

**Notes:** _____________________

---

## ✅ Sign-Off

**Tester Name:** _____________________
**Date:** _____________________
**Signature:** _____________________

**All Critical Bugs Fixed:** [ ] Yes [ ] No

**Ready for Production:** [ ] Yes [ ] No
