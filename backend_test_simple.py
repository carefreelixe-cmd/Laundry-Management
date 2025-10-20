#!/usr/bin/env python3
"""
Simple Backend API Testing for Clienty Laundry Management System
Tests new features using existing users
"""

import requests
import json
import time
from datetime import datetime, timedelta

# Configuration
BASE_URL = "https://price-order-hub.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

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

def make_request(method, endpoint, data=None, token=None):
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
        
        return response, None
    except requests.exceptions.RequestException as e:
        return None, f"Request failed: {str(e)}"

def test_authentication():
    """Test authentication with existing users"""
    print("=" * 60)
    print("TESTING AUTHENTICATION WITH EXISTING USERS")
    print("=" * 60)
    
    # Try to login with existing users (using correct passwords)
    existing_users = [
        {"email": "owner@clienty.com", "password": "owner123", "role": "owner"},
        {"email": "admin@clienty.com", "password": "admin123", "role": "admin"},
        {"email": "customer@clienty.com", "password": "customer123", "role": "customer"}
    ]
    
    for user_data in existing_users:
        login_data = {"email": user_data["email"], "password": user_data["password"]}
        response, error = make_request("POST", "/auth/login", login_data)
        
        if response and response.status_code == 200:
            data = response.json()
            test_data["tokens"][user_data["role"]] = data["access_token"]
            test_data["users"][user_data["role"]] = data["user"]
            log_test(f"{user_data['role'].title()} Login", "PASS", f"Logged in as {data['user']['full_name']}")
        else:
            log_test(f"{user_data['role'].title()} Login", "FAIL", f"Login failed: {error or response.text if response else 'No response'}")

def test_sku_management():
    """Test SKU management with new fields"""
    print("=" * 60)
    print("TESTING SKU MANAGEMENT")
    print("=" * 60)
    
    # Test getting existing SKUs
    response, error = make_request("GET", "/skus")
    if response and response.status_code == 200:
        skus = response.json()
        test_data["skus"] = skus
        log_test("Get Existing SKUs", "PASS", f"Retrieved {len(skus)} SKUs with new schema")
        
        # Verify new fields are present
        if skus and all(field in skus[0] for field in ["name", "description", "base_price", "category", "quantity"]):
            log_test("SKU Model Fields", "PASS", "All new fields present in SKU model")
        else:
            log_test("SKU Model Fields", "FAIL", "Missing new fields in SKU model")
    else:
        log_test("Get Existing SKUs", "FAIL", f"Failed to retrieve SKUs: {error}")
    
    # Test creating new SKU if we have owner token
    if "owner" in test_data["tokens"]:
        owner_token = test_data["tokens"]["owner"]
        new_sku = {
            "name": "Test Premium Service",
            "description": "Test premium laundry service with special care",
            "base_price": 15.99,
            "category": "Premium",
            "quantity": 1
        }
        
        response, error = make_request("POST", "/skus", new_sku, owner_token)
        if response and response.status_code == 200:
            sku = response.json()
            test_data["skus"].append(sku)
            log_test("Create New SKU", "PASS", f"Created SKU: {sku['name']}")
        else:
            log_test("Create New SKU", "FAIL", f"SKU creation failed: {error or response.text if response else 'No response'}")

