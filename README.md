# MTG General Store and Logistics: website

A product catalogue for MTG. Customers browse products and order on WhatsApp. The owner adds, edits, hides and deletes products from a phone at `/admin`.

- **Website:** Next.js 16, hosted on Vercel
- **Database, photos, login:** Supabase (free plan is enough to start)

## What's in it

| Page | What it does |
| --- | --- |
| `/en`, `/sw` | Hero with search, category chips, featured products (or newest), how to order |
| `/en/products` | All products, category filter, search |
| `/en/products/<name>` | Photos, price in TSh, stock label, **Order on WhatsApp** (message includes product, price and link), related products |
| `/en/contact` | WhatsApp, phone, email, map |
| `/admin` | Login, then the product list: Edit, Hide/Show, Delete |
| `/admin/products/new` | Add product: photos from camera or gallery (shrunk on the phone before upload), name, price, category, description, in stock, featured |
| `/admin/categories` | Add, rename, delete categories |

Leaving the price empty shows "Call for price". A hidden or deleted product's link shows "This product is no longer available" instead of an error.

### Languages: English and Swahili

- Every public page exists in both languages: `/en/...` and `/sw/...`. The **EN | SW** switch in the header keeps you on the same page.
- First-time visitors get English (`defaultLocale` in [src/lib/i18n.ts](src/lib/i18n.ts)). The site remembers each visitor's choice. Addresses without a language (`/`, `/products`) redirect to it.
- All website text, including the pre-filled WhatsApp messages, is in [src/lib/i18n.ts](src/lib/i18n.ts).
- Categories have an English and a Swahili name (the 28 starting ones are already translated). Products have one name, plus an optional Swahili description. Anything left empty in Swahili shows the English text.
- Search finds products by English or Swahili words.
- The admin panel is in English.

Business details (phone, WhatsApp, email, address) are in [src/lib/site.ts](src/lib/site.ts). Brand colours are in [src/app/globals.css](src/app/globals.css).

## Setup (about 20 minutes)

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com) under an account the client owns or can access. Choose the region closest to Tanzania that's offered.
2. **SQL Editor → New query**: paste all of [supabase/schema.sql](supabase/schema.sql) and run it. This creates the tables, security rules, the `product-photos` storage bucket and the starting categories.
3. **Authentication → Users → Add user**: create the owner's login (email and password, tick "Auto confirm").
4. Make that user an admin. In the SQL Editor run:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'owner@example.com';
   ```
   Repeat for any staff account. Only users in `admins` can change anything.
5. **Authentication → Sign In / Providers → Email**: turn **off** "Allow new users to sign up", so nobody else can create an account.
6. **Project Settings → API Keys**: copy the project URL and the publishable (or anon) key.

### 2. Run locally

```bash
cp .env.example .env.local   # then paste in the URL and key
npm install
npm run dev                  # http://localhost:3000, admin at /admin
```

Without the keys the site still runs as a preview: categories show, products are empty and admin login is disabled.

### 3. Deploy to Vercel

1. Push this repo to GitHub and import it in Vercel.
2. Add the three variables from `.env.example` under **Settings → Environment Variables**, then deploy.
3. `vercel.json` sets a daily call to `/api/keepalive`, which keeps the free Supabase project from pausing after a quiet week.

### 4. Connect the domain

In Vercel, **Settings → Domains**: add `mtgsuppliers.com` and `www.mtgsuppliers.com`, then add the A and CNAME records Vercel shows at the domain's DNS provider.

**Don't touch the MX records.** The domain has email (`info@mtgsuppliers.com`), and changing MX would stop it working. If an old website is on the domain, it is replaced when DNS switches, so agree the timing with the client.

## Notes

- **Logo:** the header uses a text version of the logo. To use the official image, save it as `public/logo.png` and swap it into [src/components/logo.tsx](src/components/logo.tsx).
- **Updates show immediately:** public pages are cached and refreshed the moment the admin saves.
- **Backups:** the free plan has no automatic backups. Export the `products` table (Table Editor → Export to CSV) now and then, or move to Supabase Pro.
- **Photo space:** photos are about 150–300 KB each after shrinking, so the free 1 GB holds roughly 4,000 or more.
