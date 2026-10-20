import { useState } from 'react';
import { ArrowUpRight, ChevronDown, Globe2, HeartHandshake, MapPin, PackageCheck } from 'lucide-react';
import CountryInfoPanel from './components/CountryInfoPanel';
import CountrySearch from './components/CountrySearch';
import WorldMap, { initialPosition, type MapPosition } from './components/WorldMap';
import { countries, popularDestinations, regions } from './data/countries';
import type { Country, Region } from './types/country';

const regionViews: Partial<Record<Region, MapPosition>> = {
  Europe: { coordinates: [17, 51], zoom: 3.2 },
  'North America': { coordinates: [-105, 48], zoom: 1.8 },
  Asia: { coordinates: [100, 25], zoom: 2 },
  'Middle East': { coordinates: [48, 25], zoom: 4 },
  Africa: { coordinates: [24, -26], zoom: 2.7 },
  Oceania: { coordinates: [150, -24], zoom: 2 },
  Caribbean: { coordinates: [-69, 18], zoom: 4.2 },
};
export default function App() {
  const [selected, setSelected] = useState<Country | null>(null);
  const [region, setRegion] = useState<Region>('All destinations');
  const [position, setPosition] = useState<MapPosition>(initialPosition);
  function selectCountry(country: Country) {
    setSelected(country);
    setRegion('All destinations');
    setPosition({ coordinates: country.coordinates, zoom: ['AU', 'CA', 'US', 'CN', 'IN'].includes(country.iso) ? 2.2 : 4 });
  }
  function selectRegion(next: Region) {
    setRegion(next);
    setPosition(regionViews[next] || initialPosition);
  }
  const count = countries.filter(country => region === 'All destinations' || country.region === region).length;
  return <div className="app-shell min-h-screen">
    <a className="skip-link" href="#explore">Skip to destination explorer</a>
    <header className="site-header page-width">
      <a className="wordmark" href="./" aria-label="PSS International Removals home"><span className="pss-logo">PSS<span /></span><span className="wordmark-divider" /><span className="wordmark-subtitle">INTERNATIONAL<br />REMOVALS</span></a>
      <div className="header-note"><Globe2 size={16} /><span>A world of new beginnings.</span></div>
    </header>
    <main className="page-width relative">
      <section className="hero" aria-labelledby="page-heading">
        <div className="hero-copy"><div className="eyebrow"><span /> YOUR WORLD. YOUR NEXT CHAPTER.</div>
          <h1 id="page-heading">Where in the World<br />Can We <span>Move You?</span></h1>
          <p>Explore our international removals destinations and discover everything<br className="desktop-break" /> you need to know about moving overseas with PSS.</p>
        </div>
        <CountrySearch onSelect={selectCountry} />
      </section>
      <section id="explore" aria-label="Explore moving destinations">
        <div className="explorer-heading"><h2>Find your somewhere.</h2><div className="destination-total"><span className="status-dot" />{countries.length} destinations to explore</div></div>
        <div className="region-tabs" role="group" aria-label="Filter destinations by region">
          {regions.map(item => <button key={item} aria-pressed={region === item} className={region === item ? 'active' : ''} onClick={() => selectRegion(item)}>{item === 'All destinations' && <Globe2 size={15} />}{item}</button>)}
        </div>
        <div className="explorer-card">
          <div className="map-column">
            <div className="map-topbar"><div className="map-title"><Globe2 size={16} /><span>{region === 'All destinations' ? 'Your world of possibilities' : `Discover ${region}`}</span></div>
              <label className="mobile-region-select"><span className="sr-only">Filter destinations by region</span><select aria-label="Filter destinations by region" value={region} onChange={event => selectRegion(event.target.value as Region)}>{regions.map(item => <option key={item}>{item}</option>)}</select><ChevronDown size={14} /></label>
              <span className="map-count">{count} destinations</span>
            </div>
            <WorldMap selected={selected} region={region} position={position} setPosition={setPosition} onSelect={setSelected} />
            <div className="popular-destinations"><span className="popular-label">A LITTLE INSPIRATION</span><div className="popular-chips">
              {popularDestinations.map(iso => {
                const country = countries.find(item => item.iso === iso)!;
                return <button key={iso} className={selected?.iso === iso ? 'selected' : ''} onClick={() => selectCountry(country)}><span aria-hidden="true">{country.flag}</span>{country.name === 'United States' ? 'USA' : country.name}<ArrowUpRight size={12} /></button>;
              })}
            </div></div>
          </div>
          <CountryInfoPanel country={selected} />
        </div>
        <p className="prototype-note"><span>EXPLORER PROTOTYPE</span> Destinations are provisional and do not confirm current PSS services. Small countries and islands can also be selected using search.</p>
      </section>
      <section className="next-chapter" aria-label="Moving inspiration"><div className="next-chapter-title"><span className="small-label">MORE THAN A MOVE</span><h2>A new place.<br /><span>A new beginning.</span></h2></div>
        <div className="benefit"><div className="benefit-icon"><PackageCheck size={23} strokeWidth={1.5} /></div><div><h3>Bring what makes it home</h3><p>Your favourite things.<br />Your familiar comforts.</p></div></div>
        <div className="benefit"><div className="benefit-icon"><HeartHandshake size={23} strokeWidth={1.5} /></div><div><h3>Your move, made personal</h3><p>A fresh start begins<br />with a conversation.</p></div></div>
        <div className="chapter-signoff"><MapPin size={18} /><span>Where will your<br /><strong>next chapter take you?</strong></span></div>
      </section>
    </main>
    <footer className="site-footer page-width"><span>PSS International Removals <span className="footer-dot">·</span> Destination explorer</span><span><a className="data-attribution" href={`${import.meta.env.BASE_URL}data-sources.html`}>Map &amp; country data <ArrowUpRight size={13} /></a></span></footer>
    <div className="sr-only" role="status" aria-live="polite">{selected ? `${selected.name} selected. Destination information updated.` : ''}</div>
  </div>;
}
