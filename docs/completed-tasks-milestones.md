# Completed Work — Full Task List (by Milestone)

Each entry follows: **Subject** → **Milestone** → **Task Description**.  
Stack note: **Next.js 14 (App Router)** API routes + **MongoDB (Mongoose)** — not a separate Express server.

---

## Milestone reference (roadmap)

1. Backend Architecture (Node.js + Express + MongoDB/Redis)  
2. SAAS Module Development and integration  
3. Tenancy, Plans, Modules, and RBAC  
4. Frontend Architecture (Next.js Client & Admin)  
5. Monorepo Setup & Project Restructuring  
6. Tailwind CSS Design System & Reusable Components  
7. UI/UX Modernization  
8. Generic CRM Feature Implementation (First Modules)  
9. Admin App & Platform Management  
10. DevOps & Deployment  
11. Hardening & Future Enhancements  
12. Develop Website and Integrated with SaaS System  
13. QA and Deployment  

---

## Database & models

### 1

**Subject:** User model  

**Milestone:** Backend Architecture (Node.js + Express + MongoDB/Redis)  

**Task Description:** `User` schema with email (unique), roles (`buyer` | `admin`), optional password hash, optional `shopifyCustomerId`, timestamps; used for buyers created from orders and admin login.

### 2

**Subject:** Order model  

**Milestone:** Backend Architecture (Node.js + Express + MongoDB/Redis)  

**Task Description:** `Order` schema: Shopify order id (unique), line items, buyer ref, email, totals, currency, `paymentStatus`, `source` (`webhook` | `admin` | `waitlist`), tags, customer name; indexes for admin listing and idempotency.

### 3

**Subject:** MomentCode model  

**Milestone:** Backend Architecture (Node.js + Express + MongoDB/Redis)  

**Task Description:** `MomentCode` schema: unique code, user + order refs, quantity (1/4/7), delivery type, status, unlockable flag, media subdocuments, claimed timestamp.

### 4

**Subject:** WaitlistEntry model  

**Milestone:** Backend Architecture (Node.js + Express + MongoDB/Redis)  

**Task Description:** `WaitlistEntry` schema: name, email, optional product/delivery/quantity prefs, status (`pending` | `invited` | `code_sent`), link to internal order, generated code list.

### 5

**Subject:** AdminSettings model  

**Milestone:** Backend Architecture (Node.js + Express + MongoDB/Redis)  

**Task Description:** `AdminSettings` for `sellingEnabled`, Shopify test override, and waitlist popup copy fields; dedupe/single-document patch pattern in `admin-settings-store`.

### 6

**Subject:** ShopifyCredentials model  

**Milestone:** Backend Architecture (Node.js + Express + MongoDB/Redis)  

**Task Description:** Encrypted storage of store domain, access token, webhook secret for Shopify Admin API and webhooks.

### 7

**Subject:** Database connection utility  

**Milestone:** Backend Architecture (Node.js + Express + MongoDB/Redis)  

**Task Description:** `lib/db.ts` — connect MongoDB via `MONGODB_URI`, reusable across route handlers.

---

## Core backend logic (shared libraries)

### 8

**Subject:** Order processing pipeline  

**Milestone:** Backend Architecture (Node.js + Express + MongoDB/Redis)  

**Task Description:** `lib/order-processing.ts` — `processPaidOrderAndGenerateCodes`: upsert user, create order once per Shopify id, loop `codesToGenerate`, unique code generation, `MomentCode` rows, `sendMomentCodesEmail`.

### 9

**Subject:** Metafield-driven code rules  

**Milestone:** Backend Architecture (Node.js + Express + MongoDB/Redis)  

**Task Description:** `extractProductData` / `deriveCodesToGenerateFromLineItems` — read Shopify product + variant metafields for moment quantity (1/4/7) and delivery type (digital/physical/split).

### 10

**Subject:** Moment code generator  

**Milestone:** Backend Architecture (Node.js + Express + MongoDB/Redis)  

