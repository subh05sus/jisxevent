# Production Setup Guide

This guide will help you deploy your Next.js authentication app to production and fix common authentication issues.

## Critical Environment Variables for Production

### 1. Update NEXTAUTH_URL
**This is the most important fix!**

In your production environment, you MUST set `NEXTAUTH_URL` to your actual domain:

```bash
# For production (replace with your actual domain)
NEXTAUTH_URL=https://yourdomain.com

# For staging
NEXTAUTH_URL=https://staging.yourdomain.com
```

### 2. Generate Strong Secrets
Generate new, secure secrets for production:

```bash
# Generate a secure NEXTAUTH_SECRET
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Complete Environment Variables
```bash
# Database
DATABASE_URL=your_production_database_url

# NextAuth Configuration
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_secure_production_secret_here

# JWT Secret (should be different from NEXTAUTH_SECRET)
JWT_SECRET=your_jwt_secret_here
```

## Deployment Platform Specific Instructions

### Vercel
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add the production environment variables:
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (set to your Vercel domain, e.g., `https://yourapp.vercel.app`)
   - `NEXTAUTH_SECRET`
   - `JWT_SECRET`

### Netlify
1. Go to Site Settings > Environment Variables
2. Add the same variables as above
3. Set `NEXTAUTH_URL` to your Netlify domain

### Railway/Render/DigitalOcean
1. Add environment variables in your platform's dashboard
2. Ensure `NEXTAUTH_URL` matches your deployed domain

## Common Production Issues & Fixes

### 1. Authentication Fails Silently
- **Cause**: Wrong `NEXTAUTH_URL`
- **Fix**: Set `NEXTAUTH_URL` to match your production domain exactly

### 2. CORS Errors
- **Cause**: Mismatched origins
- **Fix**: Ensure `NEXTAUTH_URL` matches the domain users access

### 3. Database Connection Issues
- **Cause**: Connection pooling or SSL issues
- **Fix**: Add `?sslmode=require` to DATABASE_URL for PostgreSQL

### 4. Session Not Persisting
- **Cause**: Secure cookie settings in production
- **Fix**: Ensure HTTPS is enabled on your domain

## Debugging Steps

1. **Check Environment Variables**
   ```bash
   # In your production logs, verify:
   console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL)
   console.log('NODE_ENV:', process.env.NODE_ENV)
   ```

2. **Enable Debug Mode** (temporarily)
   ```bash
   # Add to production env for debugging
   NEXTAUTH_DEBUG=true
   ```

3. **Check Network Tab**
   - Look for failed requests to `/api/auth/*`
   - Check if cookies are being set

4. **Database Connection**
   ```bash
   # Test database connection
   npx prisma db push
   ```

## Security Checklist

- ✅ Use HTTPS in production
- ✅ Set strong, unique `NEXTAUTH_SECRET`
- ✅ Set correct `NEXTAUTH_URL`
- ✅ Use environment variables, never hardcode secrets
- ✅ Enable database SSL connections
- ✅ Remove debug logs from production

## Quick Fix Checklist

1. **Set correct NEXTAUTH_URL** ← Most important!
2. Generate new production secrets
3. Verify database connection
4. Test authentication flow
5. Check browser cookies are being set
6. Verify middleware is working

## Support

If issues persist:
1. Check browser developer tools (Network & Console tabs)
2. Check your platform's deployment logs
3. Verify all environment variables are set correctly
4. Test with a simple user account first
