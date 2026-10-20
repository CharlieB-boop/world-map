import { useEffect, useRef, useState } from 'react';
import { ComposableMap, Geographies, Geography, Graticule, Marker, ZoomableGroup } from 'react-simple-maps';
import { geoArea } from 'd3-geo';
import { Compass, LoaderCircle, Minus, MousePointer2, Plus, RotateCcw } from 'lucide-react';
import { countries, countriesByNumericCode, navigateToCountry } from '../data/countries';
import type { Country, Region } from '../types/country';

// Kosovo has no ISO numeric ID in Natural Earth. Match its user-assigned
// country-data code explicitly; never infer other unsupported geometries.
const geometryCode = (geo: { id?: string; properties: { name?: string } }) =>
  geo.properties.name === 'Kosovo' ? '383' : String(geo.id).padStart(3, '0');

export interface MapPosition { coordinates: [number, number]; zoom: number }
export const initialPosition: MapPosition = { coordinates: [8, 12], zoom: 1 };
interface Props {
  selected: Country | null;
  region: Region;
  position: MapPosition;
  setPosition: (position: MapPosition) => void;
  onSelect: (country: Country) => void;
}
export default function WorldMap({ selected, region, position, setPosition, onSelect }: Props) {
  const [geography, setGeography] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const pointer = useRef({ type: 'mouse', wasSelected: false });
  const dragging = useRef(false);
  useEffect(() => {
    const controller = new AbortController();
    setError(false);
    fetch(`${import.meta.env.BASE_URL}countries-50m.json`, { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('Map unavailable'); return response.json(); })
      .then(setGeography).catch(error => { if (error.name !== 'AbortError') setError(true); });
    return () => controller.abort();
  }, [attempt]);
  const isVisible = (country: Country) => region === 'All destinations' || region === country.region;
  function interactiveProps(country: Country) {
    return {
      role: 'button', tabIndex: 0, 'aria-label': `Explore ${country.name}`,
      'aria-pressed': selected?.iso === country.iso,
      'data-country': country.iso,
      onMouseEnter: () => { if (!dragging.current) onSelect(country); },
      onFocus: () => onSelect(country),
      onPointerDown: (event: React.PointerEvent<SVGElement>) => {
        pointer.current = { type: event.pointerType, wasSelected: selected?.iso === country.iso };
      },
      onClick: () => {
        if (dragging.current) return;
        onSelect(country);
        if (pointer.current.type !== 'touch' || pointer.current.wasSelected) navigateToCountry(country);
      },
      onKeyDown: (event: React.KeyboardEvent<SVGElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault(); onSelect(country);
          if (event.key === 'Enter') navigateToCountry(country);
        }
      },
    };
  }
  return <div className="map-stage" aria-label="Interactive world destination map">
    <div className="map-caption"><Compass size={15} /><span>THE WORLD IS WAITING</span></div>
    {!geography && <div className="map-loading" role="status">{error ? <><p>We couldn’t load the map.</p><button className="text-button" onClick={() => setAttempt(value => value + 1)}>Try again</button></> : <><LoaderCircle className="loading-spinner" /> Loading your world…</>}</div>}
    {geography && <ComposableMap width={900} height={510} projection="geoEqualEarth" projectionConfig={{ scale: 170 }}
      aria-label="World map. Supported countries can be explored with the keyboard, mouse or touch.">
      <ZoomableGroup center={position.coordinates} zoom={position.zoom} minZoom={1} maxZoom={8}
        onMoveStart={() => { dragging.current = true; }}
        onMoveEnd={next => { setPosition(next); dragging.current = false; }}>
        <Graticule stroke="#dce3e8" strokeWidth={0.45} strokeOpacity={0.6} step={[30, 30]} />
        <Geographies geography={geography}>
          {({ geographies }) => {
            const visibleGeometries = geographies.filter(geo => geo.id !== '010');
            const areas = new Map<string, number>();
            const presentCodes = new Set<string>();
            visibleGeometries.forEach(geo => {
              const code = geometryCode(geo);
              presentCodes.add(code);
              areas.set(code, (areas.get(code) || 0) + geoArea(geo));
            });
            return <>
              {visibleGeometries.map(geo => {
                const country = countriesByNumericCode.get(geometryCode(geo));
                const enabled = country && isVisible(country);
                const chosen = enabled && selected?.iso === country.iso;
                return <Geography key={geo.rsmKey} geography={geo}
                  {...(enabled ? interactiveProps(country) : { tabIndex: -1, 'aria-hidden': true as const })}
                  className={`country-shape ${enabled ? 'is-supported' : ''} ${chosen ? 'is-selected' : ''}`}
                  fill={chosen ? '#c92f47' : enabled ? '#cbd9e7' : '#e3e7e9'}
                  stroke="#fafcfd" strokeWidth={0.65 / position.zoom}
                  style={{ default: { outline: 'none' }, hover: { outline: 'none' }, pressed: { outline: 'none' } }} />;
              })}
              {countries.filter(c => isVisible(c) && ((areas.get(c.numericCode) || 0) < 0.000035 || !presentCodes.has(c.numericCode))).map(country =>
                <Marker key={country.iso} coordinates={country.coordinates} {...interactiveProps(country)}
                  className={`island-marker ${selected?.iso === country.iso ? 'is-selected' : ''}`}>
                  <circle r={5.5 / position.zoom} fill="transparent" stroke="none" />
                  <circle r={2.1 / Math.sqrt(position.zoom)} stroke="#fff" strokeWidth={0.7 / position.zoom}
                    fill={selected?.iso === country.iso ? '#c92f47' : '#7d9cba'} />
                  <title>{country.name}</title>
                </Marker>)}
            </>;
          }}
        </Geographies>
        <Marker coordinates={[-0.12, 51.5]} className="uk-origin" aria-hidden="true">
          <circle r={3.5 / position.zoom} fill="#142d4e" stroke="white" strokeWidth={1.5 / position.zoom} />
        </Marker>
      </ZoomableGroup>
    </ComposableMap>}
    <div className="map-legend"><span><i className="legend-supported" />Destinations</span><span><i className="legend-origin" />Moving from the UK</span></div>
    <div className="map-controls" aria-label="Map controls">
      <button className="icon-button" aria-label="Zoom in" disabled={position.zoom >= 8} onClick={() => setPosition({ ...position, zoom: Math.min(8, position.zoom * 1.6) })}><Plus size={18} /></button>
      <button className="icon-button" aria-label="Zoom out" disabled={position.zoom <= 1} onClick={() => setPosition({ ...position, zoom: Math.max(1, position.zoom / 1.6) })}><Minus size={18} /></button>
      <span className="control-divider" />
      <button className="icon-button" aria-label="Reset map view" onClick={() => setPosition(initialPosition)}><RotateCcw size={16} /></button>
    </div>
    <div className="map-instruction"><MousePointer2 size={13} /><span>Hover to discover · Drag to explore</span></div>
  </div>;
}
