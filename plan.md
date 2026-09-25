# exams-platform — Full Optimization Report

**Scope:** Codebase review of the Next.js 15 Pages Router app (French question dashboard).  
**Goal:** Ranked, evidence-based work — not a rewrite. Keep Pages Router; do not migrate to App Router as a first step.

---

## Current architecture (what the app actually is)

```
Pages Router (src/pages)
  ├── Public: / (home + login form), /user/login, /user/register, /user/profile
  ├── Auth-gated UI (client-only): /dash-board + 4 question forms
  └── API: /api/auth/{login,register} + 8 question routes + /api/questions/full-exam

MongoDB (Mongoose): User, Grammaire, Situation, Composition, Passage
Zustand persist (localStorage): user + JWT
Zod: question create bodies only
```

The product today is a **question authoring dashboard**. Exam generation, exam history, and taking exams are UI stubs or broken links. Optimization should follow that reality: lock down authoring first, then build exams — do not DRY exam code that does not exist yet.

---

## Priority legend

| P | Meaning |
|---|---|
| P0 | Security / correctness — ship before production |
| P1 | High waste or high duplication — cheap, high leverage |
| P2 | Architecture that pays off as features grow |
| P3 | Polish, DX, performance at small scale |

---

## P0 — Security and correctness

### 1. JWT is issued but never enforced

Login/register mint a 24h JWT and store it in Zustand + localStorage. `fetcher.ts` always POSTs JSON with **no `Authorization` header**. No API route verifies the token.

**Impact:** Anyone can `POST /api/questions/*/new` and `GET .../random` without an account.

**Do this:**

- Fail startup if `JWT_SECRET` is missing. Remove `|| "your-secret-key"` in:
  - `src/pages/api/auth/login/index.ts`
  - `src/pages/api/auth/register/index.ts`
- Add `JWT_SECRET` to `modules.d.ts` `ProcessEnv`.
- Create `src/middleware/auth-middleware.ts` for Pages API: read `Authorization: Bearer`, verify with `jsonwebtoken`, return 401, attach `{ userId, email }` to the request.
- Protect **all write routes** (`.../new`) and **auth-only reads** (`.../random`, `full-exam`).
- Attach the token in `fetcher` from `useAuthStore.getState().token`.

Do **not** rely on `src/pages/dash-board/index.tsx` `useEffect` redirects. Question pages (`grammaire`, `situation`, `composition`, `passage`) have **no auth check**. Client redirects are UX, not security.

**Better later (not blocking):** move JWT to an httpOnly cookie so XSS cannot steal it from `localStorage`. Keep Bearer-in-header as the first increment.

### 2. Auth endpoints are under-validated and brute-forceable

- Login/register skip Zod; they use ad-hoc checks.
- Register uses a weak email regex and password rule (8 chars + letter + number).
- Duplicate-email check is TOCTOU: two parallel registers can race; Mongoose unique index will throw 500 instead of 409 unless you catch `11000`.
- No rate limit on login/register.

**Do this:** shared `src/shared/schemas/auth.schema.ts`, wrap both auth handlers with `validateBodyMiddleware`, catch duplicate-key, add in-memory rate limit (or Upstash if you deploy serverless).

### 3. Broken product surfaces (user-facing 404 / compile risk)

| Surface | Problem |
|---|---|
| `NewTestNav` | Routes to `/dash-board/generate-exam` and `/dash-board/exam-history` — **pages do not exist**. |
| `RegisterForm` | Link is `href="/login"`; real login is `/user/login`. |
| `AddToExamButton` | Imports `src/pages/context` — **file does not exist**. |
| `RefreshButton` | Uses `next/navigation` (`router.refresh`) in a **Pages Router** app. Unused, but will confuse anyone who wires it in. |
| Home (`src/pages/index.tsx`) | Renders `LoginForm` **and** a dedicated `/user/login` exists. Duplicate login UX. |
| `/api/questions/full-exam` | Comment says “full exam”; implementation is a copy of **grammaire random GET**. Misleading API. |

**Do this:** hide or disable exam nav until pages exist; fix the register link; delete unused `add-to-exam` + `refresh` (or finish them); make `/` a landing that links to login, not a second login form; rename or implement `full-exam`.

### 4. Client forms treat HTTP errors as success

`fetcher` **does not throw** on 4xx/5xx; it returns `{ data: null, error, status }`.

- `dash-board/grammaire`, `situation`, `composition` ignore `response.error` and only `console.log`.
- `dash-board/passage` does the same **and does not rethrow**, so `PassageForm` always shows success toast.

