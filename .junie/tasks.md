### Goals and working assumptions
- Goal: Improve reliability, developer experience, and performance while keeping velocity sustainable for a solo dev.
- Stack: React 19, TypeScript 4.9, React Router v7, Three.js/React Three Fiber, MUI v7, Framer Motion, Jest/RTL. API layer in src/services/api.ts; auth in src/contexts/Authprovider.tsx; global state in src/contexts/AppContext.tsx.
- Constraints: Single developer, prefer incremental, low-risk tasks with clear rollback.

### Prioritized roadmap (Now → Next → Later)
- Now (1–2 weeks, highest ROI)
    1) Stabilize API + Auth flows
    2) Testing foundation (unit + component + minimal E2E)
    3) Type safety + lint/format enforcement
    4) Developer tooling + scripts
- Next (2–4 weeks)
    5) Error handling and UX consistency
    6) 3D performance tuning + loading states
    7) Security hardening
    8) CI: build, tests, lint, typecheck
- Later (4–8+ weeks)
    9) Observability + analytics
    10) Accessibility and theming polish
    11) Documentation and maintenance cadence
    12) Feature flags and experimentation

### Concrete task backlog (with suggested ticket titles and estimates)

#### 1) API layer hardening (src/services/api.ts)
- [T-API-01] Introduce precise Response/DTO types and narrow error types (0.5–1d)
    - Ensure all endpoints return typed data and consistent error shapes.
- [T-API-02] Centralize BASE_URL and headers; add AbortController + request timeout (0.5d)
- [T-API-03] Automatic retry for idempotent GETs with exponential backoff (0.5d)
- [T-API-04] Normalize error objects (status, code, message) and surface messages from API (0.5d)
- [T-API-05] Global 401/403 handling: token refresh or forced logout (0.5–1d)
    - Integrate with Token service in src/services/token.ts and Authprovider.

#### 2) Auth flow reliability (src/contexts/Authprovider.tsx, token.ts, pages/Login.tsx, Register.tsx)
- [T-AUTH-01] Strongly type AuthContext and custom hooks (0.25d)
- [T-AUTH-02] Implement refresh token flow with single-flight (queue in-flight requests) (1d)
- [T-AUTH-03] Persist session securely; if localStorage is used, add XSS mitigations (0.5d)
- [T-AUTH-04] Add logout on refresh failure + user feedback (0.25d)
- [T-AUTH-05] Tests for login/register/reset flows (1d)

#### 3) Testing foundation
- [T-TEST-01] Jest/RTL config with TS and path aliases (0.25d)
- [T-TEST-02] Component tests for critical UI (e.g., NodeDetails) (0.5d)
- [T-TEST-03] Unit tests for api.ts with mocked fetch and error paths (0.5d)
- [T-TEST-04] Smoke E2E: Playwright or Cypress (login → load graph) (1–1.5d)
- [T-TEST-05] Coverage thresholds (start lines ≥70%) and prepush hook (0.25d)

#### 4) Type safety + lint/format
- [T-TYPE-01] Enable strict TS options (noImplicitAny, strictNullChecks) (0.5d)
- [T-TYPE-02] Add ESLint (typescript-eslint) + Prettier and npm scripts (0.5d)
- [T-TYPE-03] Fix high-priority type/lint errors in contexts and services (1d)

#### 5) Error handling + UX consistency
- [T-UX-01] App-wide ErrorBoundary with friendly fallback UI (0.5d)
- [T-UX-02] Centralized toast/snackbar pattern via MUI for API errors (0.5d)
- [T-UX-03] Standardize loading states (skeletons/spinners) in pages (0.5–1d)
- [T-UX-04] Route guards for protected routes with redirect and preserve-intended-path (0.5d)

#### 6) 3D performance (React Three Fiber / Three.js)
- [T-3D-01] Audit re-renders: memoize props, use shallow state selectors, useMemo/useCallback (1d)
- [T-3D-02] Use instanced meshes for nodes/edges where feasible (1–2d)
- [T-3D-03] Lazy-load heavy 3D components and use Suspense (0.5d)
- [T-3D-04] Tune renderer: pixel ratio caps, shadows, materials to balance quality/perf (0.5d)
- [T-3D-05] FPS meter and dev toggle for profiling (0.25d)

