# DivineGrow LLP admin portal

The admin portal is available at `/admin` after the site is deployed. It uses Supabase Auth and Row Level Security; there is no admin password in the frontend.

## One-time setup

1. In Supabase, open **Authentication → Users**.
2. Click **Add user** and create the DivineGrow admin email/password.
3. Copy the new user's UUID.
4. Open **SQL Editor** and run:

```sql
insert into public.admin_users (user_id, display_name)
values ('PASTE_USER_UUID_HERE', 'DivineGrow Admin');
```

5. Make sure the migration workflow has completed successfully so `admin_users` exists.
6. Open the deployed site at `/admin` and sign in.

## What the portal provides

- Separate filters for Contact messages and Quote requests.
- Sender email, phone, company, country, product, quantity, and message.
- Received date and time in Indian locale formatting.
- Status updates: `new`, `contacted`, `qualified`, `closed`.
- Refresh and sign-out controls.

## Security model

- Public visitors can insert new Contact or Quote submissions only.
- Public visitors cannot read, update, or delete submissions.
- Only Supabase Auth users listed in `public.admin_users` can read or update enquiries.
- Do not put a service-role key in Cloudflare Pages variables or frontend code.
