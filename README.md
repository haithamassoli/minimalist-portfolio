# رِزق — Astro portfolio

An independent, component-based Astro reconstruction of the **homepage** in the
supplied Framer HTML. Arabic content, original image references, typography,
section order, light background, rounded cards, skills deck, and dark contact
footer are retained. The generated Framer DOM and runtime are not used.

## Run

Use Node.js **22.12 or newer** (Node 22 LTS is suitable).

```sh
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:4321`.

```sh
npm test            # 18 dependency-free unit/content tests
npm run check       # Astro + TypeScript checks, after npm install
npm run build       # Static production output in dist/
npm run preview     # Serve the production output locally
```

Commit the `package-lock.json` created by your first successful `npm install`.
After that, use `npm ci` in CI/deployment. No untested lockfile has been invented.
Astro itself is pinned to 7.3.3.

For browser tests:

```sh
npx playwright install chromium
npm run test:e2e
```

## Included routes

| Route | Content |
| --- | --- |
| `/` | Rebuilt homepage, all source sections |
| `/projects/` | Local listing of the four supplied projects |
| `/blog/` | Local listing of the three supplied articles |
| `/404.html` | Custom not-found page |

**Project case-study and article bodies were not in the supplied HTML.** Cards
open their original detail-page URLs in a new tab. The two local listing pages
are additions using the supplied data, not claims to reproduce unseen pages.

## Structure

```text
src/
  layouts/SiteLayout.astro        Shared HTML, metadata, header, footer
  pages/                         Astro routes
  components/
    layout/                      Header, Footer, ContactForm
    sections/                    One component per homepage section
    cards/                       Project, Article, Testimonial, Certificate
    ui/                          Button, Icon, AssetImage, headings, CTA
  data/                          Editable JSON content and typed exports
  types/content.ts               Shared content interfaces
  styles/
    tokens.css                   Palette, sizing, spacing, shadows
    fonts.css                    Original remote font references
    global.css                   Reset, page rails, containers
    ui.css                       Shared UI primitives
    sections/                    Separate styles for each section
  scripts/                       Menu, entrance effects, contact interactions
  lib/                           Tested contact/image helper functions
public/
  icons/                         SVGs extracted from the supplied HTML
  images/                        Folder for your replacement imagery
```

The page uses native `.astro` components, plain CSS, and small TypeScript client
scripts. There is no React, Tailwind, Framer runtime, or animation-library
requirement. Content remains visible when JavaScript is disabled.

## Customize

Change `src/data/site.json` for the name, bio, contact email, profile image,
booking URL, social links, and navigation. Change the other clearly named JSON
files for projects, articles, skills, services, experience, FAQs, testimonials,
and certificates. Array order controls display order.

`src/styles/tokens.css` is the central place to change the palette, maximum
content width, spacing, font family, radii, and shadows. Section-specific
styles are in `src/styles/sections/`.

Remote images are intentionally kept as source URLs. To host your own images,
place them in `public/images/` and replace the corresponding `src` with a path
such as `/images/project-cover.webp`, keeping accurate `width` and `height`.
The responsive-image helper leaves local paths untouched.

Original fonts load from remote URLs in `fonts.css`. No font binaries are
included. Use font URLs you are authorized to publish, or switch the font stack.

## Contact form: actual behavior

The reference HTML did not provide a usable independent backend endpoint.

With `PUBLIC_CONTACT_ENDPOINT` empty, the form validates the fields and opens a
**mailto draft**. The visitor must send it in their mail application. The UI
explicitly says that the site has not sent a message. A direct email link is
always available. This fallback requires a configured mail application.

To submit to your own backend, set the public endpoint in `.env`, then rebuild:

```dotenv
PUBLIC_CONTACT_ENDPOINT=https://your-api.example.com/contact
```

The client sends an unauthenticated JSON POST with:

```json
{
  "name": "Visitor name",
  "email": "visitor@example.com",
  "message": "Project inquiry",
  "website": ""
}
```

The endpoint must return a 2xx response with JSON `{ "ok": true }` only after
accepting the message. This reports server acceptance, not guaranteed email
inbox delivery. A non-2xx response, malformed JSON, network failure, or missing
acknowledgment produces an error and preserves entered text. Requests time out
after 15 seconds; duplicate submissions are disabled while pending.

Your backend must implement validation, request-size limits, origin checks,
rate limiting/spam controls, and actual delivery. For cross-origin use, allow
the site origin and the `Content-Type` header in CORS, including OPTIONS.
The frontend honeypot is not a replacement for server-side protections.
No API secrets belong in a `PUBLIC_*` variable.

## Before publishing

The portfolio identity, employment entries, testimonials, photographs, and
logos are **reference content**, not claims about you. Replace them with your
own material or confirm your permission to reuse them. The original booking
URL points to `https://cal.com`, not a specific person's booking calendar;
replace it with your actual booking URL.

Set the domain and enable indexing only after customizing the reference:

```dotenv
PUBLIC_SITE_URL=https://your-domain.example
PUBLIC_INDEXABLE=true
```

The default is `noindex,nofollow`. This protects against accidentally indexing
a demo with another portfolio's identity. It is not an access-control feature.

## Deployment

For a static host, use `npm run build` and publish `dist/`. No application
server or database is required. This starter assumes deployment at the domain
root rather than a subdirectory. Map missing paths to `/404.html` with a 404
status instead of rewriting everything to the homepage.

A `Dockerfile` and `nginx.conf` are included:

```sh
docker build -t rzgfolio \
  --build-arg PUBLIC_SITE_URL=https://your-domain.example \
  --build-arg PUBLIC_INDEXABLE=false .
docker run --rm -p 8080:80 rzgfolio
```

Environment values for this static build are embedded **at build time**; setting
runtime container variables alone will not change an already-built website.
The contact endpoint remains a separate backend or serverless service.

## Preview and verification

`preview.html` is an optional standalone homepage preview with inline CSS and
client code. Open it in a browser with internet access for the remote images
and fonts. Its project/blog navigation jumps to the corresponding homepage
sections; the Astro app uses the local routes. Editing the source will not
regenerate this convenience snapshot automatically.

See `docs/VALIDATION.md` for exactly which checks were run and what remains
unverified. See `docs/SOURCE-MAP.md` for migration decisions and source scope.
