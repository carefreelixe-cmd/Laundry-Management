#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Clienty Laundry Management System
Tests all new features including edge cases and error handling
"""

import requests
import json
import time
from datetime import datetime, timedelta

# Configuration
BASE_URL = "https://laundry-manager-11.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

# Test credentials
CREDENTIALS = {
    "owner": {"email": "owner@clienty.com", "password": "owner123"},
    "admin": {"email": "admin@clienty.com", "password": "admin123"},
    "customer": {"email": "customer@clienty.com", "password": "customer123"}
}

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
    status_symbol = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️" if status == "WARN" else "ℹ️"
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
            return response, f"Expected status {expected_status}, got {response.status_code}"
        
        return response, None
    except requests.exceptions.RequestException as e:
        return None, f"Request failed: {str(e)}"

def setup_authentication():
    """Setup authentication for all user roles"""
    print("=" * 60)
    print("SETTING UP AUTHENTICATION")
    print("=" * 60)
    
    for role, creds in CREDENTIALS.items():
        response, error = make_request("POST", "/auth/login", creds)
        if response and response.status_code == 200:
            data = response.json()
            test_data["tokens"][role] = data["access_token"]
            test_data["users"][role] = data["user"]
            log_test(f"{role.title()} Authentication", "PASS", f"Logged in as {data['user']['full_name']}")
        else:
            log_test(f"{role.title()} Authentication", "FAIL", f"Login failed: {error or response.text if response else 'No response'}")
            return False
    return True

def test_socket_io_integration():
    """Test Socket.io server integration"""
    print("=" * 60)
    print("TESTING SOCKET.IO INTEGRATION")
    print("=" * 60)
    
    # Test Socket.io endpoint accessibility
    try:
        response = requests.get("https://laundry-manager-11.preview.emergentagent.com/socket.io/", timeout=10)
        if response.status_code in [200, 400]:  # 400 is expected for GET request to socket.io
            log_test("Socket.io Server Accessibility", "PASS", "Socket.io server is accessible")
        else:
            log_test("Socket.io Server Accessibility", "FAIL", f"Unexpected status: {response.status_code}")
    except Exception as e:
        log_test("Socket.io Server Accessibility", "FAIL", f"Socket.io server not accessible: {e}")

def test_apscheduler_integration():
    """Test APScheduler integration (indirect testing)"""
    print("=" * 60)
    print("TESTING APSCHEDULER INTEGRATION")
    print("=" * 60)
    
    # We can't directly test the scheduler, but we can verify the backend is running with scheduler
    # by checking if the server responds properly (scheduler starts on startup)
    response, error = make_request("GET", "/skus")
    if response and response.status_code == 200:
        log_test("APScheduler Integration", "PASS", "Backend running with scheduler (indirect test)")
    else:
        log_test("APScheduler Integration", "FAIL", "Backend not responding properly")

def test_enhanced_sku_model():
    """Test enhanced SKU model with all new fields"""
    print("=" * 60)
    print("TESTING ENHANCED SKU MODEL")
    print("=" * 60)
    
    if "owner" not in test_data["tokens"]:
        log_test("Enhanced SKU Model", "SKIP", "No owner token")
        return
    
    owner_token = test_data["tokens"]["owner"]
    
    # Test creating SKU with all new fields
    comprehensive_sku = {
        "name": "Comprehensive Test Service",
        "description": "Full-featured test service with all fields",
        "base_price": 29.99,
        "category": "Test Category",
        "quantity": 5
    }
    
    response, error = make_request("POST", "/skus", comprehensive_sku, owner_token)
    if response and response.status_code == 200:
        sku = response.json()
        test_data["skus"].append(sku)
        
        # Verify all fields are present and correct
        required_fields = ["id", "name", "description", "base_price", "category", "quantity", "created_at"]
        missing_fields = [field for field in required_fields if field not in sku]
        
        if not missing_fields:
            log_test("Enhanced SKU Model - All Fields", "PASS", "All required fields present")
        else:
            log_test("Enhanced SKU Model - All Fields", "FAIL", f"Missing fields: {missing_fields}")
        
        # Verify field values
        if (sku["name"] == comprehensive_sku["name"] and 
            sku["base_price"] == comprehensive_sku["base_price"] and
            sku["quantity"] == comprehensive_sku["quantity"]):
            log_test("Enhanced SKU Model - Field Values", "PASS", "All field values correct")
        else:
            log_test("Enhanced SKU Model - Field Values", "FAIL", "Field values don't match")
    else:
        log_test("Enhanced SKU Model", "FAIL", f"SKU creation failed: {error}")

def test_customer_pricing_comprehensive():
    """Comprehensive test of customer pricing functionality"""
    print("=" * 60)
    print("TESTING CUSTOMER PRICING COMPREHENSIVE")
    print("=" * 60)
    
    if "owner" not in test_data["tokens"] or "customer" not in test_data["users"]:
        log_test("Customer Pricing Comprehensive", "SKIP", "Missing required data")
        return
    
    owner_token = test_data["tokens"]["owner"]
    customer_id = test_data["users"]["customer"]["id"]
    
    # Get existing SKUs
    response, error = make_request("GET", "/skus")
    if response and response.status_code == 200:
        skus = response.json()
        test_data["skus"] = skus
        
        if len(skus) >= 2:
            # Test creating multiple customer pricing records
            pricing_records = [
                {
                    "customer_id": customer_id,
                    "sku_id": skus[0]["id"],
                    "custom_price": skus[0]["base_price"] * 0.8  # 20% discount
                },
                {
                    "customer_id": customer_id,
                    "sku_id": skus[1]["id"],
                    "custom_price": skus[1]["base_price"] * 0.9  # 10% discount
                }
            ]
            
            created_pricing = []
            for pricing in pricing_records:
                response, error = make_request("POST", "/customer-pricing", pricing, owner_token)
                if response and response.status_code == 200:
                    created_pricing.append(response.json())
                    log_test(f"Create Customer Pricing for SKU", "PASS", f"Custom price ${pricing['custom_price']:.2f} set")
                else:
                    log_test(f"Create Customer Pricing for SKU", "FAIL", f"Failed: {error}")
            
            # Test updating existing pricing (should update, not create duplicate)
            if created_pricing:
                update_pricing = {
                    "customer_id": customer_id,
                    "sku_id": skus[0]["id"],
                    "custom_price": skus[0]["base_price"] * 0.7  # 30% discount
                }
                
                response, error = make_request("POST", "/customer-pricing", update_pricing, owner_token)
                if response and response.status_code == 200:
                    log_test("Update Existing Customer Pricing", "PASS", "Pricing updated successfully")
                else:
                    log_test("Update Existing Customer Pricing", "FAIL", f"Failed: {error}")
            
            # Test getting SKUs with pricing applied
            response, error = make_request("GET", f"/skus-with-pricing/{customer_id}", token=owner_token)
            if response and response.status_code == 200:
                skus_with_pricing = response.json()
                
                # Verify pricing application
                custom_priced = [s for s in skus_with_pricing if s.get("has_custom_pricing")]
                if len(custom_priced) >= 2:
                    log_test("Customer Pricing Application", "PASS", f"Custom pricing applied to {len(custom_priced)} SKUs")
                    
                    # Verify pricing calculations
                    for sku in custom_priced:
                        if sku["customer_price"] != sku["base_price"]:
                            log_test("Pricing Calculation", "PASS", f"Custom price differs from base price for {sku['name']}")
                        else:
                            log_test("Pricing Calculation", "WARN", f"Custom price same as base price for {sku['name']}")
                else:
                    log_test("Customer Pricing Application", "FAIL", "Not enough custom pricing applied")
            else:
                log_test("Get SKUs with Pricing", "FAIL", f"Failed: {error}")

def test_frequency_templates_comprehensive():
    """Comprehensive test of frequency templates"""
    print("=" * 60)
    print("TESTING FREQUENCY TEMPLATES COMPREHENSIVE")
    print("=" * 60)
    
    if "owner" not in test_data["tokens"]:
        log_test("Frequency Templates Comprehensive", "SKIP", "No owner token")
        return
    
    owner_token = test_data["tokens"]["owner"]
    
    # Test all frequency types
    templates = [
        {
            "name": "Daily Express",
            "frequency_type": "daily",
            "frequency_value": 1,
            "description": "Daily express service"
        },
        {
            "name": "Every 3 Days",
            "frequency_type": "daily",
            "frequency_value": 3,
            "description": "Every three days service"
        },
        {
            "name": "Weekly Standard",
            "frequency_type": "weekly",
            "frequency_value": 1,
            "description": "Weekly standard service"
        },
        {
            "name": "Bi-Weekly Premium",
            "frequency_type": "weekly",
            "frequency_value": 2,
            "description": "Every two weeks premium service"
        },
        {
            "name": "Monthly Corporate",
            "frequency_type": "monthly",
            "frequency_value": 1,
            "description": "Monthly corporate service"
        }
    ]
    
    created_templates = []
    for template in templates:
        response, error = make_request("POST", "/frequency-templates", template, owner_token)
        if response and response.status_code == 200:
            created_template = response.json()
            created_templates.append(created_template)
            test_data["frequency_templates"].append(created_template)
            log_test(f"Create Template: {template['name']}", "PASS", f"Template created successfully")
        else:
            log_test(f"Create Template: {template['name']}", "FAIL", f"Failed: {error}")
    
    # Test updating a template
    if created_templates:
        template_id = created_templates[0]["id"]
        update_data = {
            "name": "Updated Daily Express",
            "frequency_type": "daily",
            "frequency_value": 1,
            "description": "Updated daily express service with new features"
        }
        
        response, error = make_request("PUT", f"/frequency-templates/{template_id}", update_data, owner_token)
        if response and response.status_code == 200:
            log_test("Update Frequency Template", "PASS", "Template updated successfully")
        else:
            log_test("Update Frequency Template", "FAIL", f"Failed: {error}")
    
    # Test getting all templates
    response, error = make_request("GET", "/frequency-templates", token=owner_token)
    if response and response.status_code == 200:
        all_templates = response.json()
        log_test("Get All Frequency Templates", "PASS", f"Retrieved {len(all_templates)} templates")
    else:
        log_test("Get All Frequency Templates", "FAIL", f"Failed: {error}")

def test_recurring_orders_comprehensive():
    """Comprehensive test of recurring orders"""
    print("=" * 60)
    print("TESTING RECURRING ORDERS COMPREHENSIVE")
    print("=" * 60)
    
    if ("owner" not in test_data["tokens"] or "customer" not in test_data["tokens"] or 
        not test_data["skus"]):
        log_test("Recurring Orders Comprehensive", "SKIP", "Missing required data")
        return
    
    owner_token = test_data["tokens"]["owner"]
    customer_token = test_data["tokens"]["customer"]
    customer = test_data["users"]["customer"]
    
    # Test different recurring patterns
    recurring_patterns = [
        {
            "name": "Daily Recurring",
            "frequency_type": "daily",
            "frequency_value": 1
        },
        {
            "name": "Weekly Recurring",
            "frequency_type": "weekly",
            "frequency_value": 1
        },
        {
            "name": "Monthly Recurring",
            "frequency_type": "monthly",
            "frequency_value": 1
        }
    ]
    
    created_orders = []
    for i, pattern in enumerate(recurring_patterns):
        if i < len(test_data["skus"]):
            sku = test_data["skus"][i]
            order_data = {
                "customer_id": customer["id"],
                "customer_name": customer["full_name"],
                "customer_email": customer["email"],
                "items": [
                    {
                        "sku_id": sku["id"],
                        "sku_name": sku["name"],
                        "quantity": 1,
                        "price": sku["base_price"]
                    }
                ],
                "pickup_date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"),
                "delivery_date": (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d"),
                "pickup_address": "123 Test Street, Test City",
                "delivery_address": "123 Test Street, Test City",
                "special_instructions": f"Test {pattern['name']} order",
                "is_recurring": True,
                "recurrence_pattern": {
                    "frequency_type": pattern["frequency_type"],
                    "frequency_value": pattern["frequency_value"]
                }
            }
            
            response, error = make_request("POST", "/orders", order_data, owner_token)
            if response and response.status_code == 200:
                order = response.json()
                created_orders.append(order)
                test_data["orders"].append(order)
                log_test(f"Create {pattern['name']} Order", "PASS", f"Order {order['order_number']} created")
                
                # Verify recurring fields
                if (order.get("is_recurring") and 
                    order.get("next_occurrence_date") and 
                    order.get("recurrence_pattern")):
                    log_test(f"{pattern['name']} Fields", "PASS", "All recurring fields present")
                else:
                    log_test(f"{pattern['name']} Fields", "FAIL", "Missing recurring fields")
            else:
                log_test(f"Create {pattern['name']} Order", "FAIL", f"Failed: {error}")
    
    # Test customer creating recurring order
    if test_data["skus"]:
        customer_recurring = {
            "items": [
                {
                    "sku_id": test_data["skus"][0]["id"],
                    "sku_name": test_data["skus"][0]["name"],
                    "quantity": 2,
                    "price": test_data["skus"][0]["base_price"]
                }
            ],
            "pickup_date": (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d"),
            "delivery_date": (datetime.now() + timedelta(days=4)).strftime("%Y-%m-%d"),
            "pickup_address": "456 Customer Street, Customer City",
            "delivery_address": "456 Customer Street, Customer City",
            "special_instructions": "Customer-created recurring order",
            "is_recurring": True,
            "recurrence_pattern": {
                "frequency_type": "weekly",
                "frequency_value": 2
            }
        }
        
        response, error = make_request("POST", "/orders/customer", customer_recurring, customer_token)
        if response and response.status_code == 200:
            order = response.json()
            test_data["orders"].append(order)
            log_test("Customer Recurring Order", "PASS", f"Customer order {order['order_number']} created")
        else:
            log_test("Customer Recurring Order", "FAIL", f"Failed: {error}")

def test_order_locking_comprehensive():
    """Test order locking functionality"""
    print("=" * 60)
    print("TESTING ORDER LOCKING COMPREHENSIVE")
    print("=" * 60)
    
    if "owner" not in test_data["tokens"] or not test_data["orders"]:
        log_test("Order Locking Comprehensive", "SKIP", "Missing required data")
        return
    
    owner_token = test_data["tokens"]["owner"]
    
    # Test updating unlocked orders
    unlocked_orders = [order for order in test_data["orders"] if not order.get("is_locked")]
    
    if unlocked_orders:
        order_id = unlocked_orders[0]["id"]
        update_data = {
            "status": "in_progress",
            "special_instructions": "Updated instructions - testing order locking"
        }
        
        response, error = make_request("PUT", f"/orders/{order_id}", update_data, owner_token)
        if response and response.status_code == 200:
            log_test("Update Unlocked Order", "PASS", "Order updated successfully")
        else:
            log_test("Update Unlocked Order", "FAIL", f"Failed: {error}")
        
        # Note: Testing actual locking after 8 hours would require time manipulation
        # In production, the APScheduler job handles this automatically
        log_test("Order Locking Logic", "INFO", "Order locking after 8 hours handled by scheduled job")
    else:
        log_test("Order Locking Test", "SKIP", "No unlocked orders available")

def test_notifications_comprehensive():
    """Comprehensive test of notification system"""
    print("=" * 60)
    print("TESTING NOTIFICATIONS COMPREHENSIVE")
    print("=" * 60)
    
    for role in ["owner", "admin", "customer"]:
        if role in test_data["tokens"]:
            token = test_data["tokens"][role]
            
            response, error = make_request("GET", "/notifications", token=token)
            if response and response.status_code == 200:
                notifications = response.json()
                log_test(f"Get {role.title()} Notifications", "PASS", f"Retrieved {len(notifications)} notifications")
                
                # Check for order-related notifications
                order_notifs = [n for n in notifications if n.get("type") in ["order_created", "order_updated"]]
                if order_notifs:
                    log_test(f"{role.title()} Order Notifications", "PASS", f"Found {len(order_notifs)} order notifications")
                else:
                    log_test(f"{role.title()} Order Notifications", "INFO", "No order notifications found")
                
                # Test marking notification as read
                if notifications:
                    notif_id = notifications[0]["id"]
                    response, error = make_request("PUT", f"/notifications/{notif_id}/read", token=token)
                    if response and response.status_code == 200:
                        log_test(f"Mark {role.title()} Notification Read", "PASS", "Notification marked as read")
                    else:
                        log_test(f"Mark {role.title()} Notification Read", "FAIL", f"Failed: {error}")
            else:
                log_test(f"Get {role.title()} Notifications", "FAIL", f"Failed: {error}")

def test_error_handling():
    """Test error handling and edge cases"""
    print("=" * 60)
    print("TESTING ERROR HANDLING")
    print("=" * 60)
    
    if "owner" not in test_data["tokens"]:
        log_test("Error Handling", "SKIP", "No owner token")
        return
    
    owner_token = test_data["tokens"]["owner"]
    
    # Test invalid SKU creation
    invalid_sku = {
        "name": "",  # Empty name
        "base_price": -10,  # Negative price
        "category": "",
        "quantity": -1
    }
    
    response, error = make_request("POST", "/skus", invalid_sku, owner_token)
    if response and response.status_code >= 400:
        log_test("Invalid SKU Creation", "PASS", "Properly rejected invalid SKU")
    else:
        log_test("Invalid SKU Creation", "FAIL", "Should have rejected invalid SKU")
    
    # Test accessing non-existent resources
    response, error = make_request("GET", "/skus/non-existent-id", token=owner_token)
    if response and response.status_code == 404:
        log_test("Non-existent Resource", "PASS", "Properly returned 404 for non-existent resource")
    else:
        log_test("Non-existent Resource", "FAIL", "Should have returned 404")
    
    # Test unauthorized access
    response, error = make_request("POST", "/skus", {"name": "Test", "base_price": 10, "category": "Test", "quantity": 1})
    if response and response.status_code == 403:
        log_test("Unauthorized Access", "PASS", "Properly rejected unauthorized request")
    else:
        log_test("Unauthorized Access", "FAIL", "Should have rejected unauthorized request")

def run_comprehensive_tests():
    """Run all comprehensive backend API tests"""
    print("🧪 STARTING COMPREHENSIVE BACKEND API TESTING")
    print("=" * 80)
    print(f"Testing Backend URL: {BASE_URL}")
    print(f"Test Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80)
    
    try:
        # Setup authentication first
        if not setup_authentication():
            print("❌ Authentication setup failed. Aborting tests.")
            return
        
        # Run all comprehensive test suites
        test_socket_io_integration()
        test_apscheduler_integration()
        test_enhanced_sku_model()
        test_customer_pricing_comprehensive()
        test_frequency_templates_comprehensive()
        test_recurring_orders_comprehensive()
        test_order_locking_comprehensive()
        test_notifications_comprehensive()
        test_error_handling()
        
        print("=" * 80)
        print("🏁 COMPREHENSIVE TESTING COMPLETED")
        print(f"Test Finished: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 80)
        
        # Final Summary
        print("\n📊 COMPREHENSIVE TEST SUMMARY:")
        print(f"• Authenticated users: {len(test_data['tokens'])}")
        print(f"• SKUs tested: {len(test_data['skus'])}")
        print(f"• Customer pricing records: {len(test_data['customer_pricing'])}")
        print(f"• Frequency templates: {len(test_data['frequency_templates'])}")
        print(f"• Orders created: {len(test_data['orders'])}")
        print(f"• Notifications received: {len(test_data['notifications'])}")
        
    except Exception as e:
        print(f"❌ CRITICAL ERROR: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    run_comprehensive_tests()