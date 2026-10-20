# Featured shipping corridors

Checked 20 October 2026. Scope: the five existing popular-destination chips.
These are representative port-to-port examples, not PSS bookings, live AIS tracks,
complete carrier rotations, current quotations, navigation charts or inland delivery routes.
The coordinates in `shippingRoutes.ts` are manually traced visual corridors over
water. Sources support the service/port sequence, not these exact coordinates.
Intermediate calls are deliberately omitted. Customer moving-time guides are
independent of these vessel legs and have not been changed.

| Destination | Example and evidence | Limitation |
| --- | --- | --- |
| Australia | London Gateway → English Channel → Gibraltar → Suez → Réunion → Mauritius → Sydney (Port Botany). [CMA CGM NEW NEMO brochure, Nov 2024](https://www.cma-cgm.com/assets/public/documents/NEMO_2.pdf) lists London Gateway, Réunion, Port Louis and Sydney. [Container News, 18 Oct 2026](https://container-news.com/cma-cgm-and-msc-return-europe-australia-service-to-suez/) reports NEWMO/Australia Express returning to Suez in both directions, retaining that rotation. | Recent routing evidence is industry reporting; the accessible carrier brochure is older. Security/operating conditions can cause Cape of Good Hope diversions. European intermediate calls omitted. Sydney is one destination port, not all Australia. |
| Canada | Liverpool → Irish Sea/North Channel → Atlantic → Halifax. [ACL schedules](https://www.aclcargo.com/schedules/) list Liverpool then Halifax westbound. | Eastern Canada gateway only. No inland leg or Vancouver route. |
| USA | Liverpool → Halifax → New York/New Jersey. [ACL schedules](https://www.aclcargo.com/schedules/) list Halifax then New York westbound. | East-coast example, not a west-coast route. New York Harbor endpoint is approximate. |
| New Zealand | Historical London Gateway → Atlantic → Panama Canal → Papeete → Nouméa → Australia → Tauranga corridor. [Marfret NASP brochure, 2024](https://www.marfret.com/app/uploads/2017/06/nasp_eng_07_06_24.pdf) lists London Gateway and these southbound destinations, and maps passage through Panama. | Explicitly labelled **published 2024 example**, not currently bookable. The [current NASP schedule](https://www.marfret.com/en/horaires/nasp-service/) no longer lists a UK call. Selected calls shown; do not silently promote the historical brochure to a current schedule. |
| Spain | Portsmouth → Channel west of Brittany → Bay of Biscay → Bilbao. [Direct Ferries freight listing](https://www.directferries.co.uk/portsmouth_bilbao_freight_ferry.htm) explicitly identifies Brittany Ferries and this freight crossing. [Operator route page](https://www.brittany-ferries.co.uk/ferry-routes/ferries-spain/portsmouth-bilbao/about). | Freight-ferry option, not a container-liner route or a claim about PSS's usual crossing. Operator passenger and freight timetable pages return JavaScript shells; freight route text was verified through Direct Ferries. Road-based moving guides remain unchanged. |

The route marker follows cumulative great-circle segment length along the whole
corridor, including the Pacific dateline crossing. Rendering uses d3's geographic
clipping rather than a straight projected line across the map.

Validation samples each segment at intervals of at most 10 km against the same
Natural Earth country geometry used by the UI. Narrow Suez/Panama canal areas and
3 km around specifically identified port basins are exempt because 1:50m country
polygons do not resolve those channels and basins. This checks obvious land
crossings; it does not establish navigational safety or exact shipping lanes.
Other destinations retain an explicitly labelled schematic UK-to-country-centre
connection. No web service or external request is needed to render routes.
