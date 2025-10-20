# 📮 API Testing - Postman Collection (curl commands)

## Base URL
```
https://laundry-manager-11.preview.emergentagent.com/api
```

---

## 1. Authentication APIs

### 1.1 Public Signup
```bash
curl -X POST https://laundry-manager-11.preview.emergentagent.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securePassword123",
    "full_name": "John Doe",
    "phone": "+61400123456",
    "address": "123 Test Street, Sydney NSW 2000"
  }'
```

**Response:**
```json
{
  "message": "OTP sent to your email and phone. Please verify to complete registration.",
  "email": "newuser@example.com",
  "phone": "+61400123456"
}
```

---

### 1.2 Verify OTP
```bash
# Get OTP from backend logs: tail -f /var/log/supervisor/backend.err.log

curl -X POST https://laundry-manager-11.preview.emergentagent.com/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "otp": "123456"
  }'
```

**Response:**
```json
{
  "message": "Email verified successfully! You can now log in.",
  "email": "newuser@example.com"
}
```

---

### 1.3 Resend OTP
```bash
curl -X POST https://laundry-manager-11.preview.emergentagent.com/api/auth/resend-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com"
  }'
```

**Response:**
```json
{
  "message": "New OTP sent to your email"
}
```

---

### 1.4 Login
```bash
curl -X POST https://laundry-manager-11.preview.emergentagent.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@clienty.com",
    "password": "customer123"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "email": "customer@clienty.com",
    "full_name": "Michael Chen",
    "role": "customer",
    "id": "...",
    "created_at": "2025-10-13T14:15:00.527085Z",
    "is_active": true
  }
}
```

---

### 1.5 Get Current User
```bash
TOKEN="your-jwt-token-here"

curl -X GET https://laundry-manager-11.preview.emergentagent.com/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "email": "customer@clienty.com",
  "full_name": "Michael Chen",
  "role": "customer",
  "id": "...",
  "created_at": "2025-10-13T14:15:00.527085Z",
  "is_active": true
}
```

---

## 2. User Management APIs (Owner/Admin Only)

### 2.1 Create User (Admin/Owner)
```bash
TOKEN="owner-or-admin-jwt-token"

curl -X POST https://laundry-manager-11.preview.emergentagent.com/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "email": "newcustomer@example.com",
    "password": "password123",
    "full_name": "Jane Smith",
    "role": "customer",
    "phone": "+61400987654",
    "address": "456 Customer Ave, Melbourne VIC 3000"
  }'
```

---

### 2.2 Get All Users
```bash
TOKEN="owner-or-admin-jwt-token"

curl -X GET https://laundry-manager-11.preview.emergentagent.com/api/users \
  -H "Authorization: Bearer $TOKEN"
```

---

### 2.3 Get User by ID
```bash
TOKEN="owner-or-admin-jwt-token"
USER_ID="user-uuid-here"

curl -X GET https://laundry-manager-11.preview.emergentagent.com/api/users/$USER_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

### 2.4 Delete User (Owner Only)
```bash
TOKEN="owner-jwt-token"
USER_ID="user-uuid-here"

curl -X DELETE https://laundry-manager-11.preview.emergentagent.com/api/users/$USER_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. Order Management APIs

### 3.1 Create Order (Admin/Owner)
```bash
TOKEN="admin-or-owner-jwt-token"

curl -X POST https://laundry-manager-11.preview.emergentagent.com/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "customer_id": "customer-uuid",
    "customer_name": "Michael Chen",
    "customer_email": "customer@clienty.com",
    "items": [
      {
        "sku_id": "sku-uuid-1",
        "sku_name": "Shirt - Wash & Fold",
        "quantity": 5,
        "price": 5.00
      },
      {
        "sku_id": "sku-uuid-2",
        "sku_name": "Pants - Wash & Fold",
        "quantity": 3,
        "price": 7.00
      }
    ],
    "pickup_date": "2025-10-20T10:00:00Z",
    "delivery_date": "2025-10-22T16:00:00Z",
    "pickup_address": "789 Customer Rd, Brisbane QLD 4000",
    "delivery_address": "789 Customer Rd, Brisbane QLD 4000",
    "special_instructions": "Please handle with care"
  }'
```

---

### 3.2 Get All Orders
```bash
TOKEN="your-jwt-token"

curl -X GET https://laundry-manager-11.preview.emergentagent.com/api/orders \
  -H "Authorization: Bearer $TOKEN"
```

