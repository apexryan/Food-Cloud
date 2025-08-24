/*const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with API key from environment
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Send password reset email to any registered user
const sendPasswordResetEmail = async (userEmail, resetToken, userName = null) => {
  try {
    const resetUrl = resetToken;
    const appName = process.env.APP_NAME || 'FoodCloud';
    const fromEmail = process.env.EMAIL_FROM || `noreply@${appName.toLowerCase()}.com`;
    
    // Personalized greeting
    const greeting = userName ? `Hello ${userName},` : 'Hello,';
    
    console.log(`📧 SendGrid: Sending password reset email to: ${userEmail}`);
    console.log(`🔗 Reset URL: ${resetUrl}`);
    
    const msg = {
  to: userEmail,
  from: fromEmail, // Must be verified in SendGrid (we'll handle this)
  subject: `🔐 Password Reset Request - ${appName}`,
  
  // Plain text version (fallback)
  text: `
${greeting}

You have requested to reset your password for your ${appName} account.

Here is your reset token:
${resetToken}

⏰ This token will expire in 15 minutes for security reasons.

If you didn't request this password reset, please ignore this email - your account is safe.

Best regards,
${appName} Team

---
This is an automated message from ${appName} College Project.
  `,
  
  // HTML version (modern email clients)
  html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0;
            background-color: #f4f4f4;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px; 
            text-align: center; 
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content { 
            padding: 30px 20px; 
        }
        .token-box {
            display: block;
            background: #f4f4f4;
            padding: 15px;
            margin: 20px 0;
            font-size: 18px;
            font-weight: bold;
            letter-spacing: 1px;
            border-radius: 8px;
            text-align: center;
            border: 1px dashed #667eea;
            color: #333;
        }
        .footer { 
            background: #f8f9fa;
            border-top: 1px solid #eee; 
            padding: 20px; 
            font-size: 14px; 
            color: #666;
            text-align: center;
        }
        .warning { 
            background: #fff3cd; 
            border-left: 4px solid #ffc107;
            padding: 15px; 
            border-radius: 4px; 
            margin: 20px 0;
        }
        .info-box {
            background: #e7f3ff;
            border-left: 4px solid #2196F3;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
        }
        @media (max-width: 600px) {
            .container { margin: 10px; }
            .content { padding: 20px 15px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Password Reset</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">${appName} - College Project</p>
        </div>
        
        <div class="content">
            <p style="font-size: 16px;">${greeting}</p>
            
            <p>You have requested to reset your password for your <strong>${appName}</strong> account.</p>
            
          <p><strong>Here is your password reset token:</strong></p>
            
           <div style="background: #f4f4f4; border: 2px dashed #667eea; padding: 20px; text-align: center; border-radius: 8px; font-size: 18px; font-weight: bold; letter-spacing: 2px; color: #333;">
            ${token}
          </div>

              <p style="margin-top: 20px;">⏰ This token will expire in <strong>15 minutes</strong>. Please copy and paste it in the reset form.</p>
            
            <div class="info-box">
                <strong>🛡️ Security Note:</strong> If you didn't request this password reset, please ignore this email - your account is completely safe.
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Best regards,</strong><br>${appName} Team</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;">
            <p><small>This is an automated message from ${appName} College Project.</small></p>
            <p><small>📧 Powered by SendGrid Email Service</small></p>
        </div>
    </div>
</body>
</html>
  `
};

    // Send email via SendGrid
    const result = await sgMail.send(msg);
    
    console.log('✅ SendGrid: Password reset email sent successfully!');
    console.log(`📬 Message ID: ${result[0].headers['x-message-id']}`);
    
    return { 
      success: true, 
      messageId: result[0].headers['x-message-id'],
      recipient: userEmail,
      service: 'SendGrid'
    };
    
  } catch (error) {
    console.error('❌ SendGrid Error Details:');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    
    // SendGrid specific error handling
    if (error.response) {
      console.error('Response Body:', error.response.body);
    }
    
    // User-friendly error messages
    let userMessage = 'Failed to send reset email';
    
    if (error.code === 401) {
      userMessage = 'Email service authentication failed. Please check API key.';
    } else if (error.code === 403) {
      userMessage = 'Email service access denied. Please verify sender email.';
    } else if (error.message.includes('email')) {
      userMessage = 'Invalid email address provided.';
    }
    
    throw new Error(`${userMessage}: ${error.message}`);
  }
};

// Test SendGrid configuration (useful for college demos)
const testEmailConfiguration = async () => {
  try {
    console.log('🧪 Testing SendGrid configuration...');
    
    // Check if API key is set
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY is not set in environment variables');
    }
    
    console.log('✅ SendGrid API key is configured');
    console.log(`📧 From email: ${process.env.EMAIL_FROM}`);
    
    return { 
      success: true, 
      message: 'SendGrid is properly configured',
      apiKey: process.env.SENDGRID_API_KEY ? 'Set ✅' : 'Not set ❌',
      fromEmail: process.env.EMAIL_FROM || 'Not set ❌'
    };
    
  } catch (error) {
    console.error('❌ SendGrid configuration test failed:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendPasswordResetEmail,
  testEmailConfiguration
};*/


