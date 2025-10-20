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
from utils.email_service import send_otp_email, send_welcome_email
from utils.sms_service import send_sms_otp, send_welcome_sms
from utils.otp_service import generate_otp, is_otp_expired
import socketio
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.triggers.cron import CronTrigger

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

# Socket.io Setup
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*',
    logger=True,
    engineio_logger=False
)
socket_app = socketio.ASGIApp(sio, other_asgi_app=app)

# APScheduler Setup
scheduler = AsyncIOScheduler()

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

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: Optional[str] = "customer"
    phone: Optional[str] = None
    address: Optional[str] = None

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
    description: Optional[str] = None
    base_price: float
    category: str
    quantity: int = 1

class SKU(SKUBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CustomerPricingBase(BaseModel):
    customer_id: str
    sku_id: str
    custom_price: float

class CustomerPricing(CustomerPricingBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class FrequencyTemplateBase(BaseModel):
    name: str
    frequency_type: str  # daily, weekly, monthly, custom
    frequency_value: int  # e.g., every 2 days, every 3 weeks
    description: Optional[str] = None

class FrequencyTemplate(FrequencyTemplateBase):
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
    is_recurring: bool = False
    recurrence_pattern: Optional[dict] = None
    next_occurrence_date: Optional[str] = None

class Order(OrderBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_number: str
    status: str = "pending"
    total_amount: float
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_by: str
    is_locked: bool = False
    locked_at: Optional[datetime] = None

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

class OTPVerify(BaseModel):
    email: EmailStr
    otp: str

class ResendOTP(BaseModel):
    email: EmailStr

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

@api_router.post("/auth/signup")
async def public_signup(user: UserCreate):
    """
    Public signup endpoint - creates unverified user and sends OTP
    """
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if pending verification exists
    pending = await db.pending_users.find_one({"email": user.email})
    if pending:
        # Delete old pending user
        await db.pending_users.delete_one({"email": user.email})
    
    # Generate OTP
    otp = generate_otp()
    
    # Create pending user
    user_dict = user.model_dump()
    hashed_password = hash_password(user_dict.pop("password"))
    
    pending_user = {
        "id": str(uuid.uuid4()),
        "email": user.email,
        "password": hashed_password,
        "full_name": user.full_name,
        "role": "customer",  # Default role for public signup
        "phone": user.phone,
        "address": user.address,
        "otp": otp,
        "otp_created_at": datetime.now(timezone.utc).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "is_active": False
    }
    
    await db.pending_users.insert_one(pending_user)
    
    # Send OTP via both email and SMS
    email_sent = send_otp_email(user.email, otp, user.full_name)
    sms_sent = False
    if user.phone:
        sms_sent = send_sms_otp(user.phone, otp, user.full_name)
    
    return {
        "message": "OTP sent to your email" + (" and phone" if sms_sent and user.phone else "") + ". Please verify to complete registration.",
        "email": user.email,
        "phone": user.phone if user.phone else None
    }

@api_router.post("/auth/verify-otp")
async def verify_otp(data: OTPVerify):
    """
    Verify OTP and activate user account
    """
    # Find pending user
    pending_user = await db.pending_users.find_one({"email": data.email})
    
    if not pending_user:
        raise HTTPException(status_code=404, detail="No pending registration found for this email")
    
    # Check OTP
    if pending_user['otp'] != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP code")
    
    # Check OTP expiry
    if is_otp_expired(pending_user['otp_created_at']):
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new one.")
    
    # Create actual user
    user_data = {
        "id": pending_user['id'],
        "email": pending_user['email'],
        "password": pending_user['password'],
        "full_name": pending_user['full_name'],
        "role": pending_user['role'],
        "phone": pending_user.get('phone'),
        "address": pending_user.get('address'),
        "is_active": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_data)
    
    # Delete pending user
    await db.pending_users.delete_one({"email": data.email})
    
    # Send welcome messages
    send_welcome_email(data.email, pending_user['full_name'])
    if pending_user.get('phone'):
        send_welcome_sms(pending_user['phone'], pending_user['full_name'])
    
    return {
        "message": "Email verified successfully! You can now log in.",
        "email": data.email
    }

@api_router.post("/auth/resend-otp")
async def resend_otp(data: ResendOTP):
    """
    Resend OTP to user
    """
    pending_user = await db.pending_users.find_one({"email": data.email})
    
    if not pending_user:
        raise HTTPException(status_code=404, detail="No pending registration found for this email")
    
    # Generate new OTP
    new_otp = generate_otp()
    
    # Update pending user
    await db.pending_users.update_one(
        {"email": data.email},
        {
            "$set": {
                "otp": new_otp,
                "otp_created_at": datetime.now(timezone.utc).isoformat()
            }
        }
    )
    
    # Send new OTP
    send_otp_email(data.email, new_otp, pending_user['full_name'])
    
    return {"message": "New OTP sent to your email"}

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user_doc = await db.users.find_one({"email": credentials.email})
    if not user_doc or not verify_password(credentials.password, user_doc['password']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not user_doc.get('is_active', True):
        raise HTTPException(status_code=401, detail="Account is inactive. Please verify your email.")
    
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

# Customer Pricing Routes
@api_router.post("/customer-pricing", response_model=CustomerPricing)
async def create_customer_pricing(pricing: CustomerPricingBase, current_user: dict = Depends(require_role(["owner"]))):
    """Set customer-specific pricing for a SKU"""
    # Check if pricing already exists
    existing = await db.customer_pricing.find_one({
        "customer_id": pricing.customer_id,
        "sku_id": pricing.sku_id
    })
    
    if existing:
        # Update existing pricing
        await db.customer_pricing.update_one(
            {"id": existing["id"]},
            {"$set": {"custom_price": pricing.custom_price}}
        )
        updated = await db.customer_pricing.find_one({"id": existing["id"]}, {"_id": 0})
        updated['created_at'] = datetime.fromisoformat(updated['created_at']) if isinstance(updated['created_at'], str) else updated['created_at']
        return CustomerPricing(**updated)
    
    # Create new pricing
    pricing_obj = CustomerPricing(**pricing.model_dump())
    doc = pricing_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.customer_pricing.insert_one(doc)
    return pricing_obj

@api_router.get("/customer-pricing/{customer_id}", response_model=List[CustomerPricing])
async def get_customer_pricing(customer_id: str, current_user: dict = Depends(get_current_user)):
    """Get all customer-specific pricing for a customer"""
    pricing = await db.customer_pricing.find({"customer_id": customer_id}, {"_id": 0}).to_list(1000)
    for p in pricing:
        p['created_at'] = datetime.fromisoformat(p['created_at']) if isinstance(p['created_at'], str) else p['created_at']
    return pricing

@api_router.get("/skus-with-pricing/{customer_id}")
async def get_skus_with_customer_pricing(customer_id: str, current_user: dict = Depends(get_current_user)):
    """Get all SKUs with customer-specific pricing applied"""
    # Get all SKUs
    skus = await db.skus.find({}, {"_id": 0}).to_list(1000)
    
    # Get customer-specific pricing
    customer_pricing = await db.customer_pricing.find({"customer_id": customer_id}, {"_id": 0}).to_list(1000)
    pricing_map = {p['sku_id']: p['custom_price'] for p in customer_pricing}
    
    # Apply customer pricing
    for sku in skus:
        sku['created_at'] = datetime.fromisoformat(sku['created_at']) if isinstance(sku['created_at'], str) else sku['created_at']
        sku['customer_price'] = pricing_map.get(sku['id'], sku['base_price'])
        sku['has_custom_pricing'] = sku['id'] in pricing_map
    
    return skus

@api_router.delete("/customer-pricing/{pricing_id}")
async def delete_customer_pricing(pricing_id: str, current_user: dict = Depends(require_role(["owner"]))):
    """Delete customer-specific pricing"""
    result = await db.customer_pricing.delete_one({"id": pricing_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Customer pricing not found")
    return {"message": "Customer pricing deleted successfully"}

# Frequency Template Routes
@api_router.post("/frequency-templates", response_model=FrequencyTemplate)
async def create_frequency_template(template: FrequencyTemplateBase, current_user: dict = Depends(require_role(["owner", "admin"]))):
    """Create a custom frequency template for recurring orders"""
    template_obj = FrequencyTemplate(**template.model_dump())
    doc = template_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.frequency_templates.insert_one(doc)
    return template_obj

@api_router.get("/frequency-templates", response_model=List[FrequencyTemplate])
async def get_frequency_templates(current_user: dict = Depends(get_current_user)):
    """Get all frequency templates"""
    templates = await db.frequency_templates.find({}, {"_id": 0}).to_list(1000)
    for t in templates:
        t['created_at'] = datetime.fromisoformat(t['created_at']) if isinstance(t['created_at'], str) else t['created_at']
    return templates

@api_router.put("/frequency-templates/{template_id}", response_model=FrequencyTemplate)
async def update_frequency_template(template_id: str, template: FrequencyTemplateBase, current_user: dict = Depends(require_role(["owner", "admin"]))):
    """Update a frequency template"""
    result = await db.frequency_templates.update_one({"id": template_id}, {"$set": template.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Frequency template not found")
    updated = await db.frequency_templates.find_one({"id": template_id}, {"_id": 0})
    updated['created_at'] = datetime.fromisoformat(updated['created_at']) if isinstance(updated['created_at'], str) else updated['created_at']
    return FrequencyTemplate(**updated)

@api_router.delete("/frequency-templates/{template_id}")
async def delete_frequency_template(template_id: str, current_user: dict = Depends(require_role(["owner", "admin"]))):
    """Delete a frequency template"""
    result = await db.frequency_templates.delete_one({"id": template_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Frequency template not found")
    return {"message": "Frequency template deleted successfully"}

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
    order_dict['is_locked'] = False
    
    # Handle recurring orders
    if order.is_recurring and order.recurrence_pattern:
        current_date = datetime.now(timezone.utc).date()
        frequency_type = order.recurrence_pattern.get('frequency_type')
        frequency_value = order.recurrence_pattern.get('frequency_value', 1)
        
        # Calculate next occurrence date
        if frequency_type == 'daily':
            next_date = current_date + timedelta(days=frequency_value)
        elif frequency_type == 'weekly':
            next_date = current_date + timedelta(weeks=frequency_value)
        elif frequency_type == 'monthly':
            next_date = current_date + timedelta(days=30 * frequency_value)
        else:
            next_date = current_date + timedelta(days=1)
        
        order_dict['next_occurrence_date'] = next_date.isoformat()
    
    order_obj = Order(**order_dict)
    
    doc = order_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    if doc.get('locked_at'):
        doc['locked_at'] = doc['locked_at'].isoformat()
    
    await db.orders.insert_one(doc)
    
    # Send notifications to customer, owner, and admin
    order_type = "recurring order" if order.is_recurring else "order"
    notification_message = f"New {order_type} #{order_number} has been created"
    
    # Notify customer
    customer = await db.users.find_one({"id": order.customer_id})
    if customer:
        await send_notification(
            user_id=customer['id'],
            email=customer['email'],
            title="New Order Created",
            message=f"Your {order_type} #{order_number} has been created successfully.",
            notif_type="order_created"
        )
    
    # Notify all owners and admins
    owners = await db.users.find({"role": "owner"}).to_list(length=None)
    admins = await db.users.find({"role": "admin"}).to_list(length=None)
    
    for user in owners + admins:
        await send_notification(
            user_id=user['id'],
            email=user['email'],
            title="New Order Created",
            message=notification_message,
            notif_type="order_created"
        )
    
    return order_obj

@api_router.post("/orders/customer", response_model=Order)
async def create_customer_order(order: OrderBase, current_user: dict = Depends(require_role(["customer"]))):
    """Allow customers to create their own orders"""
    # Generate order number
    count = await db.orders.count_documents({}) + 1
    order_number = f"ORD-{count:06d}"
    
    # Get customer details
    customer = await db.users.find_one({"id": current_user['id']})
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # Calculate total
    total_amount = sum(item.price * item.quantity for item in order.items)
    
    order_dict = order.model_dump()
    order_dict['customer_id'] = customer['id']
    order_dict['customer_name'] = customer['full_name']
    order_dict['customer_email'] = customer['email']
    order_dict['order_number'] = order_number
    order_dict['total_amount'] = total_amount
    order_dict['created_by'] = current_user['id']
    order_dict['is_locked'] = False
    
    # Handle recurring orders
    if order.is_recurring and order.recurrence_pattern:
        current_date = datetime.now(timezone.utc).date()
        frequency_type = order.recurrence_pattern.get('frequency_type')
        frequency_value = order.recurrence_pattern.get('frequency_value', 1)
        
        # Calculate next occurrence date
        if frequency_type == 'daily':
            next_date = current_date + timedelta(days=frequency_value)
        elif frequency_type == 'weekly':
            next_date = current_date + timedelta(weeks=frequency_value)
        elif frequency_type == 'monthly':
            next_date = current_date + timedelta(days=30 * frequency_value)
        else:
            next_date = current_date + timedelta(days=1)
        
        order_dict['next_occurrence_date'] = next_date.isoformat()
    
    order_obj = Order(**order_dict)
    
    doc = order_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    if doc.get('locked_at'):
        doc['locked_at'] = doc['locked_at'].isoformat()
    
    await db.orders.insert_one(doc)
    
    # Send notifications
    order_type = "recurring order" if order.is_recurring else "order"
    
    # Notify customer
    await send_notification(
        user_id=customer['id'],
        email=customer['email'],
        title="Order Created",
        message=f"Your {order_type} #{order_number} has been created successfully.",
        notif_type="order_created"
    )
    
    # Notify all owners and admins
    owners = await db.users.find({"role": "owner"}).to_list(length=None)
    admins = await db.users.find({"role": "admin"}).to_list(length=None)
    
    for user in owners + admins:
        await send_notification(
            user_id=user['id'],
            email=user['email'],
            title="New Customer Order",
            message=f"Customer {customer['full_name']} created a new {order_type} #{order_number}",
            notif_type="order_created"
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
    
    # Check if order is locked
    if order_doc.get('is_locked', False):
        raise HTTPException(status_code=400, detail="Cannot modify order - it has been locked after 8 hours")
    
    # Customer can only modify their own orders
    if current_user['role'] == 'customer':
        if order_doc['customer_id'] != current_user['id']:
            raise HTTPException(status_code=403, detail="Not authorized")
    
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.orders.update_one({"id": order_id}, {"$set": update_data})
    
    updated_order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    updated_order['created_at'] = datetime.fromisoformat(updated_order['created_at'])
    updated_order['updated_at'] = datetime.fromisoformat(updated_order['updated_at'])
    if updated_order.get('locked_at'):
        updated_order['locked_at'] = datetime.fromisoformat(updated_order['locked_at']) if isinstance(updated_order['locked_at'], str) else updated_order['locked_at']
    
    # Send notifications to customer, owner, and admin
    customer = await db.users.find_one({"id": order_doc['customer_id']})
    if customer:
        await send_notification(
            user_id=customer['id'],
            email=customer['email'],
            title="Order Updated",
            message=f"Your order #{order_doc['order_number']} has been updated.",
            notif_type="order_updated"
        )
    
    # Notify owners and admins
    owners = await db.users.find({"role": "owner"}).to_list(length=None)
    admins = await db.users.find({"role": "admin"}).to_list(length=None)
    
    for user in owners + admins:
        if user['id'] != current_user['id']:  # Don't notify the user who made the update
            await send_notification(
                user_id=user['id'],
                email=user['email'],
                title="Order Updated",
                message=f"Order #{order_doc['order_number']} has been updated.",
                notif_type="order_updated"
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

# Recurring Orders Routes
@api_router.get("/orders/recurring/list", response_model=List[Order])
async def get_recurring_orders(current_user: dict = Depends(get_current_user)):
    """Get all recurring order templates"""
    query = {"is_recurring": True, "status": {"$ne": "cancelled"}}
    if current_user['role'] == 'customer':
        query['customer_id'] = current_user['id']
    
    orders = await db.orders.find(query, {"_id": 0}).to_list(1000)
    for order in orders:
        order['created_at'] = datetime.fromisoformat(order['created_at']) if isinstance(order['created_at'], str) else order['created_at']
        order['updated_at'] = datetime.fromisoformat(order['updated_at']) if isinstance(order['updated_at'], str) else order['updated_at']
        if order.get('locked_at'):
            order['locked_at'] = datetime.fromisoformat(order['locked_at']) if isinstance(order['locked_at'], str) else order['locked_at']
    return orders

@api_router.delete("/orders/recurring/{order_id}")
async def cancel_recurring_order(order_id: str, current_user: dict = Depends(get_current_user)):
    """Cancel a recurring order (stops future occurrences)"""
    order_doc = await db.orders.find_one({"id": order_id})
    if not order_doc:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if not order_doc.get('is_recurring'):
        raise HTTPException(status_code=400, detail="Order is not a recurring order")
    
    if current_user['role'] == 'customer' and order_doc['customer_id'] != current_user['id']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.orders.update_one({"id": order_id}, {"$set": {"status": "cancelled", "is_recurring": False}})
    
    await send_notification(
        user_id=order_doc['customer_id'],
        email=order_doc['customer_email'],
        title="Recurring Order Cancelled",
        message=f"Your recurring order #{order_doc['order_number']} has been cancelled. No future orders will be generated.",
        notif_type="order_cancelled"
    )
    
    return {"message": "Recurring order cancelled successfully"}

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

# Socket.io Event Handlers
@sio.event
async def connect(sid, environ):
    logging.info(f"Client connected: {sid}")
    await sio.emit('connected', {'message': 'Connected to Clienty server'}, to=sid)

@sio.event
async def disconnect(sid):
    logging.info(f"Client disconnected: {sid}")

@sio.event
async def join_room(sid, data):
    """Join a room based on user_id for targeted notifications"""
    user_id = data.get('user_id')
    if user_id:
        sio.enter_room(sid, user_id)
        logging.info(f"Client {sid} joined room {user_id}")
        await sio.emit('room_joined', {'room': user_id}, to=sid)

# Scheduled Tasks
async def lock_orders_job():
    """Lock orders that are older than 8 hours and not yet locked"""
    try:
        current_time = datetime.now(timezone.utc)
        cutoff_time = current_time - timedelta(hours=8)
        
        # Find orders that need to be locked
        orders_to_lock = await db.orders.find({
            "is_locked": {"$ne": True},
            "created_at": {"$lt": cutoff_time.isoformat()}
        }).to_list(length=None)
        
        for order in orders_to_lock:
            # Lock the order
            await db.orders.update_one(
                {"id": order["id"]},
                {
                    "$set": {
                        "is_locked": True,
                        "locked_at": current_time.isoformat()
                    }
                }
            )
            
            # Send notifications
            await notify_order_locked(order)
            
        if orders_to_lock:
            logging.info(f"Locked {len(orders_to_lock)} orders")
    except Exception as e:
        logging.error(f"Error in lock_orders_job: {str(e)}")

async def generate_recurring_orders_job():
    """Generate recurring orders based on schedule"""
    try:
        current_date = datetime.now(timezone.utc).date()
        
        # Find recurring orders that need to be generated
        recurring_orders = await db.orders.find({
            "is_recurring": True,
            "next_occurrence_date": current_date.isoformat()
        }).to_list(length=None)
        
        for template_order in recurring_orders:
            # Create new order based on template
            await create_order_from_template(template_order)
            
        if recurring_orders:
            logging.info(f"Generated {len(recurring_orders)} recurring orders")
    except Exception as e:
        logging.error(f"Error in generate_recurring_orders_job: {str(e)}")

# Notification Helper Functions
async def notify_order_locked(order):
    """Send notifications when an order is locked"""
    try:
        # Get all owners and admins
        owners = await db.users.find({"role": "owner"}).to_list(length=None)
        admins = await db.users.find({"role": "admin"}).to_list(length=None)
        
        # Get customer
        customer = await db.users.find_one({"id": order["customer_id"]})
        
        notification_message = f"Order #{order['order_number']} has been automatically locked after 8 hours"
        
        # Notify customer
        if customer:
            await send_notification(
                user_id=customer['id'],
                email=customer['email'],
                title="Order Locked",
                message=notification_message,
                notif_type="order_locked"
            )
        
        # Notify owners and admins
        for user in owners + admins:
            await send_notification(
                user_id=user['id'],
                email=user['email'],
                title="Order Locked",
                message=notification_message,
                notif_type="order_locked"
            )
    except Exception as e:
        logging.error(f"Error in notify_order_locked: {str(e)}")

async def send_notification(user_id: str, email: str, title: str, message: str, notif_type: str):
    """Send both socket and email notifications"""
    try:
        # Store notification in database
        notif = Notification(
            user_id=user_id,
            title=title,
            message=message,
            type=notif_type
        )
        doc = notif.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.notifications.insert_one(doc)
        
        # Send socket notification
        await sio.emit('notification', {
            'id': notif.id,
            'title': title,
            'message': message,
            'type': notif_type,
            'created_at': doc['created_at']
        }, room=user_id)
        
        # Send email notification
        send_email(email, title, f"<p>{message}</p>")
    except Exception as e:
        logging.error(f"Error in send_notification: {str(e)}")

async def create_order_from_template(template_order):
    """Create a new order from a recurring order template"""
    try:
        # Create new order
        new_order = Order(
            customer_id=template_order['customer_id'],
            customer_name=template_order['customer_name'],
            customer_email=template_order['customer_email'],
            items=template_order['items'],
            pickup_date=template_order['pickup_date'],
            delivery_date=template_order['delivery_date'],
            pickup_address=template_order['pickup_address'],
            delivery_address=template_order['delivery_address'],
            special_instructions=template_order.get('special_instructions'),
            order_number=f"ORD-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}",
            total_amount=template_order['total_amount'],
            created_by='system_recurring',
            is_recurring=False  # The generated order is not recurring itself
        )
        
        doc = new_order.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        doc['is_locked'] = False
        await db.orders.insert_one(doc)
        
        # Update next occurrence date in template
        recurrence = template_order.get('recurrence_pattern', {})
        frequency_type = recurrence.get('frequency_type')
        frequency_value = recurrence.get('frequency_value', 1)
        
        next_date = datetime.fromisoformat(template_order['next_occurrence_date'])
        if frequency_type == 'daily':
            next_date = next_date + timedelta(days=frequency_value)
        elif frequency_type == 'weekly':
            next_date = next_date + timedelta(weeks=frequency_value)
        elif frequency_type == 'monthly':
            next_date = next_date + timedelta(days=30 * frequency_value)
        
        await db.orders.update_one(
            {"id": template_order['id']},
            {"$set": {"next_occurrence_date": next_date.date().isoformat()}}
        )
        
        # Send notification to customer
        customer = await db.users.find_one({"id": template_order['customer_id']})
        if customer:
            await send_notification(
                user_id=customer['id'],
                email=customer['email'],
                title="Recurring Order Generated",
                message=f"Your recurring order #{new_order.order_number} has been automatically created",
                notif_type="order_created"
            )
    except Exception as e:
        logging.error(f"Error in create_order_from_template: {str(e)}")

# Application Lifecycle Events
@app.on_event("startup")
async def startup_event():
    logging.info("Starting up Clienty server...")
    
    # Start the scheduler
    scheduler.start()
    
    # Schedule the order locking job (runs every hour)
    scheduler.add_job(
        lock_orders_job,
        IntervalTrigger(hours=1),
        id='lock_orders',
        replace_existing=True
    )
    
    # Schedule recurring orders job (runs daily at midnight)
    scheduler.add_job(
        generate_recurring_orders_job,
        CronTrigger(hour=0, minute=0),
        id='generate_recurring_orders',
        replace_existing=True
    )
    
    logging.info("Scheduler started with jobs: lock_orders, generate_recurring_orders")

@app.on_event("shutdown")
async def shutdown_event():
    logging.info("Shutting down Clienty server...")
    scheduler.shutdown()
    logging.info("Scheduler stopped")
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()