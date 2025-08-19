# 🏠 Local Development Setup Guide

## MongoDB Local Configuration

### 1. MongoDB is Already Running! ✅
I can see from your MongoDB Compass that you have:
- **Local MongoDB**: Running on `mongodb://localhost:27017/`
- **Database**: `nextgen-engineer-ai` (65.54 kB, 8 collections, 35 indexes)
- **Collections**: Already populated with data

### 2. Environment Configuration

Create a `.env` file in your root directory with:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Local MongoDB (for development)
MONGODB_URI_LOCAL=mongodb://localhost:27017/nextgen-engineer-ai

# Cloud MongoDB (for production - keep for later)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nextgen-engineer-ai

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production

# OpenAI API (for AI features)
OPENAI_API_KEY=your-openai-api-key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dexpeumwb
CLOUDINARY_API_KEY=276967877948691
CLOUDINARY_API_SECRET=VA2KcA9TZ4roQD-4J8VvpTcl9T0

# Email Service (optional for development)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Client URL
CLIENT_URL=http://localhost:3000
```

## 🗄️ MongoDB Compass Usage

### View Your Data
1. **Connect**: `mongodb://localhost:27017/`
2. **Database**: `nextgen-engineer-ai`
3. **Collections**: You can see all your data here

### Useful Compass Features:
- **Browse Documents**: View and edit data
- **Create Collections**: Add new collections
- **Index Management**: View and create indexes
- **Aggregation Pipeline**: Run complex queries
- **Export/Import**: Backup and restore data

### Database Migration (When Ready for Production)
When you want to deploy to production:

1. **Export from Local**:
   ```bash
   # Export your local database
   mongodump --db nextgen-engineer-ai --out ./backup
   ```

2. **Import to Atlas**:
   ```bash
   # Import to MongoDB Atlas
   mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/" ./backup/nextgen-engineer-ai
   ```

## ☁️ Cloudinary Setup

### Your Cloudinary Account:
- **Cloud Name**: `dexpeumwb`
- **API Key**: `276967877948691`
- **API Secret**: `VA2KcA9TZ4roQD-4J8VvpTcl9T0`

### Features Available:
- ✅ **Image Upload**: Profile pictures, project images
- ✅ **Video Upload**: Tutorial videos, demos
- ✅ **Document Upload**: PDFs, presentations
- ✅ **Auto-optimization**: Automatic format and quality optimization
- ✅ **Transformations**: Resize, crop, filters
- ✅ **CDN**: Global content delivery

### Usage Examples:
```javascript
// Upload image
const result = await uploadImage(file, {
  public_id: 'user-profile-123',
  transformation: [
    { width: 300, height: 300, crop: 'fill' }
  ]
});

// Get optimized URL
const optimizedUrl = optimizeImage('user-profile-123', {
  width: 150,
  height: 150,
  crop: 'thumb'
});
```

## 🚀 Running Your Application

### 1. Start Backend (Local MongoDB):
```bash
npm run server
```

### 2. Start Frontend:
```bash
npm run client
```

### 3. Access Your App:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB Compass**: View data at `mongodb://localhost:27017/`

## 📊 Database Collections

Your `nextgen-engineer-ai` database contains:
- **Users**: User accounts and profiles
- **CareerRoles**: Career information (from our recent setup)
- **Projects**: User projects and portfolios
- **Messages**: Chat and communication data
- **TimeCapsules**: Future message scheduling
- **Todos**: Task management
- **And more...**

## 🔄 Development Workflow

### Local Development:
1. Use local MongoDB (`mongodb://localhost:27017/nextgen-engineer-ai`)
2. Use Cloudinary for file uploads
3. Test all features locally

### Production Deployment:
1. Switch to MongoDB Atlas
2. Use same Cloudinary account
3. Deploy to Vercel + Railway

## 🛠️ Troubleshooting

### MongoDB Connection Issues:
```bash
# Check if MongoDB is running
net start MongoDB

# Or start manually
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
```

### Port Issues:
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Cloudinary Issues:
- Check your credentials in `.env`
- Verify your Cloudinary account is active
- Check upload limits (25GB free tier)

## 📈 Next Steps

1. **Test Local Setup**: Ensure everything works with local MongoDB
2. **Add More Features**: Continue building your platform
3. **Data Migration**: When ready, migrate to Atlas
4. **Deploy**: Use the deployment guide for production

## 💡 Benefits of Local Development

- ✅ **No Internet Required**: Work offline
- ✅ **Fast Development**: No network latency
- ✅ **Free**: No usage limits
- ✅ **Full Control**: Direct database access
- ✅ **Easy Testing**: Reset data anytime
- ✅ **MongoDB Compass**: Visual database management

Your local setup is perfect for development! You can build and test everything locally, then easily migrate to cloud services when ready for production.
