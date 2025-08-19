const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google AI client only if API key is available
let genAI = null;
let model = null;

if (process.env.GOOGLE_AI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-pro" });
  console.log('✅ Google AI (Gemini) initialized successfully');
} else {
  console.log('⚠️  Google AI API key not found. AI features will be disabled.');
}

/**
 * Enhance a message using Google AI
 */
const enhanceMessage = async ({ originalMessage, context, tone, length }) => {
  try {
    if (!model) {
      return {
        enhanced: originalMessage,
        suggestions: ["Add more personal details", "Include specific goals", "Make it more emotional"],
        sentiment: "neutral"
      };
    }

    const prompt = `
You are an AI assistant helping users enhance their time capsule messages to their future selves. 

Original message: "${originalMessage}"
Context: ${context}
Desired tone: ${tone}
Desired length: ${length}

Please enhance this message to make it more meaningful, encouraging, and impactful for the user's future self. Consider:

1. Adding motivational elements
2. Making it more personal and reflective
3. Including specific details that might be meaningful later
4. Maintaining the original intent while improving clarity
5. Adding encouraging language appropriate for the tone

Provide:
1. An enhanced version of the message
2. 3-5 suggestions for additional content or improvements
3. Sentiment analysis (positive, neutral, or negative)

Format your response as JSON:
{
  "enhanced": "enhanced message text",
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "sentiment": "positive/neutral/negative"
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse JSON from the response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.log('Failed to parse JSON, using fallback response');
    }

    // Fallback response
    return {
      enhanced: originalMessage + " (Enhanced with AI)",
      suggestions: ["Add more personal details", "Include specific goals", "Make it more emotional"],
      sentiment: "neutral"
    };
  } catch (error) {
    console.error('Error enhancing message with Google AI:', error);
    throw new Error('Failed to enhance message with AI');
  }
};

/**
 * Analyze message sentiment using Google AI
 */
const analyzeSentiment = async (message) => {
  try {
    if (!model) {
      return {
        sentiment: "neutral",
        confidence: 0.5,
        emotions: ["reflective"],
        summary: "Message appears to be neutral and reflective"
      };
    }

    const prompt = `
Analyze the sentiment of this message: "${message}"

Consider the emotional tone, context, and overall feeling conveyed.

Respond with JSON:
{
  "sentiment": "positive/neutral/negative",
  "confidence": 0.0-1.0,
  "emotions": ["emotion1", "emotion2"],
  "summary": "brief description of the sentiment"
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.log('Failed to parse JSON, using fallback response');
    }

    return {
      sentiment: "neutral",
      confidence: 0.5,
      emotions: ["reflective"],
      summary: "Message appears to be neutral and reflective"
    };
  } catch (error) {
    console.error('Error analyzing sentiment with Google AI:', error);
    throw new Error('Failed to analyze sentiment');
  }
};

/**
 * Suggest tags for a message using Google AI
 */
const suggestTags = async (message, category) => {
  try {
    if (!model) {
      return ['personal', 'reflection', 'goals', 'motivation']; // Fallback tags
    }

    const prompt = `
Suggest relevant tags for this time capsule message:

Message: "${message}"
Category: ${category}

Generate 5-8 relevant tags that would help categorize and find this message later. Tags should be:
- Relevant to the content
- Specific but not too narrow
- Useful for future reference
- Related to the category

Respond with JSON array of tags:
["tag1", "tag2", "tag3", "tag4", "tag5"]
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.log('Failed to parse JSON, using fallback tags');
    }

    return ['personal', 'reflection', 'goals', 'motivation'];
  } catch (error) {
    console.error('Error suggesting tags with Google AI:', error);
    return ['personal', 'reflection']; // Fallback tags
  }
};

/**
 * Get smart scheduling suggestions using Google AI
 */
const getSmartSchedulingSuggestions = async ({ message, category, priority, userPreferences }) => {
  try {
    if (!model) {
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

    const prompt = `
Analyze this time capsule message and suggest optimal delivery timing:

Message: "${message}"
Category: ${category}
Priority: ${priority}

Consider:
1. The nature of the message content
2. The category and priority
3. Typical optimal times for different types of messages
4. User engagement patterns

Suggest 3 different delivery times with explanations.

Respond with JSON:
{
  "suggestions": [
    {
      "date": "YYYY-MM-DD",
      "time": "HH:MM",
      "reason": "explanation",
      "confidence": 0.0-1.0
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.log('Failed to parse JSON, using fallback suggestions');
    }

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
  } catch (error) {
    console.error('Error getting scheduling suggestions with Google AI:', error);
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
 * Generate message templates using Google AI
 */
const generateMessageTemplates = async (category) => {
  try {
    if (!model) {
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

    const prompt = `
Generate 5 message templates for time capsule messages in the category: "${category}"

Each template should be:
- Inspiring and meaningful
- Appropriate for the category
- 2-3 sentences long
- Include placeholders for personalization

Respond with JSON:
{
  "templates": [
    {
      "title": "template title",
      "content": "template content with {placeholder}",
      "description": "brief description"
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.log('Failed to parse JSON, using fallback templates');
    }

    return {
      templates: [
        {
          title: "Default Template",
          content: "Dear future self, I hope you're doing well. Remember that you are capable of achieving great things.",
          description: "A simple, encouraging message template"
        }
      ]
    };
  } catch (error) {
    console.error('Error generating templates with Google AI:', error);
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
 * Generate career guidance using Google AI
 */
const generateCareerGuidance = async ({ userProfile, currentSkills, goals, industry }) => {
  try {
    if (!model) {
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

    const prompt = `
As an AI career advisor, provide guidance for an engineering student:

User Profile: ${userProfile}
Current Skills: ${currentSkills}
Goals: ${goals}
Industry: ${industry}

Provide:
1. 3-5 specific recommendations
2. A learning roadmap
3. Immediate next steps

Respond with JSON:
{
  "recommendations": ["rec1", "rec2", "rec3"],
  "roadmap": "detailed roadmap description",
  "nextSteps": ["step1", "step2", "step3"]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.log('Failed to parse JSON, using fallback guidance');
    }

    return {
      recommendations: [
        "Focus on building practical projects",
        "Network with professionals in your field",
        "Consider pursuing relevant certifications"
      ],
      roadmap: "Continue learning and building experience",
      nextSteps: ["Complete current projects", "Apply for internships", "Join professional communities"]
    };
  } catch (error) {
    console.error('Error generating career guidance with Google AI:', error);
    throw new Error('Failed to generate career guidance');
  }
};

module.exports = {
  enhanceMessage,
  analyzeSentiment,
  suggestTags,
  getSmartSchedulingSuggestions,
  generateMessageTemplates,
  generateCareerGuidance
};
