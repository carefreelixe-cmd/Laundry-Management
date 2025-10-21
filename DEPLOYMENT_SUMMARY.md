# 📦 Deployment Files Created

## ✅ What I've Created For You

I've created all the necessary files for deploying your Infinite Laundry Solutions application to production with full SSL support. Here's what you have:

### 1. **nginx.conf** 
- Complete Nginx configuration for both frontend and backend
- SSL/HTTPS support for all domains
- WebSocket support for Socket.IO
- HTTP to HTTPS redirect
- Security headers
- Gzip compression
- Static file caching

### 2. **deploy.sh** (Automated Deployment Script)
- One-command deployment
- Installs all dependencies automatically
- Sets up backend with Python virtual environment
- Builds frontend React app
- Configures Nginx
- Obtains SSL certificates via Let's Encrypt
- Creates systemd services
- Configures firewall
- Sets up SSL auto-renewal

### 3. **DEPLOYMENT_GUIDE.md** (Complete Documentation)
- Step-by-step manual deployment instructions
- Verification steps
- Monitoring and logging commands
- Update procedures
- Troubleshooting guide
- Security checklist

### 4. **QUICK_START.md** (Quick Reference)
- One-command deployment
- Essential commands
- Quick diagnostics
- Emergency procedures
- Important file locations

### 5. **health-check.sh** (Production Health Checker)
- Automated health check script
- Checks services status
- Tests URLs and SSL certificates
- Shows resource usage
- Displays recent logs

---

## 🚀 Your Deployment Configuration

### Domains
- **Frontend:** infinitelaundrysolutions.com.au, www.infinitelaundrysolutions.com.au
- **Backend:** api.infinitelaundrysolutions.com.au

### Server
- **IP:** 157.173.218.172
- **Backend Port:** 8000 (internal)
- **Frontend Port:** 3000 (internal, or static build)
- **Public Ports:** 80 (HTTP redirect), 443 (HTTPS)

### SSL/TLS
- Automatic SSL certificates via Let's Encrypt
- Auto-renewal configured (twice daily check)
- TLS 1.2 and 1.3 support
- A+ SSL rating configuration

### Architecture
```
Internet (HTTPS)
    ↓
Nginx (Port 443)
    ├─→ Frontend: infinitelaundrysolutions.com.au → React Build
    └─→ Backend: api.infinitelaundrysolutions.com.au → FastAPI (Port 8000)
```

---

## 📋 Before You Deploy - CHECKLIST

### ☑️ DNS Configuration (DO THIS FIRST!)
You MUST configure these DNS records before deployment:

| Type | Hostname | Value | TTL |
|------|----------|-------|-----|
| A | @ | 157.173.218.172 | 3600 |
| A | www | 157.173.218.172 | 3600 |
| A | api | 157.173.218.172 | 3600 |

**Verify DNS propagation:**
```bash
nslookup infinitelaundrysolutions.com.au
nslookup www.infinitelaundrysolutions.com.au
nslookup api.infinitelaundrysolutions.com.au
```

All should return: `157.173.218.172`

### ☑️ Updated Environment Files

**Backend (.env):**
```env
CORS_ORIGINS="http://localhost:3000,https://infinitelaundrysolutions.com.au,https://www.infinitelaundrysolutions.com.au"
```
✅ Already updated for you!

**Frontend (.env):**
```env
REACT_APP_API_URL=https://api.infinitelaundrysolutions.com.au
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyB7ViwFyJXaE4P0iNZPiVI54NXh_gTTmyY
```
✅ Already updated for you!

---

## 🎯 DEPLOYMENT STEPS (Choose One Method)

### Method 1: AUTOMATED (Recommended - 5 minutes)

**From your local Windows machine:**

```powershell
# 1. Upload deployment files
scp deploy.sh nginx.conf root@157.173.218.172:/root/
scp health-check.sh root@157.173.218.172:/root/

# 2. SSH into server
ssh root@157.173.218.172

# 3. Run deployment (this does EVERYTHING)
chmod +x /root/deploy.sh /root/health-check.sh
sudo /root/deploy.sh
```

**That's it!** The script will:
- Install all dependencies
- Clone your repository
- Setup backend and frontend
- Configure Nginx
- Get SSL certificates
- Start all services

After deployment completes, run:
```bash
sudo /root/health-check.sh
```

### Method 2: MANUAL (For advanced users)

Follow the complete step-by-step guide in `DEPLOYMENT_GUIDE.md`

---

## ✅ After Deployment

### 1. Verify Everything Works

**Test these URLs in your browser:**
- ✅ https://infinitelaundrysolutions.com.au (Frontend)
- ✅ https://www.infinitelaundrysolutions.com.au (Frontend with www)
- ✅ https://api.infinitelaundrysolutions.com.au/docs (API Documentation)
- ✅ https://api.infinitelaundrysolutions.com.au/health (Health Check)