**Task Description:** `lib/code-generator.ts` — format rules for codes by quantity and delivery type.

### 11

**Subject:** Shopify GraphQL client  

**Milestone:** Backend Architecture (Node.js + Express + MongoDB/Redis)  

**Task Description:** `lib/shopify.ts` — HMAC validation for webhooks, credential resolution, `ShopifyGraphQLClient` (query, metafields, draft order create/complete, webhook subscription CRUD).

### 12

**Subject:** Shopify credential loading & encryption  

**Milestone:** Backend Architecture (Node.js + Express + MongoDB/Redis)  

**Task Description:** `lib/shopify-credentials.ts`, `lib/encryption.ts` — load/decrypt credentials for API use.

### 13

**Subject:** Shopify test vs live mode  

**Milestone:** Backend Architecture (Node.js + Express + MongoDB/Redis)  

**Task Description:** `lib/shopify-test-mode.ts` — effective test mode for product IDs and env fallbacks.

### 14

**Subject:** Resolve product variant for waitlist generation  

**Milestone:** Backend Architecture (Node.js + Express + MongoDB/Redis)  

**Task Description:** `lib/shopify-resolve-variant.ts` — map moment quantity + delivery to Shopify variant for admin waitlist code generation.

### 15

**Subject:** Selling-enabled parsing  

**Milestone:** Backend Architecture (Node.js + Express + MongoDB/Redis)  

**Task Description:** `lib/parse-selling-enabled.ts` — normalize admin input for waitlist vs selling flag.

### 16

**Subject:** Waitlist copy defaults  

**Milestone:** Backend Architecture (Node.js + Express + MongoDB/Redis)  

**Task Description:** `lib/waitlist-copy-defaults.ts` — merge stored settings with defaults for APIs and emails.

### 17

**Subject:** Email sending abstraction  

**Milestone:** Backend Architecture (Node.js + Express + MongoDB/Redis)  

**Task Description:** `lib/email.ts` — `EMAIL_PROVIDER` switch (`smtp` / default / `api`), Nodemailer transporter with trimmed env, `sendMomentCodesEmail`, `sendWaitlistConfirmationEmail`, `sendUnlockNotificationEmail`.

### 18

**Subject:** HTML email templates  

**Milestone:** Backend Architecture (Node.js + Express + MongoDB/Redis)  

**Task Description:** `lib/moment-code-email-html.ts`, `lib/waitlist-confirmation-email-html.ts`, `lib/selling-open-email-html.ts` — branded layouts for transactional mail.

### 19

**Subject:** Cloudinary helpers  

**Milestone:** Backend Architecture (Node.js + Express + MongoDB/Redis)  

**Task Description:** `lib/cloudinary.ts` — server-side Cloudinary usage for uploads/signing as needed by media routes.

### 20

**Subject:** Site config helper  

**Milestone:** Backend Architecture (Node.js + Express + MongoDB/Redis)  

**Task Description:** `lib/site-config.ts` — shared typing/helpers for public site configuration where applicable.

### 21

**Subject:** Admin bootstrap  

**Milestone:** Backend Architecture (Node.js + Express + MongoDB/Redis)  

**Task Description:** `lib/init-admin.ts` — ensure admin user exists on app startup when configured.

### 22

**Subject:** Auth utilities  

**Milestone:** Hardening & Future Enhancements  

**Task Description:** `lib/auth.ts` — JWT sign/verify (jose + jsonwebtoken), password hash/compare for admin.

---

## Public API routes

### 23

**Subject:** GET public site config  

**Milestone:** Backend Architecture (Node.js + Express + MongoDB/Redis)  

**Task Description:** `GET /api/public/site-config` — selling flag + merged waitlist copy for landing.

### 24

**Subject:** POST public waitlist  

**Milestone:** Backend Architecture (Node.js + Express + MongoDB/Redis)  

**Task Description:** `POST /api/public/waitlist` — validate input, create `WaitlistEntry` when selling disabled, send confirmation email.

### 25

**Subject:** GET products for storefront  