**Do this:** one `submitQuestion(path, data)` helper that throws if `!response.ok` / `response.error`, and use it on all four dashboards. Make passage rethrow like the others.

### 5. Logging will fail or leak on real hosting

`src/utils/logger.ts` appends to `logs/api-errors.log` via `fs`. That is fine locally; on Vercel/serverless the filesystem is ephemeral / often read-only. Validation middleware also logs **`requestBody`**, which would include passwords if auth used it.

**Do this:** log to `console.error` in production (platform log drain); keep file logs for local only. Never log password fields. Redact bodies.

---

## P1 — Dead code, deps, and cheap wins

### 6. Delete unused files

| File | Why |
|---|---|
| `src/services/master.service.ts` | Duplicate `getRandomQuestion` for Grammaire; **zero imports**. |
| `src/shared/schemas/exam.schema.ts` | Placeholder comments only. |
| `src/utils/answers-validtor.ts` | `validateAnswers` never imported (also typo in filename). |
| `src/components/buttons/add-to-exam/index.tsx` | Unused + broken import. |
| `src/components/buttons/refresh/index.tsx` | Unused + wrong router. |
| `src/components/instructions/index.tsx` | Placeholder copy, unused by pages (only tests). Keep only if you are about to build exam-taking. |

### 7. Shrink `package.json`

Remove (unused in app code):

- `node-fetch` — native `fetch` in `fetcher.ts`; only `global.d.ts` types `Response` from `node-fetch`.
- `@types/node-fetch`
- `dotenv` — Next.js loads `.env.local`.
- `@types/mongoose` — Mongoose 7 ships types; this package is the old v5 types and can fight the real ones.

Move to `devDependencies`: `eslint`, `eslint-config-next`, `@types/node`, `@types/react`, `@types/react-dom`, `@types/bcryptjs`, `@types/jsonwebtoken`.

Jest maps CSS to `identity-obj-proxy` but it is **not in package.json** — add it as a devDep or drop the mapper.

**Also:** `global.d.ts` overrides global `fetch` with node-fetch’s `Response`. Delete that override; use DOM/lib types.

### 8. `ensureError` helper

There are many `error instanceof Error ? error : new Error("Unknown error")` copies (services + API routes). One `src/utils/ensure-error.ts` is enough. Low risk.

### 9. Fix `global.mongoose` typing

In `src/lib/mongoose-client.ts`, replace `var mongoose: any` with:

```typescript
declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}
```

(`declare global { var mongoose }` must stay `var` for the cache pattern.)

### 10. `tsconfig.json`

- Remove `"./src/types"` from `typeRoots` so ambient types are not auto-injected from that folder.
- `"lib"` already has `dom` + `esnext`; `"ES2015"` is redundant.
- `"types": ["node", "jest"]` is fine for this repo.

### 11. Next.js config (small)

```js
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true, // default is already true in Next; explicit is documentation
};
```

Do not enable image remote domains until you serve images.

---

## P2 — DRY where the duplication is real

### 12. Question services (~4 copies of the same class)

`grammaire`, `situation`, `composition`, `passage` each copy:

- `ServiceErrorCodes` / `XxxServiceResponse`
- `getRandomQuestion` (`$match` + `$sample: 1`)
- `createQuestion` try/catch + `connectToDB` + `save` + `logError`

`contextInfo` is **accepted and never used**.

**Do this:** `BaseService` (or a few functions) with a per-type `toDocument(formData)` mapper. Keep services as thin wrappers. One `ServiceResponse<T>` and one `ServiceErrorCodes`.

**Do not** merge Mongo collections yet. Discriminators are a later data-model choice, not a refactor of today’s four collections.

### 13. API route factories

Eight files (`{type}/new` and `{type}/random`) share the same method check, `logApiError`, and JSON shape. `full-exam` is a ninth clone of grammaire random.

**Do this:** `src/utils/api-handlers.ts`:

- `createNewQuestionHandler(service, messages)`
- `createRandomQuestionHandler(service, messages)`

Then: `export default auth(validateBody(schema)(createNewQuestionHandler(...)))`.

Return **201** on create (today all creates return 200).

### 14. Dashboard submit pages

Four pages copy the same `handleSubmit` + `console.log`/`console.error`. One generic page or `useQuestionCreate(path)` hook.

Also: all four default exports are named `DashBoard` — rename per type for stack traces.

### 15. Zod option helper