### 2. Run Health Check
```bash
ssh root@157.173.218.172
sudo /root/health-check.sh
```

### 3. Monitor Logs
```bash
# Backend logs
sudo journalctl -u laundry-backend -f

# Nginx access logs
sudo tail -f /var/log/nginx/api_access.log
sudo tail -f /var/log/nginx/frontend_access.log
```

---

## 🔧 Common Post-Deployment Tasks

### Update Your Application
```bash
ssh root@157.173.218.172
cd /var/www/infinitelaundrysolutions
git pull origin main

# For backend updates
sudo systemctl restart laundry-backend

# For frontend updates
cd frontend
npm run build
sudo systemctl reload nginx
```

### View Service Status
```bash
sudo systemctl status laundry-backend
sudo systemctl status nginx
```

### Restart Services
```bash
sudo systemctl restart laundry-backend
sudo systemctl restart nginx
```

---

## 🚨 Troubleshooting

### Backend Not Starting?
```bash
# Check logs
sudo journalctl -u laundry-backend -n 100

# Check if MongoDB is accessible
cd /var/www/infinitelaundrysolutions/backend
source venv/bin/activate
python -c "from motor.motor_asyncio import AsyncIOMotorClient; print('MongoDB OK')"
```

### Frontend Not Loading?
```bash
# Check if build exists
ls -la /var/www/infinitelaundrysolutions/frontend/build/

# Check nginx config
sudo nginx -t

# Check nginx logs
sudo tail -f /var/log/nginx/error.log
```

### SSL Certificate Issues?
```bash
# Check certificates
sudo certbot certificates

# Test renewal
sudo certbot renew --dry-run

# Force renew (if needed)
sudo certbot renew --force-renewal
```

### CORS Errors?
Make sure backend `.env` has production domains in CORS_ORIGINS, then:
```bash
sudo systemctl restart laundry-backend
```

---

## 📊 Monitoring Your Application

### Real-time Monitoring
```bash
# Watch backend logs
sudo journalctl -u laundry-backend -f

# Watch Nginx access logs
sudo tail -f /var/log/nginx/api_access.log

# Monitor system resources
htop
```

### Check Scheduled Jobs
Your application has scheduled jobs (order locking, recurring orders). Verify they're running:
```bash
# Check backend logs for job execution
sudo journalctl -u laundry-backend | grep "lock_orders_job\|generate_recurring_orders_job"
```

---

## 🔐 Security Notes

Your deployment includes:
- ✅ SSL/TLS encryption (HTTPS)
- ✅ Firewall configured (only ports 22, 80, 443 open)
- ✅ Security headers (HSTS, X-Frame-Options, etc.)
- ✅ Automatic SSL renewal
- ✅ Services running as non-root user
- ✅ Environment variables secured
- ✅ MongoDB credentials protected
- ✅ Gmail app password (not real password)

**Additional Security Recommendations:**
1. Setup fail2ban for SSH protection
2. Change SSH port from 22 to custom port
3. Setup monitoring (Uptime Robot, Pingdom)
4. Regular backups of MongoDB data
5. Review logs regularly

---

## 📞 Quick Commands Reference

```bash
# Service Management
sudo systemctl status laundry-backend    # Check backend status
sudo systemctl restart laundry-backend   # Restart backend
sudo systemctl status nginx              # Check nginx status
sudo systemctl restart nginx             # Restart nginx

# Logs
sudo journalctl -u laundry-backend -f   # Backend logs (real-time)
sudo tail -f /var/log/nginx/error.log   # Nginx error logs

# Updates
cd /var/www/infinitelaundrysolutions && git pull  # Pull latest code
sudo systemctl restart laundry-backend            # Apply backend changes
cd frontend && npm run build && sudo systemctl reload nginx  # Apply frontend changes

# SSL
sudo certbot certificates     # Check SSL status
sudo certbot renew           # Renew certificates

# Health Check
sudo /root/health-check.sh   # Run full health check
```

---

## 🎉 You're Ready!

Everything is set up and ready to deploy! Just follow the automated deployment method above.

**Files you have:**
- ✅ nginx.conf (Production Nginx configuration)
- ✅ deploy.sh (Automated deployment script)
- ✅ health-check.sh (Health monitoring script)
- ✅ DEPLOYMENT_GUIDE.md (Complete manual)
- ✅ QUICK_START.md (Quick reference)
- ✅ Updated .env files for production

**Next steps:**
1. Configure DNS (point domains to 157.173.218.172)
2. Wait for DNS propagation (use nslookup to check)
3. Upload files to server
4. Run deploy.sh
5. Run health-check.sh
6. Test your application!

Good luck with your deployment! 🚀
