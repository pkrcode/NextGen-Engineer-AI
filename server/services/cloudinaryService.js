const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload file to Cloudinary
 */
const uploadToCloudinary = async (file, messageType) => {
  try {
    // Convert buffer to base64
    const base64Data = file.buffer.toString('base64');
    const dataURI = `data:${file.mimetype};base64,${base64Data}`;
    
    // Configure upload options based on message type
    const uploadOptions = {
      resource_type: messageType === 'video' ? 'video' : 'audio',
      folder: `timecapsule-ai/${messageType}`,
      public_id: `message_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      overwrite: true
    };
    
    // Add specific options for video
    if (messageType === 'video') {
      uploadOptions.transformation = [
        { width: 1280, height: 720, crop: 'limit' },
        { quality: 'auto' }
      ];
    }
    
    // Add specific options for audio
    if (messageType === 'voice') {
      uploadOptions.transformation = [
        { quality: 'auto' },
        { format: 'mp3' }
      ];
    }
    
    const result = await cloudinary.uploader.upload(dataURI, uploadOptions);
    
    console.log(`☁️ File uploaded to Cloudinary: ${result.secure_url}`);
    
    return result.secure_url;
  } catch (error) {
    console.error('❌ Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload media file');
  }
};

/**
 * Delete file from Cloudinary
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`🗑️ File deleted from Cloudinary: ${publicId}`);
    return result;
  } catch (error) {
    console.error('❌ Error deleting from Cloudinary:', error);
    throw new Error('Failed to delete media file');
  }
};

/**
 * Get file info from Cloudinary
 */
const getFileInfo = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    console.error('❌ Error getting file info from Cloudinary:', error);
    throw new Error('Failed to get file information');
  }
};

/**
 * Generate thumbnail for video
 */
const generateThumbnail = async (videoUrl) => {
  try {
    // Extract public ID from URL
    const urlParts = videoUrl.split('/');
    const publicId = urlParts[urlParts.length - 1].split('.')[0];
    
    const thumbnailUrl = cloudinary.url(publicId, {
      transformation: [
        { width: 300, height: 200, crop: 'thumb' },
        { quality: 'auto' }
      ]
    });
    
    return thumbnailUrl;
  } catch (error) {
    console.error('❌ Error generating thumbnail:', error);
    return null;
  }
};

/**
 * Optimize media for delivery
 */
const optimizeForDelivery = async (mediaUrl, messageType) => {
  try {
    // Extract public ID from URL
    const urlParts = mediaUrl.split('/');
    const publicId = urlParts[urlParts.length - 1].split('.')[0];
    
    let optimizedUrl;
    
    if (messageType === 'video') {
      optimizedUrl = cloudinary.url(publicId, {
        transformation: [
          { width: 1280, height: 720, crop: 'limit' },
          { quality: 'auto' },
          { format: 'mp4' }
        ]
      });
    } else if (messageType === 'voice') {
      optimizedUrl = cloudinary.url(publicId, {
        transformation: [
          { quality: 'auto' },
          { format: 'mp3' }
        ]
      });
    } else {
      optimizedUrl = mediaUrl;
    }
    
    return optimizedUrl;
  } catch (error) {
    console.error('❌ Error optimizing media:', error);
    return mediaUrl; // Return original URL if optimization fails
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  getFileInfo,
  generateThumbnail,
  optimizeForDelivery
};
