# 🚀 Deployment Guide for NextGen Engineer AI

## Overview
This guide covers deploying your NextGen Engineer AI application to both Vercel and Render with continuous deployment.

## 📋 Prerequisites

### 1. Google AI API Key Setup
```bash
# Get your API key from Google AI Studio
# https://makersuite.google.com/app/apikey

# Add to your .env file
GOOGLE_AI_API_KEY=your-actual-api-key-here
```

### 2. MongoDB Atlas Setup
- Create a free MongoDB Atlas cluster
- Get your connection string
- Add to environment variables

### 3. Other Required Services
- Cloudinary (for file uploads)
- Email service (Gmail SMTP)

## 🎯 Deployment Options

### Option 1: Vercel (Recommended)

#### **Advantages:**
- ✅ Automatic deployments on git push
- ✅ Excellent performance
- ✅ Easy environment variable management
- ✅ Free tier available

#### **Setup Steps:**

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Set Environment Variables:**
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   vercel env add GOOGLE_AI_API_KEY
   vercel env add CLOUDINARY_CLOUD_NAME
   vercel env add CLOUDINARY_API_KEY
   vercel env add CLOUDINARY_API_SECRET
   vercel env add EMAIL_HOST
   vercel env add EMAIL_PORT
   vercel env add EMAIL_USER
   vercel env add EMAIL_PASS
   ```

5. **Connect to GitHub:**
   - Go to Vercel Dashboard
   - Import your GitHub repository
   - Enable automatic deployments

#### **Continuous Deployment:**
- Every push to `main` branch triggers deployment
- Preview deployments for pull requests
- Automatic rollback on failure

### Option 2: Render

#### **Advantages:**
- ✅ Free tier available
- ✅ Easy setup with render.yaml
- ✅ Automatic deployments
- ✅ Good for full-stack apps

#### **Setup Steps:**

1. **Create Render Account:**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Deploy Backend:**
   - Click "New Web Service"
   - Connect your GitHub repo
   - Set build command: `npm install`
   - Set start command: `npm run server`
   - Add environment variables

3. **Deploy Frontend:**
   - Click "New Static Site"
   - Connect your GitHub repo
   - Set build command: `cd client && npm install && npm run build`
   - Set publish directory: `client/build`

4. **Environment Variables:**
   ```bash
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your-mongodb-atlas-uri
   JWT_SECRET=your-jwt-secret
   GOOGLE_AI_API_KEY=your-google-ai-key
   # ... other variables
   ```

#### **Continuous Deployment:**
- Automatic deployments on git push
- Manual deployments available
- Environment variable management in dashboard

## 🔧 Environment Variables

### **Required Variables:**
```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nextgen-engineer-ai

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# AI Services
GOOGLE_AI_API_KEY=your-google-ai-api-key
OPENAI_API_KEY=your-openai-api-key (optional)

# File Upload
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 🧪 Testing Before Deployment

1. **Test Google AI API:**
   ```bash
   node test-google-ai.js
   ```

2. **Test Local Build:**
   ```bash
   # Backend
   npm run server
   
   # Frontend
   cd client && npm run build
   ```

3. **Test Environment Variables:**
   ```bash
   npm run dev
   ```

## 📊 Monitoring & Maintenance

### **Vercel:**
- Dashboard: [vercel.com/dashboard](https://vercel.com/dashboard)
- Function logs in dashboard
- Performance analytics
- Error tracking

### **Render:**
- Dashboard: [render.com/dashboard](https://render.com/dashboard)
- Service logs in dashboard
- Uptime monitoring
- Resource usage

## 🔄 Continuous Deployment Workflow

### **Development Workflow:**
1. Make changes locally
2. Test with `npm run dev`
3. Commit and push to GitHub
4. Automatic deployment triggers
5. Verify deployment in dashboard

### **Production Workflow:**
1. Create feature branch
2. Make changes and test
3. Create pull request
4. Review and merge to main
5. Automatic production deployment

## 🆘 Troubleshooting

### **Common Issues:**

1. **Build Failures:**
   - Check build logs in dashboard
   - Verify all dependencies are installed
   - Check for syntax errors

2. **Environment Variables:**
   - Verify all required variables are set
   - Check variable names match exactly
   - Restart service after adding variables

3. **API Errors:**
   - Test API endpoints locally first
   - Check CORS settings
   - Verify API keys are valid

4. **Database Connection:**
   - Check MongoDB Atlas network access
   - Verify connection string format
   - Check database user permissions

### **Debug Commands:**
```bash
# Test API locally
curl http://localhost:3001/api/health

# Test Google AI
node test-google-ai.js

# Check environment
echo $GOOGLE_AI_API_KEY

# View logs
vercel logs
# or
# Check Render dashboard logs
```

## 📈 Performance Optimization

### **Vercel:**
- Use Edge Functions for better performance
- Optimize bundle size
- Enable caching headers

### **Render:**
- Use appropriate instance types
- Optimize database queries
- Enable CDN for static assets

## 🔐 Security Best Practices

1. **Environment Variables:**
   - Never commit secrets to git
   - Use different keys for dev/prod
   - Rotate keys regularly

2. **API Security:**
   - Use HTTPS in production
   - Implement rate limiting
   - Validate all inputs

3. **Database Security:**
   - Use strong passwords
   - Enable network access controls
   - Regular backups

## 📞 Support

- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **Render Support:** [render.com/docs](https://render.com/docs)
- **Google AI Support:** [ai.google.dev/support](https://ai.google.dev/support)

## 🎉 Success Checklist

- [ ] Google AI API key configured and tested
- [ ] MongoDB Atlas cluster set up
- [ ] Environment variables configured
- [ ] Local testing completed
- [ ] Deployment successful
- [ ] Production testing completed
- [ ] Monitoring set up
- [ ] Documentation updated