**Milestone:** Develop Website and Integrated with SaaS System  

**Task Description:** `GET /api/products` — Shopify GraphQL fetch of fixed product set (test/live IDs), variants, prices, images, `storeDomain` for checkout links.

### 26

**Subject:** POST contact  

**Milestone:** Backend Architecture (Node.js + Express + MongoDB/Redis)  

**Task Description:** `POST /api/contact` — contact form handling / notification email per env.

### 27

**Subject:** Unlock API  

**Milestone:** Develop Website and Integrated with SaaS System  

**Task Description:** `POST` (and related) `app/api/unlock/route.ts` — validate code, unlock flow, notifications as implemented.

### 28

**Subject:** Media validate code  

**Milestone:** Develop Website and Integrated with SaaS System  

**Task Description:** `app/api/media/validate-code/route.ts` — authorize upload session by code.

### 29

**Subject:** Media Cloudinary signature  

**Milestone:** Develop Website and Integrated with SaaS System  

**Task Description:** `app/api/media/cloudinary-signature/route.ts` — signed upload params for client.

### 30

**Subject:** Media upload  

**Milestone:** Develop Website and Integrated with SaaS System  

**Task Description:** `app/api/media/upload/route.ts` — receive/process uploads tied to moments.

### 31

**Subject:** Media list  

**Milestone:** Develop Website and Integrated with SaaS System  

**Task Description:** `app/api/media/list/route.ts` — list media for a code/session.

### 32

**Subject:** Media complete upload  

**Milestone:** Develop Website and Integrated with SaaS System  

**Task Description:** `app/api/media/complete-upload/route.ts` — finalize upload and attach to `MomentCode`.

### 33

**Subject:** Media delete  

**Milestone:** Develop Website and Integrated with SaaS System  

**Task Description:** `app/api/media/delete/route.ts` — remove media asset.

### 34

**Subject:** Shopify check connection (public/tooling)  

**Milestone:** Develop Website and Integrated with SaaS System  

**Task Description:** `app/api/shopify/check-connection/route.ts` — verify Shopify connectivity.

### 35

**Subject:** Shopify reconnect  

**Milestone:** Develop Website and Integrated with SaaS System  

**Task Description:** `app/api/shopify/reconnect/route.ts` — reconnect flow for store integration.

---

## Webhooks

### 36

**Subject:** Shopify orders paid webhook  

**Milestone:** Backend Architecture (Node.js + Express + MongoDB/Redis)  

**Task Description:** `POST /api/webhooks/shopify/orders-paid` — raw body HMAC check (optional bypass env), idempotency, derive codes, `processPaidOrderAndGenerateCodes`, tag parsing.

---

## Admin API routes

### 37

**Subject:** Admin login  

**Milestone:** Admin App & Platform Management  

**Task Description:** `POST /api/admin/login` — credential check, JWT cookie.

### 38

**Subject:** Admin logout  

**Milestone:** Admin App & Platform Management  

**Task Description:** `POST /api/admin/logout` — clear session cookie.

### 39

**Subject:** Admin test auth  

**Milestone:** Admin App & Platform Management  

**Task Description:** `GET/POST /api/admin/test-auth` — verify token for debugging.

### 40

**Subject:** Admin stats  

**Milestone:** Admin App & Platform Management  

**Task Description:** `GET /api/admin/stats` — dashboard metrics.

### 41

**Subject:** Admin orders list & create  

**Milestone:** Admin App & Platform Management  

**Task Description:** `GET /api/admin/orders` — search/filter by source, aggregate code stats; `POST` — create paid draft order via Shopify, then run code generation.

### 42

**Subject:** Admin order detail  

**Milestone:** Admin App & Platform Management  

**Task Description:** `GET /api/admin/orders/[orderId]` — order + related codes for detail page.

### 43

**Subject:** Admin codes list  

**Milestone:** Admin App & Platform Management  

**Task Description:** `GET /api/admin/codes` — list moment codes with filters as implemented.

### 44

**Subject:** Admin code detail  