`createOptionSchema` is duplicated in `grammaire.schema.ts` and `situation.schema.ts`. Extract `src/shared/schemas/option.ts`.

### 16. One API response type

Today:

- Services: `{ success, data?, error?: { message, code, details } }`
- Routes: `{ status: "success"|"error", message, data, details? }`
- Fetcher: `{ data, error, status: number }`
- Auth routes: `{ message, token?, user? }` — third shape

**Recommendation:** keep HTTP status as the transport; body is:

```typescript
interface ApiResponse<T = null> {
  success: boolean;
  data?: T;
  error?: { message: string; code: number; details?: string };
}
```

Update `fetcher` to parse that once. Auth can still return `token` inside `data`.

### 17. Auth UI duplication

Login and register are large copies of controlled inputs. Question forms already use react-hook-form + Zod. Use the same for auth forms (and share the Zod schema with the API).

Extract a small `AuthGuard` (redirect + `null` while checking) used by dashboard **and** all `/dash-board/*` pages. Handle Zustand persist **hydration** (`persist` has `onRehydrateStorage` / `skipHydration`) so the first paint does not flash-redirect to login.

---

## P3 — Data model, performance, frontend, tests, DX

### 18. MongoDB

- `situationSchema.index({ id: 1 })` and `passageSchema.index({ id: 1 })` index a field that **does not exist**. Documents use `_id`. Remove these indexes.
- `$sample` after `$match: {}` is a collection sample — OK at hundreds of docs; expensive at tens of thousands. When you filter (difficulty, topic), add indexes on those fields **before** `$sample`.
- `connectToDB` uses `bufferCommands: true` (comment says it “solved delay”). That hides connection failures until the first query. Prefer fail-fast (`bufferCommands: false`) once URI/pooling is stable.
- User `comparePassword` is not on `IUserModel` — TypeScript does not know the method. Use `interface IUser extends Document { comparePassword(p: string): Promise<boolean> }`.
- `bcryptjs` cost 10 is fine. `bcrypt` native is faster but worse DX on some hosts; no need to change.

Optional later: one `questions` collection with a `kind` discriminator if you need “full exam from mixed types” without four round-trips.

### 19. Frontend performance / layout

- `_app.tsx` wraps **every** page in `Layout` (header + footer + nested white card). Dashboard already has its own `min-h-screen` nav — **double chrome and double scroll**. Use a per-page layout (`Component.getLayout`) so auth/dashboard can skip the marketing shell.
- `Header` imports `tailwindcss/tailwind.css` **in the component**. CSS should only enter via `styles/globals.css` in `_app`. Duplicate Tailwind inflate CSS.
- `DateDisplay` `setInterval` 30s on every page for a **calendar date** that changes once a day. Render the date once; drop the interval.
- Home `Head` sets `viewport` — Next.js already injects it from `_document`/`next`. Redundant.
- Home meta is still `"Generated by create next app"`.
- Fetcher is POST-only with a 10s abort. Random question APIs are GET — you cannot reuse fetcher until it accepts `method`.
- Question form option errors use `errors[\`options.${index}\`]` but the schema fields are `a`,`b`,`c`,`d` — option field errors never show. Bind `errors.a`, `errors.b`, etc.

### 20. Mixed Next.js mental models

The repo is Pages Router (`src/pages`, `NextApiRequest`). A few files use `'use client'` and `next/navigation`. That is App Router API. Stick to `next/router` until you actually migrate.

A full App Router + Route Handlers migration is **out of scope** for optimization. It would touch every page and API. Revisit after P0–P2.

### 21. Tests and lint

Strength: many component tests.

Gaps:

- **No tests** for question services or API handlers (except validate-body middleware).
- `identity-obj-proxy` missing (see §7).
- `@testing-library/react` is v14 while React is 19 — upgrade when tests start failing on concurrent features.
- `.eslintrc.json` only sets `react/display-name`. Add `@typescript-eslint` unused-vars, and `react-hooks/exhaustive-deps`.
- `next lint` is not wired to CI in this repo (no GitHub Actions visible). Add a `lint` + `test` + `build` CI job when you have a remote.

### 22. Docs and comments

- README is three steps and does not mention env vars (`MONGODB_URI`, `JWT_SECRET`).
- Many files have long JSDoc that restates the next line. Prefer documenting **invariants** (e.g. “rightAnswer must be a letter in options”) over restating `save()`.

---

## What to keep (already in good shape)

