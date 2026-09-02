# VC Elevate Painting

> [!IMPORTANT]
> **Status: active development.** The website and inquiry workflow run locally, and inquiries can be stored in PostgreSQL. The project is not deployed for public use yet. Email notifications, final project photography, and production monitoring are still planned.

VC Elevate Painting is a full-stack website for a residential and commercial painting business. It combines a polished, responsive marketing site with a real inquiry workflow: customers can describe a project, the backend validates the request, and PostgreSQL stores it for follow-up.

This started as more than a visual redesign. I wanted to build a small but complete system around a real business need and practice the less-visible parts of web development too: API design, database migrations, validation, error handling, security boundaries, testing, and deployment planning.

## What currently works

- Responsive React interface based on the VC Elevate brand
- Service, project, company, and contact sections
- Accessible estimate form with client-side feedback
- Express API with server-side validation
- PostgreSQL inquiry storage and repeatable SQL migrations
- Loading, success, timeout, field-error, and server-error states
- Basic spam protection through a honeypot and rate limiting
- Security headers, restricted CORS, body-size limits, and parameterized SQL
- Backend validation tests and production builds

## Technology

| Area | Tools |
| --- | --- |
| Frontend | React, TypeScript, Vite, CSS |
| Backend | Node.js, Express, Zod |
| Database | PostgreSQL, `pg` connection pooling, SQL migrations |
| Quality and security | ESLint, Node test runner, Helmet, CORS, rate limiting |

## How an inquiry moves through the project

```text
Customer completes the React form
                |
                v
POST /api/inquiries
                |
                v
Express validates and normalizes the request
                |
                v
Parameterized INSERT through pg.Pool
                |
                v
PostgreSQL stores the inquiry
```

The browser never connects directly to PostgreSQL. Database credentials and other backend settings stay in `server/.env`, which is deliberately excluded from Git.

## Run it locally

### Prerequisites

- Node.js 20 or newer
- npm
- PostgreSQL 13 or newer

### 1. Install dependencies

From the project root:

```bash
npm ci
npm --prefix server ci
```

If PowerShell blocks `npm.ps1`, use `npm.cmd` instead of `npm`.

### 2. Create an empty PostgreSQL database

Create a database named `vc_elevate_painting` with pgAdmin or the command line:

```bash
createdb vc_elevate_painting
```

The command is optional; creating the same database through pgAdmin works equally well.

### 3. Configure the backend

Copy the safe template:

```powershell
Copy-Item server/.env.example server/.env
```

On macOS or Linux:

```bash
cp server/.env.example server/.env
```

Then update `server/.env` with your local PostgreSQL credentials:

```dotenv
DATABASE_URL=postgresql://your-user:your-password@localhost:5432/vc_elevate_painting
PORT=8787
FRONTEND_ORIGIN=http://localhost:5173
NODE_ENV=development
DATABASE_SSL=false
TRUST_PROXY=false
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=5
```

Do not commit this file. If the password contains URL-reserved characters such as `@`, `:`, `/`, `#`, or `%`, URL-encode the password portion of the connection string.

### 4. Create the database tables

```bash
npm run db:migrate
```

The migration runner creates the inquiry schema and records applied migrations in `schema_migrations`. It is safe to run the command again; migrations that have already been applied are skipped.

### 5. Start both sides

Use two terminals from the project root.

Backend:

```bash
npm run dev:server
```

Frontend:

```bash
npm run dev
```

Open `http://localhost:5173`.

The API runs at `http://127.0.0.1:8787`, and its health endpoint is available at `http://127.0.0.1:8787/api/health`. Vite forwards local `/api/*` requests to the backend automatically.

## Useful commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the frontend development server. |
| `npm run dev:server` | Starts the backend in watch mode. |
| `npm run db:migrate` | Applies pending PostgreSQL migrations. |
| `npm run lint` | Checks frontend and backend code. |
| `npm run test:server` | Runs backend validation tests. |
| `npm run typecheck:server` | Type-checks the backend without generating files. |
| `npm run build:all` | Creates production builds for both applications. |
| `npm run preview` | Previews the frontend production build. |

## API overview

The public backend currently exposes one write endpoint:

```text
POST /api/inquiries
Content-Type: application/json
```

Example request:

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

A successful request returns only an inquiry ID and creation time. Submitted contact details, database errors, SQL information, and stack traces are never returned to the browser.

The frontend and backend each keep a service allowlist. If the options in `src/data/siteContent.ts` change, update `INQUIRY_SERVICE_OPTIONS` in `server/src/validation/inquiry.ts` as well.

## Database notes

The initial migration creates:

- UUID inquiry IDs
- Contact, service, location, and project-message fields
- `new`, `contacted`, `quoted`, `won`, and `lost` statuses
- Source and consent fields
- Timezone-aware creation and update timestamps
- An automatic `updated_at` trigger
- An index for status-based inquiry queues

PostgreSQL is the source of truth. No database contents or customer inquiries are included in this repository.

## Security choices

This is still an MVP, but the current backend includes a practical baseline:

- Secrets are read from server-side environment variables
- Requests are validated and normalized with Zod
- SQL values are passed through parameterized queries
- CORS accepts only the configured frontend origin
- Helmet adds common HTTP security headers
- Inquiry requests are rate-limited per IP
- JSON requests are limited to 20 KB
- Honeypot submissions are acknowledged without being stored
- Logs avoid form contents and other customer information

The current rate limiter stores counters in one server process. A shared store such as Redis would be required before running multiple backend instances.

## What is still planned

- Deploy the frontend, backend, and managed PostgreSQL database
- Add reliable email notifications for new inquiries
- Add retry/monitoring behavior for notification failures
- Replace MVP imagery with approved project photography
- Add continuous integration for automated checks
- Define operational backup and customer-data retention practices
- Consider an authenticated inquiry dashboard only if the business workflow needs one

The project deliberately does not claim verified licensing, insurance, certifications, or review totals. Those details should only appear after confirmation from the business owner.

## Production considerations

The Vite proxy exists only during local development. A deployment must route public `/api/*` requests to Express, provide backend environment variables through the hosting platform, run migrations as a release step, and serve the site over HTTPS.

`DATABASE_URL` must never be exposed through a `VITE_*` variable. Hosted PostgreSQL TLS settings should follow the provider's certificate instructions rather than disabling certificate verification.

## Project media

The current images in `public/assets/` are AI-generated visuals used to support the MVP design; they are not documented client work. They will be replaced with approved project photography before a public business launch.
