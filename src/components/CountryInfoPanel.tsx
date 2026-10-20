import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Building2, Clock3, Globe2, MapPin, Package, Users } from 'lucide-react';
import { getLandingPageUrl, navigateToCountry } from '../data/countries';
import { movingGuides, shipmentLabels, type ShipmentType } from '../data/movingGuides';
import type { Country } from '../types/country';

export default function CountryInfoPanel({ country }: { country: Country | null }) {
  const [shipment, setShipment] = useState<ShipmentType>('household');
  const panel = useRef<HTMLElement>(null);
  useEffect(() => { if (panel.current) panel.current.scrollTop = 0; }, [country?.iso]);
  const guide = country ? movingGuides[country.iso]?.[shipment] : undefined;
  const price = guide?.priceRange || (shipment === 'household' ? country?.removalCost : null);
  const transit = guide?.transitTime || (shipment === 'household' ? country?.transitTime : null);
  return <aside ref={panel} className={`info-panel ${country ? 'has-country' : ''}`} aria-label="Destination information">
    {country ? <div className="country-content" key={country.iso}>
      <div className="panel-eyebrow"><span className="status-dot" /> EXPLORE {country.region.toUpperCase()}</div>
      <div className="country-heading"><span className="large-flag" aria-hidden="true">{country.flag}</span>
        <div><span className="small-label">YOUR NEXT CHAPTER</span><h2>{country.name}</h2></div>
      </div>
      <p className="country-description">{country.description}</p>
      <div className="country-facts">
        <div className="fact"><Building2 /><div><span>Capital city</span><strong>{country.capital}</strong></div></div>
        <div className="fact"><Users /><div><span>Population</span><strong>{country.population}</strong></div></div>
      </div>
      <div className="moving-guide">
        <div className="guide-heading"><span className="small-label">PLAN YOUR MOVE</span><span>From the UK</span></div>
        <div className="shipment-options" role="group" aria-label="Shipment size">
          {(['household', 'boxes'] as const).map(type => <button key={type} aria-pressed={shipment === type}
            onClick={() => setShipment(type)}>{shipmentLabels[type]}</button>)}
        </div>
        <p className="shipment-scope">{guide?.shipmentScope || (shipment === 'household'
          ? 'A household move. Volume and destination affect your quote.'
          : 'A small shipment. Box dimensions and total weight affect your quote.')}</p>
        <div className="guide-facts">
          <div className="fact"><Package /><div><span>{guide ? 'Published guide range' : shipment === 'household' ? 'Removals cost' : 'Box shipping cost'}{!guide && country.estimatesIllustrative && price ? ' · Illustrative' : ''}</span><strong>{price || 'Contact us for a quote'}</strong></div></div>
          <div className="fact"><Clock3 /><div><span>{guide ? `${guide.transportMode} transit guide` : 'Shipping transit time'}{!guide && country.estimatesIllustrative && transit ? ' · Illustrative' : ''}</span><strong>{transit || 'Transit time on request'}</strong></div></div>
        </div>
        {guide && <div className="guide-source"><p>Indicative guide, not a PSS quotation. {guide.transitBasis} {guide.exclusions}</p>
          <a href={guide.source.url}>Source: {guide.source.publisher}</a><span> · Checked {guide.source.checkedOn}</span></div>}
      </div>
      <button className="primary-button" disabled={!getLandingPageUrl(country)} onClick={() => navigateToCountry(country)}>
        <span>Explore Removals to {country.name}</span><ArrowRight size={18} />
      </button>
      <p className="link-note">{getLandingPageUrl(country) ? 'Discover more on the PSS website.' : 'Destination link awaiting verification.'}</p>
      <p className="estimate-note">Services are provisional. Any guide figures are indicative, not PSS quotations. A personalised quote confirms costs and timings. Population is approximate.</p>
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
