import { ArrowRight, Building2, Clock3, Globe2, MapPin, Package, Users } from 'lucide-react';
import { getLandingPageUrl, navigateToCountry } from '../data/countries';
import type { Country } from '../types/country';

export default function CountryInfoPanel({ country }: { country: Country | null }) {
  return <aside className={`info-panel ${country ? 'has-country' : ''}`} aria-label="Destination information">
    {country ? <div className="country-content" key={country.iso}>
      <div className="panel-eyebrow"><span className="status-dot" /> EXPLORE {country.region.toUpperCase()}</div>
      <div className="country-heading"><span className="large-flag" aria-hidden="true">{country.flag}</span>
        <div><span className="small-label">YOUR NEXT CHAPTER</span><h2>{country.name}</h2></div>
      </div>
      <p className="country-description">{country.description}</p>
      <div className="country-facts">
        <div className="fact"><Building2 /><div><span>Capital city</span><strong>{country.capital}</strong></div></div>
        <div className="fact"><Users /><div><span>Population</span><strong>{country.population}</strong></div></div>
        <div className="fact"><Package /><div><span>Removals from the UK{country.estimatesIllustrative && country.removalCost ? ' · Illustrative' : ''}</span><strong>{country.removalCost || 'Contact us for a quote'}</strong></div></div>
        <div className="fact"><Clock3 /><div><span>Shipping transit time{country.estimatesIllustrative && country.transitTime ? ' · Illustrative' : ''}</span><strong>{country.transitTime || 'Transit time on request'}</strong></div></div>
      </div>
      <button className="primary-button" disabled={!getLandingPageUrl(country)} onClick={() => navigateToCountry(country)}>
        <span>Explore Removals to {country.name}</span><ArrowRight size={18} />
      </button>
      <p className="link-note">{getLandingPageUrl(country) ? 'Discover more on the PSS website.' : 'Destination link awaiting verification.'}</p>
      <p className="estimate-note">Prototype information only. Services are provisional; costs and transit times require a personalised quote. Population is approximate.</p>
    </div> : <div className="empty-content">
      <div className="panel-eyebrow"><span className="status-dot" /> A WORLD OF POSSIBILITIES</div>
      <div className="globe-art" aria-hidden="true">
        <div className="orbit orbit-one" /><div className="orbit orbit-two" />
        <Globe2 size={118} strokeWidth={0.7} />
        <span className="globe-pin"><MapPin size={22} fill="currentColor" strokeWidth={1.5} /></span>
        <span className="globe-spark spark-one" /><span className="globe-spark spark-two" />
      </div>
      <h2>Your Next Adventure Starts Here</h2>
      <p>Hover over a highlighted country to discover more about your moving destination.</p>
      <div className="panel-divider" />
      <div className="how-to"><span>01</span><div><strong>Find your somewhere</strong><p>Explore the map or search for a country.</p></div></div>
      <div className="how-to"><span>02</span><div><strong>Picture your next chapter</strong><p>Get to know your future destination.</p></div></div>
      <div className="how-to"><span>03</span><div><strong>Make your move</strong><p>Explore your international removals options.</p></div></div>
      <div className="panel-signoff"><MapPin size={14} /> From the UK. To your next chapter.</div>
    </div>}
  </aside>;
}
