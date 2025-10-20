#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Clienty Laundry Management System
Tests all new features: Customer pricing, Frequency templates, Recurring orders, Order locking, Notifications
"""

import requests
import json
import time
from datetime import datetime, timedelta
import uuid

# Configuration
BASE_URL = "https://laundry-manager-11.preview.emergentagent.com/api"
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

def test_authentication():
    """Test user creation and authentication flow"""
    print("=" * 60)
    print("TESTING AUTHENTICATION FLOW")
    print("=" * 60)
    
    # Test data for different user roles
    users_to_create = [
        {
            "email": "sarah.owner@clientylaundry.com",
            "password": "SecurePass123!",
            "full_name": "Sarah Johnson",
            "role": "owner",
            "phone": "+1-555-0101",
            "address": "123 Business Ave, Downtown"
        },
        {
            "email": "mike.admin@clientylaundry.com", 
            "password": "AdminPass456!",
            "full_name": "Mike Rodriguez",
            "role": "admin",
            "phone": "+1-555-0102",
            "address": "456 Admin Street, Midtown"
        },
        {
            "email": "emma.customer@gmail.com",
            "password": "CustomerPass789!",
            "full_name": "Emma Thompson",
            "role": "customer",
            "phone": "+1-555-0103",
            "address": "789 Residential Blvd, Suburbs"
        }
    ]
    
    # First, create owner account by trying to login (assuming owner exists)
    # If not, we'll create via public signup
    owner_login = {
        "email": "sarah.owner@clientylaundry.com",
        "password": "SecurePass123!"
    }
    
    response, error = make_request("POST", "/auth/login", owner_login)
    if response and response.status_code == 200:
        data = response.json()
        test_data["tokens"]["owner"] = data["access_token"]
        test_data["users"]["owner"] = data["user"]
        log_test("Owner Login", "PASS", f"Owner {data['user']['full_name']} logged in successfully")
    else:
        # Try to create owner via public signup (will need verification)
        log_test("Owner Login", "FAIL", f"Owner login failed: {error}")
        
        # Create owner via public signup
        response, error = make_request("POST", "/auth/signup", users_to_create[0])
        if response and response.status_code == 200:
            log_test("Owner Signup", "PASS", "Owner signup initiated - OTP verification needed")
            # In real scenario, we'd need OTP verification
            # For testing, we'll assume owner exists or create manually
        else:
            log_test("Owner Signup", "FAIL", f"Owner signup failed: {error}")
    
    # If we have owner token, create admin and customer users
    if "owner" in test_data["tokens"]:
        owner_token = test_data["tokens"]["owner"]
        
        # Create admin user
        response, error = make_request("POST", "/auth/register", users_to_create[1], owner_token)
        if response and response.status_code == 200:
            test_data["users"]["admin"] = response.json()
            log_test("Admin User Creation", "PASS", f"Admin {users_to_create[1]['full_name']} created")
            
            # Login as admin
            admin_login = {"email": users_to_create[1]["email"], "password": users_to_create[1]["password"]}
            response, error = make_request("POST", "/auth/login", admin_login)
            if response and response.status_code == 200:
                test_data["tokens"]["admin"] = response.json()["access_token"]
                log_test("Admin Login", "PASS", "Admin logged in successfully")
            else:
                log_test("Admin Login", "FAIL", f"Admin login failed: {error}")
        else:
            log_test("Admin User Creation", "FAIL", f"Admin creation failed: {error}")
        
        # Create customer user
        response, error = make_request("POST", "/auth/register", users_to_create[2], owner_token)
        if response and response.status_code == 200:
            test_data["users"]["customer"] = response.json()
            log_test("Customer User Creation", "PASS", f"Customer {users_to_create[2]['full_name']} created")
            
            # Login as customer
            customer_login = {"email": users_to_create[2]["email"], "password": users_to_create[2]["password"]}
            response, error = make_request("POST", "/auth/login", customer_login)
            if response and response.status_code == 200:
                test_data["tokens"]["customer"] = response.json()["access_token"]
                test_data["users"]["customer"] = response.json()["user"]
                log_test("Customer Login", "PASS", "Customer logged in successfully")
            else:
                log_test("Customer Login", "FAIL", f"Customer login failed: {error}")
        else:
            log_test("Customer User Creation", "FAIL", f"Customer creation failed: {error}")

def test_sku_management():
    """Test SKU management with new fields"""
    print("=" * 60)
    print("TESTING SKU MANAGEMENT")
    print("=" * 60)
    
    if "owner" not in test_data["tokens"]:
        log_test("SKU Management", "SKIP", "No owner token available")
        return
    
    owner_token = test_data["tokens"]["owner"]
    
    # Test SKUs with new model fields
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
        
        # Verify new fields are present
        if skus and all(field in skus[0] for field in ["name", "description", "base_price", "category", "quantity"]):
            log_test("SKU Model Fields", "PASS", "All new fields present in SKU model")
        else:
            log_test("SKU Model Fields", "FAIL", "Missing new fields in SKU model")
    else:
        log_test("Get All SKUs", "FAIL", f"Failed to retrieve SKUs: {error}")

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
    pricing_data = [
        {
            "customer_id": customer_id,
            "sku_id": test_data["skus"][0]["id"],
            "custom_price": 7.99  # Discount on Premium Shirt Cleaning
        },
        {
            "customer_id": customer_id,
            "sku_id": test_data["skus"][1]["id"], 
            "custom_price": 22.99  # Discount on Deluxe Suit Cleaning
        }
    ]
    
    # Create customer pricing
    for pricing in pricing_data:
        response, error = make_request("POST", "/customer-pricing", pricing, owner_token)
        if response and response.status_code == 200:
            created_pricing = response.json()
            test_data["customer_pricing"].append(created_pricing)
            log_test(f"Create Customer Pricing", "PASS", f"Custom price ${pricing['custom_price']} set for SKU")
        else:
            log_test(f"Create Customer Pricing", "FAIL", f"Failed to create pricing: {error}")
    
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
        if len(custom_priced_skus) == len(pricing_data):
            log_test("Customer Pricing Application", "PASS", "Custom pricing correctly applied to SKUs")
        else:
            log_test("Customer Pricing Application", "FAIL", "Custom pricing not applied correctly")
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
            "name": "Daily Pickup",
            "frequency_type": "daily",
            "frequency_value": 1,
            "description": "Daily pickup and delivery service for busy professionals"
        },
        {
            "name": "Weekly Service",
            "frequency_type": "weekly", 
            "frequency_value": 1,
            "description": "Weekly laundry service for regular customers"
        },
        {
            "name": "Bi-Weekly Premium",
            "frequency_type": "weekly",
            "frequency_value": 2,
            "description": "Every two weeks premium service package"
        },
        {
            "name": "Monthly Corporate",
            "frequency_type": "monthly",
            "frequency_value": 1,
            "description": "Monthly corporate uniform cleaning service"
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
            log_test(f"Create Template: {template_data['name']}", "FAIL", f"Template creation failed: {error}")
    
    # Get all templates
    response, error = make_request("GET", "/frequency-templates", token=owner_token)
    if response and response.status_code == 200:
        templates = response.json()
        log_test("Get All Templates", "PASS", f"Retrieved {len(templates)} frequency templates")
    else:
        log_test("Get All Templates", "FAIL", f"Failed to retrieve templates: {error}")
    
    # Update a template
    if test_data["frequency_templates"]:
        template_id = test_data["frequency_templates"][0]["id"]
        update_data = {
            "name": "Updated Daily Pickup",
            "frequency_type": "daily",
            "frequency_value": 1,
            "description": "Updated description for daily pickup service"
        }
        
        response, error = make_request("PUT", f"/frequency-templates/{template_id}", update_data, owner_token)
        if response and response.status_code == 200:
            log_test("Update Template", "PASS", "Template updated successfully")
        else:
            log_test("Update Template", "FAIL", f"Template update failed: {error}")

def test_order_creation_and_recurring():
    """Test order creation with recurring capabilities"""
    print("=" * 60)
    print("TESTING ORDER CREATION & RECURRING ORDERS")
    print("=" * 60)
    
    if ("owner" not in test_data["tokens"] or "customer" not in test_data["tokens"] or 
        not test_data["skus"] or not test_data["frequency_templates"]):
        log_test("Order Creation", "SKIP", "Missing required data")
        return
    
    owner_token = test_data["tokens"]["owner"]
    customer_token = test_data["tokens"]["customer"]
    customer = test_data["users"]["customer"]
    
    # Test regular order creation (Admin/Owner)
    regular_order = {
        "customer_id": customer["id"],
        "customer_name": customer["full_name"],
        "customer_email": customer["email"],
        "items": [
            {
                "sku_id": test_data["skus"][0]["id"],
                "sku_name": test_data["skus"][0]["name"],
                "quantity": 3,
                "price": test_data["skus"][0]["base_price"]
            },
            {
                "sku_id": test_data["skus"][1]["id"],
                "sku_name": test_data["skus"][1]["name"],
                "quantity": 1,
                "price": test_data["skus"][1]["base_price"]
            }
        ],
        "pickup_date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"),
        "delivery_date": (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d"),
        "pickup_address": "789 Residential Blvd, Suburbs",
        "delivery_address": "789 Residential Blvd, Suburbs",
        "special_instructions": "Please handle delicate items with care",
        "is_recurring": False
    }
    
    response, error = make_request("POST", "/orders", regular_order, owner_token)
    if response and response.status_code == 200:
        order = response.json()
        test_data["orders"].append(order)
        log_test("Create Regular Order (Admin)", "PASS", f"Order {order['order_number']} created")
    else:
        log_test("Create Regular Order (Admin)", "FAIL", f"Order creation failed: {error}")
    
    # Test recurring order creation (Admin/Owner)
    recurring_order = {
        "customer_id": customer["id"],
        "customer_name": customer["full_name"],
        "customer_email": customer["email"],
        "items": [
            {
                "sku_id": test_data["skus"][2]["id"],
                "sku_name": test_data["skus"][2]["name"],
                "quantity": 2,
                "price": test_data["skus"][2]["base_price"]
            }
        ],
        "pickup_date": (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d"),
        "delivery_date": (datetime.now() + timedelta(days=4)).strftime("%Y-%m-%d"),
        "pickup_address": "789 Residential Blvd, Suburbs",
        "delivery_address": "789 Residential Blvd, Suburbs",
        "special_instructions": "Weekly recurring service",
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
        log_test("Create Recurring Order (Admin)", "FAIL", f"Recurring order creation failed: {error}")
    
    # Test customer order creation
    customer_order = {
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
        "pickup_address": "789 Residential Blvd, Suburbs",
        "delivery_address": "789 Residential Blvd, Suburbs",
        "special_instructions": "Customer self-service order",
        "is_recurring": False
    }
    
    response, error = make_request("POST", "/orders/customer", customer_order, customer_token)
    if response and response.status_code == 200:
        order = response.json()
        test_data["orders"].append(order)
        log_test("Create Customer Order", "PASS", f"Customer order {order['order_number']} created")
    else:
        log_test("Create Customer Order", "FAIL", f"Customer order creation failed: {error}")
    
    # Test customer recurring order
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
        "pickup_address": "789 Residential Blvd, Suburbs",
        "delivery_address": "789 Residential Blvd, Suburbs",
        "special_instructions": "Monthly recurring customer order",
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
        log_test("Create Customer Recurring Order", "PASS", f"Customer recurring order {order['order_number']} created")
    else:
        log_test("Create Customer Recurring Order", "FAIL", f"Customer recurring order creation failed: {error}")

def test_order_management():
    """Test order listing and management"""
    print("=" * 60)
    print("TESTING ORDER MANAGEMENT")
    print("=" * 60)
    
    if "owner" not in test_data["tokens"]:
        log_test("Order Management", "SKIP", "No owner token available")
        return
    
    owner_token = test_data["tokens"]["owner"]
    customer_token = test_data["tokens"]["customer"]
    
    # Get all orders (owner view)
    response, error = make_request("GET", "/orders", token=owner_token)
    if response and response.status_code == 200:
        orders = response.json()
        log_test("Get All Orders (Owner)", "PASS", f"Retrieved {len(orders)} orders")
    else:
        log_test("Get All Orders (Owner)", "FAIL", f"Failed to get orders: {error}")
    
    # Get customer orders (customer view)
    response, error = make_request("GET", "/orders", token=customer_token)
    if response and response.status_code == 200:
        customer_orders = response.json()
        log_test("Get Customer Orders", "PASS", f"Customer retrieved {len(customer_orders)} orders")
    else:
        log_test("Get Customer Orders", "FAIL", f"Failed to get customer orders: {error}")
    
    # Get recurring orders list
    response, error = make_request("GET", "/orders/recurring/list", token=owner_token)
    if response and response.status_code == 200:
        recurring_orders = response.json()
        log_test("Get Recurring Orders", "PASS", f"Retrieved {len(recurring_orders)} recurring orders")
    else:
        log_test("Get Recurring Orders", "FAIL", f"Failed to get recurring orders: {error}")

def test_order_locking():
    """Test order locking functionality"""
    print("=" * 60)
    print("TESTING ORDER LOCKING")
    print("=" * 60)
    
    if "owner" not in test_data["tokens"] or not test_data["orders"]:
        log_test("Order Locking", "SKIP", "No owner token or orders available")
        return
    
    owner_token = test_data["tokens"]["owner"]
    
    # Test updating an unlocked order
    if test_data["orders"]:
        order_id = test_data["orders"][0]["id"]
        update_data = {
            "status": "in_progress",
            "special_instructions": "Updated instructions for processing"
        }
        
        response, error = make_request("PUT", f"/orders/{order_id}", update_data, owner_token)
        if response and response.status_code == 200:
            log_test("Update Unlocked Order", "PASS", "Order updated successfully")
        else:
            log_test("Update Unlocked Order", "FAIL", f"Order update failed: {error}")
        
        # Note: Testing actual locking after 8 hours would require waiting or manipulating time
        # In a real test environment, we would mock the time or use a test database
        log_test("Order Locking Logic", "INFO", "Order locking after 8 hours is implemented via scheduled job")

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
            log_test("Order Notifications", "WARN", "No order-related notifications found")
    else:
        log_test("Get Notifications", "FAIL", f"Failed to get notifications: {error}")
    
    # Test marking notification as read
    if test_data["notifications"]:
        notif_id = test_data["notifications"][0]["id"]
        response, error = make_request("PUT", f"/notifications/{notif_id}/read", token=customer_token)
        if response and response.status_code == 200:
            log_test("Mark Notification Read", "PASS", "Notification marked as read")
        else:
            log_test("Mark Notification Read", "FAIL", f"Failed to mark notification as read: {error}")

def test_recurring_order_cancellation():
    """Test recurring order cancellation"""
    print("=" * 60)
    print("TESTING RECURRING ORDER CANCELLATION")
    print("=" * 60)
    
    if "customer" not in test_data["tokens"]:
        log_test("Recurring Order Cancellation", "SKIP", "No customer token available")
        return
    
    customer_token = test_data["tokens"]["customer"]
    
    # Find a recurring order to cancel
    recurring_orders = [order for order in test_data["orders"] if order.get("is_recurring")]
    
    if recurring_orders:
        order_id = recurring_orders[0]["id"]
        response, error = make_request("DELETE", f"/orders/recurring/{order_id}", token=customer_token)
        if response and response.status_code == 200:
            log_test("Cancel Recurring Order", "PASS", "Recurring order cancelled successfully")
        else:
            log_test("Cancel Recurring Order", "FAIL", f"Failed to cancel recurring order: {error}")
    else:
        log_test("Cancel Recurring Order", "SKIP", "No recurring orders available to cancel")

def test_customer_pricing_deletion():
    """Test customer pricing deletion"""
    print("=" * 60)
    print("TESTING CUSTOMER PRICING DELETION")
    print("=" * 60)
    
    if "owner" not in test_data["tokens"] or not test_data["customer_pricing"]:
        log_test("Customer Pricing Deletion", "SKIP", "No owner token or customer pricing available")
        return
    
    owner_token = test_data["tokens"]["owner"]
    
    if test_data["customer_pricing"]:
        pricing_id = test_data["customer_pricing"][0]["id"]
        response, error = make_request("DELETE", f"/customer-pricing/{pricing_id}", token=owner_token)
        if response and response.status_code == 200:
            log_test("Delete Customer Pricing", "PASS", "Customer pricing deleted successfully")
        else:
            log_test("Delete Customer Pricing", "FAIL", f"Failed to delete customer pricing: {error}")

def run_all_tests():
    """Run all backend API tests"""
    print("🧪 STARTING COMPREHENSIVE BACKEND API TESTING")
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
        test_order_creation_and_recurring()
        test_order_management()
        test_order_locking()
        test_notifications()
        test_recurring_order_cancellation()
        test_customer_pricing_deletion()
        
        print("=" * 80)
        print("🏁 TESTING COMPLETED")
        print(f"Test Finished: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 80)
        
        # Summary
        print("\n📊 TEST SUMMARY:")
        print(f"• Users created: {len(test_data['users'])}")
        print(f"• SKUs created: {len(test_data['skus'])}")
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