# DivineGrow LLP package manifest

## Release contents

- React/Vite frontend source under `client/`
- Local product and hero assets under `client/public/assets/`
- Supabase migrations under `supabase/migrations/`
- Supabase Gmail notification Edge Function under `supabase/functions/notify-inquiry/`
- GitHub Actions database workflow under `.github/workflows/`
- GitHub Actions Edge Function deployment workflow under `.github/workflows/functions-deploy.yml`
- Automated migration script under `scripts/deploy-supabase.sh`
- Cloudflare Pages configuration files: `_redirects` and `_headers`
- Complete deployment, database, admin, and troubleshooting documentation
- Gmail OAuth, Supabase webhook, and notification troubleshooting documentation

## Verified before packaging

- `pnpm check` passes.
- `pnpm build` passes.
- Cloudflare output is `dist/public`.
- No Wrangler command is required.
- Sixteen local WebP assets are present in the production output.
- Two Supabase migrations are included.
- Contact and Quote form flows are separate.
- Admin portal route and Supabase Auth gate are included.

## Excluded intentionally

- `node_modules/`
- `dist/`
- `.git/`
- `.env`, `.env.local`, and any private credentials
