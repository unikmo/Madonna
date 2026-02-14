# Shopify Webhook HMAC Debugging Guide

## Common Issues and Solutions

### Issue: "Invalid HMAC signature" (401 error)

This error means the HMAC signature validation is failing. Here's how to fix it:

### 1. Check Your Webhook Secret

The `SHOPIFY_WEBHOOK_SECRET` in your `.env.local` must match exactly the webhook secret from Shopify:

1. Go to Shopify Admin → Settings → Notifications
2. Find your webhook subscription for `orders/paid`
3. Click on it to view details
4. Copy the **Webhook signing secret** (it's a long random string)
5. Make sure it's exactly the same in your `.env.local`:

```env
SHOPIFY_WEBHOOK_SECRET=your_exact_webhook_secret_from_shopify
```

**Important:** 
- No extra spaces
- No quotes around it
- Copy the entire secret exactly as shown

### 2. Verify Environment Variable is Loaded

Check if the secret is being read correctly:

```bash
# In your terminal, check if the variable is set
echo $SHOPIFY_WEBHOOK_SECRET
```

Or add temporary logging in the webhook handler to verify.

### 3. Check Webhook URL

Make sure your webhook URL in Shopify matches your `BASE_URL`:

- Shopify webhook URL: `https://yourdomain.com/api/webhooks/shopify/orders-paid`
- Your `BASE_URL` in `.env.local`: `https://yourdomain.com`

### 4. Test with Shopify CLI (Optional)

You can test webhooks locally using Shopify CLI:

```bash
shopify app generate webhook
```

### 5. Common Mistakes

- ❌ Using the API access token instead of webhook secret
- ❌ Using the store password instead of webhook secret
- ❌ Having extra spaces or newlines in the secret
- ❌ Using the wrong webhook secret (if you have multiple webhooks)

### 6. How to Get the Correct Secret

1. **Shopify Admin Method:**
   - Settings → Notifications → Webhooks
   - Click on your `orders/paid` webhook
   - Copy the "Webhook signing secret"

2. **API Method:**
   ```graphql
   query {
     webhookSubscriptions(first: 10) {
       edges {
         node {
           id
           callbackUrl
           apiVersion
           format
         }
       }
     }
   }
   ```
   Note: The secret is not returned via API for security. You must get it from Admin.

### 7. Verify the Secret Format

The webhook secret should be:
- A long random string (usually 32+ characters)
- Base64 encoded
- Unique to each webhook subscription

Example format: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0`

### 8. After Updating the Secret

1. Restart your Next.js server:
   ```bash
   npm run dev
   ```

2. Test the webhook by creating a test order in Shopify

3. Check the logs for the debug output showing:
   - Signature header present: true
   - Webhook secret present: true
   - Body length: [number]

### Still Not Working?

If you've verified all of the above:

1. Delete and recreate the webhook subscription in Shopify
2. Copy the new secret immediately
3. Update your `.env.local`
4. Restart the server
5. Test again
