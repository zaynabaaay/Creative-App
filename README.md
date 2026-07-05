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
2. Click **Add New → Project**, pick the `Creative-App` repository, and press **Deploy** — no settings to change.
3. Vercel gives you a URL like `creative-app.vercel.app`. Open it on your phone; every push to the deployed branch updates it automatically.

Costs: the Vercel Hobby tier and Supabase free tier cover everything through
launch. **£0 until real traction.**

## Build progress

- [x] **0 — Foundation**: scaffold, design tokens, fonts, this page
- [x] **1 — Auth**: email sign-up / login / onboarding (needs the Supabase setup above to switch on)
- [ ] 2 — Profile + portfolio with image upload
- [ ] 3 — Post a job
- [ ] 4 — Jobs feed + job detail
- [ ] 5 — Respond to a job
- [ ] 6 — Find creatives
- [ ] 7 — Messaging with job context
- [ ] 8 — Working / hiring switch + seed data + polish
