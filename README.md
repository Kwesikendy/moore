# Church Data Collection App

🔗 **GitHub Repository:** https://github.com/Kwesikendy/moore.git

## 📦 Project Summary

A complete, production-ready church data collection system with:
- **Backend API** (Node.js + Express + Neon Postgres)
- **Mobile App** (React Native + Expo with offline-first architecture)
- **Admin Dashboard** (React + Vite with analytics)

## ✅ What's Included

### Backend (`/backend`)
- REST API with JWT authentication
- Neon.tech PostgreSQL database (connected and ready)
- Member CRUD operations
- Bulk sync endpoint for mobile
- Dynamic form schema management

### Mobile App (`/mobile`)
- Church logo splash screen
- Dynamic member registration form
- SQLite offline storage
- Automatic sync when online
- Network status detection
- Conditional field logic

### Admin Dashboard (`/admin`)
- Secure login system
- Member management (view, search, filter, delete)
- CSV export functionality
- Analytics with charts (gender, baptism, ministry, age)
- Form builder placeholder (ready for implementation)

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/Kwesikendy/moore.git
cd moore
```

### 2. Backend Setup
```bash
cd backend
npm install
# Database is already connected to Neon
npm run dev
```

### 3. Mobile App
```bash
cd mobile
npm install
npx expo start
```

### 4. Admin Dashboard
```bash
cd admin
npm install
npm run dev
```

## 🔑 Admin Credentials

**Email:** admin@church.com  
**Password:** ChurchAdmin2026

## 📚 Documentation

- **[README.md](README.md)** - Full setup guide
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment steps
- **[QUICKSTART.md](QUICKSTART.md)** - Quick testing guide

## 🗄️ Database

**Provider:** Neon.tech (Serverless Postgres)  
**Status:** ✅ Connected and schema created  
**Tables:** admins, members, form_schema

## 🎯 Key Features

✅ Offline-first mobile architecture  
✅ Automatic data synchronization  
✅ Dynamic form system  
✅ Real-time analytics  
✅ CSV export  
✅ Secure authentication  
✅ Production-ready code  

## 📱 Tech Stack

- **Backend:** Node.js, Express, Drizzle ORM, PostgreSQL
- **Mobile:** React Native, Expo, SQLite
- **Admin:** React, Vite, Recharts
- **Database:** Neon.tech

## 🚢 Deployment

Ready to deploy to:
- **Backend:** Render.com
- **Mobile:** Expo EAS / App Stores
- **Admin:** Vercel / Netlify

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

---

**Built with ❤️ for Church of Pentecost - Moore District**
