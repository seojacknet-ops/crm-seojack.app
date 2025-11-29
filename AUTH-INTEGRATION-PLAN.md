# CRM Authentication Integration Plan

## Overview

This document outlines the plan to integrate authentication between **www.seojack.net** (marketing website) and **seojack.app** (client portal/CRM).

> **Note:** The CRM will be deployed to `seojack.app` domain.

---

## Current State

### www.seojack.net (Marketing Website)
- **Login Button:** Points to `https://seojack-ochre.vercel.app/` (old/legacy CRM)
- **Get Started CTA:** Also points to old CRM
- **`/login` page:** Empty placeholder (`<div>login page</div>`)
- **No Firebase:** Pure marketing site, no auth integration

### crm.seojack.net (CRM)
- **Auth Location:** Embedded inside the main dashboard page (`page.tsx`)
- **When not logged in:** Shows `AuthView` component on `/`
- **After login:** Shows dashboard on same `/` route
- **Problem:** No standalone login page, auth mixed with dashboard

---

## Desired State

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY FLOW                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   www.seojack.net                    crm.seojack.net                   │
│   ───────────────                    ────────────────                   │
│                                                                         │
│   ┌─────────────┐                   ┌──────────────────┐               │
│   │   NAVBAR    │                   │                  │               │
│   │  - Login    │─────────────────► │  /login          │               │
│   │  - Get      │                   │  (Standalone     │               │
│   │    Started  │                   │   Auth Page)     │               │
│   └─────────────┘                   │                  │               │
│                                     └────────┬─────────┘               │
│   ┌─────────────┐                            │                         │
│   │   HERO      │                            │ Auth Success            │
│   │  - CTA      │───────────────────────────►│                         │
│   │    Buttons  │                            ▼                         │
│   └─────────────┘                   ┌──────────────────┐               │
│                                     │  ROLE ROUTER     │               │
│   ┌─────────────┐                   │                  │               │
│   │  PRICING    │                   │  Check user:     │               │
│   │  - Try Free │───────────────────│  - role          │               │
│   │  - Buy Now  │                   │  - onboarding    │               │
│   └─────────────┘                   │    status        │               │
│                                     └────────┬─────────┘               │
│                                              │                         │
│                    ┌─────────────────────────┼─────────────────────┐   │
│                    │                         │                     │   │
│                    ▼                         ▼                     ▼   │
│           ┌───────────────┐        ┌───────────────┐      ┌──────────┐│
│           │   /admin      │        │  /onboarding  │      │    /     ││
│           │               │        │               │      │dashboard ││
│           │ Admin Command │        │ New User      │      │          ││
│           │ Center        │        │ Wizard        │      │ Returning││
│           │               │        │               │      │ Client   ││
│           └───────────────┘        └───────────────┘      └──────────┘│
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## User Types & Routing

| User Type | Conditions | Destination |
|-----------|------------|-------------|
| **Admin** | `role === 'admin'` | `/admin` |
| **New User** | `role === 'client'` + `onboardingComplete === false` | `/onboarding` |
| **Returning User** | `role === 'client'` + `onboardingComplete === true` | `/` (dashboard) |

---

## Implementation Tasks

### Phase 1: CRM - Create Standalone Login Page

#### 1.1 Create `/login` route in CRM
**File:** `src/app/login/page.tsx`

```tsx
// Standalone login page that handles:
// - Email/Password login
// - Google OAuth
// - New user registration
// - Password reset
// - Redirects based on user type after auth
```

**Features:**
- [ ] Clean, branded login UI (not embedded in dashboard)
- [ ] Tab switch: "Sign In" / "Create Account"
- [ ] Google OAuth button
- [ ] "Forgot Password" link
- [ ] Loading states
- [ ] Error handling with toast notifications
- [ ] Query param support for redirect after login (`?redirect=/onboarding`)

#### 1.2 Create Auth Redirect Logic
**File:** `src/lib/auth/redirect.ts`

```tsx
// Function to determine where to redirect user after login
export function getPostLoginRedirect(user: UserDocument): string {
  if (user.role === 'admin') {
    return '/admin';
  }
  if (!user.onboardingComplete) {
    return '/onboarding';
  }
  return '/'; // Dashboard for returning clients
}
```

