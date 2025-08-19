const openaiService = require('./aiService');
const googleAIService = require('./googleAIService');

// Determine which AI service to use based on available API keys
const useGoogleAI = process.env.GOOGLE_AI_API_KEY && !process.env.OPENAI_API_KEY;
const useOpenAI = process.env.OPENAI_API_KEY;
const useFallback = !process.env.GOOGLE_AI_API_KEY && !process.env.OPENAI_API_KEY;

console.log(`🤖 AI Service Configuration:`);
if (useGoogleAI) {
  console.log('✅ Using Google AI (Gemini)');
} else if (useOpenAI) {
  console.log('✅ Using OpenAI');
} else {
  console.log('⚠️  No AI API keys found - using fallback responses');
}

/**
 * Enhanced message service
 */
const enhanceMessage = async (params) => {
  try {
    if (useGoogleAI) {
      return await googleAIService.enhanceMessage(params);
    } else if (useOpenAI) {
      return await openaiService.enhanceMessage(params);
    } else {
      // Fallback response
      return {
        enhanced: params.originalMessage + " (Enhanced with AI)",
        suggestions: ["Add more personal details", "Include specific goals", "Make it more emotional"],
        sentiment: "neutral"
      };
    }
  } catch (error) {
    console.error('Error in unified enhanceMessage:', error);
    // Fallback response
    return {
      enhanced: params.originalMessage,
      suggestions: ["Add more personal details", "Include specific goals", "Make it more emotional"],
      sentiment: "neutral"
    };
  }
};

/**
 * Sentiment analysis service
 */
const analyzeSentiment = async (message) => {
  try {
    if (useGoogleAI) {
      return await googleAIService.analyzeSentiment(message);
    } else if (useOpenAI) {
      return await openaiService.analyzeSentiment(message);
    } else {
      // Fallback response
      return {
        sentiment: "neutral",
        confidence: 0.5,
        emotions: ["reflective"],
        summary: "Message appears to be neutral and reflective"
      };
    }
  } catch (error) {
    console.error('Error in unified analyzeSentiment:', error);
    return {
      sentiment: "neutral",
      confidence: 0.5,
      emotions: ["reflective"],
      summary: "Message appears to be neutral and reflective"
    };
  }
};

/**
 * Tag suggestion service
 */
const suggestTags = async (message, category) => {
  try {
    if (useGoogleAI) {
      return await googleAIService.suggestTags(message, category);
    } else if (useOpenAI) {
      return await openaiService.suggestTags(message, category);
    } else {
      // Fallback tags
      return ['personal', 'reflection', 'goals', 'motivation'];
    }
  } catch (error) {
    console.error('Error in unified suggestTags:', error);
    return ['personal', 'reflection', 'goals', 'motivation'];
  }
};

/**
 * Smart scheduling suggestions service
 */
const getSmartSchedulingSuggestions = async (params) => {
  try {
    if (useGoogleAI) {
      return await googleAIService.getSmartSchedulingSuggestions(params);
    } else if (useOpenAI) {
      return await openaiService.getSmartSchedulingSuggestions(params);
    } else {
      // Fallback suggestions
      return {
        suggestions: [
          {
            date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: "09:00",
            reason: "Morning delivery for positive start to the day",
            confidence: 0.7
          }
        ]
      };
    }
  } catch (error) {
    console.error('Error in unified getSmartSchedulingSuggestions:', error);
    return {
      suggestions: [
        {
          date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: "09:00",
          reason: "Morning delivery for positive start to the day",
          confidence: 0.7
        }
      ]
    };
  }
};

/**
 * Message templates service
 */
const generateMessageTemplates = async (category) => {
  try {
    if (useGoogleAI) {
      return await googleAIService.generateMessageTemplates(category);
    } else if (useOpenAI) {
      return await openaiService.generateMessageTemplates(category);
    } else {
      // Fallback templates
      return {
        templates: [
          {
            title: "Default Template",
            content: "Dear future self, I hope you're doing well. Remember that you are capable of achieving great things.",
            description: "A simple, encouraging message template"
          },
          {
            title: "Goal Setting",
            content: "Future me, I'm setting this goal today: {goal}. I believe in your ability to achieve it.",
            description: "Template for setting and tracking goals"
          },
          {
            title: "Reflection",
            content: "Looking back from the future, I want you to remember this moment: {memory}.",
            description: "Template for capturing important moments"
          }
        ]
      };
    }
  } catch (error) {
    console.error('Error in unified generateMessageTemplates:', error);
    return {
      templates: [
        {
          title: "Default Template",
          content: "Dear future self, I hope you're doing well. Remember that you are capable of achieving great things.",
          description: "A simple, encouraging message template"
        }
      ]
    };
  }
};

/**
 * Career guidance service (Google AI only)
 */
const generateCareerGuidance = async (params) => {
  try {
    if (useGoogleAI) {
      return await googleAIService.generateCareerGuidance(params);
    } else {
      // Fallback guidance
      return {
        recommendations: [
          "Focus on building practical projects",
          "Network with professionals in your field",
          "Consider pursuing relevant certifications"
        ],
        roadmap: "Continue learning and building experience",
        nextSteps: ["Complete current projects", "Apply for internships", "Join professional communities"]
      };
    }
  } catch (error) {
    console.error('Error in unified generateCareerGuidance:', error);
    return {
      recommendations: [
        "Focus on building practical projects",
        "Network with professionals in your field",
        "Consider pursuing relevant certifications"
      ],
      roadmap: "Continue learning and building experience",
      nextSteps: ["Complete current projects", "Apply for internships", "Join professional communities"]
    };
  }
};

/**
 * Get AI service status
 */
const getAIStatus = () => {
  return {
    service: useGoogleAI ? 'Google AI (Gemini)' : useOpenAI ? 'OpenAI' : 'Fallback',
    available: useGoogleAI || useOpenAI,
    features: {
      messageEnhancement: true,
      sentimentAnalysis: true,
      tagSuggestions: true,
      schedulingSuggestions: true,
      messageTemplates: true,
      careerGuidance: useGoogleAI || false
    }
  };
};

module.exports = {
  enhanceMessage,
  analyzeSentiment,
  suggestTags,
  getSmartSchedulingSuggestions,
  generateMessageTemplates,
  generateCareerGuidance,
  getAIStatus
};
