# Contact Form Email Fix - Deployment Guide

## Problem
Contact form submissions were not sending emails to:
1. Admin email (info@infinitelaundrysolutions.com.au)
2. Customer's email (confirmation copy)

## Changes Made

### 1. Backend - `server.py`
- Added error handling and logging to contact form endpoint
- Added email status tracking
- Returns detailed response with email send status

### 2. Backend - `utils/email_service.py`
- Fixed `send_email()` to return `False` when credentials are missing (was returning `True`)
- Added detailed logging for debugging
- Shows GMAIL_USER and password status in logs

### 3. Test Script - `test_email.py`
- Created script to test email configuration
- Tests both admin and customer emails
- Verifies environment variables

## Deployment Steps (On Your Server)

### Step 1: SSH into Server
```bash
ssh root@157.173.218.172
# or
ssh root@srv1074842
```

### Step 2: Navigate to Project
```bash
cd /var/www/infinitelaundrysolutions/backend
```

### Step 3: Backup Current Code
```bash
cp server.py server.py.backup
cp utils/email_service.py utils/email_service.py.backup
```

### Step 4: Pull Latest Changes
```bash
cd /var/www/infinitelaundrysolutions
git pull origin main
```

### Step 5: Verify Environment Variables
```bash
cd /var/www/infinitelaundrysolutions/backend
cat .env | grep -E "GMAIL_USER|GMAIL_PASSWORD|ADMIN_EMAIL"
```

**Expected output:**
```
GMAIL_USER="info@infinitelaundrysolutions.com.au"
GMAIL_PASSWORD="wthncsvycbnybrdk"
ADMIN_EMAIL="info@infinitelaundrysolutions.com.au"
```

### Step 6: Test Email Configuration
```bash
cd /var/www/infinitelaundrysolutions/backend
python3 test_email.py
```

This will:
- Check if environment variables are set
- Send test email to admin
- Send test email to customer (bharat7954@gmail.com)
- Show success/failure status

### Step 7: Restart Backend Server

**Option A: If using systemd**
```bash
sudo systemctl restart laundry-backend
sudo systemctl status laundry-backend
```

**Option B: If using PM2**
```bash
pm2 restart laundry-backend
pm2 logs laundry-backend --lines 50
```

**Option C: If running manually**
```bash
# Kill existing process
sudo pkill -f server.py
# or
sudo kill $(sudo lsof -t -i:8000)

# Start server
cd /var/www/infinitelaundrysolutions/backend
nohup python3 server.py > server.log 2>&1 &

# Check logs
tail -f server.log
```

### Step 8: Test Contact Form

1. Go to: https://infinitelaundrysolutions.com.au (or new landing page)
2. Fill out contact form with:
   - Name: Test User
   - Email: bharat7954@gmail.com
   - Phone: +61 400 000 000
   - Message: Testing contact form emails
3. Submit form
4. Check logs for email sending status

**Check backend logs:**
```bash
# If using PM2
pm2 logs laundry-backend

# If using nohup
tail -f /var/www/infinitelaundrysolutions/backend/server.log

# If using systemd
sudo journalctl -u laundry-backend -f
```

**Look for these log messages:**
```
Sending admin notification to: info@infinitelaundrysolutions.com.au
Admin email sent: True
Sending customer confirmation to: bharat7954@gmail.com
Customer email sent: True
```

### Step 9: Verify Emails Received

1. **Check admin inbox:** info@infinitelaundrysolutions.com.au
   - Should receive "New Contact Form Submission from Test User"

2. **Check customer inbox:** bharat7954@gmail.com
   - Should receive "Thank You for Contacting Infinite Laundry Solutions"

## Troubleshooting

### If emails are not sending:

1. **Check Gmail credentials:**
   ```bash
   cd /var/www/infinitelaundrysolutions/backend
   python3 -c "import os; from dotenv import load_dotenv; load_dotenv(); print(f'GMAIL_USER: {os.environ.get(\"GMAIL_USER\")}'); print(f'Password exists: {bool(os.environ.get(\"GMAIL_PASSWORD\"))}')"
   ```

2. **Check if Gmail App Password is valid:**
   - Login to Google Account
   - Go to Security → 2-Step Verification → App Passwords
   - Verify password `wthncsvycbnybrdk` is still active
   - If expired, generate new one and update `.env`

3. **Check firewall/port 587:**
   ```bash
   telnet smtp.gmail.com 587
   ```
   Should connect successfully. Press Ctrl+] then `quit` to exit.

4. **Check backend logs for errors:**
   ```bash
   # Look for any error messages
   grep -i "error\|failed" /var/www/infinitelaundrysolutions/backend/server.log
   ```

5. **Test SMTP connection manually:**
   ```bash
   python3 -c "import smtplib; server = smtplib.SMTP('smtp.gmail.com', 587); server.starttls(); print('SMTP connection successful')"
   ```

### If only admin email works but customer email fails:
- Check spam folder in customer's inbox
- Verify customer email address is valid
- Check backend logs for specific error

### If only customer email works but admin email fails:
- Verify ADMIN_EMAIL in .env is correct
- Check if admin inbox is full
- Verify admin email is not blocking incoming messages

## Testing Checklist

- [ ] Environment variables are set correctly
- [ ] test_email.py runs successfully
- [ ] Backend server restarted
- [ ] Contact form submission works
- [ ] Admin receives notification email
- [ ] Customer receives confirmation email
- [ ] Both emails have correct formatting
- [ ] No errors in backend logs

## Rollback (If Needed)

If something goes wrong:
```bash
cd /var/www/infinitelaundrysolutions/backend
cp server.py.backup server.py
cp utils/email_service.py.backup utils/email_service.py
# Restart server (use appropriate command from Step 7)
```

## Support

If emails still not working after following these steps:
1. Check backend logs and share error messages
2. Verify Gmail App Password hasn't been revoked
3. Test SMTP connection from server
4. Contact hosting provider if port 587 is blocked
