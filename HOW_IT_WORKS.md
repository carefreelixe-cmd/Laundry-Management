# How Clienty Laundry Management System Works

## 🏗️ System Architecture

```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│   Frontend  │ ←→   │   Backend    │ ←→   │   Database   │
│   (React)   │ HTTP │  (FastAPI)   │      │  (MongoDB)   │
└─────────────┘      └──────────────┘      └──────────────┘
       ↓                     ↓
  LocalStorage          JWT Tokens
  (Auth Token)        (Authentication)
       ↓                     ↓
   Protected            FCM Push
    Routes           Notifications
```

## 🔐 Authentication Flow

### 1. **User Registration (Owner/Admin Only)**
```javascript
// Frontend Request
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "secure123",
  "full_name": "John Doe",
  "role": "customer",  // owner, admin, or customer
  "phone": "+61 400 000 000",
  "address": "123 Street, City"
}

// Backend Process:
1. Check if user exists in MongoDB
2. Hash password using bcrypt
3. Create user document in 'users' collection
4. Return user data (without password)
```

### 2. **User Login**
```javascript
// Frontend Request
POST /api/auth/login
{
  "email": "owner@clienty.com",
  "password": "owner123"
}

// Backend Process:
1. Find user in MongoDB by email
2. Verify password with bcrypt.verify()
3. Generate JWT token with user_id and role
4. Return token and user data

// Frontend Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": { ... }
}

// Frontend Action:
1. Save token to localStorage
2. Set axios default header: Authorization: Bearer <token>
3. Navigate to role-specific dashboard
```

### 3. **Protected Routes**
```javascript
// Frontend (React Router)
<Route 
  path="/dashboard/owner"
  element={
    <ProtectedRoute allowedRoles={['owner']}>
      <OwnerDashboard />
    </ProtectedRoute>
  }
/>

// Backend (FastAPI Middleware)
@api_router.get("/orders")
async def get_orders(current_user: dict = Depends(get_current_user)):
    # current_user extracted from JWT token
    # Contains: { id: "user_id", role: "owner" }
    
    if current_user['role'] == 'customer':
        # Filter orders for this customer only
        query = {'customer_id': current_user['id']}
    else:
        # Owner/Admin see all orders
        query = {}
    
    return await db.orders.find(query).to_list(1000)
```

## 📦 Order Management Flow

### Creating an Order (Admin/Owner)

```
┌──────────┐   1. Fill Form   ┌─────────────┐
│  Admin   │ ────────────→    │   Frontend  │
│Dashboard │                  │  (React)    │
└──────────┘                  └──────────────┘
                                     │
                              2. POST /api/orders
                                     ↓
                              ┌──────────────┐
                              │   Backend    │
                              │  (FastAPI)   │
                              └──────────────┘
                                     │
                            3. Validate & Process
                              • Check permissions
                              • Calculate total
                              • Generate order number
                                     ↓
                              ┌──────────────┐
                              │   MongoDB    │
                              │Insert Order  │
                              └──────────────┘
                                     │
                            4. Create Notification
                                     ↓
                              ┌──────────────┐
                              │   Customer   │
                              │  Receives    │
                              │ Notification │
                              └──────────────┘
```

### Order Creation Code Flow:

```python
# Backend: /api/orders POST
@api_router.post("/orders", response_model=Order)
async def create_order(
    order: OrderBase, 
    current_user: dict = Depends(require_role(["owner", "admin"]))
):
    # Step 1: Generate order number
    count = await db.orders.count_documents({}) + 1
    order_number = f"ORD-{count:06d}"  # ORD-000001
    
    # Step 2: Calculate total
    total_amount = sum(item.price * item.quantity for item in order.items)
    
    # Step 3: Create order document
    order_dict = order.model_dump()
    order_dict['order_number'] = order_number
    order_dict['total_amount'] = total_amount
    order_dict['created_by'] = current_user['id']
    order_dict['status'] = 'pending'
    
    # Step 4: Insert into MongoDB
    await db.orders.insert_one(order_dict)
    
    # Step 5: Create notification for customer
    await create_notification(
        order.customer_id,
        "New Order Created",
        f"Your order {order_number} has been created.",
        "order"
    )
    
    # Step 6: Send FCM push notification (if enabled)
    # await send_fcm_notification(customer_fcm_token, {...})
    
    return order_obj
```

