# 🤖 AI API Setup Guide for NextGen Engineer AI

## Overview
This guide helps you set up alternative AI APIs since OpenAI is not available. The platform now supports multiple AI providers with automatic fallback.

## 🚀 Quick Setup Options

### Option 1: Google AI (Gemini) - **Recommended**
**Cost**: Free tier available, very affordable
**Features**: Text generation, code assistance, reasoning

#### Setup Steps:
1. **Get API Key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the API key

2. **Configure Environment**:
   ```bash
   # Add to your .env file
   GOOGLE_AI_API_KEY=your-google-ai-api-key-here
   ```

3. **Install Dependencies** (Already done):
   ```bash
   npm install @google/generative-ai
   ```

### Option 2: Anthropic Claude
**Cost**: Competitive pricing
**Features**: Excellent for coding, analysis, safety-focused

#### Setup Steps:
1. **Get API Key**:
   - Go to [Anthropic Console](https://console.anthropic.com/)
   - Sign up and create an API key
   - Copy the API key

2. **Install Dependencies**:
   ```bash
   npm install @anthropic-ai/sdk
   ```

3. **Configure Environment**:
   ```bash
   # Add to your .env file
   ANTHROPIC_API_KEY=your-anthropic-api-key-here
   ```

### Option 3: Cohere
**Cost**: Free tier available
**Features**: Text generation, classification, embeddings

#### Setup Steps:
1. **Get API Key**:
   - Go to [Cohere Console](https://dashboard.cohere.ai/)
   - Sign up and get your API key
   - Copy the API key

2. **Install Dependencies**:
   ```bash
   npm install cohere-ai
   ```

3. **Configure Environment**:
   ```bash
   # Add to your .env file
   COHERE_API_KEY=your-cohere-api-key-here
   ```

### Option 4: Hugging Face
**Cost**: Free tier available
**Features**: Open-source models, customizable

#### Setup Steps:
1. **Get API Key**:
   - Go to [Hugging Face](https://huggingface.co/settings/tokens)
   - Create an account and generate an API token
   - Copy the token

2. **Install Dependencies**:
   ```bash
   npm install @huggingface/inference
   ```

3. **Configure Environment**:
   ```bash
   # Add to your .env file
   HUGGINGFACE_API_KEY=your-huggingface-api-key-here
   ```

### Option 5: Local Models (Free)
**Cost**: Free (uses your hardware)
**Features**: Privacy-focused, no API limits

#### Setup Steps:
1. **Install Ollama**:
   - Download from [Ollama.ai](https://ollama.ai/)
   - Install and run locally

2. **Install Dependencies**:
   ```bash
   npm install ollama
   ```

3. **Configure Environment**:
   ```bash
   # Add to your .env file
   OLLAMA_BASE_URL=http://localhost:11434
   ```

## 🔧 Current Implementation

The platform now includes:

### ✅ **Unified AI Service** (`server/services/unifiedAIService.js`)
- Automatically detects available API keys
- Falls back gracefully when no AI is available
- Supports multiple AI providers

### ✅ **Google AI Service** (`server/services/googleAIService.js`)
- Full implementation with Gemini Pro
- All AI features supported
- Error handling and fallbacks

### ✅ **Features Available**:
- Message enhancement
- Sentiment analysis
- Tag suggestions
- Smart scheduling
- Message templates
- Career guidance (Google AI only)

## 🎯 Recommended Setup

**For immediate use**: Google AI (Gemini)
- Free tier available
- Excellent performance
- Easy setup
- All features supported

## 📝 Environment Variables

Update your `.env` file with your chosen API:

```bash
# Choose one or more AI providers:

# Google AI (Recommended)
GOOGLE_AI_API_KEY=your-google-ai-api-key-here

# OpenAI (if available)
OPENAI_API_KEY=your-openai-api-key-here

# Anthropic Claude
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# Cohere
COHERE_API_KEY=your-cohere-api-key-here

# Hugging Face
HUGGINGFACE_API_KEY=your-huggingface-api-key-here

# Local Ollama
OLLAMA_BASE_URL=http://localhost:11434
```

## 🚀 Getting Started

1. **Choose your AI provider** from the options above
2. **Get your API key** following the setup steps
3. **Add the API key** to your `.env` file
4. **Restart your server**:
   ```bash
   npm run dev
   ```

## 🔍 Testing AI Features

Once configured, you can test AI features in:
- Time Capsule message enhancement
- Career guidance recommendations
- Sentiment analysis
- Smart scheduling suggestions

## 💡 Tips

- **Start with Google AI**: It's free and works well
- **Keep fallbacks**: The system works even without AI
- **Monitor usage**: Most providers have rate limits
- **Local option**: Use Ollama for privacy-focused development

## 🆘 Troubleshooting

### "No AI API keys found"
- Check your `.env` file has the correct API key
- Restart the server after adding the key
- Verify the API key is valid

### "API rate limit exceeded"
- Check your provider's usage limits
- Consider upgrading your plan
- The system will use fallback responses

### "Connection errors"
- Check your internet connection
- Verify the API endpoint is accessible
- Try a different AI provider

## 📞 Support

If you need help setting up any AI provider, check their official documentation or contact their support teams.
