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

def send_email(to_email: str, subject: str, html_content: str) -> bool:
    """
    Send a general email notification
    """
    try:
        gmail_user = os.environ.get('GMAIL_USER')
        gmail_password = os.environ.get('GMAIL_PASSWORD')
        
        if not gmail_user or not gmail_password:
            logger.warning("Gmail credentials not configured. Email not sent.")
            logger.info(f"Email to {to_email}: {subject}")
            return True  # Return True for development
        
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #40E0D0 0%, #2ec4b6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; white-space: pre-line; }}
                .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Infinite Laundry Solutions</h1>
                </div>
                <div class="content">
                    {html_content}
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
        
        logger.info(f"Email sent successfully to {to_email}: {subject}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {str(e)}")
        return False

def send_order_status_email(to_email: str, customer_name: str, order_number: str, status: str, delivery_status: str = None, order_details: dict = None) -> bool:
    """
    Send order status update email to customer
    """
    try:
        gmail_user = os.environ.get('GMAIL_USER')
        gmail_password = os.environ.get('GMAIL_PASSWORD')
        
        if not gmail_user or not gmail_password:
            logger.warning("Gmail credentials not configured. Order status email not sent.")
            logger.info(f"Order status email to {to_email}: Order {order_number} - {status}")
            return True  # Return True for development
        
        # Determine the status message and icon
        status_messages = {
            'scheduled': {
                'title': '📅 Order Scheduled',
                'message': 'Your order has been scheduled and confirmed.',
                'color': '#2196F3'
            },
            'processing': {
                'title': '⚙️ Order Processing',
                'message': 'Your laundry is being processed.',
                'color': '#FF9800'
            },
            'ready_for_delivery': {
                'title': '✅ Ready for Delivery',
                'message': 'Your order is ready and will be delivered soon.',
                'color': '#4CAF50'
            },
            'out_for_delivery': {
                'title': '🚚 Out for Delivery',
                'message': 'Your order is out for delivery!',
                'color': '#9C27B0'
            },
            'delivered': {
                'title': '🎉 Order Delivered',
                'message': 'Your order has been successfully delivered.',
                'color': '#4CAF50'
            },
            'ready_for_pickup': {
                'title': '✅ Order Ready for Pickup',
                'message': 'Your order is ready and waiting for pickup.',
                'color': '#4CAF50'
            },
            'cancelled': {
                'title': '❌ Order Cancelled',
                'message': 'Your order has been cancelled.',
                'color': '#F44336'
            }
        }
        
        # Use delivery_status if provided, otherwise use order status
        current_status = delivery_status if delivery_status else status
        status_info = status_messages.get(current_status.lower(), {
            'title': f'📦 Order Update - {current_status}',
            'message': f'Your order status has been updated to {current_status.replace("_", " ").title()}.',
            'color': '#40E0D0'
        })
        
        subject = f"Order #{order_number} - {status_info['title']}"
        
        # Build order details section
        details_html = ""
        if order_details:
            details_html = f"""
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #333;">Order Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #666;">Order Number:</td>
                        <td style="padding: 8px 0; font-weight: bold;">#{order_number}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #666;">Status:</td>
                        <td style="padding: 8px 0; font-weight: bold; color: {status_info['color']};">{current_status.replace('_', ' ').title()}</td>
                    </tr>
            """
            
            if order_details.get('pickup_date'):
                details_html += f"""
                    <tr>
                        <td style="padding: 8px 0; color: #666;">Pickup Date:</td>
                        <td style="padding: 8px 0;">{order_details['pickup_date']}</td>
                    </tr>
                """
            
            if order_details.get('delivery_date'):
                details_html += f"""
                    <tr>
                        <td style="padding: 8px 0; color: #666;">Delivery Date:</td>
                        <td style="padding: 8px 0;">{order_details['delivery_date']}</td>
                    </tr>
                """
            
            if order_details.get('total_amount'):
                details_html += f"""
                    <tr>
                        <td style="padding: 8px 0; color: #666;">Total Amount:</td>
                        <td style="padding: 8px 0; font-weight: bold;">${order_details['total_amount']:.2f}</td>
                    </tr>
                """
            
            details_html += """
                </table>
            </div>
            """
        
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, {status_info['color']} 0%, #2ec4b6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }}
                .status-box {{ background: #f0f9ff; border-left: 4px solid {status_info['color']}; padding: 20px; margin: 20px 0; border-radius: 4px; }}
                .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
                .button {{ background: #40E0D0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>{status_info['title']}</h1>
                </div>
                <div class="content">
                    <h2>Hello {customer_name},</h2>
                    <div class="status-box">
                        <p style="margin: 0; font-size: 18px; font-weight: bold; color: {status_info['color']};">{status_info['message']}</p>
                    </div>
                    
                    {details_html}
                    
                    <p>You can track your order status anytime by logging into your dashboard.</p>
                    
                    <p>If you have any questions or concerns, please don't hesitate to contact us.</p>
                    
                    <p>Thank you for choosing Infinite Laundry Solutions!</p>
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
        
        logger.info(f"Order status email sent successfully to {to_email}: {order_number} - {current_status}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send order status email: {str(e)}")
        return False