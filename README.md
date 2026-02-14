# UNIKMO Gifting Platform

A secure gifting platform integrated with Shopify, built with Next.js 14, TypeScript, MongoDB, and Cloudinary.

## Features

- **Shopify Integration**: Webhook-based order processing with `orders/paid` event
- **Moment Codes**: Unique, encoded codes generated after payment confirmation
- **Media Upload**: Secure media upload with Cloudinary (1GB limit per file)
- **Recipient Unlock**: Code-based media unlocking with rate limiting
- **Admin Dashboard**: Full-featured admin panel for managing users, orders, and codes

## Tech Stack

- **Framework**: Next.js 14.x (App Router, Node runtime)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 3.4.x
- **Animations**: Framer Motion
- **Database**: MongoDB + Mongoose
- **Media**: Cloudinary
- **Auth**: JWT + bcrypt (admin only)
- **Email**: Nodemailer with SMTP

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Shopify
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=your_access_token
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret
SHOPIFY_API_VERSION=2024-10

# Application
BASE_URL=https://yourdomain.com
JWT_SECRET=your_jwt_secret

# SMTP (Nodemailer)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM=noreply@yourdomain.com

# Admin Seed
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_password
```

### 3. Seed Admin User

Create the initial admin user:

```bash
npm run seed:admin
```

### 4. Subscribe to Shopify Webhooks

Subscribe to the `orders/paid` webhook:

```bash
npm run sub:shopify:hook
```

This script will:
- Read `BASE_URL` from environment variables
- Subscribe to `orders/paid` webhook via Shopify GraphQL API
- Set the callback URL to `${BASE_URL}/api/webhooks/shopify/orders-paid`

### 5. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
/app
  /admin              # Admin dashboard pages
    /dashboard        # Overview stats
    /buyers           # Buyers management
    /codes            # Codes management
  /upload             # Media upload page
  /unlock             # Recipient unlock page
  /api                # API routes
    /webhooks/shopify # Shopify webhook handlers
    /admin            # Admin API endpoints
    /media            # Media upload endpoints
/models               # Mongoose models
/lib                  # Utility functions
/scripts              # Seed and setup scripts
```

## Key Features

### Moment Code Format

Codes are generated in the format: `UNIKMO-XXXX-[Q][D]XX-XXX`

- `UNIKMO` - Fixed prefix
- `XXXX` - 4 random alphanumeric characters
- `Q` - Quantity (1, 4, or 7)
- `D` - Delivery type (D=digital, P=physical, S=split)
- `XX` - 2 random alphanumeric characters
- `XXX` - 3 random alphanumeric characters

Example: `UNIKMO-A7FQ-1D23-XYZ` = 1 Digital

### Shopify Integration

The platform uses Shopify's `orders/paid` webhook to:
1. Validate HMAC signature
2. Create/find user by email
3. Store order with product IDs and quantities
4. Extract variant metafields (quantity and deliveryType)
5. Generate Moment Codes (one per unique variant)
6. Send email to buyer with codes

### Media Upload

- Buyers can upload media using their Moment Code
- Files are validated (1GB limit)
- Uploads go to Cloudinary
- Code must be in "new" status (not claimed)

### Recipient Unlock

- Recipients enter the Moment Code
- Rate limiting prevents brute force (5 attempts per minute)
- Media is displayed after successful unlock
- Code status changes to "claimed" on first unlock

### Admin Dashboard

Protected routes requiring admin authentication:
- **Overview**: Total buyers, orders, codes, claimed/unclaimed stats
- **Buyers**: List of buyers with search and sorting
- **Codes**: Code management with filters and actions
- **Media Viewer**: View media for specific codes

## API Endpoints

### Public
- `POST /api/webhooks/shopify/orders-paid` - Shopify webhook handler
- `POST /api/unlock` - Unlock media with code
- `GET /api/media/validate-code` - Validate code for upload
- `POST /api/media/upload` - Upload media

### Admin (Protected)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/buyers` - List buyers
- `GET /api/admin/codes` - List codes
- `GET /api/admin/codes/[codeId]` - Get code details
- `PATCH /api/admin/codes` - Update code (revoke/reset)

## Security

- HMAC validation for Shopify webhooks
- JWT authentication for admin routes
- HTTP-only cookies for session management
- Rate limiting on unlock attempts
- Idempotent webhook processing
- Input validation and sanitization

## Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Notes

- The platform uses **Node runtime** (not Edge) for all API routes
- Tailwind CSS **3.4.x** is used (NOT v4)
- All admin routes are protected by middleware
- Buyers do not have login - they access via codes only
- Moment Codes are never emailed to recipients - buyers must share them

## License

Private project - All rights reserved
