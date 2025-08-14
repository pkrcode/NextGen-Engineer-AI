const OpenAI = require('openai');

// Initialize OpenAI client only if API key is available
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
} else {
  console.log('⚠️  OpenAI API key not found. AI features will be disabled.');
}

/**
 * Enhance a message using AI
 */
const enhanceMessage = async ({ originalMessage, context, tone, length }) => {
  try {
    if (!openai) {
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

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant that enhances personal messages for time capsules. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const response = completion.choices[0].message.content;
    const result = JSON.parse(response);

    return {
      enhanced: result.enhanced,
      suggestions: result.suggestions,
      sentiment: result.sentiment
    };
  } catch (error) {
    console.error('Error enhancing message:', error);
    throw new Error('Failed to enhance message with AI');
  }
};

/**
 * Generate AI avatar voice for message
 */
const generateAvatarVoice = async ({ message, voiceType, emotion }) => {
  try {
    // This would integrate with text-to-speech services like OpenAI's TTS or ElevenLabs
    // For now, return a placeholder response
    
    console.log(`🎤 Generating avatar voice for message: "${message.substring(0, 50)}..."`);
    
    // Placeholder implementation
    return {
      url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceType}`,
      duration: Math.ceil(message.length / 10), // Rough estimate
      voiceType: voiceType
    };
  } catch (error) {
    console.error('Error generating avatar voice:', error);
    throw new Error('Failed to generate avatar voice');
  }
};

/**
 * Analyze message sentiment
 */
const analyzeSentiment = async (message) => {
  try {
    if (!openai) {
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

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that analyzes sentiment. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 300
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    throw new Error('Failed to analyze sentiment');
  }
};

/**
 * Suggest tags for a message
 */
const suggestTags = async (message, category) => {
  try {
    if (!openai) {
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

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that suggests relevant tags. Always respond with valid JSON array."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 200
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
  } catch (error) {
    console.error('Error suggesting tags:', error);
    return ['personal', 'reflection']; // Fallback tags
  }
};

/**
 * Get smart scheduling suggestions
 */
const getSmartSchedulingSuggestions = async ({ message, category, priority, userPreferences }) => {
  try {
    if (!openai) {
      // Return default suggestions
      return {
        suggestions: [
          {
            date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
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

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that suggests optimal delivery timing. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
  } catch (error) {
    console.error('Error getting scheduling suggestions:', error);
    // Return default suggestions
    return {
      suggestions: [
        {
          date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
          time: "09:00",
          reason: "Morning delivery for positive start to the day",
          confidence: 0.7
        }
      ]
    };
  }
};

/**
 * Generate message templates based on category
 */
const generateMessageTemplates = async (category) => {
  try {
    if (!openai) {
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

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that creates message templates. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 800
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
  } catch (error) {
    console.error('Error generating templates:', error);
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

module.exports = {
  enhanceMessage,
  generateAvatarVoice,
  analyzeSentiment,
  suggestTags,
  getSmartSchedulingSuggestions,
  generateMessageTemplates
};
