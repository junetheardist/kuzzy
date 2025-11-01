# Auth Persistence Fix - Comprehensive Testing Guide

## Quick Test (3 minutes)

### Step 1: Restart Server
```bash
Ctrl+C                    # Stop dev server
npm run dev              # Restart
```
Wait for "Ready in" message (~30 seconds)

### Step 2: Clear Browser
```
F12 → Application → Storage → Clear Site Data
OR
Ctrl+Shift+R (Hard reload)
```

### Step 3: Test Login + Refresh
1. Go to http://localhost:3000/login
2. Enter valid credentials
3. Click "Login"
4. **You should be on dashboard/home page**
5. Press **F5** to refresh
6. **EXPECTED: Stay on current page (NOT redirected to /login)** ✓

### Step 4: Test Direct /Ui Access
1. After successful login, go to http://localhost:3000/Ui
2. Refresh page (F5)
3. **EXPECTED: Stay on /Ui page (NOT redirected)** ✓

---

## Detailed Test Cases

### Test Case 1: Login Persistence After Refresh
**Objective:** Verify user stays logged in after page refresh

**Prerequisites:**
- Fresh login
- Dev tools open (optional, for debugging)

**Steps:**
1. Navigate to http://localhost:3000/login
2. Enter valid credentials
3. Click "Login"
4. Wait for redirect to dashboard
5. Note the URL (should be http://localhost:3000/)
6. Press F5 to refresh page
7. Wait 2-3 seconds for page to reload

**Expected Results:**
- ✅ Page reloads without redirecting to /login
- ✅ Still on dashboard/home page
- ✅ Navbar shows logged-in state
- ✅ No "Checking authentication..." loading screen

**If FAILS:**
- ❌ Redirected back to /login after refresh
- ❌ Shows "Checking authentication..." then redirects
- **Solution:** Check cookies exist in DevTools → Application → Cookies

---

### Test Case 2: Direct Protected Route Access After Refresh
**Objective:** Verify user can access protected routes after page refresh

**Prerequisites:**
- Login successful
- Know a protected route (e.g., /Ui, /features/vendors)

**Steps:**
1. Login successfully
2. Navigate to protected route: http://localhost:3000/Ui
3. Wait for page to fully load
4. Press F5 to refresh
5. Wait for page to reload

**Expected Results:**
- ✅ Page reloads successfully
- ✅ Still on /Ui page (URL unchanged)
- ✅ Page content loads normally
- ✅ No redirect to /login

---

### Test Case 3: Multiple Page Refreshes
**Objective:** Verify auth persists through multiple refresh cycles

**Steps:**
1. Login successfully
2. Refresh page (F5) → Wait
3. Refresh again (F5) → Wait
4. Refresh again (F5) → Wait
5. Navigate to different page
6. Refresh there too

**Expected Results:**
- ✅ All refreshes work without redirect
- ✅ Navigation between pages works
- ✅ No redirect at any point

---

### Test Case 4: Logout Still Works
**Objective:** Verify logout clears cookies and redirects properly

**Steps:**
1. Login successfully
2. Click logout button
3. Should redirect to /login

**Expected Results:**
- ✅ Redirected to /login after logout
- ✅ Cookies cleared (check DevTools)
- ✅ Trying to access /Ui redirects to /login

---

### Test Case 5: Logged Out User Cannot Access Protected Routes
**Objective:** Verify unauthenticated users still get redirected

**Steps:**
1. Make sure logged out (or clear cookies)
2. Try to navigate to http://localhost:3000/Ui
3. Should redirect

**Expected Results:**
- ✅ Redirected to /login
- ✅ Single redirect (not loop)
- ✅ Cannot access /Ui without login

---

### Test Case 6: Browser Tab Close + Reopen
**Objective:** Verify auth persists across browser session

**Steps:**
1. Login successfully
2. Note the URL and page you're on
3. Close this browser tab
4. Close all tabs with the app
5. Reopen browser
6. Navigate to http://localhost:3000
7. Should be logged in automatically

**Expected Results:**
- ✅ Redirected to home/dashboard without showing login
- ✅ Already authenticated (cookies still valid)
- ✅ No need to login again

---

## Redux DevTools Inspection (Optional)

If you have Redux DevTools extension installed:

### Check Redux State After Refresh
1. After login and refresh, open DevTools
2. Go to Redux tab
3. Find "auth" state
4. Look for:
   ```
   auth {
     userId: "some-id-here"        // Should be populated ✓
     token: "jwt-token-here"       // Should be populated ✓
     user: { id: "...", email: "..." }  // Should be populated ✓
     isVerified: true              // Should be true ✓
   }
   ```

### Check Redux Actions
1. In Redux DevTools, look at "Actions" tab
2. Should see:
   - `@@INIT`
   - `auth/restoreFromCookies` ← After AuthInitializer runs
   - `auth/loginUser/fulfilled` ← From original login

---

## Network Tab Inspection (Optional)

### Check Network Requests After Refresh
1. Open DevTools → Network tab
2. Refresh page (F5)
3. Look for requests:
   - Should see page load requests
   - Should NOT see redirect to /login
   - Network requests should show 200 status (not 307 redirect)

---

## Cookies Inspection

### Check If Cookies Are Being Set
1. Open DevTools → Application → Cookies
2. Select "localhost:3000"
3. After login, you should see:
   - `kuzzy-token` → JWT token
   - `kuzzy-id` → User ID
   - `kuzzy-email` → User email
4. After refresh, these cookies should still be there
5. After logout, they should be gone

---

## Troubleshooting

### Issue: Still Getting Redirected After Refresh

**Possible Causes:**
1. Server not restarted
2. Browser cache not cleared
3. Cookies not being set properly
4. AuthInitializer not loading

**What to Try:**
```bash
# Full restart:
Ctrl+C
npm run dev

# In browser:
Ctrl+Shift+R  # Hard reload
# Clear all cookies manually
```

### Issue: userId is null in Redux

**Check:**
1. Are cookies being set? (DevTools → Application → Cookies)
2. Are cookies named correctly? (kuzzy-token, kuzzy-id, kuzzy-email)
3. Did AuthInitializer action dispatch? (Redux DevTools → Actions)

### Issue: Infinite Redirect Loop

**Symptoms:**
- Console shows many redirects
- Page keeps reloading
- Can't interact with page

**What to Try:**
1. Stop server, clear cookies, restart
2. Check if GlobalAuthProvider logic is correct
3. Check if AuthInitializer is wrapped properly in layout

---

## Console Debugging

### Add Logging (Optional)

Edit `components/providers/AuthInitializer.tsx`:

```typescript
useEffect(() => {
  if (userId) {
    console.log('✓ userId already set:', userId);
    return;
  }

  const token = Cookies.get('kuzzy-token');
  const id = Cookies.get('kuzzy-id');
  const email = Cookies.get('kuzzy-email');

  console.log('Checking cookies:', { token: !!token, id: !!id, email: !!email });

  if (token && id && email) {
    console.log('✓ Restoring auth from cookies:', id);
    dispatch(restoreFromCookies({
      userId: id,
      token,
      user: { id, email },
      isVerified: true
    }));
  } else {
    console.log('✗ No valid cookies found');
  }
}, [userId, dispatch]);
```

Then check browser console (F12) to see logs.

---

## Success Checklist

- [ ] Login works without 500 error
- [ ] After login, userId is set in Redux
- [ ] Refresh page (F5) - doesn't redirect to login
- [ ] Still on same page after refresh
- [ ] Navbar still shows logged-in state
- [ ] Can navigate between protected pages
- [ ] Each page refresh keeps you logged in
- [ ] Logout clears cookies properly
- [ ] After logout, accessing /Ui redirects to /login
- [ ] AuthInitializer action appears in Redux DevTools
- [ ] Cookies persist in DevTools → Application → Cookies
- [ ] No console errors related to auth

---

## Performance Notes

**Expected Performance:**
- Page load time: Same as before (no slowdown)
- Initial load shows "Checking authentication..." briefly (1-2 seconds)
- After cookies restored, loads normally

**If Seeing Issues:**
- Check network tab for slow requests
- Check if AuthInitializer is doing unnecessary re-renders
- Can add useMemo if needed for optimization

---

## Mobile Testing

### Test on Mobile Devices
1. Same tests as above but on mobile
2. Check if responsive design still works
3. Verify touch interactions work
4. Test with slower network (DevTools → Throttle to "Slow 3G")

---

## Production Readiness

Before deploying to production:

- [ ] All tests pass
- [ ] No console errors
- [ ] Logout works properly
- [ ] Cookies are HttpOnly (set server-side, not readable by JS)
- [ ] Cookies have secure flag (HTTPS only)
- [ ] Cookies have SameSite attribute
- [ ] Token expiration is handled
- [ ] No sensitive data in Redux persisted state

---

## Rollback (If Needed)

If something breaks:

```bash
git diff components/providers/AuthInitializer.tsx
git diff redux/authSlice.ts
git diff app/layout.tsx

# If need to revert:
git checkout components/providers/ redux/authSlice.ts app/layout.tsx
npm run dev
```

---

## Questions to Answer After Testing

1. **Does login + refresh work?** Y/N
2. **Does page refresh clear any redirects?** Y/N
3. **Can you access /Ui after login + refresh?** Y/N
4. **Does logout work?** Y/N
5. **Are cookies visible in DevTools?** Y/N
6. **Is Redux state restored after refresh?** Y/N
7. **Any console errors?** Y/N

If all are "Yes", fix is working correctly! ✓
