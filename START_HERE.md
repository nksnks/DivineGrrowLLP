# DivineGrow LLP — Complete go-live guide

This package contains the complete DivineGrow LLP React/Vite website, local product assets, Supabase database migrations, GitHub Actions migration workflow, and the Cloudflare Pages deployment configuration.

## 1. What this package contains

- Premium React/Vite corporate website for DivineGrow LLP.
- Fourteen product catalogue cards with local WebP images.
- Separate Contact Us form: name, mobile, email, message.
- Detailed Request a Quote form for buyer and wholesaler requirements.
- Google Maps link for the Dwarka, New Delhi office.
- WhatsApp, email, phone, business hours, export-market, and quality sections.
- Supabase persistence for Contact and Quote submissions.
- Protected Supabase Auth admin portal for reading and updating enquiries.
- Gmail notification delivery for every new enquiry through a protected Supabase Edge Function.
- Cloudflare Pages SPA fallback and security headers.
- GitHub Actions workflow that applies Supabase migrations automatically.

## 2. Important architecture

The website is a static React frontend hosted by **Cloudflare Pages**.

The database is **Supabase PostgreSQL**. Cloudflare Pages does not run the database migration. GitHub Actions runs `scripts/deploy-supabase.sh` when migration files change on `main`.

The browser uses only the Supabase URL and public anon key. The Supabase access token, database password, and service-role key must never be added to Cloudflare Pages or frontend code.

The published registered office address is **#397, Sector-18B, Phase-2, Dwarka, New Delhi-110078**.

## 3. Requirements

- GitHub repository containing this package.
- Cloudflare account with Pages enabled.
- Supabase project.
- Node.js 20+ and pnpm for local checks.
- A Supabase personal access token for GitHub Actions.

No Wrangler package or Wrangler command is required.

## 4. Push the package to GitHub

From the package root:

```bash
git init
git add .
git commit -m "Prepare DivineGrow LLP website for Cloudflare Pages"
git branch -M main
git remote add origin https://github.com/YOUR_ACCOUNT/YOUR_REPOSITORY.git
git push -u origin main
```

If the repository already exists, use:

```bash
git add .
git commit -m "Update DivineGrow website deployment package"
git push origin main
```

Do not commit `.env.local`, `.env`, Supabase service-role keys, database passwords, or access tokens.

## 5. Create and configure the Supabase project

1. Open Supabase and create a new project.
2. Save the database password securely; it is required only by GitHub Actions.
3. Open **Project Settings → General** and copy the project reference.
4. Open **Project Settings → API** and copy:
   - Project URL
   - Publishable/anon public key
5. Leave Row Level Security enabled. The migration configures the policies.

### Database tables created by the migrations

#### `public.inquiries`

Stores both forms with `inquiry_type` set to `contact` or `quote`.

Important fields include:

- `name`
- `company`
- `country`
- `business_type`
- `email`
- `phone`
- `product`
- `quantity`
- `message`
- `inquiry_type`
- `status`
- `created_at`

#### `public.admin_users`

An allow-list of Supabase Auth users who may read and update enquiries.

### Security behavior

- Anonymous visitors may insert a new Contact or Quote submission.
- Anonymous visitors cannot select, update, or delete enquiries.
- Only authenticated users listed in `public.admin_users` can view or update enquiries.
- Status values are `new`, `contacted`, `qualified`, and `closed`.

## 6. Configure GitHub Actions database secrets

In the GitHub repository open:

**Settings → Secrets and variables → Actions → New repository secret**

Add these three repository secrets:

| Secret name | Value |
| --- | --- |
| `SUPABASE_ACCESS_TOKEN` | Supabase personal access token |
| `SUPABASE_PROJECT_REF` | Supabase project reference |
| `SUPABASE_DB_PASSWORD` | Supabase database password |

The existing workflow is:

```text
.github/workflows/database-migrate.yml
```

It runs on pushes to `main` that change `supabase/`, `scripts/deploy-supabase.sh`, or the workflow itself. You can also run it manually from the **Actions** tab using **Run workflow**.

### What the migration script does

```bash
npx --yes supabase@latest link --project-ref "$SUPABASE_PROJECT_REF" --password "$SUPABASE_DB_PASSWORD"
npx --yes supabase@latest db push --linked --yes
```

The script is safe to rerun; only unapplied migrations are applied.

## 7. Configure Cloudflare Pages

1. Open Cloudflare Dashboard.
2. Go to **Workers & Pages → Create application → Pages → Connect to Git**.
3. Select the GitHub repository.
4. Use these exact build settings:

| Cloudflare setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | `Vite` or `None` |
| Root directory | `/` |
| Build command | `pnpm build` |
| Build output directory | `dist/public` |
| Node.js version | `20` |
| Package manager | `pnpm` |