**Milestone:** Admin App & Platform Management  

**Task Description:** `GET/PATCH /api/admin/codes/[codeId]` — single code inspection/update.

### 45

**Subject:** Admin buyers  

**Milestone:** Admin App & Platform Management  

**Task Description:** `GET /api/admin/buyers` — buyer-oriented list/export-style data.

### 46

**Subject:** Admin configs GET/PUT  

**Milestone:** Admin App & Platform Management  

**Task Description:** `GET/PUT /api/admin/configs` — read/update `sellingEnabled` and waitlist copy fields.

### 47

**Subject:** Admin waitlist list  

**Milestone:** Admin App & Platform Management  

**Task Description:** `GET /api/admin/waitlist` — list entries with optional status filter.

### 48

**Subject:** Admin waitlist patch  

**Milestone:** Admin App & Platform Management  

**Task Description:** `PATCH /api/admin/waitlist/[id]` — update entry status.

### 49

**Subject:** Admin waitlist generate code  

**Milestone:** Admin App & Platform Management  

**Task Description:** `POST /api/admin/waitlist/[id]/generate-code` — synthetic order id, `processPaidOrderAndGenerateCodes`, attach order + codes to waitlist row.

### 50

**Subject:** Admin waitlist notify selling open (bulk)  

**Milestone:** Admin App & Platform Management  

**Task Description:** `POST /api/admin/waitlist/notify-selling-open` — email unique waitlist addresses, set status to `invited` on success.

### 51

**Subject:** Admin waitlist notify selling open (single)  

**Milestone:** Admin App & Platform Management  

**Task Description:** `POST /api/admin/waitlist/[id]/notify-selling-open` — one-off shop-open email.

### 52

**Subject:** Admin Shopify credentials  

**Milestone:** Admin App & Platform Management  

**Task Description:** `GET/POST/PUT/DELETE /api/admin/shopify-credentials` — manage encrypted Shopify settings (auth-guarded).

### 53

**Subject:** Admin Shopify test mode setting  

**Milestone:** Admin App & Platform Management  

**Task Description:** `GET/PUT /api/admin/settings/shopify-test-mode` — toggle test credentials behavior.

### 54

**Subject:** Admin Shopify webhook subscribe  

**Milestone:** Admin App & Platform Management  

**Task Description:** `POST /api/admin/shopify-webhooks/subscribe` — register webhook subscription with Shopify.

### 55

**Subject:** Admin test email  

**Milestone:** Admin App & Platform Management  

**Task Description:** `POST /api/admin/test-email` — SMTP verify + send sample HTML email.

---

## Middleware & app shell

### 56

**Subject:** Admin route protection  

**Milestone:** Hardening & Future Enhancements  

**Task Description:** `middleware.ts` — JWT cookie validation for `/admin/*` and `/api/admin/*` (except login/test-auth), role `admin`, redirect or 401.

### 57

**Subject:** Root layout & fonts  

**Milestone:** Frontend Architecture (Next.js Client & Admin)  

**Task Description:** `app/layout.tsx` — Inter + Cormorant Garamond, global CSS, metadata (title, description, keywords, Open Graph, Twitter), `ToastProvider`, `ErrorBoundary`.

### 58

**Subject:** Global error boundary  

**Milestone:** Hardening & Future Enhancements  

**Task Description:** `components/ErrorBoundary.tsx` — catch client render errors.

### 59

**Subject:** Toast notifications  

**Milestone:** Tailwind CSS Design System & Reusable Components  

**Task Description:** `lib/toast.tsx` — `ToastProvider` + react-hot-toast for admin UX.

---

## Public frontend — landing (`app/page.tsx` and related)

### 60

**Subject:** Site header  

**Milestone:** Frontend Architecture (Next.js Client & Admin)  

**Task Description:** Sticky header with “How it Works” (opens modal), UNIKMO wordmark, Contact; scroll styling.

### 61

**Subject:** Hero section  

**Milestone:** Frontend Architecture (Next.js Client & Admin)  

