import { geoDistance, geoInterpolate } from 'd3-geo';

export type Coordinate = [number, number];
export interface ShippingRoute {
  departure: string;
  arrival: string;
  via: string;
  scope: string;
  note: string;
  waypoints: Coordinate[];
  sources: { title: string; url: string }[];
}
export const UK_ORIGIN: Coordinate = [-0.12, 51.5];
const gateway: Coordinate[] = [[0.49, 51.50], [0.75, 51.49], [1.05, 51.51], [1.50, 51.35], [1.55, 51.05], [1.20, 50.80]];
const channel: Coordinate[] = [...gateway, [-0.8, 50.1], [-3, 49.7], [-5.8, 49.5], [-7, 48.5]];
const atlantic: Coordinate[] = [[-3.02, 53.44], [-3.35, 53.53], [-4.2, 53.7], [-5.3, 53.9], [-5.3, 54.5], [-5.5, 55.1], [-6, 55.5], [-7.0, 55.7], [-8.5, 56.0], [-12, 55.5], [-25, 53], [-40, 49], [-52, 44], [-61.5, 43.3], [-63.45, 44.35], [-63.56, 44.65]];
const acl = { title: 'ACL · westbound ports and schedule', url: 'https://www.aclcargo.com/schedules/' };

/** Sourced gateway corridors, hand-traced over water. Selected calls only: not vessel tracks. */
export const shippingRoutes: Record<string, ShippingRoute> = {
  AU: {
    departure: 'London Gateway', arrival: 'Sydney · Port Botany',
    via: 'English Channel → Gibraltar → Suez → Indian Ocean',
    scope: 'Representative sea route · Sydney example',
    note: 'Selected corridor via Réunion and Mauritius, based on the NEWMO/Australia Express service. October 2026 reporting describes a return to Suez; individual voyages may divert around the Cape of Good Hope. Intermediate European calls are omitted.',
    waypoints: [...channel, [-10, 45], [-10, 39], [-9, 36], [-6, 35.9], [-5.5, 35.95], [-5, 36], [-1, 37], [7, 37.5], [11, 37.5], [12, 36], [16, 34.5], [24, 33.5], [31.5, 32.3], [32.30, 31.4], [32.30, 31.27], [32.30, 31.05], [32.32, 30.8], [32.34, 30.6], [32.45, 30.4], [32.56, 30.25], [32.57, 30.0], [32.56, 29.95], [32.58, 29.8], [32.6, 29.6], [32.7, 29.4], [32.8, 29.2], [32.9, 29], [33.0, 28.8], [33.1, 28.6], [33.25, 28.4], [33.4, 28.2], [33.65, 28], [34.1, 27.3], [36.0, 24.5], [38.5, 20.5], [40.5, 17.5], [42.1, 14.8], [43.3, 12.6], [43.5, 12.3], [45.5, 12.0], [50.5, 12.5], [52, 12.5], [54, 10], [57, 0], [57, -12], [55, -20.7], [55.28, -20.92], [55, -20.7], [56.4, -20.0], [57.48, -20.14], [57.2, -19.8], [58, -19.5], [60, -22], [80, -33], [110, -40], [135, -40], [143, -39.5], [147.5, -39.2], [150.5, -38], [153, -34.3], [151.5, -34.1], [151.24, -34.0], [151.215, -33.973]],
    sources: [
      { title: 'CMA CGM · NEW NEMO brochure (Nov 2024)', url: 'https://www.cma-cgm.com/assets/public/documents/NEMO_2.pdf' },
      { title: 'Container News · return to Suez (Oct 2026)', url: 'https://container-news.com/cma-cgm-and-msc-return-europe-australia-service-to-suez/' },
    ],
  },
  CA: {
    departure: 'Liverpool', arrival: 'Halifax', via: 'Irish Sea → North Atlantic → Halifax',
    scope: 'Representative sea route · eastern Canada',
    note: 'ACL’s westbound service calls at Halifax after Liverpool. This example ends at the seaport; it does not represent inland delivery or a route to Vancouver.',
    waypoints: atlantic, sources: [acl],
  },
  US: {
    departure: 'Liverpool', arrival: 'New York / New Jersey', via: 'North Atlantic → Halifax → New York',
    scope: 'Representative sea route · US east coast',
    note: 'ACL’s westbound rotation calls at Halifax before New York. This example ends at New York Harbor; US west-coast destinations require a different route.',
    waypoints: [...atlantic, [-63.45, 44.35], [-64, 43], [-66, 42], [-68, 40.2], [-71, 40.1], [-73.6, 40.25], [-73.93, 40.48], [-74.04, 40.59], [-74.05, 40.66], [-74.14, 40.67]], sources: [acl],
  },
  NZ: {
    departure: 'London Gateway', arrival: 'Tauranga', via: 'Atlantic → Panama Canal → Pacific → Tauranga',
    scope: 'Published 2024 sea-route example · not a current schedule',
    note: 'Marfret’s 2024 NASP brochure documents London Gateway, the Americas, Papeete, Nouméa, Australia and Tauranga. The current schedule differs and no longer lists a UK call. This historical example shows the Panama corridor; it is not a currently bookable UK service. Intermediate calls are omitted.',
    waypoints: [...channel, [-20, 46], [-40, 41], [-60, 34], [-69, 26], [-72.7, 22], [-73, 20.8], [-73.6, 20.2], [-74.1, 19.5], [-75.5, 17.5], [-79, 12], [-79.92, 9.4], [-79.92, 9.28], [-79.90, 9.18], [-79.80, 9.12], [-79.70, 9.12], [-79.66, 9.04], [-79.64, 8.99], [-79.59, 8.94], [-79.56, 8.88], [-79.54, 8.80], [-79.5, 8], [-79.8, 7], [-81, 6.5], [-86, 3], [-100, -4], [-120, -12], [-140, -17], [-149.7, -17.3], [-149.58, -17.53], [-149.7, -17.3], [-155, -20], [-175, -23], [175, -24], [168, -23], [166.4, -22.3], [165, -23.5], [158, -27], [155, -30], [153, -34.3], [151.5, -34.1], [151.24, -34], [151.5, -35], [150.5, -37.5], [147.5, -39.2], [146, -39.5], [144.4, -38.8], [144.55, -38.35], [144.8, -38.1], [144.92, -37.86], [144.8, -38.1], [144.55, -38.35], [144.4, -38.8], [146, -39.5], [147.5, -39.2], [151, -40], [160, -39], [171, -33.5], [175, -33.5], [178, -35], [178, -36.7], [176.5, -37.4], [176.18, -37.63]],
    sources: [
      { title: 'Marfret · NASP brochure (2024)', url: 'https://www.marfret.com/app/uploads/2017/06/nasp_eng_07_06_24.pdf' },
      { title: 'Marfret · current NASP schedule (different calls)', url: 'https://www.marfret.com/en/horaires/nasp-service/' },
    ],
  },
  ES: {
    departure: 'Portsmouth', arrival: 'Bilbao', via: 'English Channel → Bay of Biscay → Bilbao',
    scope: 'Representative freight ferry · northern Spain',
    note: 'A Portsmouth–Bilbao freight-ferry option, rather than a container-liner itinerary. European removals may travel by road and other crossings; this does not change the road-based cost or transit guide.',
    waypoints: [[-1.11, 50.79], [-1.10, 50.73], [-1.02, 50.70], [-0.98, 50.58], [-1.6, 50.25], [-3, 49.7], [-5.8, 49.5], [-6, 48.5], [-5.5, 46.5], [-4, 44.5], [-3.1, 43.6], [-3.06, 43.36]],
    sources: [{ title: 'Direct Ferries · Portsmouth–Bilbao freight route', url: 'https://www.directferries.co.uk/portsmouth_bilbao_freight_ferry.htm' }, { title: 'Brittany Ferries · Portsmouth–Bilbao', url: 'https://www.brittany-ferries.co.uk/ferry-routes/ferries-spain/portsmouth-bilbao/about' }],
  },
};

/** Follow the polyline by distance, including correct interpolation across ±180°. */
export function pointOnRoute(points: Coordinate[], fraction: number): Coordinate {
  const lengths = points.slice(1).map((point, index) => geoDistance(points[index], point));
  const total = lengths.reduce((sum, length) => sum + length, 0);
  let remaining = Math.max(0, Math.min(1, fraction)) * total;
  for (let index = 0; index < lengths.length; index++) {
    if (remaining <= lengths[index] && lengths[index] > 0) return geoInterpolate(points[index], points[index + 1])(remaining / lengths[index]);
    remaining -= lengths[index];
  }
  return points[points.length - 1];
}
