# 🚀 Deployment Guide - NextGen Engineer AI

## Cloud Services Setup

### 1. Database: MongoDB Atlas
**Best choice for your project**

**Setup Steps:**
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free account
3. Create new cluster (M0 Free tier)
4. Create database user
5. Get connection string
6. Add to `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nextgen-engineer-ai
```

**Benefits:**
- ✅ Free tier: 512MB storage
- ✅ Auto-scaling
- ✅ Built-in security
- ✅ Real-time monitoring
- ✅ Automated backups

### 2. File Storage: Cloudinary
**Best for images, videos, documents**

**Setup Steps:**
1. Go to [cloudinary.com](https://cloudinary.com)
2. Create free account
3. Get credentials from dashboard
4. Add to `.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Benefits:**
- ✅ Free tier: 25GB storage, 25GB bandwidth/month
- ✅ Image optimization & transformation
- ✅ Video support
- ✅ Global CDN
- ✅ AI features (auto-tagging)

### 3. Hosting Options

#### Frontend: Vercel (Recommended)
**Setup:**
1. Go to [vercel.com](https://vercel.com)
2. Connect GitHub repository
3. Deploy automatically

**Benefits:**
- ✅ Free tier: Unlimited deployments
- ✅ Global CDN
- ✅ Auto-deploy from Git
- ✅ Custom domains with SSL

#### Backend: Railway or Render
**Railway (Recommended):**
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repository
3. Set environment variables
4. Deploy

**Benefits:**
- ✅ $5/month (reasonable pricing)
- ✅ Easy deployment
- ✅ Auto-scaling
- ✅ Database hosting included

**Render (Alternative):**
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect repository
4. Set environment variables

### 4. Environment Variables

Create `.env` file in root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nextgen-engineer-ai

# JWT Secret (generate strong secret)
JWT_SECRET=your-super-secret-jwt-key-here

# OpenAI API (for AI features)
OPENAI_API_KEY=your-openai-api-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Client URL (production)
CLIENT_URL=https://your-domain.vercel.app
```

## Deployment Steps

### 1. Prepare Your Code
```bash
# Build frontend
cd client
npm run build

# Test backend
cd ..
npm test
```

### 2. Deploy Backend (Railway)
1. Push code to GitHub
2. Connect repository to Railway
3. Set environment variables
4. Deploy

### 3. Deploy Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set build command: `cd client && npm install && npm run build`
3. Set output directory: `client/build`
4. Set environment variables
5. Deploy

### 4. Update Frontend API URL
In `client/src/services/api.js`:
```javascript
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://your-backend.railway.app/api',
  timeout: 10000,
});
```

## Cost Estimation (Monthly)

| Service | Plan | Cost |
|---------|------|------|
| MongoDB Atlas | Free Tier | $0 |
| Cloudinary | Free Tier | $0 |
| Vercel | Free Tier | $0 |
| Railway | Starter | $5 |
| **Total** | | **$5/month** |

## Alternative Free Options

### Backend Hosting (Free):
- **Render**: Free tier available
- **Heroku**: Free tier (limited)
- **Railway**: $5/month (recommended)

### Database (Free):
- **MongoDB Atlas**: Free tier (recommended)
- **Supabase**: Free tier (PostgreSQL)
- **PlanetScale**: Free tier (MySQL)

### File Storage (Free):
- **Cloudinary**: Free tier (recommended)
- **AWS S3**: Free tier (12 months)
- **Firebase Storage**: Free tier

## Security Checklist

- [ ] Use strong JWT secrets
- [ ] Enable CORS properly
- [ ] Validate all inputs
- [ ] Use HTTPS in production
- [ ] Set up proper error handling
- [ ] Enable rate limiting
- [ ] Use environment variables
- [ ] Regular security updates

## Monitoring & Analytics

### Free Tools:
- **MongoDB Atlas**: Built-in monitoring
- **Vercel Analytics**: Performance insights
- **Sentry**: Error tracking (free tier)
- **Google Analytics**: User analytics

## Next Steps

1. Set up MongoDB Atlas
2. Configure Cloudinary
3. Deploy backend to Railway
4. Deploy frontend to Vercel
5. Set up custom domain
6. Configure monitoring
7. Set up CI/CD pipeline

## Support

- MongoDB Atlas: [docs.mongodb.com](https://docs.mongodb.com)
- Cloudinary: [cloudinary.com/documentation](https://cloudinary.com/documentation)
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Railway: [docs.railway.app](https://docs.railway.app)
