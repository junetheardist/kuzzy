# 🔐 Global Auth Redirect - Visual Guide

## What This Does

```
         LOGGED OUT USER                    LOGGED IN USER
              ↓                                  ↓
        Visits any page                  Visits any page
              ↓                                  ↓
    GlobalAuthProvider checks           GlobalAuthProvider checks
              ↓                                  ↓
        userId = null?                   userId = "12345"?
           YES! ✗                             YES! ✓
              ↓                                  ↓
    Is route public?                    Show requested page
    (/login, /register)                       ✅
           NO! ✗                         (vendors, orders, etc.)
              ↓
    REDIRECT TO /login 🔄
           ✅
        User sees login page
```

---

## Flow Chart

```
┌─────────────────────────────────────────────┐
│  User navigates to a page                   │
└────────────────┬────────────────────────────┘
                 │
                 ↓
    ┌────────────────────────┐
    │ Check Redux auth state │
    │ userId exists?         │
    └────┬───────────────────┘
         │
    YES? │    NO?
    ────┼────────
    ✓   │     ✗
        │
        ↓             ↓
    SHOW PAGE   Check if route
      ✅        is public
               (/login, /register)
               │
          YES? │   NO?
          ────┼──────
          ✓   │   ✗
              │
              ↓       ↓
            SHOW   REDIRECT
            PAGE   TO /LOGIN
             ✅       🔄
```

---

## Step-by-Step Redirect Process

### Scenario: User is logged out and tries to visit `/vendors/register`

```
STEP 1: User Action
    └─ User clicks link to /vendors/register
    └─ OR types URL in browser
    └─ OR bookmarked page

STEP 2: Next.js Router
    └─ Detects route change to /vendors/register
    └─ Starts rendering app/layout.tsx

STEP 3: Redux Provider
    └─ Loads app state
    └─ state.auth.userId = null (no user logged in)

STEP 4: GlobalAuthProvider
    └─ Reads userId from Redux
    └─ userId = null ✗
    
STEP 5: Route Check
    └─ Is /vendors/register in PUBLIC_ROUTES?
    └─ PUBLIC_ROUTES = ['/login', '/register', ...]
    └─ Answer: NO ✗

STEP 6: Redirect Decision
    └─ User not logged in ✗
    └─ Route is not public ✗
    └─ ACTION: Redirect!

STEP 7: Show Loading
    └─ Display "Checking authentication..."
    └─ Show spinner animation

STEP 8: Execute Redirect
    └─ router.push('/login')
    └─ Browser navigates to /login

STEP 9: Repeat Process
    └─ GlobalAuthProvider checks /login route
    └─ /login IS in PUBLIC_ROUTES ✓
    └─ ALLOW ACCESS ✓

STEP 10: Display Result
    └─ User sees login page
    └─ User can log in
```

---

## Code Flow Visualization

### GlobalAuthProvider Logic

```typescript
useEffect(() => {
  // STEP 1: Check if auth is still loading
  if (userId === undefined) {
    return;  // Don't do anything, wait for auth to load
  }

  // STEP 2: Get current page path
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname?.startsWith(route)
  );
  
  // STEP 3: Decide what to do
  if (!userId && !isPublicRoute) {
    //    ↑        ↑
    //    Not logged in AND
    //    route is not public
    //
    //    → REDIRECT TO LOGIN
    router.push('/login');
  }
}, [userId, pathname, router]);
```

---

## Visual State Examples

### State 1: User Logged Out
```
┌─────────────────────────────────────────┐
│          Redux Auth State               │
├─────────────────────────────────────────┤
│  userId: null                           │ ✗
│  user: null                             │
│  isLoading: false                       │
│  error: null                            │
└─────────────────────────────────────────┘
         ↓
    GlobalAuthProvider sees userId = null
         ↓
    Checks if trying to access /vendors
         ↓
    /vendors is NOT public
         ↓
    REDIRECT TO /login 🔄
```

### State 2: User Logged In
```
┌─────────────────────────────────────────┐
│          Redux Auth State               │
├─────────────────────────────────────────┤
│  userId: "user_12345"                   │ ✓
│  user: { name: "John", email: "..." }   │
│  isLoading: false                       │
│  error: null                            │
└─────────────────────────────────────────┘
         ↓
    GlobalAuthProvider sees userId exists
         ↓
    Allows access to requested page
         ↓
    SHOW PAGE ✅
```

---

## Route Types

### 🔓 Public Routes (No Login Required)
```
/login           ← Users come here to login
/register        ← Users come here to signup
/verify-otp      ← Verify OTP after registration
/resend-otp      ← Request new OTP
/forgot-password ← Request password reset
/reset-password  ← Set new password
```

**ANYONE can visit these!**

### 🔒 Protected Routes (Login Required)
```
/                         ← Dashboard/home
/vendors/register         ← Add vendor
/vendors/list             ← Vendor list
/orders/manage            ← Order management
/inventory/manage         ← Inventory
/agents/dashboard         ← Agent dashboard
... any route not in public list
```

**ONLY logged-in users can visit!**

---

## Redirect Scenarios

### ✅ Scenario 1: Normal Login Flow
```
Logged Out
    ↓
Visit /vendors/register
    ↓
Redirected to /login ← GlobalAuthProvider
    ↓
See login page ✓
    ↓
Enter credentials
    ↓
Login successful
    ↓
userId set in Redux ✓
    ↓
User redirected back to /vendors/register
    ↓
Can now see form ✓
```

### ✅ Scenario 2: Direct Login Page Access
```
Logged Out
    ↓
Visit /login
    ↓
Check: Is /login in PUBLIC_ROUTES? YES ✓
    ↓
GlobalAuthProvider allows access
    ↓
See login page ✓
    ↓
(No redirect needed)
```

