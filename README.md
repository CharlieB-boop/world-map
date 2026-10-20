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
- Country-level `removalCost` and `transitTime` remain optional manual fallback fields. Published guides in `src/data/moving-guides.json` take priority by country and shipment type. Missing researched prices and timings use explicitly illustrative prototype budgets (see below). If you add manual example figures, set `estimatesIllustrative: true`; the panel labels them as illustrative.
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

Select a destination, then click **Preview journey** on the map. For Australia, Canada, New Zealand, the USA and Spain, this optional overlay draws a researched port-to-port sea/ferry corridor, with a directional marker, short reveal and expandable source notes. Australia uses a Suez corridor to Sydney; Canada/USA show Atlantic east-coast gateways; Spain shows a Portsmouth–Bilbao freight ferry. New Zealand is explicitly a historical 2024 Panama/Pacific example because the current carrier schedule no longer lists the UK call. These manually traced corridors show selected calls, **not confirmed PSS itineraries or live vessel tracks**. Other countries retain an explicitly labelled schematic UK-to-country-centre connection. See `src/data/route-research.md` for evidence and limitations. The preview opens the world view, updates with selection, disappears for destinations outside the active region, and respects reduced motion. It adds no external requests or mapping dependencies. On desktop the information panel keeps a fixed height so changing destination details does not move the map beneath the pointer.

The panel now separates **2-bedroom home** removals from **5–10 boxes** shipping. `src/data/moving-guides.json` stores curated published guides, and `movingGuides.ts` defines their types. Records retain country and shipment type, exact size scope, transport mode, transit definition, exclusions, publisher, URL and check date. Never extrapolate between countries or shipment types. Guide ranges are not statistical averages or personalised quotations. For boxes, preserve the source's carton dimensions, weight and quantity; a box count alone does not define a comparable shipping price.

Web access was enabled and PSS guides were checked on **20 October 2026**. The data includes **55 household transit guides**, **four household price references** (USA/Spain specify two bedrooms; India/Singapore cover two to three), and **26 box guides, 23 with prices**. Missing researched figures use explicitly illustrative prototype budgets (see below). Five-box, ten-box and five-to-eight-box examples stay separately identified; smaller prices are not multiplied or presented as statistical averages. Some source tables contain conflicting summaries or older dates. See `src/data/guide-research.md` for the review method and choices; the UI links each guide source and shows its age/check date, timing basis and assumptions. The source and assumptions links are separate from the country CTA: source references open in a new tab so the comparison stays available, while country navigation remains in the current tab. Tests use synthetic fixture data for navigation and source-rendering checks alongside checks of the actual curated guide values.

## Complete prototype budgets

At the owner's request, all **94 destinations × two shipment types** now have both a price and time window. Published PSS fields remain unchanged and take priority **independently**: a sourced transit time can sit beside an illustrative price, or vice versa.

The remaining fields come from `src/data/prototype-estimates.json`. These are **invented design budgets and total-moving windows**, not web findings, PSS rates, statistical averages or operational commitments. The file contains regional defaults and editable country overrides. `src/data/estimateDisplay.ts` combines these with source data and any manually supplied country fields. No extra API or dependency is used.

The UI labels each invented field **Illustrative**, displays a short prototype explanation, and never attaches a PSS source to the invented values. Published source links state which fields they support. This fills 161 missing prices and 108 missing times across the 188 comparisons. Source tables, check dates, exact box quantities, broader household scopes, verified country URLs and the journey preview are retained. Quote placeholders are no longer used for missing prices or timings in this prototype.

## PSS brand treatment

Applied the owner's supplied brand guide: PSS blue `#1f60ab`, orange `#f09114`,
light blue `#86a6d0`, white and black. The official logo is stored locally at
`public/brand/pss-logo.png`, downloaded from
https://www.pssremovals.com/images/pss-removals-logo-opt.png on 20 October 2026
and used with the owner's permission. It is displayed without recolouring,
stretching or a recreated wordmark.

Roboto body/bold typography and Roboto Slab secondary headings are served from
`public/fonts/`; rendering requires no external font or logo requests. The supplied
guide names Solitas Slab Nor Regular, whose font file was not supplied. **Roboto
Slab is an explicit prototype substitute**, consistent with the current PSS
website's font stylesheet, rather than a claim to use Solitas. Font licenses are
included beside the files (Roboto: OFL; Roboto Slab: Apache 2.0).

Map selections use PSS blue and shipping corridors use orange. Orange calls to
action use black text for readability. Existing destination, cost/transit and
route behaviour is retained.


Country flags use locally hosted `public/flags/` SVGs from
[flag-icons](https://github.com/lipis/flag-icons) (MIT license included), rather
than emoji that can appear as country-code letters on Windows. The destination
panel clips the flag into its circular badge; search and popular chips retain
rectangular flags. All 94 destinations have matching SVG assets.
