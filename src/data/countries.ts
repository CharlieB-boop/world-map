import destinations from './destinations.json';
import type { Country, Region } from '../types/country';

/** Provisional service list. Facts are rounded 2024-era context, not live data.
 * landingPageUrl: null = unverified placeholder; navigation stays disabled.
 * No prices or transit times are supplied. Future examples must set
 * estimatesIllustrative: true to label them visibly in the panel.
 */
export const countries = destinations as Country[];
export const countriesByNumericCode = new Map(countries.map(c => [c.numericCode, c]));
export const regions: Region[] = ['All destinations', 'Europe', 'North America', 'Asia', 'Middle East', 'Africa', 'Oceania', 'Caribbean'];
export const popularDestinations = ['AU', 'CA', 'NZ', 'US', 'ES'];
export function getLandingPageUrl(country: Country): string | null {
  if (!country.landingPageUrl) return null;
  try {
    const url = new URL(country.landingPageUrl);
    return url.protocol === 'https:' && ['pssremovals.com', 'www.pssremovals.com'].includes(url.hostname)
      ? url.href : null;
  } catch {
    return null;
  }
}
export function navigateToCountry(country: Country) {
  const url = getLandingPageUrl(country);
  if (url) window.location.assign(url);
}