**Task Description:** Hero with headline, sublines, supporting copy, primary CTA, `nr1.jpg` banner with width/bleed adjustments for on-image text; intersection observer entrance animation.

### 62

**Subject:** “When words aren’t enough” section  

**Milestone:** UI/UX Modernization  

**Task Description:** Use-case grid with heading “When words aren’t enough” and bullet moments.

### 63

**Subject:** Testimonials (social proof)  

**Milestone:** UI/UX Modernization  

**Task Description:** `SocialProof` — stacked quotes, avatars, taupe band, section order after use cases.

### 64

**Subject:** “ How it works.” section  

**Milestone:** UI/UX Modernization  

**Task Description:** Three-step flow (Choose key → Add a private Moment → Give them the Key to unlock it), support line about key not sent to recipient; removed duplicate “more” / Learn more links.

### 65

**Subject:** Product / pricing (StoryIn)  

**Milestone:** Develop Website and Integrated with SaaS System  

**Task Description:** Fetch `/api/products`, grid of tiers, product modal with delivery choice, checkout URL to Shopify cart with email + cart attributes, waitlist path when selling off.

### 66

**Subject:** Create moment & waitlist modals  

**Milestone:** Frontend Architecture (Next.js Client & Admin)  

**Task Description:** `CreateMomentModal`, `WaitlistModal`, `ProductModal`, `AnimatedMomentModal` variants for celebrate/confirm flows.

### 67

**Subject:** How it works modal  

**Milestone:** UI/UX Modernization  

**Task Description:** Detailed step grid/modal content; hash `#how-it-works` opens modal.

### 68

**Subject:** Final CTA & pre-footer trust  

**Milestone:** UI/UX Modernization  

**Task Description:** Final CTA block + trust icons strip before footer.

### 69

**Subject:** Site footer & legal modals  

**Milestone:** UI/UX Modernization  

**Task Description:** Footer links Privacy, Terms, Imprint; modal content for Privacy Policy, Terms & Conditions (Unikmo), Imprint; tree strip integration as designed.

### 70

**Subject:** Contact modal  

**Milestone:** Frontend Architecture (Next.js Client & Admin)  

**Task Description:** Contact form wired to contact API.

### 71

**Subject:** Landing data fetch  

**Milestone:** Frontend Architecture (Next.js Client & Admin)  

**Task Description:** `useEffect` fetch `/api/public/site-config` for waitlist mode and copy overrides.

---

## Other public pages

### 72

**Subject:** Unlock page  

**Milestone:** Develop Website and Integrated with SaaS System  

**Task Description:** `app/unlock/page.tsx` — full unlock UX, media handling hooks to APIs.

### 73

**Subject:** Upload page  

**Milestone:** Develop Website and Integrated with SaaS System  

**Task Description:** `app/upload/page.tsx` — upload flow for moment media.

---

## Admin frontend

### 74

**Subject:** Admin layout  

**Milestone:** Admin App & Platform Management  

**Task Description:** `app/admin/layout.tsx` — wraps pages with `AdminShell`.

### 75

**Subject:** Admin shell (sidebar + header)  

**Milestone:** Admin App & Platform Management  

**Task Description:** `components/AdminShell.tsx` — nav links, collapsible sidebar (desktop rail + mobile drawer), `localStorage` persistence, active route styling.

### 76

**Subject:** Admin login page  

**Milestone:** Admin App & Platform Management  

**Task Description:** `app/admin/login/page.tsx` — sign-in form, redirect when authenticated.

### 77

**Subject:** Admin dashboard  

**Milestone:** Admin App & Platform Management  

**Task Description:** `app/admin/dashboard/page.tsx` — overview / entry to subsections.

### 78

**Subject:** Admin orders list & create form  

**Milestone:** Admin App & Platform Management  

**Task Description:** `app/admin/orders/page.tsx` — search, source filter, create order form (product combobox, delivery, tags), table with links to detail.

### 79

**Subject:** Admin order detail  

