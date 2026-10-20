# PSS destination explorer

A responsive, local-data prototype built with React 18, Vite, TypeScript, Tailwind CSS 4 and react-simple-maps. No backend, API keys, paid services, remote fonts or runtime country APIs are required.

## Run locally

Use Node.js 22.12+ (tested with Node 24) and npm:

```sh
npm ci
npm run dev
```

Run these commands from the checkout root (`/workspace/world-map` in the cloud). Vite prints the local development address. To build a static deployment:

```sh
npm run build
npm run preview
```

Deploy the `dist/` directory to a static host. The build includes type checking. For a deployment beneath a subpath, set Vite's `base` in `vite.config.ts` before building; map and attribution URLs respect it.

## Explore

- Hover or keyboard-focus a supported country to show its details; the last country remains visible.
- Click a country or use its panel CTA to navigate to the **same configured PSS URL, in the current tab**.
- On touch devices, the first tap selects a country; another tap, or the CTA, follows its configured link.
- Search by country name or ISO alpha-2 code. Use arrow keys and Enter to select, Escape to dismiss. Search selections centre and zoom the map.
- Use region tabs (a dropdown on mobile), zoom controls, wheel/pinch zoom, or drag to explore. Reset restores the world view.
- Small islands and microstates have additional selection targets and remain searchable. Unsupported countries and the UK origin are not interactive destinations.

## Edit destinations and branding

`src/data/destinations.json` is the single editable data source. Each record contains country facts, ISO alpha-2 and numeric codes, a region, `[longitude, latitude]`, description, optional price/transit text and `landingPageUrl`.

- The 94 destinations are **provisional**, not a verified PSS service list. Europe includes sovereign European countries and Kosovo, plus Turkey, Georgia, Armenia and Azerbaijan; excludes Russia and the UK. Dependencies such as Åland are not standalone entries. UK geometry remains visible as the origin. Kosovo uses the dataset's user-assigned `XK` / `383` identifiers and an explicit Natural Earth name fallback.
- Populations are manually rounded, 2024-era prototype approximations, not live statistics. Capitals, centres and country names derive from world-countries; review them before production.
- `removalCost` and `transitTime` are deliberately `null`. The UI displays **Contact us for a quote** and **Transit time on request**. If you add example figures, set `estimatesIllustrative: true`; the panel labels them as illustrative.
- Every `landingPageUrl: null` is an **unverified placeholder**. The environment denied access to the PSS site, so no guessed URLs are shipped. Check a real destination page manually, then set its full HTTPS PSS URL. Both interactions share `navigateToCountry` in `src/data/countries.ts`; other hosts, HTTP and malformed URLs are rejected. Do not interpret a predictable URL pattern as verification.
- Adjust colours and layout in `src/index.css`. The text wordmark and navy/red palette are prototype interpretations and require brand review; they are not supplied official brand assets.
- `src/components/` separates map, search and country-panel behaviour. Reuse `App` or these components to integrate with a larger website.

Map geometry is checked into `public/countries-50m.json` (Natural Earth 1:50m, about 739 KB uncompressed). The map runs without external geometry requests. Countries with multiple shapes share their numeric ID and selection state. Tiny or missing geometries get discreet geographic selection targets. Region membership and source-map borders do not assert a position on disputed territories.

`scripts/prepare-data.mjs` records the original data preparation. It **overwrites edits** if run; normal installation, development and builds do not run it. `predev` and `prebuild` only copy the editable database to a downloadable public JSON file for data-license compliance. Restart development after editing data if you also need to refresh that downloadable copy.

## Browser checks

```sh
npm test
```

The Playwright suite starts Vite automatically unless a server already runs on port 5173. In the cloud it uses system Chromium at `/usr/bin/chromium`. Elsewhere, set `CHROMIUM_PATH` to your installed Chromium/Chrome executable, or install Playwright Chromium (`npx playwright install chromium`) and set `CHROMIUM_PATH` to that executable. Tests cover hover persistence, actual country facts, unsupported destinations, keyboard search and focus, microstates, region filters, zoom/reset, drag, touch/mobile overflow, reduced motion, loading recovery, and same-tab navigation using a synthetic test-only URL. They do not claim real PSS landing pages have been verified.

## Data attribution

Map geometry is Natural Earth public-domain data, distributed by world-atlas under ISC. Country metadata derives from mledoze/countries under ODbL 1.0. The derived destination database is provided under ODbL 1.0; its human-readable sources and downloadable data are linked from the application footer. License texts are included in `public/licenses/`. Application source is separate from this data licensing.

## GitHub Pages without a terminal on your computer

The supplied download includes a prebuilt `docs/` site for the repository `CharlieB-boop/world-map`. Upload the **contents** of the extracted `world-map` folder to the repository root, including `docs/`, `src/`, `public/`, `scripts/` and `package.json`. Do not upload the ZIP itself or an extra enclosing `world-map` folder.

In GitHub, choose **Settings → Pages → Build and deployment → Source: Deploy from a branch → main → /docs → Save**. GitHub displays the website URL after deployment. Private-repository Pages availability depends on your GitHub plan. The source upload does not itself publish the site; the Pages setting does.

To refresh the prebuilt site after changing the application, run `npm run build:pages` and include the updated `docs/` in your upload or commit. This build uses `/world-map/` as its asset base; ordinary `npm run dev` and `npm run build` keep the default `/` base. Renaming the repository requires changing the Pages base in `vite.config.ts` and rebuilding. Do not edit generated files inside `docs/` directly.
