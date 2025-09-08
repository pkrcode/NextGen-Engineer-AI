const TimeCapsule = require('../models/TimeCapsule');
const User = require('../models/User');
const { sendEmail } = require('./emailService');

/**
 * Deliver all scheduled messages that are due
 */
const deliverScheduledMessages = async () => {
  try {
    console.log('🕐 Starting scheduled message delivery...');
    
    // Find all pending deliveries
    const pendingDeliveries = await TimeCapsule.getReadyForDelivery();
    
    console.log(`📬 Found ${pendingDeliveries.length} messages to deliver`);
    
    for (const timeCapsule of pendingDeliveries) {
      try {
        await deliverSingleMessage(timeCapsule);
      } catch (error) {
        console.error(`❌ Error delivering message ${timeCapsule._id}:`, error);
        // Continue with other messages even if one fails
      }
    }
    
    console.log('✅ Message delivery process completed');
  } catch (error) {
    console.error('❌ Error in message delivery service:', error);
    throw error;
  }
};

/**
 * Deliver a single time capsule message
 */
const deliverSingleMessage = async (timeCapsule) => {
  try {
    // Mark as delivered
    await timeCapsule.markAsDelivered();
    
    // Send email notification if configured
    if (timeCapsule.deliveryMethod === 'email' || timeCapsule.deliveryMethod === 'both') {
      await sendDeliveryEmail(timeCapsule);
    }
    
    // Send push notification if configured (future feature)
    if (timeCapsule.deliveryMethod === 'app' || timeCapsule.deliveryMethod === 'both') {
      await sendPushNotification(timeCapsule);
    }
    
    console.log(`✅ Message "${timeCapsule.title}" delivered to user ${timeCapsule.user.email}`);
  } catch (error) {
    console.error(`❌ Error delivering message ${timeCapsule._id}:`, error);
    throw error;
  }
};

/**
 * Send email notification for delivered message
 */
const sendDeliveryEmail = async (timeCapsule) => {
  try {
    const user = await User.findById(timeCapsule.user);
    
    if (!user || !user.email) {
      console.warn(`⚠️ No email found for user ${timeCapsule.user}`);
      return;
    }
    
    const emailContent = generateDeliveryEmailContent(timeCapsule);
    
    await sendEmail({
      to: user.email,
      subject: `📬 Your Time Capsule Message: "${timeCapsule.title}"`,
      html: emailContent.html,
      text: emailContent.text
    });
    
    // Mark email as sent
    timeCapsule.emailSent = true;
    await timeCapsule.save();
    
    console.log(`📧 Email sent to ${user.email} for message "${timeCapsule.title}"`);
  } catch (error) {
    console.error(`❌ Error sending delivery email for message ${timeCapsule._id}:`, error);
    throw error;
  }
};

/**
 * Generate email content for delivered message
 */
const generateDeliveryEmailContent = (timeCapsule) => {
  const deliveryDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const scheduledDate = new Date(timeCapsule.deliveryDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your Time Capsule Message</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .message-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .btn { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📬 Your Time Capsule Message</h1>
          <p>Delivered on ${deliveryDate}</p>
        </div>
        <div class="content">
          <h2>Hello from your past self! 👋</h2>
          <p>This message was scheduled for <strong>${scheduledDate}</strong> and has now been delivered to you.</p>
          
          <div class="message-box">
            <h3>${timeCapsule.title}</h3>
            <p>${timeCapsule.content}</p>
            ${timeCapsule.mediaUrl ? `<p><strong>Media:</strong> <a href="${timeCapsule.mediaUrl}" target="_blank">View attached media</a></p>` : ''}
          </div>
          
          <p><strong>Category:</strong> ${timeCapsule.category}</p>
          <p><strong>Priority:</strong> ${timeCapsule.priority}</p>
          ${timeCapsule.tags.length > 0 ? `<p><strong>Tags:</strong> ${timeCapsule.tags.join(', ')}</p>` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard" class="btn">View in App</a>
          </div>
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
Your Time Capsule Message

Delivered on ${deliveryDate}

Hello from your past self!

This message was scheduled for ${scheduledDate} and has now been delivered to you.

Title: ${timeCapsule.title}
Message: ${timeCapsule.content}
Category: ${timeCapsule.category}
Priority: ${timeCapsule.priority}
${timeCapsule.tags.length > 0 ? `Tags: ${timeCapsule.tags.join(', ')}` : ''}

View in app: ${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard

Sent with love from TimeCapsule.AI
  `;
  
  return { html, text };
};

/**
 * Send push notification (placeholder for future implementation)
 */
const sendPushNotification = async (timeCapsule) => {
  // TODO: Implement push notification service
  // This could integrate with Firebase Cloud Messaging, OneSignal, or similar
  console.log(`📱 Push notification would be sent for message "${timeCapsule.title}"`);
};

/**
 * Get delivery statistics
 */
const getDeliveryStats = async () => {
  try {
    const stats = await TimeCapsule.aggregate([
      {
        $group: {
          _id: null,
          totalDelivered: { $sum: { $cond: ['$isDelivered', 1, 0] } },
          totalPending: { $sum: { $cond: [{ $and: [{ $not: '$isDelivered' }, { $gte: ['$scheduledDate', new Date()] }] }, 1, 0] } },
          totalOverdue: { $sum: { $cond: [{ $and: [{ $not: '$isDelivered' }, { $lt: ['$scheduledDate', new Date()] }] }, 1, 0] } }
        }
      }
    ]);
    
    return stats[0] || { totalDelivered: 0, totalPending: 0, totalOverdue: 0 };
  } catch (error) {
    console.error('Error getting delivery stats:', error);
    throw error;
  }
};

module.exports = {
  deliverScheduledMessages,
  deliverSingleMessage,
  sendDeliveryEmail,
  getDeliveryStats
};
