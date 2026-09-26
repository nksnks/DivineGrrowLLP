# DivineGrow LLP — Gmail notifications

The website continues to store every Contact and Quote submission in Supabase. In addition, a Supabase Database Webhook invokes the `notify-inquiry` Edge Function after every new row. The Edge Function uses Gmail OAuth 2.0 to email the full enquiry to `cemde.pankaj@gmail.com`.

## Why this uses a Supabase Edge Function

The frontend must not contain Gmail OAuth client secrets or refresh tokens. The browser writes to Supabase; Supabase sends the row payload to the protected Edge Function; the Edge Function sends the email through Gmail. Gmail credentials stay in Supabase Function Secrets.

## 1. Enable Gmail API in Google Cloud

1. Open Google Cloud Console.
2. Create or select a project used for DivineGrow notifications.
3. Open **APIs & Services → Library**.
4. Enable **Gmail API**.
5. Open **APIs & Services → OAuth consent screen** and configure the app.
6. Add the Gmail sender account as a test user if the app is in testing mode.
7. Open **Credentials → Create credentials → OAuth client ID**.
8. Choose a web application client.
9. Add an authorized redirect URI appropriate for your OAuth helper or local OAuth flow.
10. Save the OAuth **Client ID** and **Client Secret**.

Use the least-privileged Gmail send scope:

```text
https://www.googleapis.com/auth/gmail.send
```

## 2. Obtain a Gmail refresh token

Use a server-side OAuth flow with offline access. The authorization request must request offline access so Google returns a refresh token. Approve access using the Gmail account that will send the messages, preferably `cemde.pankaj@gmail.com`.

Store these values securely:

- Google OAuth Client ID
- Google OAuth Client Secret
- Gmail refresh token
- Sender Gmail address

Do not commit them to GitHub, Cloudflare, or the React frontend.

## 3. Deploy the notification function

The repository includes:

```text
supabase/functions/notify-inquiry/index.ts
supabase/config.toml
.github/workflows/functions-deploy.yml
```

The workflow deploys the function automatically when `supabase/functions/` changes on `main`. It uses the existing GitHub Actions secrets:

```text
SUPABASE_ACCESS_TOKEN
SUPABASE_PROJECT_REF
```

You can also deploy manually from the project root:

```bash
SUPABASE_ACCESS_TOKEN=... \
SUPABASE_PROJECT_REF=... \
pnpm functions:deploy
```

## 4. Add Supabase Function Secrets

In Supabase Dashboard, open **Edge Functions → Secrets** and add:

| Secret | Value |
| --- | --- |
| `GMAIL_CLIENT_ID` | Google OAuth Client ID |
| `GMAIL_CLIENT_SECRET` | Google OAuth Client Secret |
| `GMAIL_REFRESH_TOKEN` | Offline Gmail OAuth refresh token |
| `GMAIL_FROM_EMAIL` | Gmail account authorized for sending, e.g. `cemde.pankaj@gmail.com` |
| `NOTIFY_TO_EMAIL` | `cemde.pankaj@gmail.com` |
| `DIVINEGROW_WEBHOOK_SECRET` | A long random secret shared only with the Database Webhook |

The function also receives Supabase's built-in environment values automatically. Do not name custom secrets with the reserved `SUPABASE_` prefix.

To generate a webhook secret locally:

```bash
openssl rand -hex 32
```

The secret is not stored in the repository.

## 5. Create the Supabase Database Webhook

After the function is deployed:

1. Open Supabase Dashboard.
2. Open **Integrations → Database Webhooks**.
3. Create a webhook named `notify-divinegrow-inquiry`.
4. Select table `public.inquiries`.
5. Select event **Insert** only.
6. Set method to `POST`.
7. Set the URL to:

```text
https://YOUR_PROJECT_REF.supabase.co/functions/v1/notify-inquiry
```

8. Add request header:

```text
x-divinegrow-webhook-secret: YOUR_DIVINEGROW_WEBHOOK_SECRET
```

9. Add the `Content-Type: application/json` header if the Dashboard does not add it automatically.
10. Save and enable the webhook.

Supabase Database Webhooks send the inserted row in a payload with `type`, `table`, `schema`, and `record` fields. The function accepts only an `INSERT` for `public.inquiries` and rejects requests without the shared secret.

## 6. Test the full notification path

1. Submit a Contact message on the live website.
2. Confirm the new row appears in `public.inquiries`.
3. Check **Edge Functions → notify-inquiry → Logs**.
4. Confirm the email arrives at `cemde.pankaj@gmail.com`.
5. Submit a Request a Quote form and repeat the check.
6. Open the admin portal and confirm both records remain available there.

## 7. Troubleshooting

### No email arrives but the Supabase row exists

Check the Edge Function logs. Confirm the five function secrets are present and that `GMAIL_REFRESH_TOKEN` belongs to the same sender account as `GMAIL_FROM_EMAIL`.

### Gmail returns `invalid_grant`

The refresh token may have been revoked, generated for a different OAuth client, or not issued with offline access. Generate a new refresh token for the same OAuth client and set it again in Supabase Function Secrets.

### Gmail returns a permissions or scope error

Regenerate authorization with the `gmail.send` scope and confirm the sender Gmail account approved access.

### Webhook returns 401

The request header secret does not exactly match `DIVINEGROW_WEBHOOK_SECRET`. Update the webhook header or the Supabase Function Secret so both values match.

### Messages appear in admin but notification function is not called

Check that the Database Webhook is enabled, points to the correct project reference, uses `POST`, and listens to `INSERT` on `public.inquiries`.

## Security notes

The public browser never receives Gmail credentials. The Supabase admin portal remains the system of record. Email is a notification channel only; if Gmail is temporarily unavailable, the enquiry is still preserved in Supabase for later review.

## Official references

- [Google Gmail server-side OAuth](https://developers.google.com/workspace/gmail/api/auth/web-server)
- [Supabase Edge Function secrets](https://supabase.com/docs/guides/functions/secrets)
- [Supabase Edge Function deployment](https://supabase.com/docs/guides/functions/quickstart)
- [Supabase Database Webhooks](https://supabase.com/docs/guides/database/webhooks)