## 🔔 Notification System

### In-App Notifications

```javascript
// Frontend: Poll for notifications every 30 seconds
useEffect(() => {
  const fetchNotifications = async () => {
    const response = await axios.get(`${API}/notifications`);
    setNotifications(response.data);
  };
  
  fetchNotifications();
  const interval = setInterval(fetchNotifications, 30000);
  return () => clearInterval(interval);
}, []);

// Backend: Create notification
async def create_notification(user_id, title, message, type):
    notif = Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=type,
        is_read=False
    )
    await db.notifications.insert_one(notif.model_dump())
```

### Firebase Cloud Messaging (FCM) Integration

**Backend Setup:**
```python
# Initialize Firebase Admin SDK
import firebase_admin
from firebase_admin import credentials, messaging

# Initialize with service account
cred = credentials.Certificate('path/to/serviceAccountKey.json')
firebase_admin.initialize_app(cred)

# Send push notification
def send_fcm_notification(token, title, body, data=None):
    message = messaging.Message(
        notification=messaging.Notification(
            title=title,
            body=body
        ),
        data=data or {},
        token=token
    )
    
    response = messaging.send(message)
    return response
```

**Frontend Setup:**
```javascript
// Install: firebase library already included
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "your-api-key",
  projectId: "your-project-id",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request permission and get FCM token
const requestPermission = async () => {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    const token = await getToken(messaging);
    // Send token to backend to store with user
    await axios.post('/api/users/fcm-token', { token });
  }
};

// Listen for foreground messages
onMessage(messaging, (payload) => {
  console.log('Message received:', payload);
  // Show notification in UI
  toast(payload.notification.title, payload.notification.body);
});
```

## 🗄️ Database Operations

### MongoDB Document Structure

```javascript
// Users Collection
{
  _id: ObjectId("..."),  // MongoDB auto-generated
  id: "uuid-v4",         // App-level UUID
  email: "user@email.com",
  password: "$2b$12$...",  // Bcrypt hashed
  full_name: "John Doe",
  role: "customer",
  phone: "+61 400 000 000",
  address: "123 Street",
  is_active: true,
  created_at: "2025-10-13T14:15:00.527085Z"  // ISO format
}

// Orders Collection
{
  _id: ObjectId("..."),
  id: "uuid-v4",
  order_number: "ORD-000001",
  customer_id: "uuid-v4",
  customer_name: "John Doe",
  customer_email: "john@email.com",
  items: [
    {
      sku_id: "uuid-v4",
      sku_name: "Shirt - Wash & Fold",
      quantity: 5,
      price: 5.00
    }
  ],
  status: "pending",
  pickup_date: "2025-10-15T10:00:00Z",
  delivery_date: "2025-10-17T16:00:00Z",
  pickup_address: "123 Street",
  delivery_address: "123 Street",
  special_instructions: "Handle with care",
  total_amount: 25.00,
  created_by: "admin-uuid",
  created_at: "2025-10-13T14:15:00Z",
  updated_at: "2025-10-13T14:15:00Z"
}
```

### CRUD Operations Example

```python
# CREATE
new_order = {
  "id": str(uuid.uuid4()),
  "customer_id": "customer-uuid",
  "status": "pending",
  "created_at": datetime.now(timezone.utc).isoformat()
}
await db.orders.insert_one(new_order)

# READ
orders = await db.orders.find({"status": "pending"}).to_list(100)

# UPDATE
await db.orders.update_one(
  {"id": order_id},
  {"$set": {"status": "processing"}}
)

# DELETE (Soft delete by status)
await db.orders.update_one(
  {"id": order_id},
  {"$set": {"status": "cancelled"}}
)
```

