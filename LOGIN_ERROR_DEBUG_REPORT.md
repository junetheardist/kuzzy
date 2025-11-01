# Login Internal Server Error - Debug Report

## Issues Found

### 1. **CRITICAL: Missing Environment Variable Access in Utility Functions**
**Location:** `lib/utils.ts` line 10
**Problem:** 
```typescript
const JWT_SECRET = process.env.JWT_SECRET!;
```
This line runs at module load time. If `JWT_SECRET` is `undefined`, it sets `JWT_SECRET = undefined`, and the `!` (non-null assertion) doesn't prevent the actual `undefined` value at runtime.

**Impact:** When `generateToken()` is called during login, it tries to use `undefined` as the secret, which causes the JWT signing to fail silently or throw an error in the `try-catch` block that returns a generic "Internal server error".

**Solution:** Access `process.env.JWT_SECRET` directly in the function, or validate it exists before using.

---

### 2. **Weak JWT_SECRET Configuration**
**Location:** `.env` file
**Problem:**
```
JWT_SECRET=token
```
This is a very weak secret. JWT secrets should be cryptographically secure (ideally 32+ characters).

**Impact:** Security vulnerability. While not causing the 500 error directly, it's a security risk.

**Solution:** Use a strong, random secret like:
```
JWT_SECRET=your-super-secret-jwt-token-with-32-chars-min-abc123!@#
```

---

### 3. **Potential Bcrypt Error**
**Location:** `lib/utils.ts` lines 22-24
**Problem:**
```typescript
export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}
```
If the stored hash is malformed or null, `bcrypt.compare()` will throw an error that's caught by the API's `try-catch` block.

**Impact:** Returns generic 500 error instead of helpful error message.

**Solution:** Add validation and error handling.

---

### 4. **Poor Error Handling in Login API**
**Location:** `app/api/auth/login/route.ts` lines 50-54
**Problem:**
```typescript
} catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
        {error: 'Internal server error'},
        {status: 500}
    );
}
```
The error details are logged to console but not returned to client. User gets generic message without knowing the real issue.

**Impact:** Difficult to debug. Client can't determine if it's:
- JWT secret missing
- Database connection failed
- Password comparison error
- Other server issue

**Solution:** Add specific error messages in development mode or better error categorization.

---

## How the 500 Error Occurs

### Scenario 1: JWT_SECRET is undefined or empty
1. User submits login form with valid email/password
2. API finds user and validates password successfully
3. API calls `generateToken(user._id.toString())`
4. `generateToken()` tries to use `undefined` JWT_SECRET
5. `jwt.sign()` fails or produces invalid token
6. Error caught in try-catch block
7. API returns 500 "Internal server error"

### Scenario 2: Bcrypt comparison fails
1. User submits login
2. API queries user successfully
3. Password hash in database is corrupted/malformed
4. `bcrypt.compare()` throws error
5. Error caught in try-catch block
6. API returns 500 "Internal server error"

---

## Recommended Fixes

### Fix 1: Secure JWT_SECRET Access (HIGH PRIORITY)
**File:** `lib/utils.ts`

Replace:
```typescript
const JWT_SECRET = process.env.JWT_SECRET!;

export function generateToken(userId: string): string {
    return jwt.sign({userId}, JWT_SECRET, {expiresIn: '7d'});
}
```

With:
```typescript
export function generateToken(userId: string): string {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured in environment variables');
    }
    return jwt.sign({userId}, JWT_SECRET, {expiresIn: '7d'});
}
```

### Fix 2: Strengthen JWT_SECRET (SECURITY FIX)
**File:** `.env`

Replace:
```
JWT_SECRET=token
```

With:
```
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long-abc123def456
```

### Fix 3: Add Error Context to Login API (DEBUGGING AID)
**File:** `app/api/auth/login/route.ts`

Replace:
```typescript
} catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
        {error: 'Internal server error'},
        {status: 500}
    );
}
```

With:
```typescript
} catch (error) {
    console.error('Login error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
        {error: 'Internal server error', details: process.env.NODE_ENV === 'development' ? errorMessage : undefined},
        {status: 500}
    );
}
```

### Fix 4: Add Error Handling to Password Comparison
**File:** `lib/utils.ts`

Replace:
```typescript
export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}
```

With:
```typescript
export async function comparePassword(password: string, hash: string): Promise<boolean> {
    try {
        if (!hash) {
            console.error('Password hash is missing or invalid');
            return false;
        }
        return await bcrypt.compare(password, hash);
    } catch (error) {
        console.error('Password comparison error:', error);
        throw new Error('Password verification failed');
    }
}
```

---

## Quick Checklist to Fix

- [ ] **HIGH:** Update `lib/utils.ts` to validate JWT_SECRET in `generateToken()` function
- [ ] **HIGH:** Verify `.env` file has valid `JWT_SECRET` (strong, 32+ characters)
- [ ] **MEDIUM:** Add error context to login API for development debugging
- [ ] **MEDIUM:** Add validation to `comparePassword()` function
- [ ] **LOW:** Review all other async API endpoints for similar error handling issues

---

## Testing After Fixes

1. Check console output (browser DevTools Network tab) for error messages
2. Check server console for detailed error logs
3. Try logging in with valid credentials
4. Try logging in with invalid password
5. Try logging in with non-existent email
6. Verify each returns appropriate status codes (200, 401, 400, 500)

---

## Summary

**Root Cause:** Most likely `JWT_SECRET` environment variable issue combined with poor error handling in the login API.

**Immediate Action:** 
1. Verify `.env` file exists and has a valid `JWT_SECRET`
2. Update `generateToken()` in `lib/utils.ts` to validate JWT_SECRET at runtime
3. Add better error messages to the login API

**Priority:** Fix 1 (JWT_SECRET validation) is critical and must be done first.
