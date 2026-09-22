# DivineGrow LLP — Cloudflare Pages deployment

This repository is configured for **Cloudflare Pages from GitHub**. It does not use Wrangler, Cloudflare Workers, a Node server, or a server-side runtime. Cloudflare Pages builds the React/Vite frontend and serves the generated static files.

## Cloudflare Pages settings

Create a Pages project and connect the GitHub repository with these exact settings:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | `Vite` or `None` |
| Build command | `pnpm build` |
| Build output directory | `dist/public` |
| Root directory | `/` |
| Node.js version | `20` |
| Package manager | `pnpm` |
|

Cloudflare Pages should install dependencies from the committed `pnpm-lock.yaml`. No Wrangler package or Wrangler command is required.

## Frontend environment variables

Add these as **Production** and **Preview** variables in the Cloudflare Pages project:

| Variable | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://<project-ref>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase's public anon key |

These are browser-visible values. Never add a Supabase service-role key, database password, or access token to Cloudflare Pages variables.

## Automatic database setup

The database is managed by Supabase/PostgreSQL, not by Cloudflare Pages. The repository includes:

- `supabase/migrations/20260922220000_create_inquiries.sql` — creates the quote enquiry table, indexes, validation, and Row Level Security.
- `scripts/deploy-supabase.sh` — links the Supabase project and applies pending migrations with the Supabase CLI.
- `.github/workflows/database-migrate.yml` — runs automatically on pushes to `main` that change the migration files.
- `pnpm db:deploy` — local equivalent for an intentional migration run.

Add these **GitHub Actions secrets** once in the repository settings:

| Secret | Value |
| --- | --- |
| `SUPABASE_ACCESS_TOKEN` | Supabase personal access token |
| `SUPABASE_PROJECT_REF` | Supabase project reference |
| `SUPABASE_DB_PASSWORD` | Supabase database password |

After that one-time secret setup, the GitHub workflow applies database migrations automatically. Cloudflare Pages separately builds and deploys the frontend from `main`.

## How quote submissions work

The quote form writes directly to the Supabase `public.inquiries` table using the public anon key. The migration enables RLS and permits anonymous **insert-only** access with `status = 'new'`. Visitors cannot read, update, or delete enquiries.

If the frontend variables are not configured yet, the form still renders and shows its existing confirmation state, but it will not persist the submission. Add the variables before expecting stored enquiries.

## Troubleshooting Cloudflare build failures

- If Cloudflare reports `wrangler: command not found`, remove any old custom build command that mentions Wrangler and use `pnpm build`.
- If Cloudflare reports that the output directory is missing, use `dist/public` exactly.
- If the build uses the wrong Node version, set `NODE_VERSION=20` in Pages environment variables.
- If Supabase migrations fail, inspect the GitHub Actions run; do not add database credentials to the Cloudflare frontend build.