## 🎯 Role-Based Access Control (RBAC)

### Permission Matrix

| Feature              | Owner | Admin | Customer |
|---------------------|-------|-------|----------|
| Create Users        | ✅    | ✅    | ❌       |
| Delete Users        | ✅    | ❌    | ❌       |
| View All Orders     | ✅    | ✅    | ❌       |
| Create Orders       | ✅    | ✅    | ❌       |
| View Own Orders     | ✅    | ✅    | ✅       |
| Cancel Orders       | ✅    | ✅    | ✅*      |
| Manage SKUs         | ✅    | ✅    | ❌       |
| Delete SKUs         | ✅    | ❌    | ❌       |
| Update Cases        | ✅    | ✅    | ❌       |
| Create Cases        | ✅    | ✅    | ✅       |
| View Analytics      | ✅    | ✅    | ❌       |

*Customer can cancel only own orders within 8-hour window

### Implementation

```python
# Backend Decorator for Role Checking
def require_role(allowed_roles: List[str]):
    async def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user["role"] not in allowed_roles:
            raise HTTPException(
                status_code=403, 
                detail="Insufficient permissions"
            )
        return current_user
    return role_checker

# Usage
@api_router.post("/users")
async def create_user(
    user: UserCreate,
    current_user: dict = Depends(require_role(["owner", "admin"]))
):
    # Only owner and admin can create users
    pass

@api_router.delete("/skus/{sku_id}")
async def delete_sku(
    sku_id: str,
    current_user: dict = Depends(require_role(["owner"]))
):
    # Only owner can delete SKUs
    pass
```

## 🚀 Frontend State Management

### Authentication State

```javascript
// App.js
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

// On app load
useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchCurrentUser();  // Validate token and get user data
  }
}, []);

// Login function
const login = async (email, password) => {
  const response = await axios.post(`${API}/auth/login`, { email, password });
  const { access_token, user: userData } = response.data;
  
  // Store token
  localStorage.setItem('token', access_token);
  
  // Set axios header for all future requests
  axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
  
  // Update state
  setUser(userData);
  
  return userData;
};
```

### Data Fetching Pattern

```javascript
// Dashboard Component
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchOrders();
}, []);

const fetchOrders = async () => {
  try {
    setLoading(true);
    const response = await axios.get(`${API}/orders`);
    setOrders(response.data);
  } catch (error) {
    console.error('Failed to fetch orders', error);
  } finally {
    setLoading(false);
  }
};

// Create order
const handleCreateOrder = async (orderData) => {
  await axios.post(`${API}/orders`, orderData);
  fetchOrders();  // Refresh list
};
```

## 📱 Responsive Design

### Tailwind CSS Breakpoints

```javascript
// Mobile First Approach
<div className="
  w-full           // Full width on mobile
  md:w-1/2         // Half width on tablet (768px+)
  lg:w-1/3         // Third width on desktop (1024px+)
  xl:w-1/4         // Quarter width on large screens (1280px+)
">

// Grid Layout
<div className="
  grid
  grid-cols-1      // 1 column on mobile
  md:grid-cols-2   // 2 columns on tablet
  lg:grid-cols-4   // 4 columns on desktop
  gap-6
">
```

## 🔧 Environment Variables

