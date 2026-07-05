# Creative Hub

**Post what you need — one person or a whole crew.**

A mobile-first hiring hub for photographers, videographers, and the creatives
around them (MUAs, gaffers, stylists, editors). Post a job and the right
creatives come to you; browse open jobs and respond to the ones you want.

The reference for flow, screens, and visual style is
[`creative-hub-prototype.jsx`](./creative-hub-prototype.jsx) — treat it as the
source of truth.

## Stack

- **Next.js (App Router) + TypeScript** — the web app
- **Tailwind CSS v4** — styling; design tokens live in `app/globals.css`
- **Supabase** — database, auth, image storage, realtime chat *(wired in from milestone 1)*
- **Vercel** — hosting

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Connect Supabase (one-time, ~5 minutes)

1. Create a free project at [supabase.com](https://supabase.com) — region **Canada (Central)**.
2. In the Supabase dashboard, open **SQL Editor**, paste the whole contents of
   [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql), and click **Run**.
   This creates every table, security rule, and image bucket the app uses.
3. Copy `.env.example` to `.env.local` and fill in the **Project URL** and
   **anon public key** from Project Settings → API. On Vercel, add the same
   two values under Project → Settings → Environment Variables.

## Deploy (one-time setup, ~5 minutes)

1. Create a free account at [vercel.com](https://vercel.com) (sign in with GitHub).
2. Click **Add New → Project**, pick the `Creative-App` repository.
3. Under **Environment Variables**, add the same two values as `.env.local`
   (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`), then
   press **Deploy**.
4. In Supabase → **Authentication → URL Configuration**, set **Site URL** to
   your new Vercel URL so sign-up confirmation emails point at the real site.
5. Open the URL on your phone; every push to the deployed branch updates it
   automatically.

Costs: the Vercel Hobby tier and Supabase free tier cover everything through
launch. **$0 until real traction.**

## Sample data

`node scripts/seed.mjs` fills the app with five Ottawa creative personas
(portfolios, jobs, responses) so screens aren't empty while testing. Seed
accounts all use `zaynab.omer+seed-*@gmail.com` addresses — delete those
users in Supabase → Authentication → Users to wipe them (their profiles,
jobs, images, and messages cascade away automatically).

## Before inviting real users

- [ ] Delete the seed and `+test*` accounts (Authentication → Users)
- [ ] Turn **Confirm email** back ON (Authentication → Sign In / Providers → Email)

## Build progress

- [x] **0 — Foundation**: scaffold, design tokens, fonts
- [x] **1 — Auth**: email sign-up / login / onboarding
- [x] **2 — Profile + portfolio** with compressed image upload
- [x] **3 — Post a job** (single-role default, client/creative toggle)
- [x] **4 — Jobs feed + detail** with tab bar and working/hiring switch
- [x] **5 — Respond to a job** (one tap, portfolio required)
- [x] **6 — Find creatives** (search + discipline filters)
- [x] **7 — Messaging** with "Re: {job}" context and realtime
- [x] **8 — Seed data + polish**

v1 complete. Phase 2 (schema already in place): collaboration confirmations,
vouch write-flow, work feed, map, payments.
