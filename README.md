# VC Elevate Painting

A Vite + React + TypeScript marketing site with an Express API and PostgreSQL inquiry database.

## Architecture

```text
React estimate form
        | HTTPS + JSON
        v
Express API: POST /api/inquiries
        | parameterized SQL through pg.Pool
        v
PostgreSQL: inquiries table
```

React never connects directly to PostgreSQL. `DATABASE_URL` and all server secrets belong only in `server/.env`; never put database credentials in frontend code or a `VITE_*` variable.

The backend stores website inquiries only. It does not provide accounts, estimates, payments, projects, or an admin screen.

## Prerequisites

- Node.js 20 or newer
- npm
- PostgreSQL 13 or newer

PostgreSQL 13+ supplies `gen_random_uuid()`, so the migration needs no extension.

## First-time setup

### 1. Install both packages

```bash
npm install
cd server
npm install
cd ..
```

If PowerShell blocks `npm.ps1`, use `npm.cmd` instead of `npm`.

### 2. Create the database

```bash
createdb vc_elevate_painting
```

Alternatively, run `CREATE DATABASE vc_elevate_painting;` in `psql`.

### 3. Configure the backend

PowerShell:

```powershell
Copy-Item server/.env.example server/.env
```

macOS/Linux:

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```dotenv
DATABASE_URL=postgresql://postgres:your-password@localhost:5432/vc_elevate_painting
PORT=8787
FRONTEND_ORIGIN=http://localhost:5173
NODE_ENV=development
DATABASE_SSL=false
TRUST_PROXY=false
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=5
```

Do not commit `server/.env`; it is ignored by Git.

### 4. Apply the migration

```bash
npm run db:migrate
```

The runner applies SQL files in `server/db/migrations/` in filename order and records them in `schema_migrations`. Re-running it skips migrations already applied.

The initial migration creates `inquiries` with UUID IDs, constraints, status/source fields, timezone-aware timestamps, an `updated_at` trigger, and a `(status, created_at DESC)` index. Phone and email syntax are enforced by the API.

## Running locally from now on

Use two terminals from the project root.

Terminal 1 - backend:

```bash
npm run dev:server
```

Terminal 2 - frontend:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- API: `http://127.0.0.1:8787`
- Health: `http://127.0.0.1:8787/api/health`

Vite proxies `/api/*` to port `8787` during development. The form posts to `/api/inquiries` and contains no credentials.

The API can start while PostgreSQL is unavailable. Invalid requests still receive `400` field errors; valid submissions receive a generic `503` until the database is reachable.

## Environment variables

Backend variables are validated at startup.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Server-only PostgreSQL URL. |
| `FRONTEND_ORIGIN` | Yes | Exact allowed browser origin, without a trailing slash. |
| `PORT` | No | API port; default `8787`. |
| `NODE_ENV` | No | `development`, `test`, or `production`. |
| `DATABASE_SSL` | No | `true` only when the provider requires trusted TLS. |
| `TRUST_PROXY` | No | `true` only behind one trusted reverse proxy. |
| `RATE_LIMIT_WINDOW_MS` | No | Window; default 15 minutes. |
| `RATE_LIMIT_MAX` | No | Requests per window/IP; default 5. |

Follow the database provider's TLS instructions. Do not disable certificate verification in application code.

## API contract

### `POST /api/inquiries`

Use `Content-Type: application/json`.

```json
{
  "name": "Alex Rivera",
  "phone": "(760) 555-0142",
  "email": "alex@example.com",
  "service": "Exterior painting",
  "location": "San Diego",
  "message": "Please quote the exterior of my two-story home."
}
```

Success (`201`):

```json
{
  "success": true,
  "inquiryId": "00000000-0000-0000-0000-000000000000",
  "createdAt": "2026-08-19T12:00:00.000Z"
}
```

Validation failure (`400`):

```json
{
  "success": false,
  "errors": { "email": "Please enter a valid email address." }
}
```

The API never returns submitted customer data, SQL details, database errors, or stack traces.

## Form behavior

