import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging

logger = logging.getLogger(__name__)

def send_otp_email(to_email: str, otp: str, full_name: str) -> bool:
    """
    Send OTP verification email
    """
    try:
        gmail_user = os.environ.get('GMAIL_USER')
        gmail_password = os.environ.get('GMAIL_PASSWORD')
        
        if not gmail_user or not gmail_password:
            logger.warning("Gmail credentials not configured. OTP email not sent.")
            logger.info(f"OTP for {to_email}: {otp}")
            return True  # Return True for development
        
        subject = "Your OTP for Infinite Laundry Solutions"
        
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #40E0D0 0%, #2ec4b6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }}
                .otp-box {{ background: #f0f9ff; border: 2px dashed #40E0D0; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }}
                .otp-code {{ font-size: 32px; font-weight: bold; color: #40E0D0; letter-spacing: 5px; }}
                .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
                .button {{ background: #40E0D0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to Infinite Laundry Solutions!</h1>
                </div>
                <div class="content">
                    <h2>Hello {full_name},</h2>
                    <p>Thank you for signing up! Please verify your email address to complete your registration.</p>
                    
                    <div class="otp-box">
                        <p style="margin: 0; font-size: 14px; color: #666;">Your verification code is:</p>
                        <div class="otp-code">{otp}</div>
                        <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">This code expires in 10 minutes</p>
                    </div>
                    
                    <p>Enter this code on the verification page to activate your account.</p>
                    <p><strong>Important:</strong> Do not share this code with anyone.</p>
                    
                    <p>If you didn't request this code, please ignore this email.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2025 Infinite Laundry Solutions. All rights reserved.</p>
                    <p>Australia's trusted laundry service provider</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        msg = MIMEMultipart('alternative')
        msg['From'] = gmail_user
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(html_body, 'html'))
        
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(gmail_user, gmail_password)
        server.send_message(msg)
        server.quit()
        
        logger.info(f"OTP email sent successfully to {to_email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send OTP email: {str(e)}")
        logger.info(f"OTP for {to_email}: {otp}")
        return True  # Return True in development even if email fails

def send_welcome_email(to_email: str, full_name: str) -> bool:
    """
    Send welcome email after successful registration
    """
    try:
        gmail_user = os.environ.get('GMAIL_USER')
        gmail_password = os.environ.get('GMAIL_PASSWORD')
        
        if not gmail_user or not gmail_password:
            logger.warning("Gmail credentials not configured")
            return False
        
        subject = "Welcome to Infinite Laundry Solutions!"
        
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #40E0D0 0%, #2ec4b6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }}
                .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Welcome Aboard!</h1>
                </div>
                <div class="content">
                    <h2>Hello {full_name},</h2>
                    <p>Your account has been successfully verified! Welcome to Infinite Laundry Solutions.</p>
                    <p>You can now log in and enjoy our professional laundry services.</p>
                    <p><strong>What's Next?</strong></p>
                    <ul>
                        <li>Log in to your dashboard</li>
                        <li>View our services and pricing</li>
                        <li>Place your first order</li>
                        <li>Track your deliveries in real-time</li>
                    </ul>
                    <p>If you have any questions, feel free to contact our support team.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2025 Infinite Laundry Solutions. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        msg = MIMEMultipart('alternative')
        msg['From'] = gmail_user
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(html_body, 'html'))
        
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(gmail_user, gmail_password)
        server.send_message(msg)
        server.quit()
        
        return True
        
    except Exception as e:
        logger.error(f"Failed to send welcome email: {str(e)}")
        return False