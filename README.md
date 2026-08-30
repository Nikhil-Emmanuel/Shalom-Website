# Shalom Children's Home

Website for Shalom Children's Home, a registered children's home in Hennur, Bangalore. Thirty children live at the home; fifty-seven more are taught at village tuition centres nearby.

The site exists to make the home findable and to convert visitors into volunteers, sponsors and donors.

> **This repository contains photographs of children in care, including images that are deliberately not published on the site.** Keep it private. See [Child safeguarding](#child-safeguarding) before changing anything under `MEDIA FILES/`, `public/media/` or `src/lib/privacy.ts`.

## Running it

```bash
npm install
npm run dev
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server on :3000 |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript, strict |
| `npm run lint` | ESLint |
| `node scripts/prepare-media.mjs` | Re-optimise photographs into `public/media` |

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger · Lenis · Zod · react-hook-form. Deploy target is Vercel.

Design tokens live in `src/app/globals.css` under `@theme` — a warm editorial palette (cream canvas, terracotta, marigold) with Fraunces for display and Inter for text. Colour pairs were contrast-checked rather than eyeballed; the ratios are recorded in that file.

## Child safeguarding

The home returned its information sheet with the photo-permission question blank, while supplying photographs in which children are clearly identifiable. India's Juvenile Justice (Care and Protection of Children) Act 2015 restricts publishing details that identify a child in care, so the site defaults to protecting them.

Every photograph is classified in `scripts/prepare-media.mjs`:

| Classification | Meaning |
| --- | --- |
| `none` | No children, or no visible faces (adults only) |
| `incidental` | Children present, but nobody is an identifiable subject |
| `prominent` | At least one child's face is clearly identifiable |

Under the default `protect` policy, **`prominent` photographs are never written into `public/`**. This matters: filtering only at render time would still leave the file fetchable at a guessable URL. Currently 9 of 24 photographs are published. No child is ever named, under any policy.

To publish faces — **only** after the home gives written permission:

1. Set `facePolicy` to `"open"` in `src/content/media.policy.json`
2. Re-run `node scripts/prepare-media.mjs`

## Architecture

```
src/
  app/          routes, API, sitemap/robots
  components/   ui · sections · motion · media · forms
  content/      typed, Zod-validated content — the CMS seam
  lib/          privacy, seo, enquiry, motion helpers
```

Components never import content files directly; everything goes through `getContent()` in `src/content/index.ts`. A CMS can replace the file-backed source by changing that one module.

Animation is progressive enhancement throughout. The pinned horizontal "A Day at Shalom" section on the home page renders as a plain grid on the server and only becomes a horizontal track when the viewport is wide enough *and* the visitor has not requested reduced motion — enhancement is never load-bearing for content.

## Contact form

`POST /api/enquiry` emails the home via Resend. It needs:

```
RESEND_API_KEY=
ENQUIRY_FROM_EMAIL=
```

Without them the route returns a specific "unconfigured" response and the form falls back to a prefilled `mailto:` link. A message is never accepted and then silently dropped.

## Outstanding before launch

- **Phone number** — the home listed contact channels, not a number
- **Bank / UPI details** — needed for any real donation flow (80G exemption applies; FCRA is *not* held, so donations are India-only)
- **PIN code** — the sheet reads 570043, which is Mysuru; Hennur is 560043. Omitted from structured data until confirmed
- Logo file, written photo policy, domain name, testimonials
- Wide or back-turned photographs of the village tuition centres — every current image of that programme shows identifiable faces, so it has no photo
