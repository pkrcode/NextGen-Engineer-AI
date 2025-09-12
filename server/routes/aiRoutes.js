const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { enhanceMessage, generateAvatarVoice, analyzeSentiment } = require('../services/aiService');

// @route   POST /api/ai/enhance-message
// @desc    Enhance a message using AI
// @access  Public (for demo purposes)
router.post('/enhance-message', async (req, res) => {
  try {
    const { message, context, tone, length } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }
    
    const enhancedMessage = await enhanceMessage({
      originalMessage: message,
      context: context || 'personal reflection',
      tone: tone || 'encouraging',
      length: length || 'medium'
    });
    
    res.json({
      success: true,
      data: {
        original: message,
        enhanced: enhancedMessage.enhanced,
        suggestions: enhancedMessage.suggestions,
        sentiment: enhancedMessage.sentiment
      }
    });
  } catch (error) {
    console.error('Error enhancing message:', error);
    res.status(500).json({ message: 'AI enhancement failed', error: error.message });
  }
});

// @route   POST /api/ai/generate-avatar
// @desc    Generate AI avatar voice for message
// @access  Private
router.post('/generate-avatar', auth, async (req, res) => {
  try {
    const { message, voiceType, emotion } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }
    
    const avatarAudio = await generateAvatarVoice({
      message,
      voiceType: voiceType || 'friendly',
      emotion: emotion || 'neutral'
    });
    
    res.json({
      success: true,
      data: {
        audioUrl: avatarAudio.url,
        duration: avatarAudio.duration,
        voiceType: avatarAudio.voiceType
      }
    });
  } catch (error) {
    console.error('Error generating avatar:', error);
    res.status(500).json({ message: 'Avatar generation failed', error: error.message });
  }
});

// @route   POST /api/ai/analyze-sentiment
// @desc    Analyze message sentiment
// @access  Public (for demo purposes)
router.post('/analyze-sentiment', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }
    
    const sentiment = await analyzeSentiment(message);
    
    res.json({
      success: true,
      data: sentiment
    });
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    res.status(500).json({ message: 'Sentiment analysis failed', error: error.message });
  }
});

// @route   POST /api/ai/suggest-tags
// @desc    Suggest tags for a message
// @access  Private
router.post('/suggest-tags', auth, async (req, res) => {
  try {
    const { message, category } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }
    
    // This would integrate with AI service to suggest relevant tags
    const suggestedTags = await suggestTags(message, category);
    
    res.json({
      success: true,
      data: {
        tags: suggestedTags
      }
    });
  } catch (error) {
    console.error('Error suggesting tags:', error);
    res.status(500).json({ message: 'Tag suggestion failed', error: error.message });
  }
});

// @route   POST /api/ai/smart-scheduling
// @desc    Get AI suggestions for optimal delivery timing
// @access  Private
router.post('/smart-scheduling', auth, async (req, res) => {
  try {
    const { message, category, priority, userPreferences } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }
    
    // This would analyze the message and user patterns to suggest optimal delivery times
    const schedulingSuggestions = await getSmartSchedulingSuggestions({
      message,
      category,
      priority,
      userPreferences
    });
    
    res.json({
      success: true,
      data: schedulingSuggestions
    });
  } catch (error) {
    console.error('Error getting scheduling suggestions:', error);
    res.status(500).json({ message: 'Smart scheduling failed', error: error.message });
  }
});

module.exports = router;
