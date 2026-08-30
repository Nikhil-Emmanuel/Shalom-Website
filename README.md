# Shalom Children's Home

Developed and powered by **Nevark Technologies** (LLPIN: ACP-8830).

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
| `python scripts/redact_faces.py` | Obscure faces in photographs that need it |
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

Under the default `protect` policy, **`prominent` photographs are never written into `public/`** unless they have been redacted. This matters: filtering only at render time would still leave the file fetchable at a guessable URL.

Currently **21 of 24** photographs are published — 9 that needed no treatment, and 12 whose faces were obscured. No child is ever named, under any policy.

### Redaction

`scripts/redact_faces.py` detects faces (OpenCV YuNet) and destroys those regions — downsampled hard, then blurred, so they cannot be recovered by sharpening. Output goes to `MEDIA FILES/redacted/` for review; it is gitignored because it is rebuildable.

**The detector is not the safety mechanism.** A missed face fails silently, because the image still looks processed and nobody re-checks it. So detection runs deliberately hot (low threshold, plus an upscaled pass for small faces; false positives only blur background) and every output must be checked by eye before its slug is added to `VERIFIED` in that script and `REDACTED` in `prepare-media.mjs`. Those two lists must stay in sync.

Three photographs remain withheld: two large group shots where every face cannot be confirmed, and one where faces dominate the frame so heavily that redaction destroys the picture.

```bash
python scripts/redact_faces.py    # then LOOK at every image in MEDIA FILES/redacted/
node scripts/prepare-media.mjs
```

To publish faces unredacted — **only** after the home gives written permission:

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

Motion has **two tiers** rather than an on/off switch (`motionLevel()` in `src/lib/motion.ts`):

| Tier | Behaviour |
| --- | --- |
| `full` | Parallax, pinning, scrubbed transforms, slide-in headlines |
| `reduced` | Opacity only — fades and counters still run, nothing travels |

`prefers-reduced-motion` asks us to cut *motion*, not all animation, and it is switched on far more often than people realise (Windows "Show animations" off, macOS "Reduce motion"). A blanket kill-switch made the site look broken for those visitors.

Entrance animations are also deferred until the document is visible (`whenVisible()`). Browsers suspend `requestAnimationFrame` in hidden tabs, so building an `opacity: 0` timeline there would leave content invisible with nothing scheduled to reveal it.

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
- A written photo policy from the home would let us drop the redaction and use these photographs as they were taken
