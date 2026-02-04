# Church Data Collection App

A production-ready, offline-first mobile application for church member data collection with a comprehensive admin dashboard.

## 🏗️ Project Structure

```
moore/
├── backend/          # Node.js + Express API
├── mobile/           # React Native + Expo mobile app
└── admin/            # React admin dashboard
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- Neon.tech Postgres database account
- Render.com account (for deployment)

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your Neon database URL
# DATABASE_URL=postgresql://user:password@host/database?sslmode=require
# JWT_SECRET=your-secret-key

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Mobile App Setup

```bash
cd mobile

# Install dependencies
npm install

# Update API URL in src/services/api.js if needed

# Start Expo development server
npx expo start

# Scan QR code with Expo Go app (iOS/Android)
# Or press 'w' for web, 'a' for Android emulator, 'i' for iOS simulator
```

### 3. Admin Dashboard Setup

```bash
cd admin

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

The admin dashboard will run on `http://localhost:5173`

## 📱 Mobile App Features

- **Splash Screen**: Displays church logo on app launch
- **Dynamic Form**: Renders based on server-defined schema
- **Offline Storage**: SQLite database for local data persistence
- **Auto-Sync**: Automatically syncs when internet connection is available
- **Conditional Fields**: Shows/hides fields based on user input
- **Validation**: Required field validation before submission

## 🖥️ Admin Dashboard Features

- **Secure Login**: JWT-based authentication
- **Member Management**: View, search, filter, and delete members
- **CSV Export**: Export member data to CSV
- **Analytics**: Visual charts for:
  - Gender distribution
  - Baptism statistics
  - Ministry distribution
  - Age distribution
- **Form Builder**: (Placeholder - ready for implementation)

## 🗄️ Database Schema

### Members Table
- Personal info: firstName, lastName, dob, age, gender
- Contact: phone, address
- Church info: baptized, waterBaptized, holyGhostBaptized, presidingElder
- Work: working, occupation
- Family: maritalStatus, childrenCount
- Ministry: ministry, joinedDate, prayerRequests
- Metadata: JSONB for dynamic fields
- Sync: syncStatus, createdAt, updatedAt

### Admins Table
- id, email, passwordHash, createdAt

### Form Schema Table
- id, version, elements (JSONB), isActive, createdAt

## 🔐 Security

- JWT authentication for admin routes
- Password hashing with bcrypt
- HTTPS required in production
- CORS configured
- SQL injection protection via parameterized queries

## 📦 Deployment

### Backend (Render)

1. Create new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables:
   - `DATABASE_URL` (from Neon.tech)
   - `JWT_SECRET` (generate a secure random string)
   - `NODE_ENV=production`

### Mobile App (Expo)

```bash
cd mobile

# Build for Android
eas build --platform android

# Build for iOS (requires Apple Developer account)
eas build --platform ios

# Or publish to Expo Go
npx expo publish
```

### Admin Dashboard (Vercel/Netlify)

```bash
cd admin

# Build for production
npm run build

# Deploy to Vercel
vercel deploy

# Or deploy to Netlify
netlify deploy --prod
```

## 🔧 Configuration

### Backend Environment Variables
```env
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### Mobile App
Update `src/services/api.js`:
```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5000/api' 
  : 'https://your-app.onrender.com/api';
```

### Admin Dashboard
Update `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Testing

### Create First Admin User

```bash
# Using curl or Postman
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "admin@church.com",
  "password": "SecurePassword123"
}
```

### Test Mobile Offline Mode

1. Open mobile app
2. Turn off WiFi/mobile data
3. Fill and submit form
4. Check "pending sync" indicator
5. Turn on internet
6. Watch auto-sync happen

## 📚 API Endpoints

### Public
- `GET /health` - Health check
- `GET /api/schema` - Get form schema

### Auth
- `POST /api/auth/register` - Register admin
- `POST /api/auth/login` - Login admin

### Members (Admin only)
- `GET /api/members` - List all members
- `POST /api/members` - Create member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Sync
- `POST /api/sync` - Bulk sync from mobile

### Schema (Admin only)
- `POST /api/schema` - Update form schema

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- Drizzle ORM
- PostgreSQL (Neon.tech)
- JWT authentication
- bcryptjs

**Mobile:**
- React Native
- Expo SDK 54
- expo-sqlite
- React Navigation
- NetInfo
- AsyncStorage

**Admin:**
- React 18
- Vite
- React Router
- Recharts
- Axios

## 📄 License

MIT

## 👥 Support

For issues or questions, please contact the development team.
