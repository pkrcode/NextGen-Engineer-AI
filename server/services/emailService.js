const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

/**
 * Send email
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"TimeCapsule.AI" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

/**
 * Send welcome email to new users
 */
const sendWelcomeEmail = async (user) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to TimeCapsule.AI</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .btn { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 Welcome to TimeCapsule.AI!</h1>
          <p>Your journey to connect with your future self begins now</p>
        </div>
        <div class="content">
          <h2>Hello ${user.name}! 👋</h2>
          <p>Welcome to TimeCapsule.AI, where you can send messages to your future self and track your personal growth over time.</p>
          
          <h3>What you can do:</h3>
          <ul>
            <li>📝 Write text messages to your future self</li>
            <li>🎙️ Record voice messages</li>
            <li>📹 Create video messages</li>
            <li>🤖 Enhance messages with AI</li>
            <li>📅 Schedule delivery for any future date</li>
            <li>🌍 Share anonymous messages with the community</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard" class="btn">Start Your Journey</a>
          </div>
          
          <p><strong>Ready to send your first message?</strong> Think about what you'd like to tell your future self. It could be:</p>
          <ul>
            <li>Your current goals and dreams</li>
            <li>A message of encouragement</li>
            <li>Reflections on your current life</li>
            <li>Advice for your future self</li>
          </ul>
        </div>
        <div class="footer">
          <p>Sent with ❤️ from the TimeCapsule.AI team</p>
          <p>Your personal time capsule platform</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
Welcome to TimeCapsule.AI!

Hello ${user.name}!

Welcome to TimeCapsule.AI, where you can send messages to your future self and track your personal growth over time.

What you can do:
- Write text messages to your future self
- Record voice messages
- Create video messages
- Enhance messages with AI
- Schedule delivery for any future date
- Share anonymous messages with the community

Start your journey: ${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard

Ready to send your first message? Think about what you'd like to tell your future self. It could be:
- Your current goals and dreams
- A message of encouragement
- Reflections on your current life
- Advice for your future self

Sent with love from the TimeCapsule.AI team
  `;
  
  return sendEmail({
    to: user.email,
    subject: '🚀 Welcome to TimeCapsule.AI - Start Your Journey!',
    html,
    text
  });
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset Your Password</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .btn { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Reset Your Password</h1>
          <p>TimeCapsule.AI Account Security</p>
        </div>
        <div class="content">
          <h2>Hello ${user.name}!</h2>
          <p>We received a request to reset your password for your TimeCapsule.AI account.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" class="btn">Reset Password</a>
          </div>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
          
          <div class="warning">
            <strong>⚠️ Important:</strong>
            <ul>
              <li>This link will expire in 1 hour</li>
              <li>If you didn't request this reset, please ignore this email</li>
              <li>Your password will remain unchanged until you click the link above</li>
            </ul>
          </div>
          
          <p>If you have any questions, please contact our support team.</p>
        </div>
        <div class="footer">
          <p>Sent with ❤️ from TimeCapsule.AI</p>
          <p>Your personal time capsule platform</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
Reset Your Password - TimeCapsule.AI

Hello ${user.name}!

We received a request to reset your password for your TimeCapsule.AI account.

Reset your password: ${resetUrl}

If the link doesn't work, copy and paste it into your browser.

Important:
- This link will expire in 1 hour
- If you didn't request this reset, please ignore this email
- Your password will remain unchanged until you click the link above

If you have any questions, please contact our support team.

Sent with love from TimeCapsule.AI
  `;
  
  return sendEmail({
    to: user.email,
    subject: '🔐 Reset Your TimeCapsule.AI Password',
    html,
    text
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail
};
