# Anubhab Portfolio CMS

Next.js + Supabase portfolio with an email-locked admin dashboard for editing projects, certifications, profile content, skills, testimonials, contact details, and SEO metadata.

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

3. In Supabase:
   - Create a project.
   - Enable Google provider under Authentication.
   - Add `http://localhost:3000/auth/callback` and `https://anubhabmohapatra.in/auth/callback` as redirect URLs.
   - Run `supabase/migrations/20260429000000_portfolio_cms.sql` in the SQL editor or through the Supabase CLI.
   - Copy the project URL, publishable key, and service role key into `.env.local`.

4. Start development:

   ```bash
   npm run dev
   ```

5. Open:
   - Public site: `http://localhost:3000`
   - Admin panel: `http://localhost:3000/admin`

Only `anubhabmohapatra.01@gmail.com` is allowed to manage content.

## Deployment

Deploy to Vercel and add the same environment variables in the Vercel project settings. Point `anubhabmohapatra.in` at the Vercel deployment.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
```