def test_customer_pricing():
    """Test customer-specific pricing APIs"""
    print("=" * 60)
    print("TESTING CUSTOMER-SPECIFIC PRICING")
    print("=" * 60)
    
    if "owner" not in test_data["tokens"] or not test_data["skus"] or "customer" not in test_data["users"]:
        log_test("Customer Pricing", "SKIP", "Missing required data (owner token, SKUs, or customer)")
        return
    
    owner_token = test_data["tokens"]["owner"]
    customer_id = test_data["users"]["customer"]["id"]
    
    # Create customer-specific pricing
    if test_data["skus"]:
        pricing_data = {
            "customer_id": customer_id,
            "sku_id": test_data["skus"][0]["id"],
            "custom_price": 4.50  # Discount on first SKU
        }
        
        response, error = make_request("POST", "/customer-pricing", pricing_data, owner_token)
        if response and response.status_code == 200:
            created_pricing = response.json()
            test_data["customer_pricing"].append(created_pricing)
            log_test("Create Customer Pricing", "PASS", f"Custom price ${pricing_data['custom_price']} set for SKU")
        else:
            log_test("Create Customer Pricing", "FAIL", f"Failed to create pricing: {error or response.text if response else 'No response'}")
        
        # Get customer-specific pricing
        response, error = make_request("GET", f"/customer-pricing/{customer_id}", token=owner_token)
        if response and response.status_code == 200:
            customer_pricing = response.json()
            log_test("Get Customer Pricing", "PASS", f"Retrieved {len(customer_pricing)} custom pricing records")
        else:
            log_test("Get Customer Pricing", "FAIL", f"Failed to get customer pricing: {error}")
        
        # Get SKUs with customer pricing applied
        response, error = make_request("GET", f"/skus-with-pricing/{customer_id}", token=owner_token)
        if response and response.status_code == 200:
            skus_with_pricing = response.json()
            log_test("Get SKUs with Customer Pricing", "PASS", f"Retrieved {len(skus_with_pricing)} SKUs with pricing")
            
            # Verify pricing is applied correctly
            custom_priced_skus = [sku for sku in skus_with_pricing if sku.get("has_custom_pricing")]
            if custom_priced_skus:
                log_test("Customer Pricing Application", "PASS", f"Custom pricing applied to {len(custom_priced_skus)} SKUs")
            else:
                log_test("Customer Pricing Application", "WARN", "No custom pricing found in response")
        else:
            log_test("Get SKUs with Customer Pricing", "FAIL", f"Failed to get SKUs with pricing: {error}")

def test_frequency_templates():
    """Test frequency template management"""
    print("=" * 60)
    print("TESTING FREQUENCY TEMPLATES")
    print("=" * 60)
    
    if "owner" not in test_data["tokens"]:
        log_test("Frequency Templates", "SKIP", "No owner token available")
        return
    
    owner_token = test_data["tokens"]["owner"]
    
    # Create frequency templates
    templates_to_create = [
        {
            "name": "Weekly Standard",
            "frequency_type": "weekly",
            "frequency_value": 1,
            "description": "Weekly pickup and delivery service"
        },
        {
            "name": "Bi-Weekly Premium",
            "frequency_type": "weekly",
            "frequency_value": 2,
            "description": "Every two weeks premium service"
        }
    ]
    
    # Create templates
    for template_data in templates_to_create:
        response, error = make_request("POST", "/frequency-templates", template_data, owner_token)
        if response and response.status_code == 200:
            template = response.json()
            test_data["frequency_templates"].append(template)
            log_test(f"Create Template: {template_data['name']}", "PASS", f"Template created with ID: {template['id']}")
        else:
            log_test(f"Create Template: {template_data['name']}", "FAIL", f"Template creation failed: {error or response.text if response else 'No response'}")
    
    # Get all templates
    response, error = make_request("GET", "/frequency-templates", token=owner_token)
    if response and response.status_code == 200:
        templates = response.json()
        log_test("Get All Templates", "PASS", f"Retrieved {len(templates)} frequency templates")
    else:
        log_test("Get All Templates", "FAIL", f"Failed to retrieve templates: {error}")

