import { geoInterpolate } from 'd3-geo';
import { Line, Marker, useMapContext } from 'react-simple-maps';
import type { Country } from '../types/country';

export const UK_ORIGIN: [number, number] = [-0.12, 51.5];

/** A great-circle connection between country centres, not a sea-lane itinerary. */
export default function JourneyRoute({ country, zoom }: { country: Country; zoom: number }) {
  const { projection } = useMapContext();
  const interpolate = geoInterpolate(UK_ORIGIN, country.coordinates);
  const midpoint = interpolate(0.5);
  const midpointXY = projection(midpoint);
  const aheadXY = projection(interpolate(0.51));
  const angle = midpointXY && aheadXY
    ? Math.atan2(aheadXY[1] - midpointXY[1], aheadXY[0] - midpointXY[0]) * 180 / Math.PI : 0;
  return <g className="journey-route" data-testid="journey-route" data-destination={country.iso} aria-hidden="true" pointerEvents="none">
    <Line from={UK_ORIGIN} to={country.coordinates} stroke="#ffffff" strokeWidth={4 / zoom} strokeOpacity={0.9} />
    <Line className="journey-line" from={UK_ORIGIN} to={country.coordinates}
      stroke="#c92f47" strokeWidth={1.6 / zoom} strokeLinecap="round" pathLength={1} />
    <Marker coordinates={midpoint}>
      <g transform={`scale(${1 / zoom})`}>
        <circle r={9} fill="white" stroke="#e5a6b0" strokeWidth={0.7} />
        <path d="M -4 -3.5 L 4 0 L -4 3.5 L -2 0 Z" fill="#c92f47" transform={`rotate(${angle})`} />
      </g>
    </Marker>
    <Marker coordinates={country.coordinates}>
      <circle className="journey-endpoint" r={6 / zoom} fill="#ffffff" fillOpacity={0.85} stroke="#c92f47" strokeWidth={1 / zoom} />
      <circle r={2.5 / zoom} fill="#c92f47" />
    </Marker>
  </g>;
}
