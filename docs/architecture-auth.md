# Authentication & Login Modal Flow

This document describes the current authentication architecture and login modal flow in the Biga Pizza App.

## Providers (top → bottom)

1. **BrowserRouter**
2. **AuthProvider**
   - **State**: `user`, `token`, `isAuthenticated`
   - **Methods**: `login(user, token)`, `logout()`
   - **Side effects**:
     - On mount: hydrate from `localStorage.user`, set axios `Authorization` header
     - On `login`: set state + localStorage + axios header
     - On `logout`: clear state + localStorage + axios header (best effort POST `/logout`)
3. **DefaultsProvider**
   Loads user defaults if authenticated.
4. **RecipeProvider**
   Form/schedule state for editor & guided input flow (GIF).
5. **AuthModalProvider**
   - **State**: `isModalOpen`
   - **Methods**: `openAuthModal()`, `closeAuthModal()`

> All providers wrap `<App />` in `main.jsx`.

---

## Mount Points

- **Navbar** uses:

  - `useAuth()` → `isAuthenticated`
  - `useAuthModal()` → `openAuthModal()`

- **AppInner** mounts the modal once:
  ```jsx
  const { isModalOpen, closeAuthModal } = useAuthModal();
  <AuthModal isOpen={isModalOpen} onClose={closeAuthModal} />;
  ```

---

## Primary User Flows

### A) Open Login Modal

1. Navbar "Login" button visible when `!isAuthenticated`.
2. Click → `openAuthModal()` → `isModalOpen = true`.
3. `AuthModal` renders (prop-driven by `isModalOpen`).

### B) Submit Login

1. Modal form submits to API → returns `{ user, token }`.
2. Call `login(user, token)` from **AuthContext**:
   - Set state: `user`, `token`
   - Persist: `localStorage.user = { ...user, token }`
   - Set `axios.defaults.headers.common.Authorization = Bearer <token>`
   - Toast “Welcome back, {name}”
3. Modal closes via `closeAuthModal()`.
4. Navbar re-renders → shows `NavbarUserMenu` instead of Login.

### C) Logout

1. User menu → “Logout”.
2. `logout()`:
   - POST `/api/auth/logout` (best effort)
   - Clear state + `localStorage.user`
   - Remove axios header
   - Toast “Logged out”
3. Navbar re-renders → shows Login button.

---

## Overlay Editor (FYI)

- Create (logged in): `/editor/create` → `ModalRecipeEditor mode="create"`
- Edit: `/editor/:id` → `ModalRecipeEditor mode="edit"`
- Overlay controlled by `backgroundLocation` in `navigate` state.

---

## Guardrails & Gotchas

- **One modal mount**: `<AuthModal />` should only mount once in `AppInner`.
- **Named hooks**: Always import with named exports from contexts.
- **Pointer events**: Ensure Navbar is clickable (`z-50`), and overlays don't block it.
- **Unauthorized warnings**: `DefaultsProvider` skips fetch when `!isAuthenticated`.
- **Hydration**: If `localStorage.user` is invalid, `AuthProvider` clears it.

---

## Manual Test Checklist

- [ ] Fresh load logged out → Login button visible; click opens modal.
- [ ] Login success → modal closes; user menu appears; protected routes work.
- [ ] Refresh → still logged in (axios header set).
- [ ] Logout → user menu replaced by Login; protected routes redirect/deny.
- [ ] Open Create (logged out) → guided flow; (logged in) → `/editor/create` overlay.

---

**File last updated:** 2025-08-15
