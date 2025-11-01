# Login Restriction on /Ui Page - Root Cause & Fix

## Problem

**After logging in, user can access the app. But if they navigate to `/Ui` page or refresh the page, they get redirected back to login.**

### Why It Happens:

1. User logs in successfully
2. Redux stores: `userId`, `token`, `user` data
3. User navigates to `/Ui` page → Works fine ✓
4. **User refreshes page** (F5) or navigates away and back
5. **Redux state is lost** (client-side only, not persisted)
6. `userId` becomes `null`
7. GlobalAuthProvider sees: `if (!userId && !isPublicRoute) redirect('/login')`
8. **User redirected back to login** ❌

---

## Root Cause

### The Problem:
- Login sets userId in Redux ✓
- Redux stores data in memory only (not persisted)
- Browser refresh clears Redux state
- userId becomes null again
- GlobalAuthProvider redirects to login

### The Solution:
Need to **restore auth state from cookies on app load** before GlobalAuthProvider checks userId.

---

## Architecture Issue

**Current Flow:**
```
App Load
  ↓
Layout.tsx rendered
  ↓
GlobalAuthProvider checks userId
  ├─ userId is null (Redux not restored yet)
  ├─ Redirect to /login
  └─ ❌ WRONG
```

**What Should Happen:**
```
App Load
  ↓
Layout.tsx rendered
  ↓
Initialize Redux from cookies
  ├─ Read cookies: kuzzy-token, kuzzy-id, kuzzy-email
  ├─ Restore to Redux: userId, token, user
  └─ ✓ NOW userId is set
  ↓
GlobalAuthProvider checks userId
  ├─ userId is set ✓
  ├─ No redirect for authenticated users
  └─ ✓ CORRECT
```

---

## Solution

### Step 1: Create Auth Initialization Hook
**File:** `hooks/useInitializeAuth.ts` (new file)

```typescript
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Cookies from 'js-cookie';

export const useInitializeAuth = () => {
  const dispatch = useAppDispatch();
  const { userId } = useAppSelector(state => state.auth);

  useEffect(() => {
    // Only initialize if userId is not already set
    if (userId) return;

    // Check if user has auth cookies
    const token = Cookies.get('kuzzy-token');
    const id = Cookies.get('kuzzy-id');
    const email = Cookies.get('kuzzy-email');

    if (token && id && email) {
      // Restore user auth state from cookies
      // Dispatch action to set Redux state
      dispatch({
        type: 'auth/setUserFromCookies',
        payload: {
          userId: id,
          token,
          user: { id, email }
        }
      });
    }
  }, [userId, dispatch]);
};
```

### Step 2: Create Redux Action to Restore Auth
**File:** `redux/authSlice.ts`

Add to initialState or extraReducers:

```typescript
// Add this reducer to handle cookie restoration
.addCase('auth/setUserFromCookies', (state, action: PayloadAction<any>) => {
    state.userId = action.payload.userId;
    state.token = action.payload.token;
    state.user = action.payload.user;
    state.isVerified = true;
})
```

### Step 3: Use Hook in GlobalAuthProvider
**File:** `components/providers/GlobalAuthProvider.tsx`

Add initialization logic before checking userId.

---

## Recommended Fix (Simpler)

Actually, there's a simpler approach - **check cookies directly in GlobalAuthProvider** before deciding to redirect:

**File:** `components/providers/GlobalAuthProvider.tsx`

```typescript
import Cookies from 'js-cookie';

const GlobalAuthProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { userId } = useAppSelector(state => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // If userId is set, we're good
    if (userId) {
      setIsChecking(false);
      return;
    }

    // If userId is not set, check if we have valid cookies
    const token = Cookies.get('kuzzy-token');
    const id = Cookies.get('kuzzy-id');

    // If we have cookies, user is logged in (even if Redux not restored yet)
    if (token && id) {
      setIsChecking(false);
      return;
    }

    // No cookies and no userId = definitely not logged in
    setIsChecking(false);

    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname?.startsWith(route));
    if (!isPublicRoute) {
      router.push('/login');
    }
  }, [userId, pathname, router]);

  if (isChecking) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};
```

---

## Best Fix (Recommended)

Use a **client-side initialization component** that runs early:

**File:** `components/providers/AuthInitializer.tsx` (new file)

```typescript
'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Cookies from 'js-cookie';

export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { userId } = useAppSelector(state => state.auth);

  useEffect(() => {
    // If userId already set in Redux, nothing to do
    if (userId) return;

    // Check cookies and restore if available
    const token = Cookies.get('kuzzy-token');
    const id = Cookies.get('kuzzy-id');
    const email = Cookies.get('kuzzy-email');

    if (token && id && email) {
      // Restore auth state from cookies
      dispatch({
        type: 'auth/restoreFromCookies',
        payload: {
          userId: id,
          token,
          user: { id, email },
          isVerified: true
        }
      });
    }
  }, [userId, dispatch]);

  return <>{children}</>;
};
```

Then use in layout.tsx **BEFORE** GlobalAuthProvider:

```typescript
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <AuthInitializer>  {/* Run first to restore auth */}
            <GlobalAuthProvider>
              <Navbar />
              {children}
            </GlobalAuthProvider>
          </AuthInitializer>
        </Provider>
      </body>
    </html>
  );
}
```

And add reducer to authSlice.ts:

```typescript
// Handle cookies restoration
if (action.type === 'auth/restoreFromCookies') {
    return {
        ...state,
        userId: action.payload.userId,
        token: action.payload.token,
        user: action.payload.user,
        isVerified: action.payload.isVerified
    };
}
```

---

## Why This Works

**Before (Broken):**
1. App loads
2. Redux state is empty (userId = null)
3. GlobalAuthProvider checks: `if (!userId)` → true
4. Redirect to /login ❌

**After (Fixed):**
1. App loads
2. AuthInitializer runs first
3. Checks cookies: `Cookies.get('kuzzy-id')` → finds value
4. Restores Redux state
5. GlobalAuthProvider checks: `if (!userId)` → false
6. No redirect ✓
7. Page renders normally ✓

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `components/providers/AuthInitializer.tsx` | Create | Initialize auth from cookies |
| `app/layout.tsx` | Modify | Add AuthInitializer before GlobalAuthProvider |
| `redux/authSlice.ts` | Modify | Add reducer to handle cookie restoration |

---

## Alternative: Simpler Approach

If you want the absolute simplest fix, just **check cookies in GlobalAuthProvider directly**:

```typescript
useEffect(() => {
    if (userId === undefined) {
        setIsChecking(true);
        return;
    }

    setIsChecking(false);

    // If we have userId, we're logged in ✓
    if (userId) return;

    // If no userId but have cookies, we're still logged in ✓
    const token = Cookies.get('kuzzy-token');
    if (token) return;

    // No userId and no cookies = redirect to login
    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname?.startsWith(route));
    if (!isPublicRoute) {
        router.push('/login');
    }
}, [userId, pathname, router]);
```

This is a quick 2-line fix that checks cookies as a fallback.

---

## Summary

**Problem:** Redux state lost on page refresh → userId becomes null → Redirect to login

**Root Cause:** Auth state only in Redux memory, not persisted

**Solution:** Initialize Redux state from cookies on app load

**Implementation:**
- Option 1 (Simplest): Check cookies in GlobalAuthProvider
- Option 2 (Recommended): Create AuthInitializer component
- Option 3 (Robust): Create useInitializeAuth hook + reducer action

---

## Priority

🔴 **CRITICAL** - Users cannot access protected pages after refresh

**Recommended Implementation:** Option 2 (AuthInitializer component) - clean, maintainable, runs early
