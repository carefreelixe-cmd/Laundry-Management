# 🚀 Production Deployment Guide
## Infinite Laundry Solutions

**Server IP:** `157.173.218.172`  
**Frontend Domain:** `infinitelaundrysolutions.com.au`  
**Backend Domain:** `api.infinitelaundrysolutions.com.au`

---

## 📋 Prerequisites

### 1. DNS Configuration
Before deployment, configure your DNS records:

| Type | Hostname | Value | TTL |
|------|----------|-------|-----|
| A | @ | 157.173.218.172 | 3600 |
| A | www | 157.173.218.172 | 3600 |
| A | api | 157.173.218.172 | 3600 |

**Verify DNS propagation:**
```bash
nslookup infinitelaundrysolutions.com.au
nslookup api.infinitelaundrysolutions.com.au
```

### 2. Server Access
Ensure you have SSH access to your server:
```bash
ssh root@157.173.218.172
# or
ssh your-username@157.173.218.172
```

---

## 🛠️ Quick Deployment (Automated)

### Option 1: One-Command Deployment

1. **Copy deployment script to your server:**
```bash
scp deploy.sh root@157.173.218.172:/root/
scp nginx.conf root@157.173.218.172:/root/
```

2. **SSH into your server:**
```bash
ssh root@157.173.218.172
```

3. **Run the deployment script:**
```bash
chmod +x /root/deploy.sh
sudo /root/deploy.sh
```

The script will automatically:
- ✅ Install all dependencies (Node.js, Python, Nginx, Certbot)
- ✅ Clone your repository
- ✅ Setup backend with Python virtual environment
- ✅ Build frontend React app
- ✅ Configure Nginx
- ✅ Obtain SSL certificates
- ✅ Create systemd services
- ✅ Start all services
- ✅ Configure firewall

---

## 🔧 Manual Deployment (Step-by-Step)

### Step 1: Connect to Server
```bash
ssh root@157.173.218.172
```

### Step 2: Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### Step 3: Install Dependencies

#### Install Node.js 20.x (LTS)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v  # Should show v20.x.x
npm -v   # Should show 10.x.x
```

#### Install Python & Nginx
```bash
sudo apt install -y python3 python3-pip python3-venv nginx certbot python3-certbot-nginx git
```

### Step 4: Clone Repository
```bash
sudo mkdir -p /var/www/infinitelaundrysolutions
sudo chown -R $USER:$USER /var/www/infinitelaundrysolutions
cd /var/www/infinitelaundrysolutions
git clone https://github.com/carefreelixe-cmd/Laundry-Management.git .
```

### Step 5: Setup Backend

```bash
cd /var/www/infinitelaundrysolutions/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

#### Create Backend .env
```bash
nano .env
```

Paste this content:
```env
MONGO_URL="mongodb+srv://carefreelixe_db_user:uIB1QSWaXgjSENrj@infinitelaundrysolution.0q0ltc.mongodb.net/?retryWrites=true&w=majority&appName=infinitelaundrysolutions"
DB_NAME="clienty_database"
SECRET_KEY="nhuceoi%E$576toucwriohomade)by_freelixe"
CORS_ORIGINS="https://infinitelaundrysolutions.com.au,https://www.infinitelaundrysolutions.com.au"
GMAIL_USER="care.freelixe@gmail.com"
GMAIL_PASSWORD="axrj ioxh nyfr eupb"
ADMIN_EMAIL="admin@clienty.com"
GOOGLE_MAPS_API_KEY="AIzaSyB7ViwFyJXaE4P0iNZPiVI54NXh_gTTmyY"
FIREBASE_SERVICE_ACCOUNT="backend/laundry-196f0-firebase-adminsdk-fbsvc-a395b03897.json"
```

Save: `Ctrl + X`, then `Y`, then `Enter`

### Step 6: Setup Frontend

```bash
cd /var/www/infinitelaundrysolutions/frontend

# Create Frontend .env
nano .env
```

Paste this content:
```env
REACT_APP_API_URL=https://api.infinitelaundrysolutions.com.au
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyB7ViwFyJXaE4P0iNZPiVI54NXh_gTTmyY
```

Save and install dependencies:
```bash
npm install
npm run build
```

### Step 7: Configure Nginx

```bash
# Copy nginx config from your local machine or create it
sudo nano /etc/nginx/sites-available/infinitelaundrysolutions
```

Paste the content from `nginx.conf` file, then:

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/infinitelaundrysolutions /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t
```

### Step 8: Obtain SSL Certificates

```bash
# Create certbot directory
sudo mkdir -p /var/www/certbot

# Stop nginx temporarily
sudo systemctl stop nginx

# Get certificates
sudo certbot certonly --standalone \
    -d infinitelaundrysolutions.com.au \
    -d www.infinitelaundrysolutions.com.au \
    -d api.infinitelaundrysolutions.com.au \
    --non-interactive \
    --agree-tos \
    --email care.freelixe@gmail.com
