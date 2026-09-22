# DivineGrow LLP — Supabase deployment

The repository now contains an idempotent Supabase migration and a GitHub Actions workflow. After the one-time secret setup, every push to `main` that changes `supabase/` automatically links the project and applies pending migrations.

## One-time GitHub configuration

Add these **Actions secrets** in the repository settings:

| Secret | Value |
| --- | --- |
| `SUPABASE_ACCESS_TOKEN` | A Supabase personal access token used only by GitHub Actions |
| `SUPABASE_PROJECT_REF` | The project reference from the Supabase project URL |
| `SUPABASE_DB_PASSWORD` | The database password for that Supabase project |

Add these **Actions variables** for the frontend build/deploy workflow, or equivalent build environment variables:

| Variable | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://<project-ref>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | The public anon key from Supabase API settings |

The anon key is safe for browser use when Row Level Security is enabled. Do not expose `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD`, or a Supabase service-role key to the frontend.

## What is automated

`supabase/migrations/20260922220000_create_inquiries.sql` creates the `public.inquiries` table, indexes, validation checks, and a restrictive Row Level Security policy. Anonymous visitors can insert new enquiries but cannot read or modify buyer data.

`scripts/deploy-supabase.sh` is safe to rerun. It links the project and executes `supabase db push --linked --yes`, so only unapplied migrations are applied.

The quote form uses the public Supabase client when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are available. If those variables are absent in a local preview, the form retains its existing confirmation-only behavior rather than failing to render.

## Local verification

```bash
SUPABASE_ACCESS_TOKEN=... \
SUPABASE_PROJECT_REF=... \
SUPABASE_DB_PASSWORD=... \
bash scripts/deploy-supabase.sh
```

For production, use the GitHub Actions workflow instead of storing secrets in a local shell history.
