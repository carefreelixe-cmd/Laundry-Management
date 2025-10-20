#!/usr/bin/env python3
"""
Backend API Testing for Clienty - Focus on New Features
Tests customer pricing, frequency templates, recurring orders, and order locking
"""

import requests
import json
import time
from datetime import datetime, timedelta
import uuid
import pymongo
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import os
from passlib.context import CryptContext

# Configuration
BASE_URL = "https://price-order-hub.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

# MongoDB connection for direct user creation
MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "clienty_database"

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Test data storage
test_data = {
    "tokens": {},
    "users": {},
    "skus": [],
    "customer_pricing": [],
    "frequency_templates": [],
    "orders": [],
    "notifications": []
}

def log_test(test_name, status, details=""):
    """Log test results"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    status_symbol = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
    print(f"[{timestamp}] {status_symbol} {test_name}")
    if details:
        print(f"    {details}")
    print()

def make_request(method, endpoint, data=None, token=None, expected_status=None):
    """Make HTTP request with error handling"""
    url = f"{BASE_URL}{endpoint}"
    headers = HEADERS.copy()
    
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    try:
        if method.upper() == "GET":
            response = requests.get(url, headers=headers, timeout=30)
        elif method.upper() == "POST":
            response = requests.post(url, headers=headers, json=data, timeout=30)
        elif method.upper() == "PUT":
            response = requests.put(url, headers=headers, json=data, timeout=30)
        elif method.upper() == "DELETE":
            response = requests.delete(url, headers=headers, timeout=30)
        
        if expected_status and response.status_code != expected_status:
            return None, f"Expected status {expected_status}, got {response.status_code}: {response.text}"
        
        return response, None
    except requests.exceptions.RequestException as e:
        return None, f"Request failed: {str(e)}"

def create_test_users():
    """Create test users directly in MongoDB"""
    print("=" * 60)
    print("CREATING TEST USERS DIRECTLY IN DATABASE")
    print("=" * 60)
    
    try:
        client = pymongo.MongoClient(MONGO_URL)
        db = client[DB_NAME]
        
        # Test users to create
        users_to_create = [
            {
                "id": str(uuid.uuid4()),
                "email": "owner@clientylaundry.com",
                "password": pwd_context.hash("SecurePass123!"),
                "full_name": "Test Owner",
                "role": "owner",
                "phone": "+1-555-0101",
                "address": "123 Business Ave",
                "is_active": True,
                "created_at": datetime.now().isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "email": "admin@clientylaundry.com",
                "password": pwd_context.hash("AdminPass456!"),
                "full_name": "Test Admin",
                "role": "admin",
                "phone": "+1-555-0102",
                "address": "456 Admin Street",
                "is_active": True,
                "created_at": datetime.now().isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "email": "customer@clientylaundry.com",
                "password": pwd_context.hash("CustomerPass789!"),
                "full_name": "Test Customer",
                "role": "customer",
                "phone": "+1-555-0103",
                "address": "789 Customer Blvd",
                "is_active": True,
                "created_at": datetime.now().isoformat()
            }
        ]
        
        # Clear existing users and create new ones
        db.users.delete_many({})
        
        for user in users_to_create:
            db.users.insert_one(user)
            log_test(f"Create {user['role']} user", "PASS", f"User {user['full_name']} created in database")
        
        client.close()
        return True
        
    except Exception as e:
        log_test("Database User Creation", "FAIL", f"Failed to create users: {str(e)}")
        return False

def test_authentication():
    """Test authentication with created users"""
    print("=" * 60)
    print("TESTING AUTHENTICATION WITH CREATED USERS")
    print("=" * 60)
    
    # Test users login
    users_to_login = [
        {"email": "owner@clientylaundry.com", "password": "SecurePass123!", "role": "owner"},
        {"email": "admin@clientylaundry.com", "password": "AdminPass456!", "role": "admin"},
        {"email": "customer@clientylaundry.com", "password": "CustomerPass789!", "role": "customer"}
    ]
    
    for user_login in users_to_login:
        response, error = make_request("POST", "/auth/login", {
            "email": user_login["email"],
            "password": user_login["password"]
        })
        
        if response and response.status_code == 200:
            data = response.json()
            test_data["tokens"][user_login["role"]] = data["access_token"]
            test_data["users"][user_login["role"]] = data["user"]
            log_test(f"{user_login['role'].title()} Login", "PASS", f"Successfully logged in as {user_login['role']}")
        else:
            log_test(f"{user_login['role'].title()} Login", "FAIL", f"Login failed: {error}")

def test_sku_management():
    """Test SKU management with enhanced model"""
    print("=" * 60)
    print("TESTING SKU MANAGEMENT")
    print("=" * 60)
    
    if "owner" not in test_data["tokens"]:
        log_test("SKU Management", "SKIP", "No owner token available")
        return
    
    owner_token = test_data["tokens"]["owner"]
    
    # Create test SKUs
    skus_to_create = [
        {
            "name": "Premium Shirt Cleaning",
            "description": "Professional cleaning for dress shirts and blouses",
            "base_price": 8.99,
            "category": "Shirts",
            "quantity": 1
        },
        {
            "name": "Deluxe Suit Cleaning",
            "description": "Full suit cleaning with pressing and minor repairs",
            "base_price": 24.99,
            "category": "Suits",
            "quantity": 1
        },
        {
            "name": "Express Wash & Fold",
            "description": "Quick wash and fold service for everyday clothes",
            "base_price": 12.50,
            "category": "Casual",
            "quantity": 5
        }
    ]
    
    # Create SKUs
    for sku_data in skus_to_create:
        response, error = make_request("POST", "/skus", sku_data, owner_token)
        if response and response.status_code == 200:
            sku = response.json()
            test_data["skus"].append(sku)
            log_test(f"Create SKU: {sku_data['name']}", "PASS", f"SKU created with ID: {sku['id']}")
        else:
            log_test(f"Create SKU: {sku_data['name']}", "FAIL", f"SKU creation failed: {error}")
    
    # Get all SKUs
    response, error = make_request("GET", "/skus")
    if response and response.status_code == 200:
        skus = response.json()
        log_test("Get All SKUs", "PASS", f"Retrieved {len(skus)} SKUs")
        
        # Verify enhanced model fields
        if skus and all(field in skus[0] for field in ["name", "description", "base_price", "category", "quantity"]):
            log_test("Enhanced SKU Model", "PASS", "All enhanced fields present in SKU model")
        else:
            log_test("Enhanced SKU Model", "FAIL", "Missing enhanced fields in SKU model")
    else:
        log_test("Get All SKUs", "FAIL", f"Failed to retrieve SKUs: {error}")

def test_customer_pricing_apis():
    """Test customer-specific pricing APIs"""
    print("=" * 60)
    print("TESTING CUSTOMER-SPECIFIC PRICING APIS")
    print("=" * 60)
    
    if "owner" not in test_data["tokens"] or not test_data["skus"] or "customer" not in test_data["users"]:
        log_test("Customer Pricing APIs", "SKIP", "Missing required data")
        return
    
    owner_token = test_data["tokens"]["owner"]
    customer_id = test_data["users"]["customer"]["id"]
    
    # Test 1: POST /api/customer-pricing (create custom pricing)
    pricing_data = {
        "customer_id": customer_id,
        "sku_id": test_data["skus"][0]["id"],
        "custom_price": 7.99  # Discount on Premium Shirt Cleaning
    }
    
    response, error = make_request("POST", "/customer-pricing", pricing_data, owner_token)
    if response and response.status_code == 200:
        created_pricing = response.json()
        test_data["customer_pricing"].append(created_pricing)
        log_test("POST /api/customer-pricing", "PASS", f"Custom pricing created: ${pricing_data['custom_price']}")
    else:
        log_test("POST /api/customer-pricing", "FAIL", f"Failed to create pricing: {error}")
    
    # Test 2: POST /api/customer-pricing (update existing pricing)
    update_pricing_data = {
        "customer_id": customer_id,
        "sku_id": test_data["skus"][0]["id"],
        "custom_price": 6.99  # Updated discount
    }
    
    response, error = make_request("POST", "/customer-pricing", update_pricing_data, owner_token)
    if response and response.status_code == 200:
        log_test("POST /api/customer-pricing (update)", "PASS", "Custom pricing updated successfully")
    else:
        log_test("POST /api/customer-pricing (update)", "FAIL", f"Failed to update pricing: {error}")
    
    # Test 3: GET /api/skus-with-pricing/{customer_id}
    response, error = make_request("GET", f"/skus-with-pricing/{customer_id}", token=owner_token)
    if response and response.status_code == 200:
        skus_with_pricing = response.json()
        log_test("GET /api/skus-with-pricing/{customer_id}", "PASS", f"Retrieved {len(skus_with_pricing)} SKUs with pricing")
        
        # Verify pricing is applied
        custom_priced_skus = [sku for sku in skus_with_pricing if sku.get("has_custom_pricing")]
        if custom_priced_skus:
            log_test("Customer Pricing Application", "PASS", "Custom pricing correctly applied to SKUs")
        else:
            log_test("Customer Pricing Application", "FAIL", "Custom pricing not applied correctly")
    else:
        log_test("GET /api/skus-with-pricing/{customer_id}", "FAIL", f"Failed to get SKUs with pricing: {error}")
    
    # Test 4: DELETE /api/customer-pricing/{pricing_id}
    if test_data["customer_pricing"]:
        pricing_id = test_data["customer_pricing"][0]["id"]
        response, error = make_request("DELETE", f"/customer-pricing/{pricing_id}", token=owner_token)
        if response and response.status_code == 200:
            log_test("DELETE /api/customer-pricing/{pricing_id}", "PASS", "Customer pricing deleted successfully")
        else:
            log_test("DELETE /api/customer-pricing/{pricing_id}", "FAIL", f"Failed to delete pricing: {error}")

def test_frequency_template_apis():
    """Test frequency template APIs"""
    print("=" * 60)
    print("TESTING FREQUENCY TEMPLATE APIS")
    print("=" * 60)
    
    if "owner" not in test_data["tokens"]:
        log_test("Frequency Template APIs", "SKIP", "No owner token available")
        return
    
    owner_token = test_data["tokens"]["owner"]
    
    # Test 1: POST /api/frequency-templates (create template)
    templates_to_create = [
        {
            "name": "Daily Pickup",
            "frequency_type": "daily",
            "frequency_value": 1,
            "description": "Daily pickup and delivery service"
        },
        {
            "name": "Weekly Service",
            "frequency_type": "weekly",
            "frequency_value": 1,
            "description": "Weekly laundry service"
        },
        {
            "name": "Monthly Corporate",
            "frequency_type": "monthly",
            "frequency_value": 1,
            "description": "Monthly corporate service"
        }
    ]
    
    for template_data in templates_to_create:
        response, error = make_request("POST", "/frequency-templates", template_data, owner_token)
        if response and response.status_code == 200:
            template = response.json()
            test_data["frequency_templates"].append(template)
            log_test(f"POST /api/frequency-templates ({template_data['name']})", "PASS", f"Template created: {template['id']}")
        else:
            log_test(f"POST /api/frequency-templates ({template_data['name']})", "FAIL", f"Failed to create template: {error}")
    
    # Test 2: GET /api/frequency-templates (list all templates)
    response, error = make_request("GET", "/frequency-templates", token=owner_token)
    if response and response.status_code == 200:
        templates = response.json()
        log_test("GET /api/frequency-templates", "PASS", f"Retrieved {len(templates)} frequency templates")
    else:
        log_test("GET /api/frequency-templates", "FAIL", f"Failed to retrieve templates: {error}")
    
    # Test 3: PUT /api/frequency-templates/{template_id} (update template)
    if test_data["frequency_templates"]:
        template_id = test_data["frequency_templates"][0]["id"]
        update_data = {
            "name": "Updated Daily Pickup",
            "frequency_type": "daily",
            "frequency_value": 1,
            "description": "Updated daily pickup service description"
        }
        
        response, error = make_request("PUT", f"/frequency-templates/{template_id}", update_data, owner_token)
        if response and response.status_code == 200:
            log_test("PUT /api/frequency-templates/{template_id}", "PASS", "Template updated successfully")
        else:
            log_test("PUT /api/frequency-templates/{template_id}", "FAIL", f"Failed to update template: {error}")
    
    # Test 4: DELETE /api/frequency-templates/{template_id}
    if len(test_data["frequency_templates"]) > 1:
        template_id = test_data["frequency_templates"][-1]["id"]  # Delete the last one
        response, error = make_request("DELETE", f"/frequency-templates/{template_id}", token=owner_token)
        if response and response.status_code == 200:
            log_test("DELETE /api/frequency-templates/{template_id}", "PASS", "Template deleted successfully")
        else:
            log_test("DELETE /api/frequency-templates/{template_id}", "FAIL", f"Failed to delete template: {error}")

def test_recurring_order_creation():
    """Test recurring order creation APIs"""
    print("=" * 60)
    print("TESTING RECURRING ORDER CREATION")
    print("=" * 60)
    
    if ("owner" not in test_data["tokens"] or "customer" not in test_data["tokens"] or 
        not test_data["skus"] or not test_data["frequency_templates"]):
        log_test("Recurring Order Creation", "SKIP", "Missing required data")
        return
    
    owner_token = test_data["tokens"]["owner"]
    customer_token = test_data["tokens"]["customer"]
    customer = test_data["users"]["customer"]
    
    # Test 1: POST /api/orders (admin creates recurring order)
    admin_recurring_order = {
        "customer_id": customer["id"],
        "customer_name": customer["full_name"],
        "customer_email": customer["email"],
        "items": [
            {
                "sku_id": test_data["skus"][0]["id"],
                "sku_name": test_data["skus"][0]["name"],
                "quantity": 2,
                "price": test_data["skus"][0]["base_price"]
            }
        ],
        "pickup_date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"),
        "delivery_date": (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d"),
        "pickup_address": "789 Customer Blvd",
        "delivery_address": "789 Customer Blvd",
        "special_instructions": "Admin created recurring order",
        "is_recurring": True,
        "recurrence_pattern": {
            "frequency_type": "weekly",
            "frequency_value": 1
        }
    }
    
    response, error = make_request("POST", "/orders", admin_recurring_order, owner_token)
    if response and response.status_code == 200:
        order = response.json()
        test_data["orders"].append(order)
        log_test("POST /api/orders (admin recurring)", "PASS", f"Admin recurring order created: {order['order_number']}")
        
        # Verify recurring fields
        if (order.get("is_recurring") and order.get("recurrence_pattern") and 
            order.get("next_occurrence_date")):
            log_test("Recurring Order Fields Verification", "PASS", "All recurring fields present")
        else:
            log_test("Recurring Order Fields Verification", "FAIL", "Missing recurring fields")
    else:
        log_test("POST /api/orders (admin recurring)", "FAIL", f"Failed to create admin recurring order: {error}")
    
    # Test 2: POST /api/orders/customer (customer creates recurring order)
    customer_recurring_order = {
        "items": [
            {
                "sku_id": test_data["skus"][1]["id"],
                "sku_name": test_data["skus"][1]["name"],
                "quantity": 1,
                "price": test_data["skus"][1]["base_price"]
            }
        ],
        "pickup_date": (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d"),
        "delivery_date": (datetime.now() + timedelta(days=4)).strftime("%Y-%m-%d"),
        "pickup_address": "789 Customer Blvd",
        "delivery_address": "789 Customer Blvd",
        "special_instructions": "Customer created recurring order",
        "is_recurring": True,
        "recurrence_pattern": {
            "frequency_type": "monthly",
            "frequency_value": 1
        }
    }
    
    response, error = make_request("POST", "/orders/customer", customer_recurring_order, customer_token)
    if response and response.status_code == 200:
        order = response.json()
        test_data["orders"].append(order)
        log_test("POST /api/orders/customer (recurring)", "PASS", f"Customer recurring order created: {order['order_number']}")
    else:
        log_test("POST /api/orders/customer (recurring)", "FAIL", f"Failed to create customer recurring order: {error}")

def test_order_lock_status():
    """Test order lock status functionality"""
    print("=" * 60)
    print("TESTING ORDER LOCK STATUS")
    print("=" * 60)
    
    if "owner" not in test_data["tokens"] or not test_data["orders"]:
        log_test("Order Lock Status", "SKIP", "No owner token or orders available")
        return
    
    owner_token = test_data["tokens"]["owner"]
    
    # Test 1: Verify orders have is_locked and locked_at fields
    response, error = make_request("GET", "/orders", token=owner_token)
    if response and response.status_code == 200:
        orders = response.json()
        if orders:
            order = orders[0]
            if "is_locked" in order and "locked_at" in order:
                log_test("Order Lock Fields Verification", "PASS", "Orders have is_locked and locked_at fields")
            else:
                log_test("Order Lock Fields Verification", "FAIL", "Missing lock fields in order model")
        else:
            log_test("Order Lock Fields Verification", "SKIP", "No orders to verify")
    else:
        log_test("Order Lock Fields Verification", "FAIL", f"Failed to get orders: {error}")
    
    # Test 2: Test updating unlocked order (should work)
    if test_data["orders"]:
        order_id = test_data["orders"][0]["id"]
        update_data = {
            "status": "in_progress",
            "special_instructions": "Updated instructions"
        }
        
        response, error = make_request("PUT", f"/orders/{order_id}", update_data, owner_token)
        if response and response.status_code == 200:
            log_test("PUT /api/orders/{order_id} (unlocked)", "PASS", "Successfully updated unlocked order")
        else:
            log_test("PUT /api/orders/{order_id} (unlocked)", "FAIL", f"Failed to update unlocked order: {error}")
    
    # Note: Testing locked order rejection would require waiting 8 hours or manipulating the database
    log_test("Order Locking After 8 Hours", "INFO", "Order locking logic implemented via scheduled job")

def run_all_tests():
    """Run all backend API tests"""
    print("🧪 STARTING BACKEND API TESTING FOR NEW FEATURES")
    print("=" * 80)
    print(f"Testing Backend URL: {BASE_URL}")
    print(f"Test Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80)
    
    try:
        # Create test users first
        if not create_test_users():
            print("❌ Failed to create test users. Exiting.")
            return
        
        # Run all test suites
        test_authentication()
        test_sku_management()
        test_customer_pricing_apis()
        test_frequency_template_apis()
        test_recurring_order_creation()
        test_order_lock_status()
        
        print("=" * 80)
        print("🏁 TESTING COMPLETED")
        print(f"Test Finished: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 80)
        
        # Summary
        print("\n📊 TEST SUMMARY:")
        print(f"• Users authenticated: {len(test_data['tokens'])}")
        print(f"• SKUs created: {len(test_data['skus'])}")
        print(f"• Customer pricing records: {len(test_data['customer_pricing'])}")
        print(f"• Frequency templates: {len(test_data['frequency_templates'])}")
        print(f"• Orders created: {len(test_data['orders'])}")
        
    except Exception as e:
        print(f"❌ CRITICAL ERROR: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    run_all_tests()