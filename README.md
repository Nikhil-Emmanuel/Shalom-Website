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

Animation is progressive enhancement throughout. The pinned horizontal "A Day at Shalom" section renders as a plain grid on the server and only becomes a horizontal track above 768px — enhancement is never load-bearing for content.

**Motion is not gated on `prefers-reduced-motion`**, by instruction: the site runs full motion on any device that can render it. `motionLevel()` in `src/lib/motion.ts` always returns `full` and is the single place that decision lives — reverse it there. `prefersReducedMotion()` remains as an honest read of the media query but is wired to nothing.

Framer Motion drives scroll reveals, the mobile nav drawer and the gallery lightbox. GSAP keeps the pinned journey (ScrollTrigger's `pin` has no Framer Motion equivalent) and the hero timeline (synced to Lenis through GSAP's ticker).

`Reveal` hides content from an effect rather than via a server-rendered `initial` style, so no-JS, crawlers and hidden tabs all get the finished markup. It has twice regressed to leaving content permanently invisible; that ordering is what prevents it.

Entrance animations are deferred until the document is visible (`whenVisible()`). Browsers suspend `requestAnimationFrame` in hidden tabs, so building an `opacity: 0` timeline there would leave content invisible with nothing scheduled to reveal it.

## Contact form

Two providers, and they submit from **different sides**. Copy `.env.example` to `.env.local` and fill in one.

**Web3Forms — in use now, submitted from the browser.** `src/lib/web3forms.ts`, called by the form directly. This is not a stylistic choice: the Web3Forms API sits behind Cloudflare bot protection and answers a server-side `fetch` with the "Just a moment..." interstitial and a `403`, never the API. Verified against a valid key, which succeeds from a browser and fails from Node with identical headers — and datacenter IPs like Vercel's are challenged hardest, so a server-side implementation fails in production while reviewing as correct. Browser submission is their documented model. Set `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`; the `NEXT_PUBLIC_` prefix is deliberate, as the key names a destination inbox and grants no read access.

**Resend — the better path, now that the home owns a domain.** `POST /api/enquiry` → `src/lib/mailer.ts`, server side. Set `RESEND_API_KEY` and `ENQUIRY_FROM_EMAIL` (at `shalomhome.in`) once the domain is verified in Resend's dashboard. Mail then comes from the home's own address rather than a relay. **Never** put a Resend key behind `NEXT_PUBLIC_` — that one is a real secret.

Either way `reply-to` is the sender's address, so hitting Reply in Gmail goes straight back to them.

With neither set, the form offers a prefilled `mailto:` link instead — as it does if a send fails. A message is never accepted and then silently dropped.

The hidden `website` field is a honeypot, checked client-side before submitting. It is intentionally permissive in the schema: validating it as `max(0)` made a filled honeypot fail validation and return the ordinary error, telling a bot its submission was rejected. It now shows the ordinary confirmation and sends nothing.

## Outstanding before launch

- **`NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` on the host** — `.env.local` is local only; without it in Vercel's environment the live form falls back to `mailto:`
- **Bank / UPI details** — needed for any real donation flow (80G exemption applies; FCRA is *not* held, so donations are India-only)
- **Point `shalomhome.in` at the deployment** — `site.url` already expects it, so canonicals, the sitemap, OG URLs and JSON-LD `@id`s are wrong until DNS resolves
- Testimonials
- A written photo policy from the home would let us drop the redaction and use these photographs as they were taken
