import CountryFlag from './CountryFlag';
import { useId, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { countries } from '../data/countries';
import type { Country } from '../types/country';

function normalize(text: string) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}
export default function CountrySearch({ onSelect }: { onSelect: (country: Country) => void }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  const results = useMemo(() => countries.filter(country =>
    normalize(country.name).includes(normalize(query.trim())) || country.iso.toLowerCase() === query.trim().toLowerCase()
  ).slice(0, 8), [query]);
  function select(country: Country) {
    onSelect(country);
    setQuery(country.name);
    setOpen(false);
    setActive(-1);
  }
  return <div className="search-wrap" onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }}>
    <label className="search-label" htmlFor={id}>Your next chapter starts with a destination</label>
    <div className={`search-box ${open ? 'is-open' : ''}`}>
      <Search size={19} aria-hidden="true" />
      <input id={id} ref={input} role="combobox" autoComplete="off" placeholder="Search for a destination..."
        aria-expanded={open} aria-controls={`${id}-results`} aria-autocomplete="list"
        aria-activedescendant={open && active >= 0 ? `${id}-option-${active}` : undefined}
        value={query} onFocus={() => setOpen(true)}
        onChange={event => { setQuery(event.target.value); setActive(-1); setOpen(true); }}
        onKeyDown={event => {
          if (event.key === 'Escape') { setOpen(false); return; }
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault(); setOpen(true);
            setActive(current => (current + (event.key === 'ArrowDown' ? 1 : -1) + results.length) % Math.max(1, results.length));
          }
          if (event.key === 'Enter' && open && results.length) { event.preventDefault(); select(results[Math.max(0, active)]); }
        }} />
      {query ? <button className="icon-button search-clear" aria-label="Clear search" onClick={() => {
        setQuery(''); setActive(-1); input.current?.focus(); setOpen(true);
      }}><X size={16} /></button> : <kbd aria-hidden="true">⌕</kbd>}
    </div>
    {open && <div className="search-results" id={`${id}-results`} role="listbox" aria-label="Destinations">
      <div className="result-heading">{query ? 'Matching destinations' : 'Explore a destination'}</div>
      {results.length ? results.map((country, index) => <button key={country.iso} id={`${id}-option-${index}`}
        role="option" aria-selected={index === active} className={index === active ? 'active' : ''}
        onMouseDown={event => event.preventDefault()} onClick={() => select(country)}>
        <span className="result-flag" aria-hidden="true"><CountryFlag iso={country.iso} /></span>
        <span>{country.name}<small>{country.region}</small></span><ArrowUpRight size={17} />
      </button>) : <p className="no-results">No destinations found. Try another country name.</p>}
    </div>}
  </div>;
}
