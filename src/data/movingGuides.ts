import publishedGuides from './moving-guides.json';

/** Published planning guides, separate from PSS quotations and country facts.
 * Only add figures after reading the source. Preserve its exact shipment size,
 * mode, inclusions/exclusions and transit definition; do not extrapolate prices
 * between countries or call a guide range a statistical average.
 */
export type ShipmentType = 'household' | 'boxes';

export interface MovingGuide {
  priceRange: string | null;
  transitTime: string | null;
  priceDetails?: string | null;
  transitScope?: string;
  /** E.g. two-bedroom home, or carton dimensions and total weight. */
  shipmentScope: string;
  transportMode: 'Sea' | 'Air' | 'Road' | 'Mixed' | 'Not specified';
  transitBasis: string;
  exclusions: string;
  source: { publisher: string; url: string; checkedOn: string; publishedLabel?: string };
}

// Curated from fetched PSS pages on 20 October 2026. Each record retains its
// own price scope, service, timing basis and source. Missing fields stay unknown.
// The review ledger documents conflicting tables and explicitly broader sizes.
export const movingGuides = publishedGuides as Partial<Record<string, Partial<Record<ShipmentType, MovingGuide>>>>;

export const shipmentLabels: Record<ShipmentType, string> = {
  household: '2-bedroom home',
  boxes: '5–10 boxes',
};
