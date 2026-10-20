/** Published planning guides, separate from PSS quotations and country facts.
 * Only add figures after reading the source. Preserve its exact shipment size,
 * mode, inclusions/exclusions and transit definition; do not extrapolate prices
 * between countries or call a guide range a statistical average.
 */
export type ShipmentType = 'household' | 'boxes';

export interface MovingGuide {
  priceRange: string | null;
  transitTime: string | null;
  /** E.g. two-bedroom home, or carton dimensions and total weight. */
  shipmentScope: string;
  transportMode: 'Sea' | 'Air' | 'Road' | 'Mixed' | 'Not specified';
  transitBasis: string;
  exclusions: string;
  source: { publisher: string; url: string; checkedOn: string };
}

// No figures are verified yet: environment network access currently blocks both
// PSS and the independent guide sites. Empty entries intentionally show quote
// placeholders instead of invented prices. Key entries by ISO alpha-2 code.
export const movingGuides: Partial<Record<string, Partial<Record<ShipmentType, MovingGuide>>>> = {};

export const shipmentLabels: Record<ShipmentType, string> = {
  household: '2-bedroom home',
  boxes: '5–10 boxes',
};
