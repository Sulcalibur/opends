# Penpot Integration Guide

## Issue: Connection Error

When trying to connect Penpot (running on Coolify) to OpenDS, you may encounter a "Connection error". This is typically caused by **CORS (Cross-Origin Resource Sharing) restrictions**.

## Root Cause

The OpenDS API was blocking requests from external origins (like Penpot running on Coolify) because they weren't in the allowed origins list.

## Solution

### Quick Fix (Recommended)

The CORS middleware has been updated to **automatically allow all origins (*) in production**. This means after redeploying your OpenDS instance on Coolify, the connection should work immediately.

### Steps to Fix

1. **Redeploy OpenDS on Coolify**
   - Go to your Coolify dashboard
   - Find your OpenDS application
   - Trigger a new deployment to pull the latest changes

2. **Verify the Fix**
   - After deployment, try connecting Penpot again
   - The connection should now succeed

### Custom CORS Configuration (Optional)

If you want to restrict origins for security, you can set the `CORS_ORIGIN` environment variable in Coolify:

```bash
# Allow specific origins (recommended for production)
CORS_ORIGIN=https://coolify.sulei.dev,https://penpot.example.com

# Allow all origins (less secure but works for all integrations)
CORS_ORIGIN=*
```

**How to set in Coolify:**
1. Go to your OpenDS application in Coolify
2. Navigate to **Environment Variables**
3. Add `CORS_ORIGIN` with your desired value
4. Redeploy the application

## API Key Configuration

Make sure you're using a valid API key when connecting Penpot to OpenDS:

### Valid API Keys (for testing)
- `test-api-key`
- `opends-simple-key`
- `opends_5ceaa06f48417a197ba30c9d4fe4788658f38422887441115dda1e546bd7dec8`

### Generate a New API Key

To create a production API key via the OpenDS database:

```sql
INSERT INTO api_keys (key, name, created_at) 
VALUES ('your-secure-key-here', 'Penpot Integration', NOW());
```

Or use the OpenDS Admin UI:
1. Log in to OpenDS at https://opends.sulei.dev/admin
2. Go to **Admin → API Tokens**
3. Create a new token for Penpot

## API Endpoints

Penpot uses these OpenDS endpoints:

- **Health Check**: `GET /api/health`
- **Sync Status**: `GET /api/penpot/sync-status`
- **Import Tokens**: `POST /api/penpot/tokens`

### Test Connection

You can test the connection manually:

```bash
# Test health endpoint
curl https://opends.sulei.dev/api/health

# Test Penpot sync status with API key
curl -H "Authorization: Bearer opends-simple-key" \
     https://opends.sulei.dev/api/penpot/sync-status
```

Expected response:
```json
{"synced":0,"pending":0,"conflicts":0}
```

## Troubleshooting

### Still Getting Connection Error?

1. **Check CORS Headers**
   ```bash
   curl -v -X OPTIONS https://opends.sulei.dev/api/penpot/sync-status \
        -H "Origin: https://coolify.sulei.dev" \
        -H "Access-Control-Request-Method: GET"
   ```
   
   You should see `Access-Control-Allow-Origin: *` in the response headers.

2. **Verify API Key**
   ```bash
   curl -H "Authorization: Bearer YOUR_API_KEY" \
        https://opends.sulei.dev/api/penpot/sync-status
   ```
   
   Should return `200 OK`, not `401 Unauthorized`.

3. **Check Deployment Logs**
   - Look at Coolify deployment logs for any build errors
   - Check OpenDS application logs for runtime errors

### Browser Console Errors

If you see CORS errors in the browser console:
- `Access to fetch at 'https://opends.sulei.dev' from origin 'https://coolify.sulei.dev' has been blocked by CORS policy`

This means the CORS fix hasn't been deployed yet. Redeploy OpenDS on Coolify.

## Security Considerations

### Production Recommendations

For production environments, it's more secure to specify exact origins rather than using `*`:

```bash
# In Coolify Environment Variables
CORS_ORIGIN=https://coolify.sulei.dev,https://penpot.sulei.dev,https://opends.sulei.dev
```

This limits which domains can make API requests to your OpenDS instance.

### Development vs Production

- **Development**: Automatically restricted to `localhost` only
- **Production**: Automatically allows all origins (`*`) unless `CORS_ORIGIN` is set

## Related Files

- CORS Middleware: `server/middleware/cors.ts`
- Penpot Endpoints: `server/api/penpot/`
- Auth Utils: `server/utils/auth.ts`
- Environment Config: `.env.example`