#### 7) Security hygiene
- [T-SEC-01] Validate env usage; avoid leaking secrets to client bundles (0.25d)
- [T-SEC-02] Add security headers (via proxy/server) and document local setup (0.5d)
- [T-SEC-03] Sanitize/escape any user-provided content (e.g., labels/tooltips) (0.5d)
- [T-SEC-04] Dependency audit and updates (0.25d)

#### 8) CI setup
- [T-CI-01] GitHub Actions: Node 20, cache deps, install, build, typecheck (0.5d)
- [T-CI-02] Run tests, lint, upload coverage; fail on thresholds (0.5d)
- [T-CI-03] Require PR checks before merge (0.25d)

#### 9) Observability + analytics
- [T-OBS-01] Lightweight logger with levels; integrate inside api.ts and key flows (0.5d)
- [T-OBS-02] Error tracking (Sentry or alternative) with DSN via .env (0.5d)
- [T-OBS-03] Minimal usage analytics (page views, key feature events), opt-in (0.5d)

#### 10) Accessibility + theming
- [T-A11Y-01] Add jsx-a11y lint rules and fix violations (0.5d)
- [T-A11Y-02] Keyboard navigation for dialogs and 3D overlays; focus management (1d)
- [T-A11Y-03] Reduced-motion and high-contrast theme variants (0.5d)

#### 11) Documentation
- [T-DOC-01] Update README with scripts, env, troubleshooting (0.5d)
- [T-DOC-02] Developer Guide: structure, conventions, testing, perf tips (0.5d)
- [T-DOC-03] ADRs for key decisions (Auth, 3D perf, state mgmt) (0.5d)

#### 12) Feature flags
- [T-FLAG-01] Lightweight flag utility via .env or local JSON (0.5d)
- [T-FLAG-02] Gate experimental 3D optimizations and new UX (0.25d)

### Quick wins (1–2 days total)
- Add ErrorBoundary + toast notifications
- Normalize API error handling with a request() helper
- Typecheck and lint scripts; CI for build + tests
- Basic tests for api.ts and one critical component

### Suggested weekly plan (solo developer)
- Week 1: T-API-01/02/04/05, T-AUTH-01/04, T-TYPE-02, T-TEST-02, T-UX-01/02
- Week 2: T-TEST-03/04, T-TYPE-01/03, T-CI-01/02/03, T-SEC-04
- Week 3: T-3D-01/03/05, T-UX-03/04, T-SEC-01/03
- Week 4: T-3D-02/04, T-OBS-01/02, T-DOC-01/02

### Definition of Done (per task)
- Types complete; no implicit any
- Unit/component tests updated or added
- No new ESLint/Prettier errors; CI green
- Error and loading states handled
- Docs/changelog updated for user-facing changes

### Concrete file-level suggestions based on your recent files
- src/services/api.ts
    - Add a request() helper with timeout, retry, and consistent error shape.
    - Hook 401 handling into Token.refresh; replay failed requests after refresh.
    - Export typed functions (e.g., getAllConceptNames(): Promise<ConceptName[]>).
- src/contexts/Authprovider.tsx
    - Ensure context value is strongly typed: { user, isAuthenticated, login(), logout(), refresh() }.
    - Use a shared refresh promise to avoid multiple simultaneous refresh calls.
- src/contexts/AppContext.tsx
    - Define interfaces for global state; consider splitting contexts to reduce re-renders.
- src/pages/Login.tsx / Register.tsx
    - Add form validation and submit loading; show API errors via MUI Snackbar.
- .env
    - Keep only non-secret client-side vars; provide a .env.example and document required keys.

### Helpful npm scripts
- "typecheck": "tsc --noEmit"
- "lint": "eslint 'src/**/*.{ts,tsx}'"
- "format": "prettier --write 'src/**/*.{ts,tsx,js,jsx,json,css,md}'"
- "test:watch": "npm test -- --watch"

### Risks and mitigations
- Refactor churn: Ship behind feature flags; write tests first.
- Auth outages: Provide manual refresh + clear logout fallback; user-visible toasts.
- 3D perf regressions: Add FPS meter and toggle to disable instancing; profile regularly.

If you share specific pain points (e.g., slow scene, flaky login), I can reorder and refine this into a 2–4 week sprint plan tailored to your current bottlenecks.