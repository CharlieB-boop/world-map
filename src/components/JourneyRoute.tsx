import { Line, Marker, useMapContext } from 'react-simple-maps';
import type { Country } from '../types/country';

import { shippingRoutes, UK_ORIGIN, pointOnRoute } from '../data/shippingRoutes';
export { UK_ORIGIN } from '../data/shippingRoutes';

/** Researched sea corridors for featured destinations; schematic fallback elsewhere. */
export default function JourneyRoute({ country, zoom }: { country: Country; zoom: number }) {
  const { projection } = useMapContext();
  const route = shippingRoutes[country.iso];
  const coordinates = route?.waypoints ?? [UK_ORIGIN, country.coordinates];
  const midpoint = pointOnRoute(coordinates, 0.5);
  const midpointXY = projection(midpoint);
  const aheadXY = projection(pointOnRoute(coordinates, 0.501));
  const angle = midpointXY && aheadXY
    ? Math.atan2(aheadXY[1] - midpointXY[1], aheadXY[0] - midpointXY[0]) * 180 / Math.PI : 0;
  return <g className="journey-route" data-testid="journey-route" data-destination={country.iso} data-route-kind={route ? 'researched' : 'schematic'} aria-hidden="true" pointerEvents="none">
    <Line coordinates={coordinates} stroke="#ffffff" strokeWidth={4 / zoom} strokeOpacity={0.9} />
    <Line className="journey-line" coordinates={coordinates}
      stroke="#f09114" strokeWidth={2 / zoom} strokeLinecap="round" pathLength={1} />
    <Marker coordinates={midpoint}>
      <g transform={`scale(${1 / zoom})`}>
        <circle r={9} fill="white" stroke="#1f60ab" strokeWidth={0.7} />
        <path d="M -4 -3.5 L 4 0 L -4 3.5 L -2 0 Z" fill="#f09114" transform={`rotate(${angle})`} />
      </g>
    </Marker>
    <Marker coordinates={coordinates[coordinates.length - 1]}>
      <circle className="journey-endpoint" r={6 / zoom} fill="#ffffff" fillOpacity={0.85} stroke="#f09114" strokeWidth={1 / zoom} />
      <circle r={2.5 / zoom} fill="#f09114" />
    </Marker>
  </g>;
}