```

### Step 9: Create Backend Systemd Service

```bash
sudo nano /etc/systemd/system/laundry-backend.service
```

Paste:
```ini
[Unit]
Description=Infinite Laundry Solutions Backend API
After=network.target

[Service]
Type=simple
User=YOUR_USERNAME
WorkingDirectory=/var/www/infinitelaundrysolutions/backend
Environment="PATH=/var/www/infinitelaundrysolutions/backend/venv/bin"
ExecStart=/var/www/infinitelaundrysolutions/backend/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8000 --workers 4
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Replace `YOUR_USERNAME` with your actual username!**

### Step 10: Start Services

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable and start backend
sudo systemctl enable laundry-backend
sudo systemctl start laundry-backend

# Enable and start nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### Step 11: Configure Firewall

```bash
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### Step 12: Setup SSL Auto-Renewal

```bash
sudo crontab -e
```

Add this line:
```bash
0 0,12 * * * certbot renew --quiet --deploy-hook 'systemctl reload nginx'
```

---

## ✅ Verification

### 1. Check Services Status
```bash
# Backend status
sudo systemctl status laundry-backend

# Nginx status
sudo systemctl status nginx
```

### 2. Test Backend API
```bash
curl https://api.infinitelaundrysolutions.com.au/health
curl https://api.infinitelaundrysolutions.com.au/docs
```

### 3. Test Frontend
Open browser and visit:
- `https://infinitelaundrysolutions.com.au`
- `https://www.infinitelaundrysolutions.com.au`

---

## 📊 Monitoring & Logs

### View Backend Logs
```bash
# Real-time logs
sudo journalctl -u laundry-backend -f

# Last 100 lines
sudo journalctl -u laundry-backend -n 100

# Today's logs
sudo journalctl -u laundry-backend --since today
```

### View Nginx Logs
```bash
# Access logs
sudo tail -f /var/log/nginx/frontend_access.log
sudo tail -f /var/log/nginx/api_access.log

# Error logs
sudo tail -f /var/log/nginx/frontend_error.log
sudo tail -f /var/log/nginx/api_error.log
```

### Check SSL Certificate Expiry
```bash
sudo certbot certificates
```

---

## 🔄 Updating Application

### Update Backend Code
```bash
cd /var/www/infinitelaundrysolutions
git pull origin main

# Restart backend
sudo systemctl restart laundry-backend
```

### Update Frontend Code
```bash
cd /var/www/infinitelaundrysolutions
git pull origin main

cd frontend
npm install
npm run build

# Reload nginx
sudo systemctl reload nginx
```

---

## 🛠️ Useful Commands

| Action | Command |
|--------|---------|
| Restart Backend | `sudo systemctl restart laundry-backend` |
| Restart Nginx | `sudo systemctl restart nginx` |
| Reload Nginx (no downtime) | `sudo systemctl reload nginx` |
| Check Nginx Config | `sudo nginx -t` |
| View Backend Logs | `sudo journalctl -u laundry-backend -f` |
| Renew SSL Manually | `sudo certbot renew` |
| Check Service Status | `sudo systemctl status laundry-backend` |

---

## 🚨 Troubleshooting

### Backend Not Starting
```bash
# Check logs
sudo journalctl -u laundry-backend -n 50

# Check if port 8000 is in use
sudo lsof -i :8000

# Test backend manually
cd /var/www/infinitelaundrysolutions/backend
source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8000
```

### Nginx Not Starting
```bash
# Test configuration
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/error.log

# Check if ports are in use
sudo lsof -i :80
sudo lsof -i :443
```

### SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew manually
sudo certbot renew --force-renewal

# Test renewal
sudo certbot renew --dry-run
```

### CORS Errors
Make sure your backend `.env` has:
```env
CORS_ORIGINS="https://infinitelaundrysolutions.com.au,https://www.infinitelaundrysolutions.com.au"
```

Then restart:
```bash
sudo systemctl restart laundry-backend
```

---

## 🔐 Security Checklist

- ✅ SSL/TLS certificates installed
- ✅ Firewall configured (only ports 22, 80, 443 open)
- ✅ Services running as non-root user
- ✅ Environment variables secured
- ✅ MongoDB credentials protected
- ✅ Gmail app password used (not real password)
- ✅ Security headers configured in Nginx
- ✅ Auto SSL renewal setup

---

## 📞 Support

If you encounter issues:

1. Check service logs first
2. Verify DNS propagation
3. Test SSL certificates
4. Check firewall rules
5. Verify environment variables

**Emergency Stop:**
```bash
sudo systemctl stop laundry-backend
sudo systemctl stop nginx
```

**Emergency Start:**
```bash
sudo systemctl start laundry-backend
sudo systemctl start nginx
```

---

## 🎉 Success!

Your application should now be live at:
- 🌐 **Frontend:** https://infinitelaundrysolutions.com.au
- 🔌 **Backend API:** https://api.infinitelaundrysolutions.com.au
- 📚 **API Docs:** https://api.infinitelaundrysolutions.com.au/docs

Enjoy your deployed application! 🚀