---

### 3.3 Get Order by ID
```bash
TOKEN="your-jwt-token"
ORDER_ID="order-uuid"

curl -X GET https://laundry-manager-11.preview.emergentagent.com/api/orders/$ORDER_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

### 3.4 Update Order Status
```bash
TOKEN="admin-or-owner-jwt-token"
ORDER_ID="order-uuid"

curl -X PUT https://laundry-manager-11.preview.emergentagent.com/api/orders/$ORDER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "processing"
  }'
```

---

### 3.5 Cancel Order
```bash
TOKEN="your-jwt-token"
ORDER_ID="order-uuid"

curl -X DELETE https://laundry-manager-11.preview.emergentagent.com/api/orders/$ORDER_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## 4. Case Management APIs

### 4.1 Create Case
```bash
TOKEN="customer-jwt-token"

curl -X POST https://laundry-manager-11.preview.emergentagent.com/api/cases \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "customer_id": "customer-uuid",
    "customer_name": "Michael Chen",
    "customer_email": "customer@clienty.com",
    "type": "complaint",
    "subject": "Damaged Item",
    "description": "One of my shirts was damaged during cleaning. Please investigate.",
    "order_id": "order-uuid-optional",
    "priority": "high"
  }'
```

**Response:**
```json
{
  "id": "case-uuid",
  "case_number": "CASE-000001",
  "customer_id": "customer-uuid",
  "customer_name": "Michael Chen",
  "customer_email": "customer@clienty.com",
  "type": "complaint",
  "subject": "Damaged Item",
  "description": "One of my shirts was damaged during cleaning. Please investigate.",
  "status": "open",
  "priority": "high",
  "order_id": "order-uuid",
  "assigned_to": null,
  "resolution": null,
  "created_at": "2025-10-17T...",
  "updated_at": "2025-10-17T..."
}
```

---

### 4.2 Get All Cases
```bash
TOKEN="your-jwt-token"

curl -X GET https://laundry-manager-11.preview.emergentagent.com/api/cases \
  -H "Authorization: Bearer $TOKEN"
```

---

### 4.3 Get Case by ID
```bash
TOKEN="your-jwt-token"
CASE_ID="case-uuid"

curl -X GET https://laundry-manager-11.preview.emergentagent.com/api/cases/$CASE_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

### 4.4 Update Case (Admin/Owner)
```bash
TOKEN="admin-or-owner-jwt-token"
CASE_ID="case-uuid"

curl -X PUT https://laundry-manager-11.preview.emergentagent.com/api/cases/$CASE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "resolved",
    "resolution": "We have refunded the cost and offered a discount on your next order.",
    "priority": "high"
  }'
```

---

## 5. SKU Management APIs

### 5.1 Create SKU (Admin/Owner)
```bash
TOKEN="admin-or-owner-jwt-token"

curl -X POST https://laundry-manager-11.preview.emergentagent.com/api/skus \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Jacket - Dry Clean",
    "category": "Dry Cleaning",
    "price": 30.00,
    "unit": "per item",
    "description": "Professional dry cleaning for jackets"
  }'
```

---

### 5.2 Get All SKUs (Public)
```bash
curl -X GET https://laundry-manager-11.preview.emergentagent.com/api/skus
```

---

### 5.3 Update SKU (Admin/Owner)
```bash
TOKEN="admin-or-owner-jwt-token"
SKU_ID="sku-uuid"

curl -X PUT https://laundry-manager-11.preview.emergentagent.com/api/skus/$SKU_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Jacket - Dry Clean",
    "category": "Dry Cleaning",
    "price": 35.00,
    "unit": "per item",
    "description": "Premium dry cleaning for jackets"
  }'
```

---

### 5.4 Delete SKU (Owner Only)
```bash
TOKEN="owner-jwt-token"
SKU_ID="sku-uuid"

curl -X DELETE https://laundry-manager-11.preview.emergentagent.com/api/skus/$SKU_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## 6. Notification APIs

### 6.1 Get My Notifications
```bash
TOKEN="your-jwt-token"

curl -X GET https://laundry-manager-11.preview.emergentagent.com/api/notifications \
  -H "Authorization: Bearer $TOKEN"
```

---