#### 1.3 Create Protected Route Wrapper
**File:** `src/components/auth/ProtectedRoute.tsx`

```tsx
// HOC or component that:
// - Checks if user is authenticated
// - Redirects to /login if not
// - Optionally checks for specific roles
// - Shows loading state while checking auth
```

#### 1.4 Update Dashboard Page
**File:** `src/app/page.tsx`

**Changes:**
- [ ] Remove `AuthView` from dashboard
- [ ] Add `ProtectedRoute` wrapper
- [ ] Redirect unauthenticated users to `/login`
- [ ] Dashboard only shows for authenticated users

---

### Phase 2: CRM - Update Layout & Navigation

#### 2.1 Create Auth-Aware Layout
**File:** `src/app/layout.tsx`

- [ ] Don't show sidebar on `/login` route
- [ ] Don't show sidebar on `/onboarding` route (has its own layout)
- [ ] Show sidebar on all other routes

#### 2.2 Update Sidebar
**File:** `src/components/layout/Sidebar.tsx`

- [ ] Show different nav items based on role
- [ ] Admin sees: Dashboard, Clients, Projects, Inbox, Tickets, Users
- [ ] Client sees: Home, My Website, Messages, Media, Analytics, Support, Billing

---

### Phase 3: Marketing Website - Update CTAs

#### 3.1 Update Navbar
**File:** `www.seojack.net/src/components/Navbar.tsx`

**Changes:**
```tsx
// OLD
href="https://seojack-ochre.vercel.app/"

// NEW  
href="https://crm.seojack.net/login"
// OR for local dev:
href={process.env.NEXT_PUBLIC_CRM_URL || "https://crm.seojack.net"}/login
```

**Buttons to update:**
- [ ] "Login" link → `crm.seojack.net/login`
- [ ] "Get Started" button → `crm.seojack.net/login?action=register`
- [ ] Mobile menu Login → same
- [ ] Mobile menu Get Started → same

#### 3.2 Update Hero CTAs
**File:** `www.seojack.net/src/components/home/HeroSection.tsx`

- [ ] Primary CTA → `crm.seojack.net/login?action=register`
- [ ] Secondary CTA (if any) → appropriate CRM route

#### 3.3 Update Pricing Page CTAs
**File:** `www.seojack.net/src/app/pricing/page.tsx`

- [ ] "Try Free" buttons → `crm.seojack.net/login?plan=starter`
- [ ] "Get Started" buttons → `crm.seojack.net/login?plan={plan_name}`

#### 3.4 Add Environment Variable
**File:** `www.seojack.net/.env.local`

```env
NEXT_PUBLIC_CRM_URL=https://crm.seojack.net
# Local dev: http://localhost:3002
```

---

### Phase 4: Environment Configuration

#### 4.1 CRM Environment Variables
**File:** `crm.seojack.net/.env.local`

```env
# Existing Firebase config...

# Add marketing site URL for redirects
NEXT_PUBLIC_MARKETING_URL=https://seojack.net

# Auth redirect URLs
NEXT_PUBLIC_POST_LOGIN_REDIRECT=/
NEXT_PUBLIC_POST_LOGOUT_REDIRECT=https://seojack.net
```

#### 4.2 Firebase Auth Config
- [ ] Add `crm.seojack.net` to authorized domains in Firebase Console
- [ ] Add `localhost:3002` for local development
- [ ] Configure OAuth redirect URIs for Google Sign-In

---

### Phase 5: Admin Features

#### 5.1 Admin Route Protection
**File:** `src/app/admin/layout.tsx`

```tsx
// Wrap admin routes with role check
// Redirect non-admins to dashboard with error message
```

#### 5.2 User Impersonation (Optional)
**File:** `src/services/auth.ts`

```tsx
// Allow admins to impersonate clients for debugging
// Already partially implemented (see mapImpersonatedUser)
```

---

## File Structure After Implementation

