# Skills Technology — Animated Rebuild

Full TanStack Start rebuild of sktechnology.org: blue-and-white brand,
auto-cycling animated weather background, 3D-tilt course cards, and a
real admin panel backed by Supabase (Lovable Cloud).

## Running this

**In Lovable:** drop this project in, enable Lovable Cloud, and run the
migration at `supabase/migrations/0001_init.sql`. Lovable Cloud injects
`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` automatically once enabled —
you shouldn't need to touch `.env` there.

**Outside Lovable (plain Supabase project):**
```bash
npm install
cp .env.example .env   # fill in your Supabase project values
npm run dev
```
Run the SQL in `supabase/migrations/0001_init.sql` against your Supabase
project (SQL editor, or `supabase db push` if you use the CLI).

## Making the first admin

The migration seeds categories and two sample courses but does **not**
auto-promote anyone to admin — do that once you have a real account:

```sql
insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where email = 'you@example.com';
```

(There's a commented-out "first user becomes admin" version at the
bottom of the migration if you'd rather use that for a quick demo.)

## Swapping in the real logo

`public/logo-mark.svg` (nav/footer wordmark) and `public/logo-mark-3d.svg`
(floating hero mark) are placeholders built to match the brief's blue
palette. Drop your actual "S Skills Technology Solutions" wordmark and
3D building mark files in at those same paths (same filenames) and
everything else — nav, footer, hero, auth split-screen — picks them up
automatically.

## Adding real course content

Curriculum and instructor bios aren't in the schema yet (the brief's
open item). To wire them in:
1. Add `curriculum jsonb` and `instructor jsonb` columns to `courses` in
   a new migration.
2. Replace `PLACEHOLDER_CURRICULUM` in
   `src/routes/courses/$slug.tsx` with the real column.

## File map

```
src/
  routes/
    __root.tsx          root shell: weather bg, nav, footer, <Outlet/>
    index.tsx            home page
    courses/index.tsx    course grid, search + category filters
    courses/$slug.tsx     course detail
    about.tsx
    contact.tsx           contact form -> contact_messages
    auth.tsx              combined sign in / sign up
    admin.tsx             admin layout + role gate
    admin/index.tsx        dashboard
    admin/courses/*        course CRUD
    admin/categories.tsx   category CRUD
    admin/messages.tsx     contact inbox
  components/
    WeatherBackground.tsx canvas weather cycle (clear/clouds/rain/snow/sunset)
    CourseCard.tsx         3D tilt card (react-parallax-tilt)
    FloatingLogo.tsx       hero 3D mark, rotation + mouse parallax
    StatsCounter.tsx       animated count-up stats
    TestimonialsMarquee.tsx
    MagneticButton.tsx
    admin/CourseForm.tsx   shared create/edit form
  server/admin.ts          server functions for admin writes (role-checked)
  lib/{supabase,auth,types}.ts
supabase/migrations/0001_init.sql   tables, RLS, storage bucket, seed data
```

## Notes

- `routeTree.gen.ts` is generated automatically by the TanStack Start
  Vite plugin on first `dev`/`build` — don't hand-write it.
- All motion respects `prefers-reduced-motion` (weather background
  freezes on one frame, marquee stops, global animation durations
  collapse — see `src/styles.css`).
- RLS is the real security boundary; the `requireAdmin` check in
  `src/server/admin.ts` is defense-in-depth on top of it, not a
  replacement.
