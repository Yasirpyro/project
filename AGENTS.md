# University AI Portal

Next.js 16 (App Router) + TypeScript + Tailwind/shadcn dashboard demo. See `README.md` for feature/route overview.

## Cursor Cloud specific instructions

### Services
There is a single service: the Next.js web app. Standard commands live in `package.json` scripts.

- Run (dev): `npm run dev` → serves on `http://localhost:3000` (Turbopack).
- Typecheck: `npm run typecheck` (`tsc --noEmit`).

### Non-obvious gotchas
- `npm run lint` is BROKEN: the script is `next lint`, which was removed in Next.js 16, so it errors with "Invalid project directory ... /workspace/lint". Run ESLint directly instead: `npx eslint . --ext .ts,.tsx,.js`.
- The dashboards (`/advisor/dashboard`, `/student/pathway`) and their sub-pages use mock data from `lib/mock-data.ts` and are fully viewable WITHOUT logging in — navigate to the routes directly. This is the easiest way to exercise core functionality.
- `/login` uses real Supabase auth (`supabaseclient.js`) and requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` env vars. Without them the client logs a warning and login throws "Supabase environment variables are not configured." Despite the README's "use any email/password" note, login is NOT mocked.
- `scripts_seedDatabase.ts` is a one-off Supabase seeding script needing `SUPABASE_SERVICE_ROLE_KEY` (+ a provisioned Supabase schema); not needed for local dev of the dashboards.
- Production build (`npm run build`) has known issues per the README; use dev mode for development/testing.
- On first `npm run dev`, Next patches the lockfile for missing `@next/swc` deps (harmless warning); the server still becomes Ready.
