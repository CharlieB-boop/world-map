# Published moving-guide review — 20 October 2026

Source pages were fetched successfully over HTTPS, read, and checked against the displayed country and service. Runtime figures are stored in `moving-guides.json`, with a source URL and check date in every entry. All figures are GBP. These are published planning guides, **not statistical averages, live quotes, verified tariffs or promises of current PSS service availability**.

## Coverage

- 56 destination landing pages verified by successful fetch, matching final URL and country-specific page title. See `landingPageUrl` and `landingPageVerifiedOn` in `destinations.json`.
- 55 household transit guides. Ireland has a verified page and box-price examples, but no household timing was extracted.
- Four household price entries: USA and Spain are explicit two-bedroom prices; India and Singapore are **two- to three-bedroom** references, visibly labelled as broader.
- 26 box-shipping guides, including 23 with count-based prices. The remaining three provide transit only.
- Other destinations and missing researched fields now use separately labelled illustrative prototype budgets, per the owner’s subsequent request. These invented values live in `prototype-estimates.json`, not this researched dataset. Prices are not extrapolated across countries, quantities or property sizes.

## Household price references

| Country | Published scope and price | Transit used | Source |
| --- | --- | --- | --- |
| USA | Two-bedroom house/flat, 30–50 boxes plus furniture, shared container: £5,500–£8,500 | 8–13 weeks total door-to-door in the primary service table | https://www.pssremovals.com/removals-to-usa |
| Spain | Two-bedroom home, part-load or small dedicated lorry: £2,022–£3,500 | Shared lorry 1–3 weeks; dedicated and island services differ | https://www.pssremovals.com/removals-to-spain |
| India | **2–3-bedroom**, 20ft container: from £3,500 | FCL 6–8 weeks to major ports; 6–9 to secondary destinations | https://www.pssremovals.com/removals-to-india |
| Singapore | **2–3-bedroom**, 20ft container or large groupage: £3,500–£5,500 | FCL 6–8 weeks; groupage 8–12. The displayed 6–12 range spans those services. | https://www.pssremovals.com/removals-to-singapore |

Australia, Canada and New Zealand publish one-bedroom and three-bedroom price references, but no clear two-bedroom price in the reviewed primary tables. Those references were **not** averaged or relabelled. Their household transit guides are populated independently.

## Box-price methodology

Use count-based economy/groupage rows, not the Royal Mail parcel examples or weight-based airfreight tables. Where five- and ten-box examples are supplied, the main range spans their minimum and maximum, while `priceDetails` displays the separate published examples. The envelope is not a statistical average or a quote for six to nine boxes.

Where a source supplies only five boxes or five to eight boxes, preserve that quantity and explicitly state that a ten-box rate is unavailable. Do not multiply a one-box or five-box price. PSS lists available carton dimensions in FAQs, but the count-based price tables do not consistently identify the priced carton type or total weight; the UI says so.

Dedicated box pages supply most prices. Removals-page box tables fill documented gaps for France, Greece, Ireland, Italy, Malaysia, Netherlands, Norway, Portugal, Sweden, Switzerland and Thailand. Their timing comes from that same removals page where available. Ireland therefore keeps an unknown box transit time. Every entry links to the page actually used.

## Conflicting, older and ambiguous source material

Some PSS pages contain newer primary tables alongside different introductory figures, FAQs or older repeated tables. Preserve the chosen table's scope rather than combining incompatible figures:

- Australia groupage: 8–12 weeks to Sydney, Melbourne, Perth and Brisbane; 9–16 to Adelaide, Hobart and Darwin. The displayed 8–16 range spans those routes. The household timing and dedicated box table both list those groups.
- Canada household: the primary service table gives 8–16 weeks groupage and explicitly says port-to-port; add 1–2 weeks for clearance/delivery. The dedicated box page uses 8–12 weeks in its main timing table, although its prose also says 6–12. Those records remain separate. The box-price section labels its table **2025**, shown in the interface.
- USA household uses the primary service table's 8–13-week door-to-door range; the dedicated box page uses its main 8–12-week timing table. Prose and FAQ summaries differ and are not silently substituted.
- Singapore household uses the primary 2–3-bedroom £3,500–£5,500 range; a later legacy table lists £2,650 for a two-bedroom move. The conflicting later figure is not used.
- India box-price table explicitly says **2024**. This age is displayed, alongside the 2026 check date; checking the page does not make its rates current.
- Generic European dedicated/part-load tables often give 1–4 weeks without defining port-to-port versus door-to-door. Their basis is labelled unknown; no sea or road guarantee is invented. Box pages using a part-load table are labelled as service estimates.
- Cyprus source wording is “Up to 4–8 weeks”; that wording is retained. Malta's household and box guides differ (2–4 weeks versus up to 3 weeks) and remain separate.
- Customs, duties, inspections and optional protection require confirmation in a personalised quote; the prototype does not present the figures as all-inclusive.

## Landing-page limits

The observed Vietnam removals link redirects to the generic international-removals page, so country navigation remains disabled for Vietnam. No landing URLs were invented from a naming pattern. Other missing countries remain disabled until a genuine country page is verified.

PSS sources were sufficient for the populated data. MoveHub and 1st Move International were consulted but no outside-company figures were copied into the prototype: the reviewed public guides did not supply a comparable, clearly stated two-bedroom household price for the missing PSS entries.
