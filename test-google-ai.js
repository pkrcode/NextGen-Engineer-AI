const axios = require('axios');

// Test Google AI API
async function testGoogleAI() {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  
  if (!apiKey) {
    console.log('❌ No Google AI API key found in environment variables');
    console.log('Please add GOOGLE_AI_API_KEY=your-api-key to your .env file');
    return;
  }

  console.log('🔑 Testing Google AI API...');
  
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: "Explain how AI works in a few words"
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Google AI API Test Successful!');
    console.log('Response:', response.data.candidates[0].content.parts[0].text);
    
  } catch (error) {
    console.log('❌ Google AI API Test Failed');
    console.log('Error:', error.response?.data || error.message);
    
    if (error.response?.status === 400) {
      console.log('💡 This might be an API key issue. Please check:');
      console.log('1. Your API key is correct');
      console.log('2. You have enabled the Gemini API in Google AI Studio');
      console.log('3. Your account has access to the API');
    }
  }
}

// Test the unified AI service
async function testUnifiedAI() {
  console.log('\n🤖 Testing Unified AI Service...');
  
  try {
    const unifiedAIService = require('./server/services/unifiedAIService');
    
    // Test AI status
    const status = unifiedAIService.getAIStatus();
    console.log('AI Status:', status);
    
    // Test career guidance
    const guidance = await unifiedAIService.generateCareerGuidance({
      userProfile: 'Engineering student',
      currentSkills: 'JavaScript, React',
      goals: 'Become a full-stack developer',
      industry: 'Software Engineering'
    });
    
    console.log('✅ Unified AI Service Test Successful!');
    console.log('Career Guidance:', guidance);
    
  } catch (error) {
    console.log('❌ Unified AI Service Test Failed');
    console.log('Error:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🧪 Running AI Tests...\n');
  
  await testGoogleAI();
  await testUnifiedAI();
  
  console.log('\n✨ Tests completed!');
}

runTests();