**Milestone:** Admin App & Platform Management  

**Task Description:** `app/admin/orders/[orderId]/page.tsx` — order metadata + codes table with media preview links.

### 80

**Subject:** Admin codes list  

**Milestone:** Admin App & Platform Management  

**Task Description:** `app/admin/codes/page.tsx` — browse/search codes.

### 81

**Subject:** Admin code detail  

**Milestone:** Admin App & Platform Management  

**Task Description:** `app/admin/codes/[codeId]/page.tsx` — single code admin view.

### 82

**Subject:** Admin buyers page  

**Milestone:** Admin App & Platform Management  

**Task Description:** `app/admin/buyers/page.tsx` — buyer list UI.

### 83

**Subject:** Admin Shopify page  

**Milestone:** Admin App & Platform Management  

**Task Description:** `app/admin/shopify/page.tsx` — connection UI; uses `ShopifyConnectionStatus` where applicable.

### 84

**Subject:** Shopify connection status component  

**Milestone:** Tailwind CSS Design System & Reusable Components  

**Task Description:** `components/ShopifyConnectionStatus.tsx` — display connection state.

### 85

**Subject:** Admin configs & waitlist table  

**Milestone:** Admin App & Platform Management  

**Task Description:** `app/admin/configs/page.tsx` — selling toggle, waitlist copy fields, save; waitlist table with status select styling, generate-code modal, bulk + single “shop open” email modals.

### 86

**Subject:** Admin template viewer  

**Milestone:** Admin App & Platform Management  

**Task Description:** `app/admin/template-viewer/page.tsx` — preview email/HTML templates.

---

## Scripts & tooling

### 87

**Subject:** Seed admin user  

**Milestone:** DevOps & Deployment  

**Task Description:** `scripts/seed-admin.ts` + `npm run seed:admin` — create initial admin from env.

### 88

**Subject:** Check admin exists  

**Milestone:** DevOps & Deployment  

**Task Description:** `scripts/check-admin.ts` + `predev` / `prebuild` / `prestart` hooks — fail fast if admin not configured.

### 89

**Subject:** Subscribe Shopify webhook  

**Milestone:** DevOps & Deployment  

**Task Description:** `scripts/subscribe-webhook.ts` + `npm run sub:shopify:hook` — register orders/paid webhook.

### 90

**Subject:** Package scripts & dependencies  

**Milestone:** DevOps & Deployment  

**Task Description:** `package.json` — Next, React, Mongoose, Nodemailer, bcrypt/jose/jwt, Cloudinary, framer-motion, eslint, tailwind, etc.

### 91

**Subject:** Tailwind configuration  

**Milestone:** Tailwind CSS Design System & Reusable Components  

**Task Description:** `tailwind.config.ts` — theme/content paths for app and components.

### 92

**Subject:** Environment template  

**Milestone:** QA and Deployment  

**Task Description:** `.env.example` — documented variables including MongoDB, Cloudinary, Shopify, JWT, SMTP, cPanel SMTP notes, contact email.

---

## Documentation & planning (deliverables)

### 93

**Subject:** Referral / discounted feature client brief  

**Milestone:** Hardening & Future Enhancements  

**Task Description:** `discounted-feature-flow-client.md` — non-technical flow, milestones concept, open questions for client sign-off.

### 94

**Subject:** This milestone task index  

**Milestone:** QA and Deployment  

**Task Description:** `docs/completed-tasks-milestones.md` — full enumerated delivery list for stakeholders.

---

## Roadmap milestones not implemented in this repo

**Subject:** SaaS productization, multi-tenancy, plans, advanced RBAC, monorepo split, generic CRM modules  

**Milestone:** SAAS Module Development and integration · Tenancy, Plans, Modules, and RBAC · Monorepo Setup & Project Restructuring · Generic CRM Feature Implementation (First Modules)  

**Task Description:** No matching application code in the current codebase; reserved for future phases if contracted separately.

---

*End of list. Renumber or split milestones in your SOW if your contract uses different groupings.*