- Client feedback plus server-side validation
- Synchronous duplicate-submit guard
- Disabled `Sending inquiry...` state
- Only known server field errors are displayed
- Values remain after network/server failures
- Success appears only after API acceptance
- Hidden honeypot for basic bot filtering
- 15-second timeout with a safe retry message

The backend service allowlist mirrors `serviceOptions` in `src/data/siteContent.ts`. When services change, also update `INQUIRY_SERVICE_OPTIONS` in `server/src/validation/inquiry.ts`.

## Security baseline

- Helmet and exact-origin CORS
- 20 KB JSON limit and JSON content-type enforcement
- Zod validation and parameterized SQL
- Five inquiry attempts per 15 minutes/IP by default
- Honeypot requests acknowledged without storage
- Generic client errors and PII-free request logs
- One reusable `pg.Pool` and graceful shutdown

The limiter uses process memory for the initial single-instance MVP. Use a shared store such as Redis before horizontally scaling.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Vite. |
| `npm run dev:server` | Start the API in watch mode. |
| `npm run db:migrate` | Apply pending migrations. |
| `npm run build` | Build the frontend. |
| `npm run build:server` | Compile to `server/dist/`. |
| `npm run build:all` | Build frontend and backend. |
| `npm run lint` | Lint all TypeScript. |
| `npm run typecheck:server` | Type-check the backend. |
| `npm run test:server` | Run validation tests. |
| `npm run preview` | Preview the frontend build. |

## Test an inquiry manually

With PostgreSQL, the migration, and backend running:

```powershell
$body = @{
  name = 'Alex Rivera'
  phone = '(760) 555-0142'
  email = 'alex@example.com'
  service = 'Exterior painting'
  location = 'San Diego'
  message = 'Please quote the exterior of my two-story home.'
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri 'http://127.0.0.1:8787/api/inquiries' `
  -ContentType 'application/json' `
  -Body $body
```

Verify without selecting full customer messages:

```bash
psql "$DATABASE_URL" -c "SELECT id, name, status, source, consent_to_contact, created_at FROM inquiries ORDER BY created_at DESC LIMIT 5;"
```

## Manual checklist

1. Valid inquiry: one `201` and one row with `new`, `website`, and consent true.
2. Bad email, short phone, or unknown service: field error, retained values, no row.
3. Overlong field: `400`; JSON over 20 KB: `413`.
4. Backend unavailable: retry/call message and button re-enabled.
5. Database unavailable: generic `503` without database details.
6. Rapid submissions: UI blocks duplicates; direct bursts eventually receive `429`.
7. SQL-like text remains literal data or is rejected by the service allowlist.
8. Verify loading, focus, errors, success, and retry on mobile.
9. Blank honeypot stores normally; populated honeypot creates no row.

## Production

```bash
npm ci
npm run build

cd server
npm ci
npm run build
npm run db:migrate:prod
npm start
```

Production requirements:

1. Store backend variables in the host's secret manager; set exact HTTPS `FRONTEND_ORIGIN` and `NODE_ENV=production`.
2. Run migrations as a release step before the new API starts.
3. Route public `/api/*` to Express; Vite's development proxy is not deployed in `dist/`.
4. Serve everything over HTTPS and set `TRUST_PROXY=true` only behind one trusted proxy.
5. Configure backups, monitoring, inquiry follow-up, and customer-data retention/deletion practices.
6. Replace the in-memory limiter before running multiple API instances.

## Troubleshooting

- Server exits: verify `server/.env`, especially `DATABASE_URL` and `FRONTEND_ORIGIN`.
- Migration fails: verify PostgreSQL, the database name, and credentials.
- Frontend gets `404`: start the API or configure production `/api/*` routing.
- CORS fails: the browser protocol, hostname, and port must exactly match `FRONTEND_ORIGIN`.
- API returns `503`: PostgreSQL is unavailable or the migration has not run.
- API returns `429`: wait for the limit window or adjust local development values.
- Hosted TLS fails: follow the provider's certificate instructions and set `DATABASE_SSL` appropriately.

## Site content

Business details and frontend service options live in `src/data/siteContent.ts`.

Images in `public/assets/` are AI-generated MVP visuals, not documented client work. Replace them with approved project photography before publishing. Do not add licensing, insurance, certification, or review-count claims until verified by the owner.
