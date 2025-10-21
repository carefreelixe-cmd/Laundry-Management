#!/bin/bash
# Deployment Script for Infinite Laundry Solutions
# Server IP: 157.173.218.172
# Run this script on your Ubuntu/Debian server

set -e  # Exit on any error

echo "🚀 Starting deployment for Infinite Laundry Solutions..."

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Variables
DOMAIN_FRONTEND="infinitelaundrysolutions.com.au"
DOMAIN_BACKEND="api.infinitelaundrysolutions.com.au"
APP_DIR="/var/www/infinitelaundrysolutions"
ADMIN_EMAIL="care.freelixe@gmail.com"

echo -e "${YELLOW}📋 Step 1: Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

echo -e "${YELLOW}📦 Step 2: Installing required packages...${NC}"
sudo apt install -y nginx certbot python3-certbot-nginx python3-pip python3-venv nodejs npm git curl

# Install Node.js 20.x (LTS)
if ! command -v node &> /dev/null || [ $(node -v | cut -d'.' -f1 | cut -d'v' -f2) -lt 18 ]; then
    echo -e "${YELLOW}📦 Installing Node.js 20.x LTS...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

echo -e "${GREEN}✅ Node version: $(node -v)${NC}"
echo -e "${GREEN}✅ NPM version: $(npm -v)${NC}"
echo -e "${GREEN}✅ Python version: $(python3 --version)${NC}"

echo -e "${YELLOW}📁 Step 3: Creating application directory...${NC}"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

echo -e "${YELLOW}📂 Step 4: Cloning repository...${NC}"
if [ -d "$APP_DIR/.git" ]; then
    echo "Repository already exists, pulling latest changes..."
    cd $APP_DIR
    git pull origin main
else
    git clone https://github.com/carefreelixe-cmd/Laundry-Management.git $APP_DIR
    cd $APP_DIR
fi

echo -e "${YELLOW}🔧 Step 5: Setting up Backend...${NC}"
cd $APP_DIR/backend

# Create Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Create .env file for backend
cat > .env << 'EOF'
MONGO_URL="mongodb+srv://carefreelixe_db_user:uIB1QSWaXgjSENrj@infinitelaundrysolution.0q0ltc.mongodb.net/?retryWrites=true&w=majority&appName=infinitelaundrysolutions"
DB_NAME="clienty_database"
SECRET_KEY="nhuceoi%E$576toucwriohomade)by_freelixe"
CORS_ORIGINS="https://infinitelaundrysolutions.com.au,https://www.infinitelaundrysolutions.com.au"
GMAIL_USER="care.freelixe@gmail.com"
GMAIL_PASSWORD="axrj ioxh nyfr eupb"
ADMIN_EMAIL="admin@clienty.com"
GOOGLE_MAPS_API_KEY="AIzaSyB7ViwFyJXaE4P0iNZPiVI54NXh_gTTmyY"
FIREBASE_SERVICE_ACCOUNT="backend/laundry-196f0-firebase-adminsdk-fbsvc-a395b03897.json"
EOF

echo -e "${GREEN}✅ Backend .env file created${NC}"

echo -e "${YELLOW}⚛️ Step 6: Setting up Frontend...${NC}"
cd $APP_DIR/frontend

# Create .env file for frontend
cat > .env << 'EOF'
REACT_APP_API_URL=https://api.infinitelaundrysolutions.com.au
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyB7ViwFyJXaE4P0iNZPiVI54NXh_gTTmyY
EOF

echo -e "${GREEN}✅ Frontend .env file created${NC}"

# Install frontend dependencies
npm install

# Build React app for production
echo -e "${YELLOW}🏗️ Building React production bundle...${NC}"
npm run build

echo -e "${GREEN}✅ Frontend build completed${NC}"

echo -e "${YELLOW}🌐 Step 7: Configuring Nginx...${NC}"
# Copy nginx configuration
sudo cp $APP_DIR/nginx.conf /etc/nginx/sites-available/infinitelaundrysolutions

# Create symbolic link
sudo ln -sf /etc/nginx/sites-available/infinitelaundrysolutions /etc/nginx/sites-enabled/

# Remove default nginx site
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

echo -e "${YELLOW}🔒 Step 8: Obtaining SSL Certificates...${NC}"
# Create directory for certbot challenges
sudo mkdir -p /var/www/certbot

# Stop nginx temporarily for certificate generation
sudo systemctl stop nginx

# Obtain SSL certificates
sudo certbot certonly --standalone \
    -d $DOMAIN_FRONTEND \
    -d www.$DOMAIN_FRONTEND \
    -d $DOMAIN_BACKEND \
    --non-interactive \
    --agree-tos \
    --email $ADMIN_EMAIL

echo -e "${GREEN}✅ SSL Certificates obtained${NC}"

echo -e "${YELLOW}⚙️ Step 9: Creating Systemd Services...${NC}"

# Backend service
sudo tee /etc/systemd/system/laundry-backend.service > /dev/null << EOF
[Unit]
Description=Infinite Laundry Solutions Backend API
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$APP_DIR/backend
Environment="PATH=$APP_DIR/backend/venv/bin"
ExecStart=$APP_DIR/backend/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8000 --workers 4
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

echo -e "${GREEN}✅ Backend systemd service created${NC}"

# Reload systemd
sudo systemctl daemon-reload

# Enable and start services
echo -e "${YELLOW}🚀 Step 10: Starting Services...${NC}"
sudo systemctl enable laundry-backend
sudo systemctl start laundry-backend
sudo systemctl enable nginx
sudo systemctl start nginx

# Setup auto-renewal for SSL certificates
echo -e "${YELLOW}🔄 Step 11: Setting up SSL auto-renewal...${NC}"
(sudo crontab -l 2>/dev/null; echo "0 0,12 * * * certbot renew --quiet --deploy-hook 'systemctl reload nginx'") | sudo crontab -

echo -e "${GREEN}✅ SSL auto-renewal configured${NC}"

# Configure firewall
echo -e "${YELLOW}🔥 Step 12: Configuring Firewall...${NC}"
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

echo -e "${GREEN}✅ Firewall configured${NC}"

# Check service status
echo -e "${YELLOW}📊 Service Status:${NC}"
echo -e "${GREEN}Backend API:${NC}"
sudo systemctl status laundry-backend --no-pager | head -n 10

echo -e "${GREEN}Nginx:${NC}"
sudo systemctl status nginx --no-pager | head -n 10

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}📍 Your application is now accessible at:${NC}"
echo -e "   Frontend: ${GREEN}https://$DOMAIN_FRONTEND${NC}"
echo -e "   Backend API: ${GREEN}https://$DOMAIN_BACKEND${NC}"
echo -e "   API Docs: ${GREEN}https://$DOMAIN_BACKEND/docs${NC}"
echo ""
echo -e "${YELLOW}🔧 Useful Commands:${NC}"
echo -e "   View backend logs: ${GREEN}sudo journalctl -u laundry-backend -f${NC}"
echo -e "   Restart backend: ${GREEN}sudo systemctl restart laundry-backend${NC}"
echo -e "   Restart nginx: ${GREEN}sudo systemctl restart nginx${NC}"
echo -e "   Check nginx config: ${GREEN}sudo nginx -t${NC}"
echo -e "   Renew SSL: ${GREEN}sudo certbot renew${NC}"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo "   1. Update DNS A records to point to 157.173.218.172"
echo "   2. Test your application: https://$DOMAIN_FRONTEND"
echo "   3. Monitor logs for any issues"
echo ""
