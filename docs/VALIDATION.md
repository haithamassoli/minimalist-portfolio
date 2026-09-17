# Validation record

## Executed successfully

- `npm test`: **18 passed**, 0 failed. These tests use Node's built-in runner
  and do not require installed project dependencies.
- Strict TypeScript checking of client scripts, helpers, data exports, and
  content interfaces with the environment's installed TypeScript 5.8.3.
- Syntax parsing of the project's simple Astro template expressions through
  TypeScript's JSX parser in a temporary verification harness. This is an
  additional syntax check, **not** the official Astro compiler.
- Chromium checks of a locally rendered HTML preview using the actual CSS
  and transpiled client scripts at 320, 390, 809, 810, 1024, and 1440px widths.
  All six had no horizontal page overflow and no JavaScript page errors.
- At each width: open menu, Escape close, trigger focus restoration, keyboard
  FAQ expansion, exclusive FAQ state, contact success with a mocked JSON
  acknowledgment, contact error with input preservation.
- Project and article listing content counts and no-JavaScript navigation
  were checked in the rendered previews.

## Not executed / not verified

- **An actual Astro build, `astro check`, and the shipped Playwright suite
  against Astro output.** The environment could not resolve external hosts,
  and offline installation returned `ENOTCACHED` for `@astrojs/check`.
- Chromium navigation was blocked in this environment, including localhost.
  Browser tests therefore used `page.set_content()` with a temporary local
  renderer; they do not establish correctness of Astro's build pipeline.
- Remote photographs and fonts could not load in the test browser. Layout
  checks used fixed asset dimensions and fallback fonts. Pixel-perfect
  equivalence, final font wrapping, and external asset availability remain
  unverified.
- Contact submission was mocked; no message was sent to a real endpoint.
- Docker build, public deployment, and real booking/social destinations were
  not exercised.

Run these after downloading, on a machine with internet access:

```sh
npm install
npm run validate
npx playwright install chromium
npm run test:e2e
```

Finally, visually compare the running app with the reference with images and
fonts loaded before publishing. The recreated native CSS animations are not
an exact export of Framer's motion timelines.
