# DivineGrow LLP — Cloudflare Pages deployment

This repository is configured for **Cloudflare Pages from GitHub**. It does not use Wrangler, Cloudflare Workers, a Node server, or a server-side runtime. Cloudflare Pages builds the React/Vite frontend and serves the generated static files.

For the complete click-by-click procedure, read `START_HERE.md`.

## Cloudflare Pages settings

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | `Vite` or `None` |
| Build command | `pnpm build` |
| Build output directory | `dist/public` |
| Root directory | `/` |
| Node.js version | `20` |
| Package manager | `pnpm` |

Cloudflare Pages installs dependencies from `pnpm-lock.yaml`. No Wrangler package or Wrangler command is required.

## Frontend environment variables

Add these as **Production** and **Preview** variables in Cloudflare Pages:

| Variable | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://<project-ref>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase public anon/publishable key |

These are browser-visible values. Never add a Supabase service-role key, database password, or access token to Cloudflare Pages variables.

## Automatic database setup

The database is managed by Supabase/PostgreSQL, not by Cloudflare Pages. The repository includes:

- `supabase/migrations/20260922220000_create_inquiries.sql` — creates the base inquiry table, indexes, validation, and RLS.
- `supabase/migrations/20260926170000_contact_and_admin.sql` — separates Contact and Quote submissions, creates the admin allow-list, and adds admin-only read/update policies.
- `scripts/deploy-supabase.sh` — links the Supabase project and applies pending migrations.
- `.github/workflows/database-migrate.yml` — runs on migration changes pushed to `main`.
- `pnpm db:deploy` — local equivalent for an intentional migration run.

Add these GitHub Actions secrets:

| Secret | Value |
| --- | --- |
| `SUPABASE_ACCESS_TOKEN` | Supabase personal access token |
| `SUPABASE_PROJECT_REF` | Supabase project reference |
| `SUPABASE_DB_PASSWORD` | Supabase database password |

Cloudflare Pages separately builds and deploys the frontend from `main`.

## Form interactions

The Contact form inserts `inquiry_type = 'contact'` with name, phone, email, and message. The Request a Quote form inserts `inquiry_type = 'quote'` with buyer, product, quantity, and sourcing details. Both are stored in `public.inquiries` when the frontend Supabase variables are configured.

The `/admin` portal uses Supabase Auth and only allows users listed in `public.admin_users` to view or update enquiries. See `ADMIN_PORTAL.md`.

New rows also trigger the `notify-inquiry` Supabase Edge Function through a Database Webhook. That function sends the full enquiry to `cemde.pankaj@gmail.com` through Gmail OAuth. Gmail secrets are stored in Supabase Edge Function Secrets, never in Cloudflare Pages. See `GMAIL_NOTIFICATIONS.md` for the exact setup.

The registered office address shown on the website is **#397, Sector-18B, Phase-2, Dwarka, New Delhi-110078**.

## Troubleshooting

- If Cloudflare reports `wrangler: command not found`, use `pnpm build` as the build command.
- If the output directory is missing, use `dist/public` exactly.
- If the build uses the wrong Node version, set Node.js version to `20`.
- If forms confirm without saving, add the two `VITE_SUPABASE_*` variables and redeploy.
- If migrations fail, inspect the GitHub Actions run; do not add database credentials to the Cloudflare frontend build.
