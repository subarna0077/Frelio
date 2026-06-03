# Supabase Auth Issues I Encountered (And What I Learned)

I've been building a freelance management app called **Frelio** using React, Supabase, Zustand, and TanStack Query for about 3 weeks. Everything was working fine — DB operations, Deno edge functions, Khalti payments — but I never fully understood *why* it worked. Here's a breakdown of every auth issue I hit, what caused it, and how I fixed it.

---

## Background: My Stack

- **Frontend**: React + TypeScript + TanStack Query
- **Auth + DB**: Supabase (with RLS enabled on all tables)
- **State management**: Zustand with `persist` middleware
- **Edge functions**: Deno (for sending invoices via Brevo, and Khalti payment initiation)

---

## Issue 1: Storing the Access Token in Zustand (Redundant + Risky)

### What I was doing

```ts
export const useAuthStore = create<AuthStore>()(persist(
  (set) => ({
    isAuthenticated: false,
    user: null,
    token: '',  // ← storing the JWT access token
    setUser: (user, token) => set({ user, token, isAuthenticated: true }),
    logout: () => set({ user: null, token: '', isAuthenticated: false })
  }),
  {
    name: 'auth-storage',
    partialize: (state) => ({
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      token: state.token  // ← persisting it to localStorage
    }),
  }
))
```

### Why it was wrong

The Supabase JS client already manages the JWT internally. It stores the session under its own localStorage key (`sb-<project-ref>-auth-token`) and handles:

- Reading the token before every request
- Checking expiry
- Silently refreshing using the refresh token
- Attaching `Authorization: Bearer <token>` to every HTTP request

My Zustand `token` was set once at login and **never updated**. After 120 seconds (my JWT expiry), it was stale. But since I never actually used it for any Supabase calls, everything kept working.

### The real flow (what supabase.from() actually does)

```
supabase.from('clients').insert({...})
  → reads session from localStorage (sb-xxx-auth-token)
  → checks if access_token is expired
  → if expired: uses refresh_token → gets new access_token silently
  → attaches fresh Bearer token to the HTTP request
  → fires the fetch()
```

My Zustand token was completely ignored by this process.

### The fix

Remove `token` from Zustand entirely. It was never needed.

```ts
export interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User) => void;  // no token param
  logout: () => void;
}
```

**Rule of thumb**: Let Supabase handle token storage and refresh. Zustand only needs to know *who* is logged in, not *the token* itself.

---

## Issue 2: Zustand Logout Not Clearing the Supabase Session

### What I was doing

```ts
logout: () => set({ user: null, isAuthenticated: false })
```

### Why it was wrong

This only cleared Zustand state. The Supabase session in localStorage (`sb-xxx-auth-token`) was still alive and valid. Even after "logging out":

- The user appeared logged out visually ✅
- But `supabase.auth.getSession()` still returned a valid session ❌
- Any Supabase DB call would still succeed ❌
- The refresh token was still valid and usable ❌

### The fix

Always call `supabase.auth.signOut()` first — it clears the session from localStorage AND invalidates the refresh token on the server:

```ts
const handleLogout = async () => {
  await supabase.auth.signOut()  // clears Supabase session + invalidates refresh token
  logout()                        // clears Zustand
}
```

---

## Issue 3: All DB Operations Failing After 10 Minutes of Inactivity

### What I was noticing

Everything worked fine during active use. But after leaving the app idle for ~10 minutes, all Supabase operations returned `null` or empty arrays — across every table.

### Root cause

I had accidentally set the **Refresh Token Expiry to 600 seconds (10 minutes)** instead of the default 1 week.

```
Access token expiry   → 120s  (I intentionally set this for security)
Refresh token expiry  → 600s  (accidentally set too low)
```

The flow:

```
App idle for 10+ mins
  → refresh token expires
  → Supabase client can no longer get new access tokens
  → session effectively dead
  → all queries run as anon user
  → RLS blocks everything → null / []
```

The tricky part: the Supabase client auto-refreshes the access token every 120s **while the app is active**. But once you close/idle the tab, the client is dead and nothing refreshes. When you return after 10 mins, the refresh token is gone and the session can't be restored.

