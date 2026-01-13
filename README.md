# Backburner

A minimal, production-ready web app that helps users log why tasks were postponed, then surfaces behavioral patterns over time.

## Features (Day 1 - MVP)

- **Authentication**: Email-based login via Clerk
- **Dashboard**: Basic layout with empty state
- **Logging**: Coming soon (Day 2+)
- **History**: Coming soon (Day 2+)
- **Patterns**: Coming soon (Day 2+)

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Auth**: Clerk
- **Database**: Prisma with SQLite
- **Charts**: Recharts

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy `.env.example` to `.env` and fill in your Clerk keys:
   ```bash
   cp .env.example .env
   ```
   
   Or create a `.env` file manually in the root directory:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Database
   DATABASE_URL="file:./dev.db"

   # Clerk URLs
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   ```

3. **Set up Clerk**:
   - Create an account at [clerk.com](https://clerk.com)
   - Create a new application
   - Copy your publishable key and secret key to the `.env` file

4. **Initialize the database**:
   ```bash
   npx prisma db push
   npm run db:seed
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  dashboard/     # Main dashboard page (Day 1)
  layout.tsx     # Root layout with Clerk provider
  page.tsx       # Home page (redirects)

components/
  Header.tsx     # App header with navigation

lib/
  auth.ts        # Authentication utilities
  prisma.ts      # Prisma client instance

prisma/
  schema.prisma  # Database schema
  seed.ts        # Seed script for default categories
```

## Default Excuse Categories

The app comes with these default excuse categories:
- Tired
- Distracted
- Poor planning
- Too ambitious
- Forgot
- Low motivation
- External obligation
- Other

## Deployment

This app is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

For production, consider switching from SQLite to PostgreSQL by updating the `DATABASE_URL` in your environment variables and changing the provider in `prisma/schema.prisma`.

## License

ISC