from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
from passlib.context import CryptContext
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Utility Functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = timedelta(days=7)):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        role = payload.get("role")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication")
        return {"id": user_id, "role": role}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def require_role(allowed_roles: List[str]):
    async def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user["role"] not in allowed_roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return current_user
    return role_checker

def send_email(to_email: str, subject: str, body: str):
    try:
        gmail_user = os.environ.get('GMAIL_USER')
        gmail_password = os.environ.get('GMAIL_PASSWORD')
        
        if not gmail_user or not gmail_password:
            logging.warning("Gmail credentials not configured")
            return False
        
        msg = MIMEMultipart()
        msg['From'] = gmail_user
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'html'))
        
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(gmail_user, gmail_password)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        logging.error(f"Email sending failed: {str(e)}")
        return False

# Pydantic Models
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str
    phone: Optional[str] = None
    address: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_active: bool = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: User

class SKUBase(BaseModel):
    name: str
    category: str
    price: float
    unit: str
    description: Optional[str] = None

class SKU(SKUBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderItemBase(BaseModel):
    sku_id: str
    sku_name: str
    quantity: int
    price: float

class OrderBase(BaseModel):
    customer_id: str
    customer_name: str
    customer_email: str
    items: List[OrderItemBase]
    pickup_date: str
    delivery_date: str
    pickup_address: str
    delivery_address: str
    special_instructions: Optional[str] = None

class Order(OrderBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_number: str
    status: str = "pending"
    total_amount: float
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_by: str

class OrderUpdate(BaseModel):
    status: Optional[str] = None
    pickup_date: Optional[str] = None
    delivery_date: Optional[str] = None
    special_instructions: Optional[str] = None

class DeliveryBase(BaseModel):
    order_id: str
    driver_name: Optional[str] = None
    driver_phone: Optional[str] = None
    vehicle_number: Optional[str] = None
    route_details: Optional[str] = None

class Delivery(DeliveryBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "pending"
    pickup_lat: Optional[float] = None
    pickup_lng: Optional[float] = None
    delivery_lat: Optional[float] = None
    delivery_lng: Optional[float] = None
    current_lat: Optional[float] = None
    current_lng: Optional[float] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CaseRequestBase(BaseModel):
    customer_id: str
    customer_name: str
    customer_email: str
    type: str
    subject: str
    description: str
    order_id: Optional[str] = None
    priority: str = "medium"

class CaseRequest(CaseRequestBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    case_number: str
    status: str = "open"
    assigned_to: Optional[str] = None
    resolution: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CaseUpdate(BaseModel):
    status: Optional[str] = None
    assigned_to: Optional[str] = None
    resolution: Optional[str] = None
    priority: Optional[str] = None

class NotificationBase(BaseModel):
    user_id: str
    title: str
    message: str
    type: str

class Notification(NotificationBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    is_read: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    phone: str
    message: str

# Helper function to create notifications
async def create_notification(user_id: str, title: str, message: str, notif_type: str):
    notif = Notification(user_id=user_id, title=title, message=message, type=notif_type)
    doc = notif.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.notifications.insert_one(doc)
    return notif

# Authentication Routes
@api_router.post("/auth/register", response_model=User)
async def register_user(user: UserCreate, current_user: dict = Depends(require_role(["owner", "admin"]))):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_dict = user.model_dump()
    hashed_password = hash_password(user_dict.pop("password"))
    user_obj = User(**user_dict)
    
    doc = user_obj.model_dump()
    doc['password'] = hashed_password
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.users.insert_one(doc)
    return user_obj

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user_doc = await db.users.find_one({"email": credentials.email})
    if not user_doc or not verify_password(credentials.password, user_doc['password']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not user_doc.get('is_active', True):
        raise HTTPException(status_code=401, detail="Account is inactive")
    
    user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at']) if isinstance(user_doc['created_at'], str) else user_doc['created_at']
    user_obj = User(**{k: v for k, v in user_doc.items() if k != 'password'})
    
    token = create_access_token(data={"sub": user_obj.id, "role": user_obj.role})
    return TokenResponse(access_token=token, token_type="bearer", user=user_obj)

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: dict = Depends(get_current_user)):
    user_doc = await db.users.find_one({"id": current_user["id"]}, {"_id": 0, "password": 0})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at']) if isinstance(user_doc['created_at'], str) else user_doc['created_at']
    return User(**user_doc)

# User Management Routes
@api_router.get("/users", response_model=List[User])
async def get_users(current_user: dict = Depends(require_role(["owner", "admin"]))):
    users = await db.users.find({}, {"_id": 0, "password": 0}).to_list(1000)
    for user in users:
        user['created_at'] = datetime.fromisoformat(user['created_at']) if isinstance(user['created_at'], str) else user['created_at']
    return users

@api_router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str, current_user: dict = Depends(require_role(["owner", "admin"]))):
    user_doc = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at']) if isinstance(user_doc['created_at'], str) else user_doc['created_at']
    return User(**user_doc)

@api_router.delete("/users/{user_id}")
async def delete_user(user_id: str, current_user: dict = Depends(require_role(["owner"]))):
    result = await db.users.delete_one({"id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

# SKU Management Routes
@api_router.post("/skus", response_model=SKU)
async def create_sku(sku: SKUBase, current_user: dict = Depends(require_role(["owner", "admin"]))):
    sku_obj = SKU(**sku.model_dump())
    doc = sku_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.skus.insert_one(doc)
    return sku_obj

@api_router.get("/skus", response_model=List[SKU])
async def get_skus():
    skus = await db.skus.find({}, {"_id": 0}).to_list(1000)
    for sku in skus:
        sku['created_at'] = datetime.fromisoformat(sku['created_at']) if isinstance(sku['created_at'], str) else sku['created_at']
    return skus

@api_router.put("/skus/{sku_id}", response_model=SKU)
async def update_sku(sku_id: str, sku: SKUBase, current_user: dict = Depends(require_role(["owner", "admin"]))):
    result = await db.skus.update_one({"id": sku_id}, {"$set": sku.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="SKU not found")
    updated_sku = await db.skus.find_one({"id": sku_id}, {"_id": 0})
    updated_sku['created_at'] = datetime.fromisoformat(updated_sku['created_at']) if isinstance(updated_sku['created_at'], str) else updated_sku['created_at']
    return SKU(**updated_sku)

@api_router.delete("/skus/{sku_id}")
async def delete_sku(sku_id: str, current_user: dict = Depends(require_role(["owner"]))):
    result = await db.skus.delete_one({"id": sku_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="SKU not found")
    return {"message": "SKU deleted successfully"}

# Order Management Routes
@api_router.post("/orders", response_model=Order)
async def create_order(order: OrderBase, current_user: dict = Depends(require_role(["owner", "admin"]))):
    # Generate order number
    count = await db.orders.count_documents({}) + 1
    order_number = f"ORD-{count:06d}"
    
    # Calculate total
    total_amount = sum(item.price * item.quantity for item in order.items)
    
    order_dict = order.model_dump()
    order_dict['order_number'] = order_number
    order_dict['total_amount'] = total_amount
    order_dict['created_by'] = current_user['id']
    order_obj = Order(**order_dict)
    
    doc = order_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.orders.insert_one(doc)
    
    # Create notification for customer
    await create_notification(
        order.customer_id,
        "New Order Created",
        f"Your order {order_number} has been created successfully.",
        "order"
    )
    
    return order_obj

@api_router.get("/orders", response_model=List[Order])
async def get_orders(current_user: dict = Depends(get_current_user)):
    query = {}
    if current_user['role'] == 'customer':
        query['customer_id'] = current_user['id']
    
    orders = await db.orders.find(query, {"_id": 0}).to_list(1000)
    for order in orders:
        order['created_at'] = datetime.fromisoformat(order['created_at']) if isinstance(order['created_at'], str) else order['created_at']
        order['updated_at'] = datetime.fromisoformat(order['updated_at']) if isinstance(order['updated_at'], str) else order['updated_at']
    return sorted(orders, key=lambda x: x['created_at'], reverse=True)

@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str, current_user: dict = Depends(get_current_user)):
    order_doc = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order_doc:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if current_user['role'] == 'customer' and order_doc['customer_id'] != current_user['id']:
        raise HTTPException(status_code=403, detail="Not authorized to view this order")
    
    order_doc['created_at'] = datetime.fromisoformat(order_doc['created_at']) if isinstance(order_doc['created_at'], str) else order_doc['created_at']
    order_doc['updated_at'] = datetime.fromisoformat(order_doc['updated_at']) if isinstance(order_doc['updated_at'], str) else order_doc['updated_at']
    return Order(**order_doc)

@api_router.put("/orders/{order_id}", response_model=Order)
async def update_order(order_id: str, update: OrderUpdate, current_user: dict = Depends(get_current_user)):
    order_doc = await db.orders.find_one({"id": order_id})
    if not order_doc:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Customer can only modify orders 8 hours before delivery
    if current_user['role'] == 'customer':
        if order_doc['customer_id'] != current_user['id']:
            raise HTTPException(status_code=403, detail="Not authorized")
        
        delivery_date = datetime.fromisoformat(order_doc['delivery_date'])
        if datetime.now(timezone.utc) > delivery_date - timedelta(hours=8):
            raise HTTPException(status_code=400, detail="Cannot modify order within 8 hours of delivery")
    
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.orders.update_one({"id": order_id}, {"$set": update_data})
    
    updated_order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    updated_order['created_at'] = datetime.fromisoformat(updated_order['created_at'])
    updated_order['updated_at'] = datetime.fromisoformat(updated_order['updated_at'])
    
    # Notify customer of update
    await create_notification(
        order_doc['customer_id'],
        "Order Updated",
        f"Your order {order_doc['order_number']} has been updated.",
        "order"
    )
    
    return Order(**updated_order)

@api_router.delete("/orders/{order_id}")
async def cancel_order(order_id: str, current_user: dict = Depends(get_current_user)):
    order_doc = await db.orders.find_one({"id": order_id})
    if not order_doc:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if current_user['role'] == 'customer' and order_doc['customer_id'] != current_user['id']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.orders.update_one({"id": order_id}, {"$set": {"status": "cancelled"}})
    
    await create_notification(
        order_doc['customer_id'],
        "Order Cancelled",
        f"Your order {order_doc['order_number']} has been cancelled.",
        "order"
    )
    
    return {"message": "Order cancelled successfully"}

# Delivery Routes
@api_router.post("/deliveries", response_model=Delivery)
async def create_delivery(delivery: DeliveryBase, current_user: dict = Depends(require_role(["owner", "admin"]))):
    delivery_obj = Delivery(**delivery.model_dump())
    doc = delivery_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.deliveries.insert_one(doc)
    return delivery_obj

@api_router.get("/deliveries", response_model=List[Delivery])
async def get_deliveries(current_user: dict = Depends(require_role(["owner", "admin"]))):
    deliveries = await db.deliveries.find({}, {"_id": 0}).to_list(1000)
    for delivery in deliveries:
        delivery['created_at'] = datetime.fromisoformat(delivery['created_at']) if isinstance(delivery['created_at'], str) else delivery['created_at']
        delivery['updated_at'] = datetime.fromisoformat(delivery['updated_at']) if isinstance(delivery['updated_at'], str) else delivery['updated_at']
    return deliveries

@api_router.get("/deliveries/order/{order_id}", response_model=Delivery)
async def get_delivery_by_order(order_id: str, current_user: dict = Depends(get_current_user)):
    delivery_doc = await db.deliveries.find_one({"order_id": order_id}, {"_id": 0})
    if not delivery_doc:
        raise HTTPException(status_code=404, detail="Delivery not found")
    
    delivery_doc['created_at'] = datetime.fromisoformat(delivery_doc['created_at']) if isinstance(delivery_doc['created_at'], str) else delivery_doc['created_at']
    delivery_doc['updated_at'] = datetime.fromisoformat(delivery_doc['updated_at']) if isinstance(delivery_doc['updated_at'], str) else delivery_doc['updated_at']
    return Delivery(**delivery_doc)

@api_router.put("/deliveries/{delivery_id}")
async def update_delivery(delivery_id: str, update_data: dict, current_user: dict = Depends(require_role(["owner", "admin"]))):
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    result = await db.deliveries.update_one({"id": delivery_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Delivery not found")
    return {"message": "Delivery updated successfully"}

# Case Request Routes
@api_router.post("/cases", response_model=CaseRequest)
async def create_case(case: CaseRequestBase, current_user: dict = Depends(get_current_user)):
    # Generate case number
    count = await db.cases.count_documents({}) + 1
    case_number = f"CASE-{count:06d}"
    
    case_dict = case.model_dump()
    case_dict['case_number'] = case_number
    case_obj = CaseRequest(**case_dict)
    
    doc = case_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.cases.insert_one(doc)
    
    # Notify admins
    admins = await db.users.find({"role": {"$in": ["owner", "admin"]}}, {"_id": 0}).to_list(100)
    for admin in admins:
        await create_notification(
            admin['id'],
            "New Case Request",
            f"New case {case_number} created by {case.customer_name}",
            "case"
        )
    
    return case_obj

@api_router.get("/cases", response_model=List[CaseRequest])
async def get_cases(current_user: dict = Depends(get_current_user)):
    query = {}
    if current_user['role'] == 'customer':
        query['customer_id'] = current_user['id']
    
    cases = await db.cases.find(query, {"_id": 0}).to_list(1000)
    for case in cases:
        case['created_at'] = datetime.fromisoformat(case['created_at']) if isinstance(case['created_at'], str) else case['created_at']
        case['updated_at'] = datetime.fromisoformat(case['updated_at']) if isinstance(case['updated_at'], str) else case['updated_at']
    return sorted(cases, key=lambda x: x['created_at'], reverse=True)

@api_router.get("/cases/{case_id}", response_model=CaseRequest)
async def get_case(case_id: str, current_user: dict = Depends(get_current_user)):
    case_doc = await db.cases.find_one({"id": case_id}, {"_id": 0})
    if not case_doc:
        raise HTTPException(status_code=404, detail="Case not found")
    
    if current_user['role'] == 'customer' and case_doc['customer_id'] != current_user['id']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    case_doc['created_at'] = datetime.fromisoformat(case_doc['created_at']) if isinstance(case_doc['created_at'], str) else case_doc['created_at']
    case_doc['updated_at'] = datetime.fromisoformat(case_doc['updated_at']) if isinstance(case_doc['updated_at'], str) else case_doc['updated_at']
    return CaseRequest(**case_doc)

@api_router.put("/cases/{case_id}", response_model=CaseRequest)
async def update_case(case_id: str, update: CaseUpdate, current_user: dict = Depends(require_role(["owner", "admin"]))):
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.cases.update_one({"id": case_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Case not found")
    
    updated_case = await db.cases.find_one({"id": case_id}, {"_id": 0})
    updated_case['created_at'] = datetime.fromisoformat(updated_case['created_at'])
    updated_case['updated_at'] = datetime.fromisoformat(updated_case['updated_at'])
    
    # Notify customer
    await create_notification(
        updated_case['customer_id'],
        "Case Updated",
        f"Your case {updated_case['case_number']} has been updated.",
        "case"
    )
    
    return CaseRequest(**updated_case)

# Notification Routes
@api_router.get("/notifications", response_model=List[Notification])
async def get_notifications(current_user: dict = Depends(get_current_user)):
    notifs = await db.notifications.find({"user_id": current_user['id']}, {"_id": 0}).to_list(1000)
    for notif in notifs:
        notif['created_at'] = datetime.fromisoformat(notif['created_at']) if isinstance(notif['created_at'], str) else notif['created_at']
    return sorted(notifs, key=lambda x: x['created_at'], reverse=True)

@api_router.put("/notifications/{notif_id}/read")
async def mark_notification_read(notif_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.notifications.update_one(
        {"id": notif_id, "user_id": current_user['id']},
        {"$set": {"is_read": True}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"message": "Notification marked as read"}

@api_router.put("/notifications/read-all")
async def mark_all_read(current_user: dict = Depends(get_current_user)):
    await db.notifications.update_many(
        {"user_id": current_user['id']},
        {"$set": {"is_read": True}}
    )
    return {"message": "All notifications marked as read"}

# Analytics Routes
@api_router.get("/analytics/dashboard")
async def get_dashboard_stats(current_user: dict = Depends(require_role(["owner", "admin"]))):
    total_orders = await db.orders.count_documents({})
    total_customers = await db.users.count_documents({"role": "customer"})
    pending_orders = await db.orders.count_documents({"status": "pending"})
    completed_orders = await db.orders.count_documents({"status": "completed"})
    open_cases = await db.cases.count_documents({"status": "open"})
    
    # Calculate total revenue
    orders = await db.orders.find({"status": "completed"}, {"total_amount": 1}).to_list(10000)
    total_revenue = sum(order.get('total_amount', 0) for order in orders)
    
    return {
        "total_orders": total_orders,
        "total_customers": total_customers,
        "pending_orders": pending_orders,
        "completed_orders": completed_orders,
        "open_cases": open_cases,
        "total_revenue": total_revenue
    }

# Contact Form
@api_router.post("/contact")
async def submit_contact(form: ContactForm):
    doc = form.model_dump()
    doc['id'] = str(uuid.uuid4())
    doc['created_at'] = datetime.now(timezone.utc).isoformat()
    doc['status'] = 'new'
    await db.contacts.insert_one(doc)
    
    # Send email notification to admin
    send_email(
        os.environ.get('ADMIN_EMAIL', 'admin@clienty.com'),
        f"New Contact Form Submission from {form.name}",
        f"<h3>New Contact Form</h3><p><strong>Name:</strong> {form.name}</p><p><strong>Email:</strong> {form.email}</p><p><strong>Phone:</strong> {form.phone}</p><p><strong>Message:</strong> {form.message}</p>"
    )
    
    return {"message": "Contact form submitted successfully"}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()