### The fix

In Supabase dashboard → **Authentication → Configuration**:

```
JWT Expiry (access token)  → 120s     (keep for security)
Refresh Token Expiry       → 604800s  (1 week — the default)
```

This way:
- Access token rotates every 2 mins for security ✅
- Refresh token lasts 1 week so users stay logged in ✅
- After 1 week of inactivity, user is prompted to log in again ✅

---

## What I Learned About How supabase.from() Actually Works

Every Supabase client call is just a typed wrapper around a plain `fetch()` to the PostgREST REST API:

```ts
// What you write:
supabase.from('clients').select('*').eq('user_id', user?.id)

// What actually fires:
fetch('https://<project>.supabase.co/rest/v1/clients?user_id=eq.<id>&select=*', {
  method: 'GET',
  headers: {
    'apikey': '<anon-key>',
    'Authorization': 'Bearer <fresh-JWT>',  // attached automatically
    'Content-Type': 'application/json'
  }
})
```

The translation map:

| Supabase method | HTTP equivalent |
|---|---|
| `.from('table')` | `/rest/v1/table` |
| `.select('*')` | `GET ?select=*` |
| `.insert({...})` | `POST` with body |
| `.update({...})` | `PATCH` with body |
| `.delete()` | `DELETE` |
| `.eq('col', val)` | `?col=eq.val` |
| `.lt('col', val)` | `?col=lt.val` |
| `.single()` | `Prefer: return=representation + limit 1` |

The JWT is always picked up from localStorage and injected automatically — you never touch it directly.

---

## What I Learned About RLS and .eq()

I was doing this everywhere:

```ts
supabase.from('clients').select('*, projects(...)').eq('user_id', user?.id)
```

The `.eq('user_id', user?.id)` is **redundant** if you have a proper RLS SELECT policy:

```sql
CREATE POLICY "users see own clients"
ON clients FOR SELECT
USING (auth.uid() = user_id);
```

RLS automatically filters rows to the current user. The `.eq()` is doing the same filter twice. Keeping it isn't harmful — it can even be slightly faster by hinting Postgres to use the index — but it's not providing any extra security. RLS is the actual security layer.

**The real danger**: if you rely only on `.eq()` without RLS, anyone who bypasses your frontend can query anyone's data.

---

## Service Role Key vs User JWT

My Deno edge functions use the service role key:

```ts
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!  // bypasses RLS
)
```

This is correct for background jobs (like marking overdue invoices) because:
- There's no logged-in user context
- The job needs to read/write rows across ALL users
- RLS would block everything since `auth.uid()` is null

**Rule of thumb**:
```
User doing their own stuff  → user JWT (Supabase client handles it)
Background job / admin task → service role key (never expose to browser)
```

---

## Final Clean Auth Store

```ts
import { create } from 'zustand'
import type { User } from '../types/auth'
import { persist } from 'zustand/middleware'

export interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(persist(
  (set) => ({
    isAuthenticated: false,
    user: null,
    setUser: (user) => set({ user, isAuthenticated: true }),
    logout: () => set({ user: null, isAuthenticated: false })
  }),
  {
    name: 'auth-storage',
    partialize: (state) => ({
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      // no token — Supabase handles it
    }),
  }
))
```

---

## TL;DR

| Issue | Cause | Fix |
|---|---|---|
| Storing JWT in Zustand | Misunderstanding how Supabase client works | Remove token from store entirely |
| Logout not clearing session | Only clearing Zustand, not Supabase session | Call `supabase.auth.signOut()` before clearing Zustand |
| All DB ops failing after 10 mins | Refresh token expiry accidentally set to 600s | Set refresh token expiry to 604800s (1 week) |
| `.eq()` on every query | Not trusting RLS | RLS handles filtering — `.eq()` is redundant but harmless |

The biggest takeaway: **the Supabase JS client is not just a "door" to the database — it's a full auth middleware layer** that handles token storage, expiry checking, silent refresh, and header injection on every single request. You just write the business logic on top.