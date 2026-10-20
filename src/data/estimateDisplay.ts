import prototypeData from './prototype-estimates.json';
import type { Country } from '../types/country';
import type { MovingGuide, ShipmentType } from './movingGuides';

type PrototypeEstimate = { priceRange: string; transitTime: string; transportMode: string };
const regions = prototypeData.regions as Record<Country['region'], Record<ShipmentType, PrototypeEstimate>>;
const overrides = prototypeData.countryOverrides as Record<string, Partial<Record<ShipmentType, Partial<PrototypeEstimate>>>>;

/** Resolve every field independently so a researched time never becomes an invented price. */
export function resolveEstimate(country: Country, shipment: ShipmentType, guide?: MovingGuide) {
  const example = { ...regions[country.region][shipment], ...overrides[country.iso]?.[shipment] };
  const manualPrice = shipment === 'household' ? country.removalCost : null;
  const manualTransit = shipment === 'household' ? country.transitTime : null;
  return {
    price: guide?.priceRange || manualPrice || example.priceRange,
    transit: guide?.transitTime || manualTransit || example.transitTime,
    priceIllustrative: !guide?.priceRange && (!manualPrice || country.estimatesIllustrative),
    transitIllustrative: !guide?.transitTime && (!manualTransit || country.estimatesIllustrative),
    example,
  };
}
