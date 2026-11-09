This is a Dash-board to create various kinds of questions in french langauge.

## Stack

Next.js 15 (Pages Router) · React 19 · TypeScript · Mongoose 7 · Zustand · Zod · react-hook-form.
Package manager: **yarn** (`yarn.lock`).

## Environment

Create `.env.local` in the project root (it is gitignored):

| Variable | Required | Purpose |
|---|---|---|
| `MONGODB_URI` | yes | MongoDB connection string. Missing → the app throws on import. |
| `JWT_SECRET` | yes | Signs/verifies auth tokens. Missing → auth endpoints return 500. |
| `DB_NAME` | no | Database name override for the Mongoose connection. |
| `MAX_LOG_SIZE` | no | Max size in bytes of the local rotating log file (default 10 MB). |

## Getting Started

First register new user with email and password

then login with email and password

after login, you will be redirected to dashboard

on dashboard, you can create various kinds of questions

```bash
yarn install
yarn dev        # next dev --turbopack
yarn build      # production build, also type-checks the project
yarn start      # serve the production build
yarn test       # Jest (jsdom, babel-jest)
yarn lint       # next lint
```

## API routes

Auth (rate-limited, validated with Zod):

- `POST /api/auth/register`
- `POST /api/auth/login`

Every question type (`grammaire`, `situation`, `composition`, `passage`) exposes the
same routes; all of them require `Authorization: Bearer <token>`:

- `POST /api/questions/<type>/new` — create (201)
- `GET  /api/questions/<type>/random` — random question
- `GET  /api/questions/<type>/[id]` — question by `_id`
- `PUT  /api/questions/<type>/[id]/update` — update (author only)
- `DELETE /api/questions/<type>/[id]/delete` — delete (author only)

All routes answer with the same envelope:

```json
{ "success": true, "data": { } }
{ "success": false, "error": { "message": "…", "code": 400, "details": "…" } }
```

`/api/questions/_full-exam-disabled` is a placeholder (the leading `_` keeps it out
of Next.js routing) until real exam generation exists.
