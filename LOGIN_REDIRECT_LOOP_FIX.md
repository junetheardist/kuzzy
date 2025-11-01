# Login Redirect Loop - Root Cause & Fix

## Problem

**After successful login, user is immediately redirected back to login page instead of staying on the dashboard/home page.**

### How It Happens:

1. User enters email and password
2. Clicks "Login"
3. API returns: `{message, token, user: {id, email}}`
4. **Redux sets `state.user` but NOT `state.userId`** ❌
5. GlobalAuthProvider checks: `if (!userId && !isPublicRoute) redirect('/login')`
6. **userId is null**, so redirect triggers even though user is logged in
7. **Infinite redirect loop** back to login page

---

## Root Causes

### 1. **Login Reducer Missing userId Assignment**
**File:** `redux/authSlice.ts` (loginUser.fulfilled handler)

**Before:**
```typescript
.addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
    state.loading = false;
    state.message = action.payload.message;
    state.token = action.payload.token;
    state.user = action.payload.user;
    // ❌ userId NOT set! Still null
    state.isVerified = true;
})
```

**Issue:** The `userId` field that GlobalAuthProvider checks is never populated.

---

### 2. **Verify OTP Reducer Missing userId Assignment**
**File:** `redux/authSlice.ts` (verifyOtp.fulfilled handler)

**Before:**
```typescript
.addCase(verifyOtp.fulfilled, (state, action: PayloadAction<any>) => {
    state.loading = false;
    state.message = action.payload.message;
    state.token = action.payload.token;
    // ❌ userId NOT set! Still null
    state.isVerified = true;
})
```

**Issue:** After email verification, user couldn't transition to home because userId wasn't set.

---

### 3. **Verify OTP API Not Returning User Info**
**File:** `app/api/auth/verify-otp/route.ts`

**Before:**
```typescript
return NextResponse.json(
    {message: 'Email verified successfully', token},
    {status: 200}
);
// ❌ No user data included
```

**Issue:** Redux reducer had no user data to extract userId from.

---

## Fixes Applied

### Fix 1: Set userId on Successful Login
**File:** `redux/authSlice.ts`

```typescript
.addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
    state.loading = false;
    state.message = action.payload.message;
    state.token = action.payload.token;
    state.user = action.payload.user;
    state.userId = action.payload.user?.id;  // ✅ NOW SET
    state.isVerified = true;
})
```

**Impact:** GlobalAuthProvider now sees userId and stops redirecting authenticated users.

---

### Fix 2: Set userId on OTP Verification
**File:** `redux/authSlice.ts`

```typescript
.addCase(verifyOtp.fulfilled, (state, action: PayloadAction<any>) => {
    state.loading = false;
    state.message = action.payload.message;
    state.token = action.payload.token;
    state.user = action.payload.user;          // ✅ NOW SET
    state.userId = action.payload.user?.id;    // ✅ NOW SET
    state.isVerified = true;
})
```

**Impact:** After email verification, user is properly authenticated.

---

### Fix 3: Include User Data in OTP Verification Response
**File:** `app/api/auth/verify-otp/route.ts`

```typescript
return NextResponse.json(
    {
        message: 'Email verified successfully',
        token,
        user: {id: user._id, email: user.email}  // ✅ NOW INCLUDED
    },
    {status: 200}
);
```

**Impact:** Redux reducer has user data to extract userId from.

---

## How It Works Now

### Authentication Flow:
1. User logs in or verifies email
2. API returns: `{message, token, user: {id: user._id, email: user.email}}`
3. Redux sets:
   - `state.token` ✅
   - `state.user` ✅
   - `state.userId` ✅ ← **This is the key**
   - `state.isVerified` ✅
4. GlobalAuthProvider checks `userId`
5. **userId is NOT null** → No redirect
6. User stays on dashboard/home page ✅

---

## Affected Flows

### ✅ Login Flow
- User → Login Form → API → Redux (now sets userId) → Dashboard
- **Before:** Stuck in redirect loop at Dashboard
- **After:** Stays at Dashboard ✓

### ✅ Register + OTP Verification Flow
- User → Register Form → Verification Page → OTP Form → API (now returns user) → Redux (now sets userId) → Can redirect to Dashboard
- **Before:** Got stuck after verification
- **After:** Properly authenticated ✓

---

## Files Modified

| File | Change | Status |
|------|--------|--------|
| `redux/authSlice.ts` | Added `state.userId = action.payload.user?.id` to loginUser.fulfilled | ✅ No errors |
| `redux/authSlice.ts` | Added `state.user` and `state.userId` to verifyOtp.fulfilled | ✅ No errors |
| `app/api/auth/verify-otp/route.ts` | Added `user: {id, email}` to response | ✅ No errors |

---

## Testing

### Test 1: Login Should NOT Redirect
1. Go to http://localhost:3000/login
2. Enter valid credentials
3. Click "Login"
4. **Expected:** Redirect to home/dashboard (NOT back to login)
5. **Before Fix:** Stuck in redirect loop
6. **After Fix:** ✅ Successful redirect to home

### Test 2: OTP Verification Should NOT Redirect
1. Register new account at /register
2. Enter email/password, click Register
3. Get redirected to /verify-otp
4. Enter OTP from email
5. Click "Verify"
6. **Expected:** Can access dashboard (NOT redirected back to login)
7. **Before Fix:** Couldn't access dashboard
8. **After Fix:** ✅ Proper authentication

### Test 3: Redux State Check
1. After login, open browser DevTools → Redux DevTools (if installed)
2. Check Redux state:
   - `auth.userId` should be populated ✓
   - `auth.token` should be populated ✓
   - `auth.user` should be populated ✓
3. **Before Fix:** userId was null
4. **After Fix:** ✅ userId has correct value

---

## Summary

**Problem:** userId never set after login → GlobalAuthProvider always redirected to /login

**Solution:** Extract userId from user object returned by API and store in Redux state

**Result:** 
- ✅ No more redirect loops after login
- ✅ Users stay authenticated on protected pages
- ✅ OTP verification properly authenticates users
- ✅ GlobalAuthProvider works as intended

**Priority:** CRITICAL - Login is completely broken without this fix

---

## Related Code

### GlobalAuthProvider Logic:
```typescript
const { userId } = useAppSelector(state => state.auth);

useEffect(() => {
    if (!userId && !isPublicRoute) {
        router.push('/login');  // ← This now only triggers for actual logged-out users
    }
}, [userId, pathname, router]);
```

Before fix: userId was always null after login → Always redirected  
After fix: userId is populated after login → No redirect ✓

---

## Deployment Note

**Must restart dev server after this fix** to load updated code:
```bash
Ctrl+C  # Stop current server
npm run dev  # Restart
```

Clear browser cache/cookies if needed to ensure fresh Redux state.
