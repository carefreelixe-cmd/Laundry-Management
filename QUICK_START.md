# 🚀 Quick Deployment Cheat Sheet

## 📍 Your Server Details
```
IP: 157.173.218.172
Frontend: https://infinitelaundrysolutions.com.au
Backend: https://api.infinitelaundrysolutions.com.au
```

## 🔥 ONE-COMMAND DEPLOYMENT

### From Your Local Machine:
```bash
# 1. Upload files to server
scp deploy.sh nginx.conf root@157.173.218.172:/root/

# 2. SSH into server
ssh root@157.173.218.172

# 3. Run deployment (this does EVERYTHING automatically)
chmod +x /root/deploy.sh && sudo /root/deploy.sh
```

That's it! ✅ The script installs everything and starts your app.

---

## 🛠️ Essential Commands

### Check If Everything Is Running
```bash
sudo systemctl status laundry-backend
sudo systemctl status nginx
```

### View Logs (Real-time)
```bash
sudo journalctl -u laundry-backend -f
```

### Restart Services
```bash
sudo systemctl restart laundry-backend
sudo systemctl restart nginx
```

### Update Your App
```bash
cd /var/www/infinitelaundrysolutions
git pull origin main

# For backend changes:
sudo systemctl restart laundry-backend

# For frontend changes:
cd frontend
npm run build
sudo systemctl reload nginx
```

---

## 🔍 Quick Diagnostics

### Backend Not Working?
```bash
# Check logs
sudo journalctl -u laundry-backend -n 50

# Test manually
cd /var/www/infinitelaundrysolutions/backend
source venv/bin/activate
python server.py
```

### Frontend Not Loading?
```bash
# Check nginx logs
sudo tail -f /var/log/nginx/error.log

# Test nginx config
sudo nginx -t
```

### SSL Issues?
```bash
# Check certificates
sudo certbot certificates

# Renew manually
sudo certbot renew
```

---

## 📂 Important File Locations

```
Application: /var/www/infinitelaundrysolutions/
Backend Service: /etc/systemd/system/laundry-backend.service
Nginx Config: /etc/nginx/sites-available/infinitelaundrysolutions
SSL Certs: /etc/letsencrypt/live/
Backend Logs: sudo journalctl -u laundry-backend
Nginx Logs: /var/log/nginx/
```

---

## 🚨 Emergency Stop/Start

```bash
# STOP everything
sudo systemctl stop laundry-backend nginx

# START everything
sudo systemctl start laundry-backend nginx

# CHECK status
sudo systemctl status laundry-backend nginx
```

---

## ✅ Verify Deployment Success

After deployment, test these URLs:

1. ✅ Frontend: https://infinitelaundrysolutions.com.au
2. ✅ API Health: https://api.infinitelaundrysolutions.com.au/health
3. ✅ API Docs: https://api.infinitelaundrysolutions.com.au/docs

If all three work → You're LIVE! 🎉

---

## 🔐 Before You Deploy

Make sure DNS is configured:

| Record | Hostname | Value |
|--------|----------|-------|
| A | @ | 157.173.218.172 |
| A | www | 157.173.218.172 |
| A | api | 157.173.218.172 |

Check propagation:
```bash
nslookup infinitelaundrysolutions.com.au
```

---

## 📞 Need Help?

1. Check logs first: `sudo journalctl -u laundry-backend -f`
2. Test nginx: `sudo nginx -t`
3. Verify SSL: `sudo certbot certificates`
4. Check firewall: `sudo ufw status`

---

**That's it! You're ready to deploy! 🚀**