There is no Cloudflare deployment command and no Wrangler command. Cloudflare Pages builds automatically after every push to `main`.

### Cloudflare Pages environment variables

Open **Settings → Environment variables** and add these variables for both **Production** and **Preview**:

| Variable | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://YOUR_PROJECT_REF.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase public anon/publishable key |

These two variables are intentionally browser-visible. Do not add:

- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_DB_PASSWORD`
- Supabase service-role key
- Any private database credential

After saving the variables, trigger a new deployment.

## 8. Local development and preview

From the project root:

```bash
pnpm install
cp .env.example .env.local
# Edit .env.local with your Supabase URL and public anon key
pnpm check
pnpm dev
```

Open the local Vite URL shown in the terminal.

To test the production artifact locally:

```bash
pnpm build
pnpm preview
```

The production files are generated in:

```text
dist/public
```

## 9. Create the first admin user

After the migrations finish successfully:

1. In Supabase, open **Authentication → Users**.
2. Click **Add user**.
3. Create the admin email and password.
4. Copy the new user's UUID.
5. Open Supabase **SQL Editor** and run:

```sql
insert into public.admin_users (user_id, display_name)
values ('PASTE_USER_UUID_HERE', 'DivineGrow Admin');
```

6. Sign in through the website's `/admin` route.

The admin portal supports:

- Contact vs Quote filters.
- Sender email and phone links.
- Company, country, product, quantity, and message details.
- Enquiry status updates.
- Refresh and sign-out.

## 10. End-to-end live test

After Cloudflare deploys and the Supabase migration succeeds:

1. Open the public website.
2. Submit one Contact message.
3. Submit one Request a Quote form.
4. Open the admin portal and sign in.
5. Confirm one Contact record and one Quote record are visible.
6. Change one status to `contacted`.
7. Refresh the page and confirm the status remains saved.
8. Confirm the WhatsApp, email, phone, and Google Maps links open correctly.

For Gmail OAuth, Supabase Function Secrets, the `notify-inquiry` Edge Function, Database Webhook setup, and Gmail troubleshooting, follow `GMAIL_NOTIFICATIONS.md`.

## 11. Troubleshooting

### Cloudflare says `wrangler: command not found`

The package does not need Wrangler. Set the Cloudflare build command to:

```text
pnpm build
```

Remove any older Wrangler command from the Cloudflare project settings.

### Cloudflare says the output directory is missing

Set the output directory to exactly:

```text
dist/public
```

### Forms show success but no record appears in Supabase

Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in Cloudflare **Production** variables, then redeploy. Also check the browser console for Supabase errors.

### GitHub migration fails

Check that all three GitHub Actions secrets are present and spelled exactly:

```text
SUPABASE_ACCESS_TOKEN
SUPABASE_PROJECT_REF
SUPABASE_DB_PASSWORD
```

Run the workflow manually from the GitHub Actions tab to see the full error.

### Admin login works but inbox is empty or access is denied

Confirm the logged-in Supabase Auth user's UUID exists in `public.admin_users`. The table is an explicit allow-list.

### Images are missing

Confirm the GitHub repository includes:

```text
client/public/assets/
```

The build must include the fourteen local `.webp` product assets.

## 12. Useful commands

```bash
# Install dependencies
pnpm install

# Typecheck
pnpm check

# Build for Cloudflare Pages
pnpm build

# Run local development server
pnpm dev

# Preview the production build
pnpm preview

# Apply Supabase migrations locally (requires the three environment variables)
pnpm db:deploy
```

## 13. Final launch checklist

- [ ] Code pushed to GitHub `main`.
- [ ] Cloudflare Pages build command is `pnpm build`.
- [ ] Cloudflare output directory is `dist/public`.
- [ ] Node version is `20`.
- [ ] `VITE_SUPABASE_URL` is set in Production and Preview.
- [ ] `VITE_SUPABASE_ANON_KEY` is set in Production and Preview.
- [ ] GitHub Actions has all three Supabase secrets.
- [ ] Database migration workflow completed successfully.
- [ ] Admin Auth user created.
- [ ] Admin user UUID added to `public.admin_users`.
- [ ] Contact test submission verified.
- [ ] Quote test submission verified.
- [ ] Admin status update verified.
- [ ] Gmail API enabled and OAuth refresh token created.
- [ ] Gmail secrets added to Supabase Edge Functions.
- [ ] `notify-inquiry` function deployed.
- [ ] Supabase Database Webhook enabled for `public.inquiries` INSERT.
- [ ] Gmail notification received at `cemde.pankaj@gmail.com`.
- [ ] WhatsApp, email, phone, and Maps links verified.
