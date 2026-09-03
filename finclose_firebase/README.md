# FinClose Firebase deployment candidate

Standalone static Next.js client for Firebase Hosting.

- Firebase Hosting owns web deployment and preview channels.
- Supabase remains the tested persistence/API layer for now.
- Only synthetic/test financial data should be used until authentication is added.
- `NEXT_PUBLIC_FINCLOSE_API_URL` can override the current Lab API at build time.

Build: `npm install && npm run build`

Firebase root: this directory (`firebase.json` serves `out/`).
