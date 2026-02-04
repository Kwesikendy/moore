# 🧪 Admin Dashboard Testing Guide

## Prerequisites
✅ Backend running on port 5000
✅ Admin dashboard running on port 5173
✅ At least one member registered from mobile app

---

## Test 1: Login to Admin Dashboard

1. Open browser on your computer
2. Go to: **http://localhost:5173**
3. You should see a login page with blue gradient
4. Enter:
   - Email: `admin@church.com`
   - Password: `ChurchAdmin2026`
5. Click "Login"

**Expected Result:** ✅ You should be redirected to the dashboard with 3 tabs

---

## Test 2: View Members

1. You should be on the "Members" tab by default
2. Look for the member count at the top: "All Members (X)"
3. You should see a table with columns:
   - First Name
   - Last Name
   - Gender
   - Phone
   - Baptized
   - Working
   - Actions (Delete button)

**Expected Result:** ✅ If you submitted a member from the mobile app, you should see it here!

---

## Test 3: Search Members

1. In the search box at the top, type a member's name
2. The table should filter to show only matching members

**Expected Result:** ✅ Table updates in real-time as you type

---

## Test 4: Filter by Gender

1. Click the "Filter by Gender" dropdown
2. Select "Male" or "Female"
3. Table should show only members of that gender

**Expected Result:** ✅ Table filters correctly

---

## Test 5: Export to CSV

1. Click the "Export to CSV" button (top right)
2. A CSV file should download

**Expected Result:** ✅ File downloads with name like `church_members_2026-02-04.csv`

---

## Test 6: View Analytics

1. Click the "Analytics" tab
2. You should see:
   - 4 stat cards at the top (Total Members, Baptized, Working, Married)
   - 4 charts below:
     - Gender Distribution (Pie Chart)
     - Baptism Statistics (Bar Chart)
     - Ministry Distribution (Bar Chart)
     - Age Distribution (Bar Chart)

**Expected Result:** ✅ All charts display with your member data

---

## Test 7: Delete a Member

1. Go back to "Members" tab
2. Click the red "Delete" button next to a member
3. Confirm the deletion in the popup

**Expected Result:** ✅ Member is removed from the table

---

## Test 8: Logout

1. Click the "Logout" button (top right)
2. You should be redirected back to the login page

**Expected Result:** ✅ You're logged out and can't access dashboard without logging in again

---

## 🔄 Full System Test (Mobile + Admin)

### Part 1: Register on Mobile
1. Open mobile app on your phone
2. Fill out the member registration form
3. Submit the form
4. Click "Sync Now" if you see pending count
5. Wait for success message

### Part 2: View on Admin Dashboard
1. Go to admin dashboard in browser
2. Click "Members" tab
3. **Refresh the page** (F5 or Ctrl+R)
4. Look for the newly registered member

**Expected Result:** ✅ The member you just registered on mobile appears in the admin dashboard!

### Part 3: Check Analytics
1. Click "Analytics" tab
2. Charts should update with the new member's data

**Expected Result:** ✅ Charts reflect the new member (gender count increases, etc.)

---

## 🐛 Troubleshooting

### Can't access http://localhost:5173
- Check if admin dev server is running
- Look for "Local: http://localhost:5173/" in the terminal
- Restart with: `cd admin` then `npm run dev`

### Login fails
- Make sure backend is running on port 5000
- Check browser console (F12) for errors
- Verify credentials are correct

### No members showing
- Make sure you've synced from mobile app
- Check backend is running
- Try refreshing the page

### Charts not showing
- Make sure you have at least one member registered
- Check browser console for errors
- Refresh the page

---

## ✅ Success Criteria

- [x] Can login to admin dashboard
- [x] Can see members list
- [x] Can search and filter members
- [x] Can export to CSV
- [x] Can view analytics charts
- [x] Can delete members
- [x] Can logout
- [x] Members from mobile app appear in dashboard

---

**If all tests pass, your admin dashboard is working perfectly!** 🎉