def test_order_creation():
    """Test order creation with recurring capabilities"""
    print("=" * 60)
    print("TESTING ORDER CREATION & RECURRING ORDERS")
    print("=" * 60)
    
    if ("owner" not in test_data["tokens"] or "customer" not in test_data["tokens"] or 
        not test_data["skus"]):
        log_test("Order Creation", "SKIP", "Missing required data")
        return
    
    owner_token = test_data["tokens"]["owner"]
    customer_token = test_data["tokens"]["customer"]
    customer = test_data["users"]["customer"]
    
    # Test regular order creation (Admin/Owner)
    if test_data["skus"]:
        regular_order = {
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
            "pickup_address": "123 Test Street, Test City",
            "delivery_address": "123 Test Street, Test City",
            "special_instructions": "Handle with care - test order",
            "is_recurring": False
        }
        
        response, error = make_request("POST", "/orders", regular_order, owner_token)
        if response and response.status_code == 200:
            order = response.json()
            test_data["orders"].append(order)
            log_test("Create Regular Order (Admin)", "PASS", f"Order {order['order_number']} created")
        else:
            log_test("Create Regular Order (Admin)", "FAIL", f"Order creation failed: {error or response.text if response else 'No response'}")
        
        # Test recurring order creation
        recurring_order = {
            "customer_id": customer["id"],
            "customer_name": customer["full_name"],
            "customer_email": customer["email"],
            "items": [
                {
                    "sku_id": test_data["skus"][0]["id"],
                    "sku_name": test_data["skus"][0]["name"],
                    "quantity": 1,
                    "price": test_data["skus"][0]["base_price"]
                }
            ],
            "pickup_date": (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d"),
            "delivery_date": (datetime.now() + timedelta(days=4)).strftime("%Y-%m-%d"),
            "pickup_address": "123 Test Street, Test City",
            "delivery_address": "123 Test Street, Test City",
            "special_instructions": "Weekly recurring test order",
            "is_recurring": True,
            "recurrence_pattern": {
                "frequency_type": "weekly",
                "frequency_value": 1
            }
        }
        
        response, error = make_request("POST", "/orders", recurring_order, owner_token)
        if response and response.status_code == 200:
            order = response.json()
            test_data["orders"].append(order)
            log_test("Create Recurring Order (Admin)", "PASS", f"Recurring order {order['order_number']} created")
            
            # Verify recurring fields
            if order.get("is_recurring") and order.get("next_occurrence_date"):
                log_test("Recurring Order Fields", "PASS", "Recurring fields properly set")
            else:
                log_test("Recurring Order Fields", "FAIL", "Missing recurring fields")
        else:
            log_test("Create Recurring Order (Admin)", "FAIL", f"Recurring order creation failed: {error or response.text if response else 'No response'}")

def test_order_management():
    """Test order listing and management"""
    print("=" * 60)
    print("TESTING ORDER MANAGEMENT")
    print("=" * 60)
    
    if "owner" not in test_data["tokens"]:
        log_test("Order Management", "SKIP", "No owner token available")
        return
    
    owner_token = test_data["tokens"]["owner"]
    
    # Get all orders (owner view)
    response, error = make_request("GET", "/orders", token=owner_token)
    if response and response.status_code == 200:
        orders = response.json()
        log_test("Get All Orders (Owner)", "PASS", f"Retrieved {len(orders)} orders")
    else:
        log_test("Get All Orders (Owner)", "FAIL", f"Failed to get orders: {error}")
    
    # Get recurring orders list
    response, error = make_request("GET", "/orders/recurring/list", token=owner_token)
    if response and response.status_code == 200:
        recurring_orders = response.json()
        log_test("Get Recurring Orders", "PASS", f"Retrieved {len(recurring_orders)} recurring orders")
    else:
        log_test("Get Recurring Orders", "FAIL", f"Failed to get recurring orders: {error}")

def test_notifications():
    """Test notification system"""
    print("=" * 60)
    print("TESTING NOTIFICATION SYSTEM")
    print("=" * 60)
    
    if "customer" not in test_data["tokens"]:
        log_test("Notifications", "SKIP", "No customer token available")
        return
    
    customer_token = test_data["tokens"]["customer"]
    
    # Get notifications for customer
    response, error = make_request("GET", "/notifications", token=customer_token)
    if response and response.status_code == 200:
        notifications = response.json()
        log_test("Get Notifications", "PASS", f"Retrieved {len(notifications)} notifications")
        
        # Check if notifications were created from order operations
        order_notifications = [n for n in notifications if n.get("type") in ["order_created", "order_updated"]]
        if order_notifications:
            log_test("Order Notifications", "PASS", f"Found {len(order_notifications)} order-related notifications")
            test_data["notifications"] = notifications
        else:
            log_test("Order Notifications", "INFO", "No order-related notifications found (may be expected)")
    else:
        log_test("Get Notifications", "FAIL", f"Failed to get notifications: {error}")

def run_all_tests():
    """Run all backend API tests"""
    print("🧪 STARTING SIMPLE BACKEND API TESTING")
    print("=" * 80)
    print(f"Testing Backend URL: {BASE_URL}")
    print(f"Test Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80)
    
    try:
        # Run all test suites
        test_authentication()
        test_sku_management()
        test_customer_pricing()
        test_frequency_templates()
        test_order_creation()
        test_order_management()
        test_notifications()
        
        print("=" * 80)
        print("🏁 TESTING COMPLETED")
        print(f"Test Finished: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 80)
        
        # Summary
        print("\n📊 TEST SUMMARY:")
        print(f"• Authenticated users: {len(test_data['tokens'])}")
        print(f"• SKUs available: {len(test_data['skus'])}")
        print(f"• Customer pricing records: {len(test_data['customer_pricing'])}")
        print(f"• Frequency templates: {len(test_data['frequency_templates'])}")
        print(f"• Orders created: {len(test_data['orders'])}")
        print(f"• Notifications received: {len(test_data['notifications'])}")
        
    except Exception as e:
        print(f"❌ CRITICAL ERROR: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    run_all_tests()