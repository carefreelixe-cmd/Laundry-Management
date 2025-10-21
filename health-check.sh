#!/bin/bash
# Production Environment Checker
# Run this script to verify your deployment is working correctly

echo "🔍 Infinite Laundry Solutions - Production Health Check"
echo "======================================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

DOMAIN_FRONTEND="infinitelaundrysolutions.com.au"
DOMAIN_BACKEND="api.infinitelaundrysolutions.com.au"
ERRORS=0

# Function to check service
check_service() {
    if systemctl is-active --quiet $1; then
        echo -e "${GREEN}✅ $1 is running${NC}"
    else
        echo -e "${RED}❌ $1 is NOT running${NC}"
        ERRORS=$((ERRORS+1))
    fi
}

# Function to check port
check_port() {
    if sudo lsof -i :$1 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Port $1 is open${NC}"
    else
        echo -e "${RED}❌ Port $1 is NOT open${NC}"
        ERRORS=$((ERRORS+1))
    fi
}

# Function to check URL
check_url() {
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" $1 2>/dev/null)
    if [ "$STATUS" -eq 200 ] || [ "$STATUS" -eq 301 ] || [ "$STATUS" -eq 302 ]; then
        echo -e "${GREEN}✅ $1 - HTTP $STATUS${NC}"
    else
        echo -e "${RED}❌ $1 - HTTP $STATUS (Expected 200/301/302)${NC}"
        ERRORS=$((ERRORS+1))
    fi
}

# Function to check SSL
check_ssl() {
    if echo | openssl s_client -connect $1:443 -servername $1 2>/dev/null | grep -q "Verify return code: 0"; then
        EXPIRY=$(echo | openssl s_client -connect $1:443 -servername $1 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2)
        echo -e "${GREEN}✅ SSL certificate valid for $1${NC}"
        echo -e "   Expires: $EXPIRY"
    else
        echo -e "${RED}❌ SSL certificate issue for $1${NC}"
        ERRORS=$((ERRORS+1))
    fi
}

echo "📦 System Services"
echo "-------------------"
check_service "laundry-backend"
check_service "nginx"
echo ""

echo "🔌 Port Availability"
echo "-------------------"
check_port 8000  # Backend
check_port 80    # HTTP
check_port 443   # HTTPS
echo ""

echo "🌐 HTTP/HTTPS Connectivity"
echo "-------------------"
check_url "https://$DOMAIN_FRONTEND"
check_url "https://www.$DOMAIN_FRONTEND"
check_url "https://$DOMAIN_BACKEND"
check_url "https://$DOMAIN_BACKEND/docs"
check_url "https://$DOMAIN_BACKEND/health"
echo ""

echo "🔒 SSL Certificates"
echo "-------------------"
check_ssl "$DOMAIN_FRONTEND"
check_ssl "$DOMAIN_BACKEND"
echo ""

echo "📊 Resource Usage"
echo "-------------------"
echo "💾 Disk Usage:"
df -h / | tail -n 1 | awk '{print "   Used: "$3" / "$2" ("$5")"}'
echo ""
echo "🧠 Memory Usage:"
free -h | grep Mem | awk '{print "   Used: "$3" / "$2}'
echo ""
echo "💻 CPU Load:"
uptime | awk '{print "   "$8" "$9" "$10" "$11" "$12}'
echo ""

echo "📝 Recent Logs (Last 5 lines)"
echo "-------------------"
echo "Backend:"
sudo journalctl -u laundry-backend -n 5 --no-pager
echo ""

echo "🔥 Firewall Status"
echo "-------------------"
sudo ufw status | grep -E "Status:|80|443|22"
echo ""

echo "======================================================"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Your application is healthy.${NC}"
else
    echo -e "${RED}⚠️  Found $ERRORS issue(s). Please review the errors above.${NC}"
fi
echo "======================================================"
