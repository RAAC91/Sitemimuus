# 🔧 OAuth Error Diagnostic Guide

## ❌ Error Received

```
http://localhost:3000/?error=invalid_request&error_code=bad_oauth_state&error_description=OAuth+state+not+found+or+expired
```

**Translation**: Supabase OAuth state cookie was not found or expired during the authentication flow.

---

## 🔍 Root Causes

### 1. **Supabase Dashboard Configuration** (MOST COMMON)

The OAuth callback URL must be whitelisted in Supabase Dashboard.

**Fix**:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to: **Authentication** → **URL Configuration**
4. Add to **Redirect URLs**:
   ```
   http://localhost:3000/auth/callback
   ```
5. For production, also add:
   ```
   https://mimuus.com/auth/callback
   https://www.mimuus.com/auth/callback
   ```

---

### 2. **Cookie Configuration Issues**

Supabase uses cookies to store OAuth state. If cookies are blocked or not persisting, this error occurs.

**Checklist**:

- ✅ Browser allows third-party cookies
- ✅ No ad blockers interfering
- ✅ HTTPS in production (required for `Secure` cookies)
- ✅ `localhost` in development (cookies work)

**Test**: Open DevTools → Application → Cookies → Check for `sb-*` cookies

---

### 3. **Browser Cache/Session Issue**

Sometimes old auth sessions cause conflicts.

**Fix**:

1. Clear browser cookies for `localhost:3000`
2. Or try incognito/private browsing mode
3. Restart dev server: `Ctrl+C` then `npm run dev`

---

### 4. **PKCE Flow Configuration**

Supabase uses PKCE for security. The state parameter must match between request and callback.

**Current Implementation**: [route.ts](file:///c:/Users/User/Documents/Site%20mimuus/Mimmus/src/app/auth/callback/route.ts)

The callback route looks correct. It properly handles:

- ✅ Code exchange
- ✅ Session creation
- ✅ Cookie management
- ✅ Redirect handling

---

## ✅ Immediate Fix Steps

### Step 1: Verify Supabase Dashboard URLs

```bash
# Check your .env.local first
cat .env.local | grep SUPABASE_URL
```

Then in Supabase Dashboard:

1. Authentication → URL Configuration
2. **Site URL**: `http://localhost:3000`
3. **Redirect URLs**: Add both
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/**` (wildcard for flexibility)

---

### Step 2: Test OAuth Flow Again

1. Clear cookies: DevTools → Application → Clear storage
2. Navigate to login page: `http://localhost:3000/login`
3. Click "Sign in with Google"
4. Complete OAuth flow
5. Should redirect to `/auth/callback` → then to `/conta`

---

### Step 3: If Still Failing

**Enable Debug Mode**:

Add to [AuthProvider.tsx](file:///c:/Users/User/Documents/Site%20mimuus/Mimmus/src/providers/AuthProvider.tsx):

```typescript
useEffect(() => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    console.log("Auth event:", event); // ADD THIS
    console.log("Session:", session); // ADD THIS
    setUser(session?.user ?? null);
    setLoading(false);
  });
  return () => subscription.unsubscribe();
}, []);
```

Then check browser console for logs during OAuth flow.

---

## 🚀 Alternative: Use Email/Password First

If OAuth continues failing, you can test with email/password authentication first:

```typescript
// In login page
const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) console.error(error);
  else console.log("Logged in:", data.user);
};
```

This bypasses OAuth entirely and helps isolate the issue.

---

## 📝 Checklist Summary

- [ ] Supabase Dashboard → Redirect URLs includes `http://localhost:3000/auth/callback`
- [ ] Site URL in Supabase is `http://localhost:3000`
- [ ] Browser cookies enabled
- [ ] Cleared browser cache/cookies
- [ ] Tried incognito mode
- [ ] Restarted dev server
- [ ] Added debug logs to AuthProvider

---

## 🔗 References

- [Supabase OAuth Docs](https://supabase.com/docs/guides/auth/social-login)
- [Next.js + Supabase Auth](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [OAuth Callback Route](file:///c:/Users/User/Documents/Site%20mimuus/Mimmus/src/app/auth/callback/route.ts)

---

**Most Likely Solution**: Add `http://localhost:3000/auth/callback` to Supabase Dashboard Redirect URLs ✅
