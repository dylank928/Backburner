# Collaboration Guide

## Sharing Clerk Keys for Development

For development and testing, you can share the same Clerk keys with your collaborator. Here's how:

### Option 1: Share Keys Directly (Recommended for Development)

1. **One person creates the Clerk account:**

   - Go to [clerk.com](https://clerk.com) and create an account
   - Create a new application
   - Copy the API keys from the dashboard

2. **Share the keys securely:**

   - Use a secure messaging app (Signal, WhatsApp, etc.)
   - Or use a shared password manager
   - Or share via encrypted email

3. **Your collaborator sets up:**
   - Clone the repository: `git clone https://github.com/dylank928/Backburner.git`
   - Copy `.env.example` to `.env`: `cp .env.example .env` (or create `.env` manually)
   - Paste the shared Clerk keys into their `.env` file
   - Run `npm install`
   - Run `npx prisma db push` and `npm run db:seed`
   - Run `npm run dev`

### Option 2: Use Environment Variable Sharing Tools

For teams, consider using:

- **1Password Secrets Automation**
- **Doppler** (free for small teams)
- **GitHub Secrets** (for CI/CD)
- **Vercel Environment Variables** (if deploying to Vercel)

### Important Notes

⚠️ **Security Considerations:**

- **Never commit `.env` files to git** (already in `.gitignore`)
- **Never share keys in public channels** (Slack, Discord public channels, etc.)
- For production, each environment should have separate Clerk applications
- Test keys (`pk_test_...` and `sk_test_...`) are safe to share for development

✅ **What's Safe:**

- Sharing test/development keys with trusted collaborators
- Using the same keys for local development
- Committing `.env.example` (it has no real keys)

❌ **What's NOT Safe:**

- Committing real keys to git
- Sharing production keys
- Posting keys in public repositories or forums

### Quick Setup for New Collaborator

```bash
# 1. Clone the repo
git clone https://github.com/dylank928/Backburner.git
cd Backburner

# 2. Install dependencies
npm install

# 3. Create .env file (copy from .env.example)
cp .env.example .env

# 4. Add Clerk keys to .env (get from your teammate)

# 5. Set up database
npx prisma db push
npm run db:seed

# 6. Start dev server
npm run dev
```

### Using the Same Database

By default, each person will have their own local SQLite database (`dev.db`). If you want to share data:

1. **Option A: Use a shared database file** (not recommended - can cause conflicts)
2. **Option B: Use a cloud database** (recommended for collaboration):
   - Set up a free PostgreSQL database on [Supabase](https://supabase.com) or [Railway](https://railway.app)
   - Update `DATABASE_URL` in `.env` to use the PostgreSQL connection string
   - Update `prisma/schema.prisma` to use `provider = "postgresql"` instead of `"sqlite"`
   - Run `npx prisma db push` to sync the schema

### Development Bypass Mode

If you want to test without authentication, set in `.env`:

```
DEV_BYPASS_AUTH=true
NEXT_PUBLIC_DEV_BYPASS_AUTH=true
```

This allows you to access the app without signing in (useful for UI testing).