### 6.2 Mark Notification as Read
```bash
TOKEN="your-jwt-token"
NOTIF_ID="notification-uuid"

curl -X PUT https://laundry-manager-11.preview.emergentagent.com/api/notifications/$NOTIF_ID/read \
  -H "Authorization: Bearer $TOKEN"
```

---

### 6.3 Mark All Notifications as Read
```bash
TOKEN="your-jwt-token"

curl -X PUT https://laundry-manager-11.preview.emergentagent.com/api/notifications/read-all \
  -H "Authorization: Bearer $TOKEN"
```

---

## 7. Analytics APIs (Owner/Admin)

### 7.1 Get Dashboard Statistics
```bash
TOKEN="owner-or-admin-jwt-token"

curl -X GET https://laundry-manager-11.preview.emergentagent.com/api/analytics/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "total_orders": 150,
  "total_customers": 45,
  "pending_orders": 12,
  "completed_orders": 125,
  "open_cases": 5,
  "total_revenue": 5432.50
}
```

---

## 8. Contact Form API (Public)

### 8.1 Submit Contact Form
```bash
curl -X POST https://laundry-manager-11.preview.emergentagent.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+61400123456",
    "message": "I am interested in your commercial laundry services."
  }'
```

---

## 9. Delivery Management APIs (Admin/Owner)

### 9.1 Create Delivery
```bash
TOKEN="admin-or-owner-jwt-token"

curl -X POST https://laundry-manager-11.preview.emergentagent.com/api/deliveries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "order_id": "order-uuid",
    "driver_name": "Bob Driver",
    "driver_phone": "+61400111222",
    "vehicle_number": "ABC-123",
    "route_details": "Route 5 - Northern Suburbs"
  }'
```

---

### 9.2 Get All Deliveries
```bash
TOKEN="admin-or-owner-jwt-token"

curl -X GET https://laundry-manager-11.preview.emergentagent.com/api/deliveries \
  -H "Authorization: Bearer $TOKEN"
```

---

### 9.3 Get Delivery by Order ID
```bash
TOKEN="your-jwt-token"
ORDER_ID="order-uuid"

curl -X GET https://laundry-manager-11.preview.emergentagent.com/api/deliveries/order/$ORDER_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## 10. Testing Scripts

### Complete User Journey Test
```bash
#!/bin/bash

# 1. Signup
echo "Testing Signup..."
SIGNUP_RESPONSE=$(curl -s -X POST https://laundry-manager-11.preview.emergentagent.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "test123",
    "full_name": "Test User",
    "phone": "+61400123456",
    "address": "123 Test St"
  }')
echo $SIGNUP_RESPONSE

# 2. Get OTP from logs
echo "Check backend logs for OTP"
# tail -f /var/log/supervisor/backend.err.log | grep OTP

# 3. Verify OTP (replace with actual OTP)
OTP="123456"
echo "Testing OTP Verification..."
VERIFY_RESPONSE=$(curl -s -X POST https://laundry-manager-11.preview.emergentagent.com/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"testuser@example.com\",
    \"otp\": \"$OTP\"
  }")
echo $VERIFY_RESPONSE

# 4. Login
echo "Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST https://laundry-manager-11.preview.emergentagent.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "test123"
  }')
echo $LOGIN_RESPONSE

# Extract token
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
echo "Token: $TOKEN"

# 5. Create Case
echo "Testing Create Case..."
CASE_RESPONSE=$(curl -s -X POST https://laundry-manager-11.preview.emergentagent.com/api/cases \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "customer_id": "test-id",
    "customer_name": "Test User",
    "customer_email": "testuser@example.com",
    "type": "inquiry",
    "subject": "Test Case",
    "description": "Testing API",
    "priority": "medium"
  }')
echo $CASE_RESPONSE

echo "All tests completed!"
```

---

## Error Response Format

All APIs return errors in this format:
```json
{
  "detail": "Error message here"
}
```

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized (invalid/missing token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error

---

## Notes

1. **Authentication:** Most endpoints require Bearer token in Authorization header
2. **Role-Based Access:** Some endpoints restricted to specific roles
3. **Data Filtering:** Customer users see only their own data
4. **Timestamps:** All dates in ISO 8601 format with UTC timezone
5. **UUIDs:** All IDs are UUID v4 strings
6. **OTP:** Check backend logs for OTP in development mode

---

## Import to Postman

1. Copy any curl command
2. Open Postman → Import → Raw Text
3. Paste curl command
4. Postman auto-converts to request

Or save these as a collection JSON and import directly.
