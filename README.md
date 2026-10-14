# Living Earth website

The site for [Living Earth](https://www.livingearthapp.com), built as static pages with
[Astro](https://astro.build).

## Working on it

    npm ci
    npm run dev       # local server
    npm run build     # into dist/

Needs Node 22.12 or later.

## Publishing

Every push to `main` builds the site and publishes it to GitHub Pages
(`.github/workflows/deploy.yml`). Cloudflare sits in front and picks up a new deploy within ten
minutes, with no purge needed.

Each build fetches the App Store rating, the number of ratings and the price
(`src/appstore.ts`), so the home page stays current without edits. Running the workflow by hand
refreshes them. If the App Store can't be reached, the page falls back to the US figures, then
to fixed ones. The press kit's fact sheet is the exception: its numbers are written by hand in
`src/press.md`.

## Where things come from

- `src/press.md` is the press kit's text. `/press/` shows it, and the ZIP carries it as its
  README, so rebuild the ZIP after editing it.
- `public/LivingEarthPressKit.zip` and the videos in `public/press/` are built by
  `website/tools/press-kit.py` in the private livingearth-design repo, which writes them here.
- The home page's images (`src/assets/home/`), `src/zones.js` and `public/og-image.jpg` are
  copies from `website/assets/img/` in that repo, most of them built by
  `website/tools/build-v2.py`. The hero's regions in `public/hero/` are its images converted to
  WebP with `cwebp -q 80 -m 6`.
- `src/reviews.ts` holds the App Store reviews the home page quotes, with where each came from.
- The rest of `public/` is older pages and files, kept at their old addresses.
