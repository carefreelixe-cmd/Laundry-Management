# Infinite Laundry Solutions - Professional Laundry Management System

A complete web-based management system for **Infinite Laundry Solutions**, a professional laundry and delivery service provider in Queensland, Australia.

## 🌟 Features

### Public Website
- **Modern Landing Page** with hero section, services showcase, testimonials, and contact form
- **Responsive Design** optimized for all devices
- **Teal Color Theme** extracted from company logo (#40E0D0)
- **Contact Form** with email notifications

### Role-Based Management Portal

#### 👑 Owner Dashboard
- **Full System Access** with complete administrative control
- **User Management**: Create and manage admins and customers
- **SKU & Pricing Configuration**: Manage service items and pricing with quantity tracking
- **Customer-Specific Pricing**: Set custom prices for individual customers
- **Frequency Template Management**: Create dynamic recurring order frequencies
- **Analytics Dashboard**: View total orders, customers, revenue, and open cases
- **Approval System**: Oversee admin actions

#### 🧑‍💼 Admin Dashboard
- **Order Management**: Create, view, update, and track orders
- **Recurring Order Creation**: Set up orders that automatically repeat
- **Delivery Scheduling**: Assign drivers and manage delivery routes
- **Case Management**: Handle customer requests and complaints
- **Status Updates**: Update order and case statuses in real-time
- **Notification Center**: Receive real-time notifications via Socket.io

#### 🧍 Customer Portal
- **Order History**: View all past and current orders
- **Recurring Orders**: Create and manage automatically recurring orders
- **Delivery Tracking**: Real-time status updates
- **Order Modification**: Modify orders within 8-hour window (auto-locks after)
- **Order Lock Notifications**: Receive alerts when orders are locked
- **Case Requests**: Raise service requests and track resolution status
- **Live Status Updates**: Real-time Socket.io and email notifications

## 🆕 Latest Features (January 2025)

### ⚡ Real-Time Notifications
- **Socket.io Integration**: Instant notifications for all order events
- **Email Notifications**: Comprehensive email alerts for stakeholders
- **Multi-Channel Alerts**: Both real-time and email for critical events
- **Room-Based Targeting**: User-specific notification delivery

### 🔄 Recurring Orders System
- **Dynamic Frequency Templates**: Create custom recurring patterns
- **Automated Generation**: Orders auto-create based on schedule
- **Flexible Patterns**: Daily, weekly, monthly, or custom intervals
- **Customer & Admin Control**: Both roles can set up recurring orders

### 🔒 Smart Order Locking
- **8-Hour Auto-Lock**: Orders automatically lock 8 hours after creation
- **Edit Prevention**: Locked orders cannot be modified
- **Automated Notifications**: Alerts sent to all stakeholders when orders lock
- **APScheduler Integration**: Hourly background job checks and locks orders

### 💰 Customer-Specific Pricing
- **Custom Price Overrides**: Set unique prices for individual customers
- **Base Price Management**: Define default pricing for all SKUs
- **Pricing Dashboard**: Owner interface to manage customer pricing
- **Automatic Application**: Custom prices automatically used in orders

## 🛠️ Tech Stack

### Backend
- **FastAPI** (Python 3.9+)
- **MongoDB** with Motor (async driver)
- **Socket.io** (python-socketio 5.11.0) for real-time communication
- **APScheduler** (3.10.4) for scheduled tasks
- **JWT Authentication** with role-based access control (RBAC)
- **Pydantic** for data validation
- **Python Email** (smtplib) for notifications
- **Twilio** for SMS notifications (optional)

### Frontend
- **React 19** with React Router
- **Socket.io Client** (4.8.1) for real-time updates
- **Tailwind CSS** for styling
- **Shadcn/UI** components library
- **Axios** for API communication
- **Inter Font** for modern typography

## 🔐 Demo Credentials

```
Owner:
Email: owner@clienty.com
Password: owner123

Admin:
Email: admin@clienty.com
Password: admin123

Customer:
Email: customer@clienty.com
Password: customer123
```

## 🎨 Design Features

- **Modern Teal Color Palette** (#40E0D0) extracted from company logo
- **Inter Font** for clean, professional typography
- **Shadcn UI Components** for consistent design
- **Responsive Layout** optimized for mobile and desktop
- **Smooth Animations** and hover effects
- **Custom Scrollbar** styling
- **Status Badges** with color coding
- **Real-time Updates** with Socket.io indicators

## 🔔 Notification System

- **Real-time Socket.io Notifications**: Instant updates for all events
- **Email Notifications**: Configurable email alerts (Gmail SMTP)
- **Multi-Stakeholder Alerts**: Notifications sent to customers, admins, and owners
- **Event Types**: Order created, updated, locked, recurring order generated
- **Role-based Notifications**: Targeted notifications based on user role
- **Notification Center**: Dropdown with read/unread status

## ⏰ Scheduled Tasks

### Order Locking Job (Hourly)
- Automatically locks orders 8 hours after creation
- Prevents further modifications
- Sends notifications to all stakeholders
- Maintains data integrity

### Recurring Order Generation (Daily at Midnight)
- Checks for recurring orders due today
- Automatically creates new orders from templates
- Updates next occurrence date
- Notifies customers of new orders

## 🗺️ Google Maps Integration

- **Delivery Tracking**: Track order deliveries in real-time (API key provided)
- **Route Optimization**: Plan efficient delivery routes
- **Location Services**: Pickup and delivery address mapping

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control (RBAC)**: Granular permissions by role
- **Password Hashing**: Bcrypt encryption for passwords
- **Protected Routes**: Frontend and backend route protection
- **CORS Configuration**: Controlled cross-origin requests
- **Token Expiration**: 7-day JWT token lifetime

## 📝 Business Rules

1. **Order Locking**: Orders automatically lock 8 hours after creation
2. **Order Modification**: Customers can only modify unlocked orders
3. **Recurring Orders**: Both customers and admins can create recurring orders
4. **Customer Pricing**: Owners can set custom pricing per customer per SKU
5. **User Creation**: Only Owner and Admin can create new users
6. **Case Assignment**: Cases are automatically visible to all Owners and Admins
7. **SKU Management**: Only Owner can delete SKUs
8. **Role Hierarchy**: Owner > Admin > Customer

## 🚀 Pre-configured Services

The system comes with enhanced SKU management:
- **Base Price**: Default price for all customers
- **Custom Pricing**: Override prices for specific customers
- **Quantity Tracking**: Track quantity per SKU
- **Category Management**: Organize services by category
- **Description Support**: Detailed service descriptions

## 📧 Email & SMS Configuration (Optional)

### Gmail SMTP (Email Notifications)
Configure in `backend/.env`:
```env
GMAIL_USER="your-gmail@gmail.com"
GMAIL_PASSWORD="your-app-password"
```

### Twilio SMS (Optional)
Configure in `backend/.env`:
```env
TWILIO_ACCOUNT_SID="your-account-sid"
TWILIO_AUTH_TOKEN="your-auth-token"
TWILIO_PHONE_NUMBER="your-twilio-number"
```

**Note**: Email and SMS are optional. The system works fully with Socket.io notifications alone.

## 🧪 Testing the System

### Test Owner Features:
1. Login with Owner credentials
2. Navigate to "User Management" tab - create new users
3. Navigate to "SKU & Pricing" tab - add/edit/delete service items
4. Navigate to "Customer Pricing" - set custom prices for customers
5. Navigate to "Frequency Templates" - create recurring order patterns
6. View analytics dashboard with real-time stats

### Test Admin Features:
1. Login with Admin credentials
2. Navigate to "Orders" tab - create a new order for a customer
3. Create a recurring order with custom frequency
4. Navigate to "Cases" tab - view and update customer cases
5. Navigate to "Deliveries" tab - manage delivery assignments
6. Receive real-time Socket.io notifications for all events

### Test Customer Features:
1. Login with Customer credentials
2. View your orders and their status with lock indicators
3. Create a recurring order for regular service
4. Navigate to "My Cases" - raise a new case/request
5. Receive real-time notifications for order updates
6. Try to edit a locked order (will be blocked)

## 📊 Key Workflows

### Creating a Recurring Order (Admin/Owner):
1. Click "Create Order" button
2. Select customer from dropdown
3. Add order items (custom pricing automatically applied if set)
4. Set pickup and delivery dates
5. Check "Recurring Order" checkbox
6. Select or create frequency template (daily, weekly, monthly, custom)
7. Submit - customer receives notification, future orders auto-generate

### Setting Customer-Specific Pricing (Owner):
1. Navigate to "Customer Pricing" section
2. Select customer from dropdown
3. Select SKU to customize
4. Enter custom price (overrides base price)
5. Save - customer sees custom price in all future orders

### Order Auto-Lock Process:
1. Order is created (timestamp recorded)
2. After 8 hours, APScheduler job runs
3. Order is marked as locked
4. Notifications sent to customer, owner, and admin via Socket.io and email
5. Order edit attempts are blocked with error message

### Handling a Customer Case (Admin/Owner):
1. Customer raises a case from their portal
2. Admin/Owner receives real-time Socket.io notification
3. Navigate to Cases tab
4. Click "Update" on the case
5. Change status, add resolution notes
6. Submit - customer receives instant notification

## 🛠️ System Architecture

```
Frontend (React + Socket.io Client) ⟷ Backend API (FastAPI + Socket.io Server) ⟷ MongoDB
                                                    ⬇
                                            APScheduler (Background Jobs)
                                                    ⬇
                                          Notification System (Socket.io + Email)
```

## 📦 Database Collections

- **users**: User accounts with role-based access
- **orders**: Order records with items, status, lock status, and recurring patterns
- **cases**: Customer service requests
- **skus**: Service items with base pricing and quantities
- **customer_pricing**: Customer-specific price overrides
- **frequency_templates**: Recurring order frequency patterns
- **deliveries**: Delivery tracking information
- **notifications**: In-app notification records
- **contacts**: Contact form submissions
- **pending_users**: Temporary storage for OTP verification

## 🎯 Future Enhancements (Not Implemented)

While the current system is fully functional, here are potential future features:
- Real-time delivery driver GPS tracking
- Customer payment integration (Stripe)
- Advanced reporting and analytics with charts
- Mobile app versions
- Multi-location support
- Subscription-based pricing
- Customer loyalty program
- Inventory management

## 🐛 Known Limitations

- **Email notifications**: Requires Gmail SMTP configuration (optional, Socket.io works standalone)
- **SMS notifications**: Requires Twilio configuration (optional)
- **Delivery tracking**: Google Maps integration is configured but not fully implemented in UI
- **Payment processing**: Not implemented (manual payment handling)

## 📄 License

Copyright © 2025 Infinite Laundry Solutions. All rights reserved.

## 🤝 Support

For support and questions:
- Email: info@infinitelaundry.com.au
- Phone: 1800 LAUNDRY
- Location: Serving Queensland

---

**Built with FastAPI + React + MongoDB + Socket.io**

**Latest Update**: January 2025 - Added recurring orders, customer-specific pricing, order locking, driver management, delivery tracking, and real-time notifications
