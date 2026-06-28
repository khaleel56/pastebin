# Pastebin Clone

A simple paste-sharing app built with Node.js, Express, MySQL, and EJS. It lets users create a text paste, get a shareable URL, copy it, and view the paste later.

## What is implemented

- A simple UI built with EJS for creating paste content
- A POST endpoint to save a paste
- A GET endpoint to view a paste by its short ID
- Expiration options including `never`, `1m`, `10m`, `1d`, and `1w`
- A shareable URL like `/pastes/<id>`
- A copy-to-clipboard button for sharing
- Basic expiration handling so expired pastes stop being visible
- A sensitive-paste option that encrypts content in the browser before it is sent to the server
- A passphrase-based decryption flow for viewing sensitive pastes

## API

### Create a paste

- `POST /api/pastes`
- Body:
  - `content`: string
  - `expiration`: `never`, `1m`, `10m`, `1d`, `1w`
  - `visibility`: `public` or `unlisted`

### View a paste

- `GET /pastes/:id`

## How short URLs are generated

Each paste gets a short unique identifier using the `nanoid` package. This keeps the URL short and easy to share while avoiding long database IDs.

## Tech stack

- Node.js
- Express
- EJS for server-rendered views
- MySQL for persistent storage
- `nanoid` for short paste IDs
- Web Crypto API for browser-side encryption using AES-GCM and PBKDF2

## How it was built

The app follows a simple layered structure:

1. Routes handle incoming HTTP requests
2. Controllers process request data and responses
3. Services contain the business logic
4. The database layer stores and retrieves paste records

This keeps the code organized and easy to extend as features grow.

## Design principles used

- Simplicity: the app starts with a minimal feature set that is easy to understand
- Separation of concerns: routes, controllers, services, and database logic are kept separate
- Fast iteration: EJS and Express allow quick UI and backend changes without heavy setup
- User-friendly sharing: the app focuses on a short link and one-click copy experience
- Privacy by design: sensitive content is encrypted in the browser before it reaches the server

## Run locally

1. `cd pastebin-clone`
2. `npm install`
3. Start MySQL (or use Docker Compose)
4. `npm start`

## Docker database

A MySQL container is available through Docker Compose:

```bash
docker compose up -d db
```

## Next steps

1. Add user login and registration
2. Add private pastes for logged-in users
3. Improve dark mode support
4. Add syntax highlighting and paste editing
5. Add a better recovery flow for forgotten passphrases
