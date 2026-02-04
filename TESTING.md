# Testing Guide - Church Data Collection App

## ✅ Prerequisites Check

Your backend `.env` file is already configured with:
- Neon database connection ✅
- JWT secret ✅
- Port 5000 ✅

## 🧪 Testing Steps

### 1️⃣ Test Backend (You're here now!)

In your current terminal (`D:\moore\backend`):

```cmd
npm run dev
```

**Expected Output:**
```
🚀 Server running on port 5000
📍 Environment: development
```

**Test the API:**
Open a new terminal and run:
```cmd
curl http://localhost:5000/health
```

Or open browser: http://localhost:5000/health

**Expected Response:**
```json
{"status":"ok","timestamp":"..."}
```

---

### 2️⃣ Create Admin User (if not already created)

Open a **new PowerShell window** and run:

```powershell
Invoke-WebRequest -Uri http://localhost:5000/api/auth/register -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"admin@church.com","password":"ChurchAdmin2026"}'
```

**Expected Response:**
```json
{
  "message": "Admin created successfully",
  "admin": {
    "id": "...",
    "email": "admin@church.com"
  }
}
```

If you get "Admin already exists" - that's fine, it means it's already created! ✅

---

### 3️⃣ Test Mobile App

Open a **new terminal**:

```cmd
cd D:\moore\mobile
npm install
npx expo start
```

**What to expect:**
1. QR code appears in terminal
2. Scan with **Expo Go** app on your phone (download from App Store/Play Store)
3. App opens showing **Church logo splash screen** for 3 seconds
4. Then shows the **member registration form**

**Test offline mode:**
1. Fill out the form
2. Turn off WiFi on your phone
3. Submit the form
4. Should show "Saved offline" message
5. Turn WiFi back on
6. Should auto-sync within 2 seconds

---

### 4️⃣ Test Admin Dashboard

Open a **new terminal**:

```cmd
cd D:\moore\admin
npm install
npm run dev
```

**Expected Output:**
```
VITE v... ready in ...ms
➜  Local:   http://localhost:5173/
```

**Open browser:** http://localhost:5173

**Login with:**
- Email: `admin@church.com`
- Password: `ChurchAdmin2026`

**Test features:**
1. ✅ View members list
2. ✅ Search for a member
3. ✅ Filter by gender
4. ✅ Click "Analytics" tab to see charts
5. ✅ Click "Export to CSV" button

---

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is already in use
- Verify `.env` file exists in `backend` folder
- Run `npm install` again

### Mobile app error
- Make sure backend is running on port 5000
- Check that you're on the same WiFi network (if testing on phone)
- Try `npx expo start --tunnel` for remote testing

### Admin dashboard can't login
- Verify backend is running
- Check browser console for errors (F12)
- Make sure admin user was created successfully

### Database connection error
- Verify Neon database is active
- Check connection string in `.env`
- Test connection: `npm run db:push` in backend folder

---

## 📊 Success Criteria

### Backend ✅
- [ ] Server starts without errors
- [ ] Health endpoint returns 200 OK
- [ ] Admin user created successfully

### Mobile ✅
- [ ] App opens with church logo
- [ ] Form displays all fields
- [ ] Can submit form offline
- [ ] Auto-syncs when online
- [ ] Shows pending count

### Admin ✅
- [ ] Can login successfully
- [ ] Members list displays
- [ ] Search/filter works
- [ ] Analytics charts show
- [ ] CSV export downloads

---

## 🎯 Quick Test Scenario

**End-to-End Test:**

1. **Backend running** ✅
2. **Mobile:** Fill form with test data:
   - First Name: John
   - Last Name: Doe
   - Gender: Male
   - Phone: 0123456789
   - Baptized: Yes
3. **Submit** (should sync immediately if online)
4. **Admin:** Login and verify "John Doe" appears in members list
5. **Admin:** Check analytics - should show 1 male member
6. **Admin:** Export CSV - should download with John Doe's data

---

## 🔗 Useful Links

- Backend API: http://localhost:5000
- Admin Dashboard: http://localhost:5173
- GitHub Repo: https://github.com/Kwesikendy/moore.git

---

## 💡 Next Steps After Testing

1. Deploy backend to Render (see DEPLOYMENT.md)
2. Build mobile app for production (EAS Build)
3. Deploy admin to Vercel/Netlify
4. Share APK with church members

---

**Need help?** Check the full documentation in:
- `README.md` - Setup guide
- `DEPLOYMENT.md` - Production deployment
- `walkthrough.md` - Implementation details
