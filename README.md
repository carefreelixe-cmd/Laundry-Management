# Clienty - Professional Laundry Management System

A complete web-based management system for **Clienty**, a professional laundry and delivery service provider in Australia.

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
- **SKU & Pricing Configuration**: Manage service items and pricing
- **Analytics Dashboard**: View total orders, customers, revenue, and open cases
- **Approval System**: Oversee admin actions

#### 🧑‍💼 Admin Dashboard
- **Order Management**: Create, view, update, and track orders
- **Delivery Scheduling**: Assign drivers and manage delivery routes
- **Case Management**: Handle customer requests and complaints
- **Status Updates**: Update order and case statuses in real-time
- **Notification Center**: Send and receive in-app notifications

#### 🧍 Customer Portal
- **Order History**: View all past and current orders
- **Delivery Tracking**: Real-time status updates
- **Order Modification**: Modify orders up to 8 hours before delivery
- **Case Requests**: Raise service requests and track resolution status
- **Live Status Updates**: Real-time notifications for order and case updates

## 🛠️ Tech Stack

### Backend
- **FastAPI** (Python 3.9+)
- **MongoDB** with Motor (async driver)
- **JWT Authentication** with role-based access control (RBAC)
- **Pydantic** for data validation
- **Python Email** (smtplib) for notifications

### Frontend
- **React 19** with React Router
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

## 🔔 Notification System

- **Real-time Updates**: In-app notifications for order and case updates
- **Email Notifications**: Configurable email alerts (Gmail SMTP)
- **Role-based Notifications**: Targeted notifications based on user role
- **Notification Center**: Dropdown with read/unread status

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

## 📝 Business Rules

1. **Order Modification Window**: Customers can modify orders up to 8 hours before delivery
2. **User Creation**: Only Owner and Admin can create new users
3. **Case Assignment**: Cases are automatically visible to all Owners and Admins
4. **Order Creation**: Only Admin and Owner can create orders for customers
5. **SKU Management**: Only Owner can delete SKUs
6. **Role Hierarchy**: Owner > Admin > Customer

## 🚀 Pre-configured Services

The system comes with 7 pre-configured laundry services:
- Shirt - Wash & Fold ($5.00 per item)
- Pants - Wash & Fold ($7.00 per item)
- Suit - Dry Clean ($25.00 per item)
- Dress - Dry Clean ($20.00 per item)
- Bedding Set - Wash ($30.00 per set)
- Curtains - Dry Clean ($35.00 per pair)
- Ironing Service ($3.00 per item)

## 📧 Email Configuration (Optional)

For email notifications, configure Gmail SMTP in `backend/.env`:
```env
GMAIL_USER="your-gmail@gmail.com"
GMAIL_PASSWORD="your-app-password"
```

**Note**: Email functionality is optional. The system works fully without it.

## 🧪 Testing the System

### Test Owner Features:
1. Login as owner@clienty.com / owner123
2. Navigate to "User Management" tab - create new users
3. Navigate to "SKU & Pricing" tab - add/edit/delete service items
4. View analytics dashboard with stats

### Test Admin Features:
1. Login as admin@clienty.com / admin123
2. Navigate to "Orders" tab - create a new order for a customer
3. Navigate to "Cases" tab - view and update customer cases
4. Navigate to "Deliveries" tab - manage delivery assignments

### Test Customer Features:
1. Login as customer@clienty.com / customer123
2. View your orders and their status
3. Navigate to "My Cases" - raise a new case/request
4. Test order cancellation (if within 8-hour window)

## 📊 Key Workflows

### Creating an Order (Admin/Owner):
1. Click "Create Order" button
2. Select customer from dropdown
3. Add order items (multiple items supported)
4. Set pickup and delivery dates
5. Enter pickup and delivery addresses
6. Add special instructions (optional)
7. Submit - customer receives notification

### Handling a Customer Case (Admin/Owner):
1. Customer raises a case from their portal
2. Admin/Owner receives notification
3. Navigate to Cases tab
4. Click "Update" on the case
5. Change status, add resolution notes
6. Submit - customer receives notification

### Customer Order Modification:
1. Customer views their orders
2. Orders can be cancelled if more than 8 hours before delivery
3. After cancellation, order status changes to "cancelled"
4. Admin receives notification

## 🛠️ System Architecture

```
Frontend (React) ⟷ Backend API (FastAPI) ⟷ Database (MongoDB)
                           ⬇
                   Notification System
                   Email Service (Gmail SMTP)
```

## 📦 Database Collections

- **users**: User accounts with role-based access
- **orders**: Order records with items and status
- **cases**: Customer service requests
- **skus**: Service items and pricing
- **deliveries**: Delivery tracking information
- **notifications**: In-app notification records
- **contacts**: Contact form submissions

## 🎯 Future Enhancements (Not Implemented)

While the current system is fully functional, here are potential future features:
- Real-time delivery driver GPS tracking
- Automated SMS notifications
- Customer payment integration (Stripe)
- Advanced reporting and analytics
- Mobile app versions
- Multi-location support
- Subscription-based pricing

## 🐛 Known Limitations

- **Email notifications**: Requires Gmail SMTP configuration (optional)
- **Delivery tracking**: Google Maps integration is configured but not fully implemented in UI
- **Payment processing**: Not implemented (manual payment handling)

## 📄 License

Copyright © 2025 Clienty. All rights reserved.

## 🤝 Support

For support and questions:
- Email: info@clienty.com.au
- Phone: 1800 LAUNDRY
- Address: Sydney, Melbourne, Brisbane

---

**Built with FastAPI + React + MongoDB on Emergent Platform**
