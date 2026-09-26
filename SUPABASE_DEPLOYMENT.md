# DivineGrow LLP — Supabase deployment

The repository contains idempotent Supabase migrations and a GitHub Actions workflow. After one-time secret setup, every push to `main` that changes `supabase/` automatically links the project and applies pending migrations.

For the complete procedure, read `START_HERE.md`.

For Gmail notification setup, read `GMAIL_NOTIFICATIONS.md`. Supabase stores each record first, then a Database Webhook calls the protected `notify-inquiry` Edge Function, which sends the email through Gmail OAuth.

## One-time GitHub configuration

Add these **Actions secrets** in repository settings:

| Secret | Value |
| --- | --- |
| `SUPABASE_ACCESS_TOKEN` | Supabase personal access token used only by GitHub Actions |
| `SUPABASE_PROJECT_REF` | Project reference from the Supabase project URL |
| `SUPABASE_DB_PASSWORD` | Database password for that Supabase project |

Frontend variables are configured in Cloudflare Pages, not as private GitHub secrets:

| Variable | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://<project-ref>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Public anon/publishable key from Supabase API settings |

The anon key is safe for browser use when Row Level Security is enabled. Do not expose `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD`, or a service-role key to the frontend.

## What the migrations create

- `20260922220000_create_inquiries.sql` creates the base `public.inquiries` table and RLS.
- `20260926170000_contact_and_admin.sql` adds `inquiry_type`, allows simple Contact records without company/country, creates `public.admin_users`, and gives approved admins read/update access.

Public users can insert only new Contact or Quote records. Approved admins can read and update records through the portal.

## Local migration command

```bash
SUPABASE_ACCESS_TOKEN=... \
SUPABASE_PROJECT_REF=... \
SUPABASE_DB_PASSWORD=... \
pnpm db:deploy
```

For production, use the GitHub Actions workflow instead of placing secrets in local shell history.

## Admin setup

After migrations complete, create a user under Supabase **Authentication → Users**, then add that user's UUID to `public.admin_users`:

```sql
insert into public.admin_users (user_id, display_name)
values ('PASTE_USER_UUID_HERE', 'DivineGrow Admin');
```

See `ADMIN_PORTAL.md` for portal behavior and security details.

The registered office address is **#397, Sector-18B, Phase-2, Dwarka, New Delhi-110078**.