### Backend (.env)
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="clienty_database"
SECRET_KEY="your-jwt-secret-key"
CORS_ORIGINS="*"
GMAIL_USER="your-email@gmail.com"
GMAIL_PASSWORD="your-app-password"
ADMIN_EMAIL="admin@clienty.com"
GOOGLE_MAPS_API_KEY="your-google-maps-key"
FIREBASE_SERVICE_ACCOUNT="path/to/serviceAccountKey.json"
```

### Frontend (.env)
```env
REACT_APP_BACKEND_URL=https://your-domain.com
REACT_APP_FIREBASE_API_KEY="your-firebase-api-key"
REACT_APP_FIREBASE_PROJECT_ID="your-project-id"
REACT_APP_FIREBASE_SENDER_ID="your-sender-id"
REACT_APP_FIREBASE_APP_ID="your-app-id"
```

## 🧪 Testing Workflows

### 1. Test Owner Workflow
```bash
1. Login as owner@clienty.com / owner123
2. Navigate to "User Management"
3. Create a new customer user
4. Navigate to "SKU & Pricing"
5. Add a new service item
6. View analytics dashboard
```

### 2. Test Admin Workflow
```bash
1. Login as admin@clienty.com / admin123
2. Navigate to "Orders"
3. Click "Create Order"
4. Select customer and add items
5. Set pickup/delivery dates
6. Submit order
7. Customer receives notification
```

### 3. Test Customer Workflow
```bash
1. Login as customer@clienty.com / customer123
2. View order history
3. Navigate to "My Cases"
4. Raise a new case request
5. View case status updates
```

## 🛠️ Common Operations

### Add New SKU Item
```javascript
// Frontend Request
POST /api/skus
{
  "name": "Blanket - Wash",
  "category": "Household",
  "price": 40.00,
  "unit": "per item",
  "description": "Professional wash for blankets"
}

// Backend creates UUID and stores in MongoDB
// Returns complete SKU object
```

### Update Order Status
```javascript
// Frontend Request
PUT /api/orders/{order_id}
{
  "status": "completed"
}

// Backend:
1. Updates order in MongoDB
2. Creates notification for customer
3. Updates updated_at timestamp
4. Returns updated order
```

## 🔍 Debugging Tips

### Check Backend Logs
```bash
tail -f /var/log/supervisor/backend.err.log
```

### Check Frontend Logs
```bash
tail -f /var/log/supervisor/frontend.err.log
```

### Test Backend API
```bash
# Test login
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@clienty.com","password":"owner123"}'

# Test protected endpoint
curl https://your-domain.com/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Check MongoDB Data
```bash
mongosh
use clienty_database
db.orders.find().pretty()
db.users.find().pretty()
```

## 📊 Performance Considerations

1. **Database Indexing**
```python
# Create indexes for frequently queried fields
await db.orders.create_index("customer_id")
await db.orders.create_index("status")
await db.users.create_index("email", unique=True)
```

2. **API Response Pagination**
```python
# Limit results to prevent large payloads
orders = await db.orders.find(query).limit(100).to_list(100)
```

3. **Frontend Optimization**
```javascript
// Lazy load components
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Debounce search inputs
const debouncedSearch = useMemo(
  () => debounce(handleSearch, 300),
  []
);
```

## 🎨 UI Components

### Shadcn/UI Usage
```javascript
// Button
import { Button } from '@/components/ui/button';
<Button className="bg-teal-500">Click Me</Button>

// Card
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
<Card>
  <CardHeader><CardTitle>Title</CardTitle></CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Dialog
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
<Dialog>
  <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader><DialogTitle>Title</DialogTitle></DialogHeader>
    Content
  </DialogContent>
</Dialog>
```

## 🔐 Security Best Practices

1. **Password Hashing**: All passwords hashed with bcrypt (12 rounds)
2. **JWT Expiration**: Tokens expire after 7 days
3. **HTTPS Only**: All production traffic over HTTPS
4. **CORS Configuration**: Restricted to specific origins
5. **Input Validation**: Pydantic models validate all inputs
6. **SQL Injection Prevention**: MongoDB parameterized queries
7. **XSS Prevention**: React auto-escapes content
8. **CSRF Protection**: JWT tokens in headers (not cookies)

---

**System Status**: ✅ Fully Operational
**Last Updated**: October 2025
**Tech Stack**: FastAPI + React + MongoDB + Firebase
