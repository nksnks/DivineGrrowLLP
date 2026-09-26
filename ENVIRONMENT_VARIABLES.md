# DivineGrow LLP environment variables

## Cloudflare Pages — public frontend variables

Set these in Cloudflare Pages for both **Production** and **Preview** deployments:

| Name | Example | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | `https://abc123.supabase.co` | Supabase project URL used by the browser client |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...` | Public Supabase anon/publishable key used with Row Level Security |

These values are bundled into the browser application. That is expected. The Supabase policies protect the data.

## GitHub Actions — private database migration secrets

Set these in GitHub under **Settings → Secrets and variables → Actions → Secrets**:

| Name | Purpose |
| --- | --- |
| `SUPABASE_ACCESS_TOKEN` | Allows the workflow to use the Supabase CLI |
| `SUPABASE_PROJECT_REF` | Identifies the Supabase project |
| `SUPABASE_DB_PASSWORD` | Allows the CLI to link to the database |

These values are used only by `.github/workflows/database-migrate.yml`. Never copy them into Cloudflare Pages variables or frontend source code.

## Supabase Edge Function secrets — private Gmail notification path

Set these in Supabase Dashboard under **Edge Functions → Secrets**:

| Name | Purpose |
| --- | --- |
| `GMAIL_CLIENT_ID` | Google OAuth client ID |
| `GMAIL_CLIENT_SECRET` | Google OAuth client secret |
| `GMAIL_REFRESH_TOKEN` | Offline Gmail OAuth refresh token |
| `GMAIL_FROM_EMAIL` | Authorized Gmail sender address |
| `NOTIFY_TO_EMAIL` | Notification recipient: `cemde.pankaj@gmail.com` |
| `DIVINEGROW_WEBHOOK_SECRET` | Shared secret used by the Supabase Database Webhook |

These secrets are read only by `supabase/functions/notify-inquiry/index.ts`. Do not place them in GitHub source, Cloudflare Pages variables, or React code. See `GMAIL_NOTIFICATIONS.md` for OAuth and webhook setup.

## Local development

For local testing, export the same two public `VITE_SUPABASE_*` variables in your shell or use a local `.env.local` file. Do not commit `.env.local`.

```bash
export VITE_SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
export VITE_SUPABASE_ANON_KEY="YOUR_PUBLIC_ANON_KEY"
pnpm dev
```
