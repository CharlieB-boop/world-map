import destinations from './destinations.json';
import type { Country, Region } from '../types/country';
import type { ShipmentType } from './movingGuides';

/** Provisional service list. Facts are rounded 2024-era context, not live data.
 * landingPageUrl: null = unverified placeholder; navigation stays disabled.
 * Published, source-attributed price/transit guides live in moving-guides.json.
 * Manual examples in these country fallback fields must set
 * estimatesIllustrative: true to label them visibly in the panel.
 */
export const countries = destinations as Country[];
export const countriesByNumericCode = new Map(countries.map(c => [c.numericCode, c]));
export const regions: Region[] = ['All destinations', 'Europe', 'North America', 'Asia', 'Middle East', 'Africa', 'Oceania', 'Caribbean'];
export const popularDestinations = ['AU', 'NZ', 'US', 'AE', 'CA', 'ZA', 'ES'];
export function getLandingPageUrl(country: Country, shipment: ShipmentType = 'household'): string | null {
  const pageUrl = shipment === 'boxes' ? country.shippingPageUrl : country.landingPageUrl;
  if (!pageUrl) return null;
  try {
    const url = new URL(pageUrl);
    return url.protocol === 'https:' && ['pssremovals.com', 'www.pssremovals.com'].includes(url.hostname)
      ? url.href : null;
  } catch {
    return null;
  }
}
export function navigateToCountry(country: Country, shipment: ShipmentType = 'household') {
  const url = getLandingPageUrl(country, shipment);
  if (url) window.location.assign(url);
}
