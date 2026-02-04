# Deployment Guide - Church Data Collection App

## Prerequisites

- Neon.tech account (free tier available)
- Render.com account (free tier available)
- Expo account (free)
- GitHub repository (optional but recommended)

---

## 1. Database Setup (Neon.tech)

### Step 1: Create Database

1. Go to [neon.tech](https://neon.tech) and sign up/login
2. Click "Create Project"
3. Choose a name (e.g., "church-members-db")
4. Select region closest to your users
5. Click "Create Project"

### Step 2: Get Connection String

1. In your project dashboard, click "Connection Details"
2. Copy the connection string (it looks like):
   ```
   postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```
3. Save this - you'll need it for backend deployment

### Step 3: Initialize Database

Option A: Use Drizzle Kit (Recommended)
```bash
cd backend
# Add DATABASE_URL to .env
npm run db:push
```

Option B: Manual SQL
1. Go to Neon SQL Editor
2. Run the following SQL:

```sql
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  dob VARCHAR(50),
  age INTEGER,
  gender VARCHAR(20),
  phone VARCHAR(50),
  address TEXT,
  baptized BOOLEAN,
  water_baptized BOOLEAN,
  holy_ghost_baptized BOOLEAN,
  presiding_elder VARCHAR(100),
  working BOOLEAN,
  occupation VARCHAR(100),
  marital_status VARCHAR(50),
  children_count INTEGER,
  ministry VARCHAR(100),
  joined_date VARCHAR(50),
  prayer_requests TEXT,
  metadata JSONB,
  sync_status VARCHAR(20) DEFAULT 'synced',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE form_schema (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version INTEGER NOT NULL DEFAULT 1,
  elements JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

---

## 2. Backend Deployment (Render)

### Step 1: Prepare Repository

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/church-app.git
git push -u origin main
```

### Step 2: Create Web Service

1. Go to [render.com](https://render.com) and login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `church-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Step 3: Add Environment Variables

In Render dashboard, add:
- `DATABASE_URL`: Your Neon connection string
- `JWT_SECRET`: Generate with `openssl rand -base64 32`
- `NODE_ENV`: `production`
- `PORT`: `5000` (Render will override this automatically)

### Step 4: Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Your backend URL will be: `https://church-backend-xxxx.onrender.com`
4. Test: Visit `https://your-url.onrender.com/health`

### Step 5: Create First Admin

```bash
curl -X POST https://your-backend-url.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@church.com","password":"YourSecurePassword123"}'
```

---

## 3. Mobile App Deployment (Expo)

### Step 1: Update API URL

Edit `mobile/src/services/api.js`:
```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5000/api' 
  : 'https://your-backend-url.onrender.com/api';
```

### Step 2: Configure Expo

```bash
cd mobile
npx expo login
```

### Step 3: Build for Android

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build APK (for testing)
eas build --platform android --profile preview

# Build AAB (for Google Play)
eas build --platform android --profile production
```

### Step 4: Build for iOS (Optional - requires Apple Developer account)

```bash
eas build --platform ios --profile production
```

### Step 5: Publish Update (OTA)

```bash
# Publish to Expo
npx expo publish

# Or use EAS Update
eas update --branch production
```

### Distribution Options

**Option A: Expo Go (Testing)**
- Users install Expo Go app
- Share your published URL
- Good for testing, not for production

**Option B: Standalone APK**
- Download APK from EAS build
- Share APK file directly
- Users install manually (Android only)

**Option C: App Stores**
- Submit AAB to Google Play Store
- Submit IPA to Apple App Store
- Follow respective store guidelines

---

## 4. Admin Dashboard Deployment

### Option A: Vercel (Recommended)

```bash
cd admin

# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Environment variables (add in Vercel dashboard):
- `VITE_API_URL`: `https://your-backend-url.onrender.com/api`

### Option B: Netlify

```bash
cd admin

# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

Environment variables (add in Netlify dashboard):
- `VITE_API_URL`: `https://your-backend-url.onrender.com/api`

### Option C: Render (Static Site)

1. Create new "Static Site" on Render
2. Connect repository
3. Set:
   - **Root Directory**: `admin`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Add environment variable: `VITE_API_URL`

---

## 5. Post-Deployment Checklist

### Backend
- [ ] Health check endpoint works
- [ ] Can create admin user
- [ ] Can login and get JWT token
- [ ] Database connection successful
- [ ] CORS configured for frontend domains

### Mobile
- [ ] App opens and shows splash screen
- [ ] Form loads correctly
- [ ] Can submit form offline
- [ ] Syncs when online
- [ ] API calls work with production backend

### Admin
- [ ] Can login with admin credentials
- [ ] Members list loads
- [ ] Analytics charts display
- [ ] CSV export works
- [ ] Can delete members

---

## 6. Monitoring & Maintenance

### Render
- Check logs: Dashboard → Logs
- Monitor usage: Dashboard → Metrics
- Free tier sleeps after 15 min inactivity (first request takes ~30s)

### Neon
- Monitor database size: Dashboard → Storage
- Free tier: 3GB storage, 100 hours compute/month
- Set up connection pooling for production

### Expo
- Monitor crashes: Expo dashboard
- Track updates: EAS Update dashboard
- Analytics: Expo Analytics (optional)

---

## 7. Scaling Considerations

### When to Upgrade

**Render Free → Paid ($7/month)**
- Backend sleeps too often
- Need faster response times
- More than 100 members

**Neon Free → Pro ($19/month)**
- Database > 3GB
- Need more compute hours
- Want automatic backups

### Performance Tips

1. **Backend**
   - Add Redis caching
   - Enable connection pooling
   - Use CDN for static assets

2. **Mobile**
   - Optimize images
   - Lazy load components
   - Batch sync operations

3. **Database**
   - Add indexes on frequently queried fields
   - Archive old data
   - Regular VACUUM

---

## 8. Troubleshooting

### Backend won't start
- Check Render logs
- Verify DATABASE_URL is correct
- Ensure all dependencies installed

### Mobile can't connect
- Check API_BASE_URL in code
- Verify backend is running
- Check CORS settings

### Database connection fails
- Verify connection string
- Check Neon project is active
- Ensure SSL mode is enabled

### Admin login fails
- Verify admin user exists in database
- Check JWT_SECRET matches
- Clear browser localStorage

---

## 9. Security Best Practices

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS only
- [ ] Set up rate limiting
- [ ] Regular database backups
- [ ] Monitor for suspicious activity
- [ ] Keep dependencies updated

---

## Support

For deployment issues:
1. Check Render/Neon/Expo documentation
2. Review application logs
3. Test locally first
4. Contact support if needed