const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with API key from environment
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Send password reset email to any registered user (User, NGO, Volunteer)
const sendPasswordResetEmail = async (userEmail, resetToken, userName = null, userType = 'user') => {
  try {
    const resetUrl = `${process.env.RESET_URL}/reset-password?token=${resetToken}`;
    const appName = process.env.APP_NAME || 'FoodCloud';
    const fromEmail = process.env.EMAIL_FROM || `noreply@${appName.toLowerCase()}.com`;
    
    // Personalized greeting based on user type
    const greeting = userName ? `Hello ${userName},` : 'Hello,';
    
    // User type specific messages
    const userTypeMessages = {
      user: 'food donor',
      ngo: 'NGO representative', 
      volunteer: 'volunteer'
    };
    
    const roleDescription = userTypeMessages[userType] || 'user';
    
    console.log(`📧 SendGrid: Sending password reset email to: ${userEmail}`);
    console.log(`🔗 Reset URL: ${resetUrl}`);
    
    const msg = {
      to: userEmail,
      from: fromEmail, // Must be verified in SendGrid (we'll handle this)
      subject: `🔐 Password Reset Request - ${appName} (${userType.toUpperCase()})`,
      
      // Plain text version (fallback)
      text: `
${greeting}

You have requested to reset your password for your ${appName} ${roleDescription} account.

Click or copy this link to reset your password:
${resetUrl}

⏰ This link will expire in 15 minutes for security reasons.

If you didn't request this password reset, please ignore this email - your account is safe.

Best regards,
${appName} Team

---
This is an automated message from ${appName} College Project.
      `,
      
      // HTML version (modern email clients)
      html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0;
            background-color: #f4f4f4;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px; 
            text-align: center; 
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content { 
            padding: 30px 20px; 
        }
        .button { 
            display: inline-block; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 25px; 
            margin: 20px 0;
            font-weight: bold;
            text-align: center;
            transition: transform 0.2s;
        }
        .button:hover {
            transform: translateY(-2px);
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .footer { 
            background: #f8f9fa;
            border-top: 1px solid #eee; 
            padding: 20px; 
            font-size: 14px; 
            color: #666;
            text-align: center;
        }
        .warning { 
            background: #fff3cd; 
            border-left: 4px solid #ffc107;
            padding: 15px; 
            border-radius: 4px; 
            margin: 20px 0;
        }
        .info-box {
            background: #e7f3ff;
            border-left: 4px solid #2196F3;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
        }
        @media (max-width: 600px) {
            .container { margin: 10px; }
            .content { padding: 20px 15px; }
            .button { padding: 12px 25px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Password Reset</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">${appName} - College Project</p>
        </div>
        
        <div class="content">
            <p style="font-size: 16px;">${greeting}</p>
            
            <p>You have requested to reset your password for your <strong>${appName}</strong> ${roleDescription} account.</p>
            
            <p>Click the button below to create a new password:</p>
            
            <div class="button-container">
                <a href="${resetUrl}" class="button">Reset My Password</a>
            </div>
            
            <div class="warning">
                <strong>⏰ Important:</strong> This link will expire in <strong>15 minutes</strong> for security reasons.
            </div>
            
            <div class="info-box">
                <strong>🛡️ Security Note:</strong> If you didn't request this password reset, please ignore this email - your account is completely safe.
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Best regards,</strong><br>${appName} Team</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;">
            <p><small>This is an automated message from ${appName} College Project.</small></p>
            <p><small>📧 Powered by SendGrid Email Service</small></p>
            <p><small>If the button doesn't work, copy this link:<br>
            <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a></small></p>
        </div>
    </div>
</body>
</html>
      `
    };

    // Send email via SendGrid
    const result = await sgMail.send(msg);
    
    console.log('✅ SendGrid: Password reset email sent successfully!');
    console.log(`📬 Message ID: ${result[0].headers['x-message-id']}`);
    
    return { 
      success: true, 
      messageId: result[0].headers['x-message-id'],
      recipient: userEmail,
      service: 'SendGrid'
    };
    
  } catch (error) {
    console.error('❌ SendGrid Error Details:');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    
    // SendGrid specific error handling
    if (error.response) {
      console.error('Response Body:', error.response.body);
    }
    
    // User-friendly error messages
    let userMessage = 'Failed to send reset email';
    
    if (error.code === 401) {
      userMessage = 'Email service authentication failed. Please check API key.';
    } else if (error.code === 403) {
      userMessage = 'Email service access denied. Please verify sender email.';
    } else if (error.message.includes('email')) {
      userMessage = 'Invalid email address provided.';
    }
    
    throw new Error(`${userMessage}: ${error.message}`);
  }
};

// Test SendGrid configuration (useful for college demos)
const testEmailConfiguration = async () => {
  try {
    console.log('🧪 Testing SendGrid configuration...');
    
    // Check if API key is set
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY is not set in environment variables');
    }
    
    console.log('✅ SendGrid API key is configured');
    console.log(`📧 From email: ${process.env.EMAIL_FROM}`);
    
    return { 
      success: true, 
      message: 'SendGrid is properly configured',
      apiKey: process.env.SENDGRID_API_KEY ? 'Set ✅' : 'Not set ❌',
      fromEmail: process.env.EMAIL_FROM || 'Not set ❌'
    };
    
  } catch (error) {
    console.error('❌ SendGrid configuration test failed:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendPasswordResetEmail,
  testEmailConfiguration
};