- Zod on question **create** bodies + `validateBodyMiddleware`.
- Connection cache on `global.mongoose` (correct Next.js pattern).
- Password hashing in a pre-save hook; login uses generic “Invalid credentials”.
- Zustand persist for client session (once APIs verify JWT).
- `$sample` for random pick at current scale.
- Shared input primitives (`base-input`, react-hook-form generics) on question forms.
- `logs/` already gitignored.

---

## Suggested execution order

```
Phase 0 — Stop the bleeding (P0)
  Fix fetcher error handling + passage toast false success
  Fix /login link
  Hide exam nav or add 404-safe placeholder pages
  Delete or quarantine broken add-to-exam / refresh
  JWT_SECRET required; auth middleware on write APIs; fetcher sends Bearer
  Rate-limit auth; Zod auth schema; duplicate-key 409

Phase 1 — Cleanup (P1)
  Delete dead files and unused deps
  Fix global.d.ts fetch types
  ensureError + mongoose global type + tsconfig typeRoots
  poweredByHeader: false

Phase 2 — Structure (P2)
  BaseService + api-handlers
  Thin service/route files
  Unified ApiResponse + fetcher
  AuthGuard + RHF auth forms
  Per-page layout (drop double chrome)

Phase 3 — Data & polish (P3)
  Drop bogus `id` indexes
  Fix option error paths in forms
  Logger: console in prod, redact bodies
  GET support in fetcher
  Service/API tests, ESLint, README env section
  Only then: real exam generate/history + real full-exam aggregator
```

---

## File-level change map

| File | Action |
|---|---|
| `src/services/master.service.ts` | DELETE |
| `src/shared/schemas/exam.schema.ts` | DELETE |
| `src/utils/answers-validtor.ts` | DELETE |
| `src/components/buttons/add-to-exam/index.tsx` | DELETE (or implement after exam context exists) |
| `src/components/buttons/refresh/index.tsx` | DELETE |
| `global.d.ts` | DELETE or strip node-fetch `fetch` override |
| `package.json` | Remove unused deps; move types to devDeps; add `identity-obj-proxy` |
| `src/middleware/auth-middleware.ts` | CREATE |
| `src/shared/schemas/auth.schema.ts` | CREATE |
| `src/utils/ensure-error.ts` | CREATE |
| `src/utils/api-handlers.ts` | CREATE (Phase 2) |
| `src/services/base.service.ts` | CREATE (Phase 2) |
| `src/utils/fetcher.ts` | MODIFY — method, Bearer, throw/return errors consistently |
| `src/pages/api/auth/login/index.ts` | MODIFY — no fallback secret, Zod, rate limit |
| `src/pages/api/auth/register/index.ts` | Same + duplicate-key handling |
| `src/pages/api/questions/**` | MODIFY — auth + factory |
| `src/pages/api/questions/full-exam/index.ts` | FIX or rename — not a full exam today |
| `src/lib/mongoose-client.ts` | MODIFY — typed cache |
| `src/types/auth.ts` | MODIFY — `comparePassword` |
| `src/types/common.ts` | MODIFY — one response type |
| `src/store/auth-store.ts` | MODIFY — hydration |
| `src/pages/dash-board/**` | MODIFY — AuthGuard, shared submit, check `fetcher` errors |
| `src/components/forms/user/register-form.tsx` | FIX `/user/login` |
| `src/components/dash-board/new-test-nav/index.tsx` | Hide until routes exist |
| `src/components/header/index.tsx` | Remove Tailwind CSS import |
| `src/components/header/date-display.tsx` | Drop 30s interval |
| `src/pages/_app.tsx` | Optional getLayout |
| `src/pages/index.tsx` | Landing, not second login |
| `src/models/questions/situation.model.ts` | Remove `{ id: 1 }` index |
| `src/models/questions/passage.model.ts` | Remove `{ id: 1 }` index |
| `src/utils/logger.ts` | Prod = stdout; redact |
| `tsconfig.json` | typeRoots |
| `next.config.js` | poweredByHeader |
| `.eslintrc.json` | stricter TS/hooks |
| `README.md` | Env + real routes |
| Four `*.service.ts` | Thin wrappers (Phase 2) |

---

## Explicit non-goals (do not start here)

- Migrating the whole app to App Router / Server Actions.
- Merging four question collections into one before exam generation exists.
- Redis/queue/CDN — traffic is dashboard-scale.
- Replacing Mongoose with Prisma/Drizzle for its own sake.
- Adding `express-rate-limit` as a dependency if a 20-line Map-based limiter is enough for a single Node process (use a shared store only when you have multiple instances).
