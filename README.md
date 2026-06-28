# Pastebin Clone

A simple backend scaffold for a Pastebin-style app.

## Phase 1: Backend

- POST `/api/pastes`
  - `content`: string
  - `expiration`: `never`, `10m`, `1d`, `1w`
  - `visibility`: `public` or `unlisted`
- GET `/api/pastes/:id`
- In-memory paste store with expiration cleanup every minute

## Run locally

1. `cd pastebin-clone`
2. `npm install`
3. `npm run dev`

## Next phases

1. Add a real database (PostgreSQL chosen)
2. Build a frontend UI (React / Next.js)
3. Add cache and performance improvements
4. Add auth, private pastes, syntax highlighting

Note: The codebase now targets PostgreSQL for production. Database setup (local or Docker) will be done in the next phase; the app reads `DATABASE_URL` environment variable or falls back to `postgresql://postgres:postgres@localhost:5432/pastebindb`.
