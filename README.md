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
- Country-level `removalCost` and `transitTime` remain optional manual fallback fields. Published guides in `src/data/moving-guides.json` take priority by country and shipment type. Missing prices show **Contact us for a quote** and missing timings show **Transit time on request**. If you add manual example figures, set `estimatesIllustrative: true`; the panel labels them as illustrative.
- 56 `landingPageUrl` values were verified against fetched, country-specific PSS pages on 20 October 2026; `landingPageVerifiedOn` records the check. A `null` URL remains an **unverified placeholder**, with navigation disabled. Vietnam remains disabled because its observed removals link redirects to the generic international-removals page. Both map and CTA use `navigateToCountry` in `src/data/countries.ts`; other hosts, HTTP and malformed URLs are rejected. Do not infer validity from a URL naming pattern.
- Adjust colours and layout in `src/index.css`. The text wordmark and navy/red palette are prototype interpretations and require brand review; they are not supplied official brand assets.
- `src/components/` separates map, search and country-panel behaviour. Reuse `App` or these components to integrate with a larger website.

Map geometry is checked into `public/countries-50m.json` (Natural Earth 1:50m, about 739 KB uncompressed). The map runs without external geometry requests. Countries with multiple shapes share their numeric ID and selection state. Tiny or missing geometries get discreet geographic selection targets. Region membership and source-map borders do not assert a position on disputed territories.

`scripts/prepare-data.mjs` records the original data preparation. It **overwrites edits** if run; normal installation, development and builds do not run it. `predev` and `prebuild` only copy the editable country and moving-guide databases to downloadable public JSON files; the country copy supports its data-license requirements. Restart development after editing data if you also need to refresh that downloadable copy.

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

## Journey preview and moving guides

Select a destination, then click **Preview journey** on the map. This optional overlay draws a great-circle connection from London to the destination's approximate centre, with a directional marker and a short reveal. It is explicitly schematic: **not a sea-lane map, actual sailing route, port connection, delivery itinerary or tracking service**. The preview opens the world view, updates with selection, disappears for destinations outside the active region, and respects reduced motion. It adds no external requests or mapping dependencies. On desktop the information panel keeps a fixed height so changing destination details does not move the map beneath the pointer.

The panel now separates **2-bedroom home** removals from **5–10 boxes** shipping. `src/data/moving-guides.json` stores curated published guides, and `movingGuides.ts` defines their types. Records retain country and shipment type, exact size scope, transport mode, transit definition, exclusions, publisher, URL and check date. Never extrapolate between countries or shipment types. Guide ranges are not statistical averages or personalised quotations. For boxes, preserve the source's carton dimensions, weight and quantity; a box count alone does not define a comparable shipping price.

Web access was enabled and PSS guides were checked on **20 October 2026**. The data includes **55 household transit guides**, **four household price references** (USA/Spain specify two bedrooms; India/Singapore cover two to three), and **26 box guides, 23 with prices**. Missing figures retain placeholders. Five-box, ten-box and five-to-eight-box examples stay separately identified; smaller prices are not multiplied or presented as statistical averages. Some source tables contain conflicting summaries or older dates. See `src/data/guide-research.md` for the review method and choices; the UI links each guide source and shows its age/check date, timing basis and assumptions. The source and assumptions links are separate from the country CTA: source references open in a new tab so the comparison stays available, while country navigation remains in the current tab. Tests use synthetic fixture data for navigation and source-rendering checks alongside checks of the actual curated guide values.