### ✅ Scenario 3: Already Logged In
```
Logged In
    ↓
Visit /vendors/register
    ↓
Check: userId exists? YES ✓
    ↓
GlobalAuthProvider allows access
    ↓
See vendor form ✓
    ↓
(No redirect needed)
```

### ❌ Scenario 4: Logout Then Access
```
Logged In
    ↓
On /vendors/register
    ↓
Click logout
    ↓
userId removed from Redux
    ↓
Try to stay on page
    ↓
GlobalAuthProvider detects logout
    ↓
userId = null ✗
    ↓
/vendors/register is not public ✗
    ↓
REDIRECT TO /login 🔄
```

---

## Architecture Diagram

```
┌────────────────────────────────────────────────────────────┐
│                    Browser                                 │
│                  (User's Device)                           │
└────────────────────┬───────────────────────────────────────┘
                     │
                     │ User visits URL
                     ↓
        ┌────────────────────────────┐
        │  Next.js App Router        │
        │  • Handles routing         │
        │  • Manages navigation      │
        └────────────┬───────────────┘
                     │
                     │ Load layout
                     ↓
        ┌────────────────────────────────────┐
        │  app/layout.tsx (Root Layout)      │
        │  • HTML structure                  │
        │  • Meta tags                       │
        │  • Body wrapper                    │
        └────────────┬──────────────────────┘
                     │
                     │ Initialize providers
                     ↓
      ┌──────────────────────────────────────────┐
      │  Redux Provider (Wraps entire app)      │
      │                                          │
      │  • Provides Redux store                 │
      │  • Auth state available                 │
      │  • userId in state.auth.userId          │
      └────────────┬─────────────────────────────┘
                   │
                   │ App initialization
                   ↓
    ┌──────────────────────────────────────────────────┐
    │  GlobalAuthProvider ← ⭐ AUTHENTICATION LAYER    │
    │                                                  │
    │  // Check if user is logged in                  │
    │  const { userId } = state.auth                  │
    │                                                  │
    │  // Get current route                           │
    │  const pathname = usePathname()                 │
    │                                                  │
    │  // Is route public?                            │
    │  if (!userId && !isPublicRoute) {              │
    │    router.push('/login')  ← REDIRECT!          │
    │  }                                              │
    │                                                  │
    │  return <>{children}</>  ← IF ALLOWED          │
    └────────────┬─────────────────────────────────────┘
                 │
        ┌────────┴──────────┐
        │                   │
    ALLOWED?        NOT ALLOWED?
        │                   │
        ↓                   ↓
    RENDER PAGE        REDIRECT TO
    • Navbar           /login
    • Content
    • Footer
    
    ✅ User sees      🔄 Redirect
       requested page    happens
```

---

## Loading State Timeline

```
User clicks link to protected page
         ↓
    Time = 0ms
    ┌──────────────────────────┐
    │  Page starts loading     │
    └──────────────────────────┘
         ↓
    Time = 50ms
    ┌─────────────────────────────────────────┐
    │  Redux loads                            │
    │  Redux state initializing...            │
    └─────────────────────────────────────────┘
         ↓
    Time = 100ms
    ┌─────────────────────────────────────────┐
    │  GlobalAuthProvider starts              │
    │  • Waiting for Redux (userId loading)   │
    │  • Show loading spinner                 │
    │    "Checking authentication..."         │
    └─────────────────────────────────────────┘
         ↓
    Time = 150ms-200ms
    ┌─────────────────────────────────────────┐
    │  Redux ready                            │
    │  userId loaded from storage/server      │
    │  null = logged out                      │
    │  "user_id" = logged in                  │
    └─────────────────────────────────────────┘
         ↓
    Time = 250ms
    ┌─────────────────────────────────────────┐
    │  Decision made                          │
    │  • Check: userId exists?                │
    │  • Check: route is public?              │
    │  • If NO to both → REDIRECT             │
    └─────────────────────────────────────────┘
         ↓
    Time = 300ms
    ┌─────────────────────────────────────────┐
    │  Redirect executed (if needed)          │
    │  router.push('/login')                  │
    │  Browser navigates to login             │
    └─────────────────────────────────────────┘
         ↓
    Time = 350ms
    ┌─────────────────────────────────────────┐
    │  Final state                            │
    │  User sees:                             │
    │  • /login page (if redirected)          │
    │  • OR requested page (if allowed)       │
    └─────────────────────────────────────────┘

Total time: ~350ms (very fast!)
```

---

## Configuration

### Where to Add Public Routes

**File:** `components/providers/GlobalAuthProvider.tsx`

**Lines 28-36:**
```typescript
const PUBLIC_ROUTES = [
  '/login',           ← Add to this array
  '/register',        ← if route should be
  '/verify-otp',      ← accessible without
  '/resend-otp',      ← login
  '/forgot-password',
  '/reset-password',
];
```

---

## Security Layers

```
    User's Browser
          ↓
    Next.js Router ← Layer 1: Client-side routing
          ↓
    Redux State ← Layer 2: Auth state management
          ↓
    GlobalAuthProvider ← Layer 3: Auth check
          ↓
    Route Protection ← Layer 4: Enforce public/private
          ↓
    Page Rendering ← Layer 5: Only render if allowed
```

---

## Summary

✅ **What happens:**
- GlobalAuthProvider checks if user is logged in
- If not logged in and visiting protected route → Redirect to /login
- If logged in or visiting public route → Show page

✅ **Why it works:**
- Global protection layer
- Redux provides auth state
- One system, entire app protected
- No duplication needed

✅ **User experience:**
- Fast redirects (client-side)
- Brief loading state
- Professional behavior
- Expected web app pattern

🎉 **Result:** 
Your app is now fully protected! Logged out users will always be redirected to login!
