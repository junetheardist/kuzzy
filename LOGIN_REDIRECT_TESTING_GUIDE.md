# Login Redirect Loop - Testing Guide

## Quick Test (5 minutes)

### Prerequisites
- Development server stopped
- Browser closed (to clear cache)

### Step 1: Restart Server
```bash
# In terminal, stop current server with Ctrl+C
# Then restart:
npm run dev
```

Wait for server to fully start (~30 seconds)

### Step 2: Clear Browser Cache
1. Open browser
2. Go to http://localhost:3000
3. Open DevTools (F12)
4. Right-click the reload button in top-left
5. Select "Empty cache and hard reload"
6. Wait for page to reload

### Step 3: Test Login Flow
1. **Go to login page:** http://localhost:3000/login
2. **Enter test credentials:**
   - Email: `test@example.com` (or your registered email)
   - Password: (your test password)
3. **Click "Login"**
4. **Expected Result:**
   - ✅ Redirect to home/dashboard page
   - ✅ NOT redirected back to login
   - ✅ Navbar shows logged-in state
   - ✅ Can navigate to protected pages

### Step 4: Verify Redux State (Optional - requires Redux DevTools extension)
1. Open DevTools → Redux tab (if installed)
2. Look for auth state:
   - `auth.userId` → Should be populated ✓
   - `auth.token` → Should be populated ✓
   - `auth.user.id` → Should be populated ✓
   - `auth.isVerified` → Should be `true` ✓

### Step 5: Test OTP Verification (Alternative)
1. Go to http://localhost:3000/register
2. Register with new email and password
3. Confirm registration
4. Get OTP from email
5. Enter OTP in verification form
6. Click "Verify"
7. **Expected Result:**
   - ✅ Should show success message
   - ✅ NOT redirected back to /verify-otp
   - ✅ Can access dashboard

---

## Detailed Test Cases

### Test Case 1: Fresh Login
**Objective:** Verify login doesn't redirect back to login page

**Steps:**
1. Close all browser tabs and clear cache
2. Go to http://localhost:3000/login
3. Enter valid credentials
4. Click "Login"

**Expected Result:**
- ✅ See dashboard/home page
- ✅ URL shows http://localhost:3000/ (not /login)
- ✅ Navbar shows user is logged in

**If FAILS:**
- ❌ Redirects back to /login
- ❌ Shows infinite redirect in console
- Contact support - likely Redis or auth state issue

---

### Test Case 2: Login Then Logout + Login
**Objective:** Verify multiple login cycles work

**Steps:**
1. Login successfully (Test Case 1)
2. Find logout button and click it
3. Confirm you're back at login page
4. Login again with same credentials

**Expected Result:**
- ✅ First login works
- ✅ Logout clears auth state
- ✅ Second login also works
- ✅ No redirect loops

---

### Test Case 3: Protected Route Access After Login
**Objective:** Verify protected pages are accessible after login

**Steps:**
1. Login successfully
2. Navigate to protected routes (e.g., /features/vendors, /features/inventory)
3. Try accessing different sections of app

**Expected Result:**
- ✅ Can access all protected pages without redirect
- ✅ No redirect loops on any page
- ✅ Navbar remains visible

---

### Test Case 4: Protected Route Access Without Login
**Objective:** Verify unauthenticated users still get redirected to login

**Steps:**
1. Make sure you're logged out
2. Try to access protected route directly
3. E.g., http://localhost:3000/features/vendors

**Expected Result:**
- ✅ Redirected to http://localhost:3000/login
- ✅ Single redirect (not loop)
- ✅ Clear error/message about login required

---

### Test Case 5: Registration + Verification Flow
**Objective:** Verify new users can register and verify email without redirect issues

**Steps:**
1. Go to http://localhost:3000/register
2. Enter new email and password
3. Click "Register"
4. Check email for OTP
5. Enter OTP in /verify-otp form
6. Click "Verify"

**Expected Result:**
- ✅ Can see verification form
- ✅ After verification, not redirected back to /verify-otp
- ✅ Redirected to /login or home page
- ✅ Account is now verified

---

## Browser Console Checks

### Open DevTools (F12) and check:

**1. No Redirect Loops in Console**
- Look for repeated redirect messages
- ✅ Should see normal page loads
- ❌ If seeing many redirects = redirect loop

**2. Check Network Tab**
- Click login
- Watch network requests
- ✅ Should see one /login POST request
- ✅ Then redirect to home
- ❌ If seeing multiple redirects = loop issue

**3. Check Redux State (if extension installed)**
- After login, Redux tab should show:
  - `auth.userId` = user ID string (not null)
  - `auth.token` = JWT token string
  - `auth.user` = {id, email} object
  - `auth.isVerified` = true

---

## Troubleshooting

### Issue: Still seeing redirect to login after login

**Possible causes:**
1. **Server not restarted** → Restart with Ctrl+C and `npm run dev`
2. **Cache not cleared** → Clear with DevTools hard reload
3. **Redux not updated** → Check Redux state in DevTools
4. **Old cookies** → Clear all cookies for localhost

**What to try:**
```bash
# Full restart sequence:
Ctrl+C                          # Stop server
npm run dev                     # Restart server
# Then in browser:
# F12 → Clear site data → Hard reload (Ctrl+Shift+R)
```

### Issue: userId is still null in Redux

**Possible causes:**
1. **Changes not loaded** → Restart server
2. **API not returning user** → Check `/api/auth/login` response
3. **Redux reducer not updated** → Check authSlice.ts file

**What to try:**
```bash
# Check if files were updated:
grep -n "state.userId = action.payload.user?.id" redux/authSlice.ts
# Should find 2 matches (login and verify-otp)
```

### Issue: Redirect loop in console

**Symptoms:**
- Console shows many GET requests to /
- Page is stuck reloading
- Can't interact with page

**What to try:**
1. Stop server (Ctrl+C)
2. Check if you restarted after fixes
3. Check Redux state - userId should be set
4. If still looping, check GlobalAuthProvider logic

---

## Success Checklist

After fix is working, verify:

- [ ] Can login without redirect to /login
- [ ] Stay on home/dashboard after login
- [ ] Can navigate protected pages
- [ ] Redux shows userId populated
- [ ] Logout works and clears userId
- [ ] Can login again after logout
- [ ] No redirect loops in console
- [ ] No multiple network requests on single action
- [ ] OTP verification doesn't redirect to /verify-otp
- [ ] Mobile view also works (if responsive design)

---

## Performance Notes

The fix should result in:
- ✅ Single redirect on login (instead of loop)
- ✅ No unnecessary network requests
- ✅ Smooth navigation between pages
- ✅ No UI jank or page flashing

If you see multiple redirects or page flashing:
1. Check Redux state
2. Verify server restarted
3. Check browser cache (should be cleared)

---

## Rollback (If Needed)

If something breaks after applying fix:

```bash
git diff redux/authSlice.ts
# Review changes

git diff app/api/auth/verify-otp/route.ts
# Review changes

git checkout redux/authSlice.ts app/api/auth/verify-otp/route.ts
# Rollback if needed
```

Then restart server:
```bash
npm run dev
```

---

## Support

If issues persist after:
1. Restarting server ✓
2. Clearing browser cache ✓
3. Following all steps above ✓

Check:
- Server console for errors
- Browser console for errors
- Redux state (userId should be set)
- Network requests (should be single request, not loop)

Document the issue with:
- Exact steps to reproduce
- Screenshot of redux state
- Screenshot of console errors
- Browser/OS information
