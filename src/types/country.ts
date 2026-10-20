export type Region = 'All destinations' | 'Europe' | 'North America' | 'Asia' | 'Middle East' | 'Africa' | 'Oceania' | 'Caribbean';

export interface Country {
  iso: string;
  numericCode: string;
  name: string;
  flag: string;
  capital: string;
  population: string;
  region: Exclude<Region, 'All destinations'>;
  coordinates: [number, number];
  description: string;
  removalCost: string | null;
  transitTime: string | null;
  estimatesIllustrative: boolean;
  /** Unverified placeholder. Set only after checking the final destination URL. */
  landingPageUrl: string | null;
}
