# Backburner Setup Guide

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Clerk**:
   - Go to [clerk.com](https://clerk.com) and create an account
   - Create a new application
   - In the Clerk dashboard, go to "API Keys"
   - Copy your `Publishable Key` and `Secret Key`

3. **Create `.env` file**:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   DATABASE_URL="file:./dev.db"
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   ```

4. **Initialize database**:
   ```bash
   npx prisma db push
   npm run db:seed
   ```

5. **Run development server**:
   ```bash
   npm run dev
   ```

6. **Open** [http://localhost:3000](http://localhost:3000)

## Database Commands

- **Push schema changes**: `npm run db:push`
- **Seed categories**: `npm run db:seed`
- **View database**: `npx prisma studio`

## Production Deployment (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. For production, update `DATABASE_URL` to use PostgreSQL:
   - Update `prisma/schema.prisma` datasource to `provider = "postgresql"`
   - Use a PostgreSQL connection string in `DATABASE_URL`
5. Deploy!

## Notes

- SQLite is used for development (file-based, no setup needed)
- For production, switch to PostgreSQL for better performance and reliability
- All routes except `/sign-in` and `/sign-up` are protected by authentication
- One entry per day is enforced at the database level