```
crm.seojack.net/
├── src/
│   ├── app/
│   │   ├── login/
│   │   │   └── page.tsx          # NEW: Standalone login page
│   │   ├── admin/
│   │   │   ├── layout.tsx        # UPDATE: Add role protection
│   │   │   └── ...
│   │   ├── onboarding/
│   │   │   └── page.tsx          # EXISTS: Wizard for new users
│   │   ├── page.tsx              # UPDATE: Remove AuthView, add ProtectedRoute
│   │   └── layout.tsx            # UPDATE: Conditional sidebar
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx     # NEW: Reusable login form
│   │   │   ├── RegisterForm.tsx  # NEW: Reusable register form
│   │   │   └── ProtectedRoute.tsx # NEW: Auth wrapper
│   │   └── ...
│   └── lib/
│       └── auth/
│           └── redirect.ts       # NEW: Post-login routing logic
```

---

## URL Routing Summary

| URL | Purpose | Auth Required | Role |
|-----|---------|---------------|------|
| `/login` | Authentication | ❌ | Any |
| `/login?action=register` | Registration | ❌ | Any |
| `/` | Client Dashboard | ✅ | Client |
| `/onboarding` | New User Setup | ✅ | Client (new) |
| `/admin` | Admin Dashboard | ✅ | Admin |
| `/admin/*` | Admin Functions | ✅ | Admin |

---

## Testing Checklist

### Login Flow
- [ ] Email/password login works
- [ ] Google OAuth login works
- [ ] Registration creates new user in Firestore
- [ ] Password reset email sends
- [ ] Invalid credentials show error
- [ ] Rate limiting works (if implemented)

### Role-Based Routing
- [ ] Admin → redirected to `/admin`
- [ ] New client → redirected to `/onboarding`
- [ ] Returning client → redirected to `/`
- [ ] Unauthenticated → redirected to `/login`

### Protected Routes
- [ ] Dashboard requires auth
- [ ] Admin routes require admin role
- [ ] Onboarding accessible to new users only
- [ ] Completed users can't re-access onboarding

### Cross-Site Integration
- [ ] www.seojack.net Login → opens CRM login
- [ ] www.seojack.net Get Started → opens CRM registration
- [ ] Pricing page CTAs work correctly
- [ ] Mobile navigation works

---

## Deployment Considerations

### DNS/Domains
- [ ] `crm.seojack.net` configured and pointing to Vercel
- [ ] SSL certificate active
- [ ] CORS configured for cross-origin requests (if needed)

### Firebase
- [ ] `crm.seojack.net` added to authorized domains
- [ ] Google OAuth redirect URIs updated
- [ ] Firestore security rules reviewed

### Vercel
- [ ] Environment variables set in Vercel dashboard
- [ ] Preview deployments use dev Firebase project (optional)

---

## Questions to Clarify

1. **Domain:** Will the CRM be at `crm.seojack.net` or another subdomain?
2. **Onboarding Re-entry:** Can users who completed onboarding edit their info later?
3. **Multiple Projects:** Can one user have multiple websites/projects?
4. **Admin Creation:** How are admin accounts created? (Manual Firestore edit, invite system?)
5. **Session Persistence:** How long should sessions last before requiring re-login?

---

## Priority Order

1. **High:** Create `/login` page in CRM
2. **High:** Add role-based redirect logic
3. **High:** Update www.seojack.net CTAs
4. **Medium:** Add ProtectedRoute wrapper
5. **Medium:** Update sidebar for role-based nav
6. **Low:** User impersonation for admins
7. **Low:** Analytics/tracking on auth events

---

## Estimated Timeline

| Phase | Tasks | Time Estimate |
|-------|-------|---------------|
| Phase 1 | Standalone Login Page | 2-3 hours |
| Phase 2 | Layout Updates | 1-2 hours |
| Phase 3 | Marketing Site CTAs | 30 mins |
| Phase 4 | Environment Config | 30 mins |
| Phase 5 | Admin Features | 1-2 hours |
| Testing | End-to-end testing | 1 hour |

**Total: ~6-8 hours**

---

## Next Steps

1. Review this plan and confirm requirements
2. Answer clarifying questions above
3. Begin Phase 1 implementation
4. Test locally with both projects running
5. Deploy CRM to `crm.seojack.net`
6. Update marketing site CTAs
7. End-to-end testing in production

---

*Document created: November 29, 2025*
*Last updated: November 29, 2025*

