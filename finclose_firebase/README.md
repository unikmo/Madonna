# FinClose Firebase deployment candidate

Standalone static Next.js client for Firebase Hosting.

- Firebase project: `theantibalcony`.
- FinClose testing uses the non-live Hosting preview channel `finclose-lab` so the project's existing live Hosting content is not intentionally replaced.
- Supabase remains the tested persistence/API layer for now.
- Only synthetic/test financial data should be used until authentication is added.
- `NEXT_PUBLIC_FINCLOSE_API_URL` can override the current Lab API at build time.

Build: `npm install && npm run build`

Firebase root: this directory (`firebase.json` serves `out/`).

Preview deployment workflow: `.github/workflows/finclose-firebase-preview.yml`.
It requires the GitHub Actions secret `FIREBASE_SERVICE_ACCOUNT_THEANTIBALCONY` before it can authenticate to Firebase.

Do not run a live Hosting deployment from this directory until FinClose has its own Hosting site/target or an explicit decision is made to replace the existing live site.
