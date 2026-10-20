import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { feature } from 'topojson-client';
import { geoBounds, geoContains, geoDistance, geoInterpolate } from 'd3-geo';
import { shippingRoutes, pointOnRoute, type Coordinate } from '../src/data/shippingRoutes';

// The rendered map cannot resolve canal channels or all port basins. Exempt only
// the named canal corridors and 3 km around these documented port locations.
const portBasins: Coordinate[] = [[0.49, 51.5], [-149.58, -17.53], [144.92, -37.86], [-3.06, 43.36]];
const inCanal = ([lon, lat]: Coordinate) =>
  (lon >= 32.25 && lon <= 32.60 && lat >= 29.95 && lat <= 31.3) ||
  (lon >= -79.96 && lon <= -79.55 && lat >= 8.88 && lat <= 9.4);

test('featured sea corridors stay over water outside canals and port basins', () => {
  const topology = JSON.parse(readFileSync('public/countries-50m.json', 'utf8'));
  const countries = feature(topology, topology.objects.countries).features.map(country => ({ country, bounds: geoBounds(country) }));
  const crossings: string[] = [];
  for (const [iso, route] of Object.entries(shippingRoutes)) {
    for (let i = 1; i < route.waypoints.length; i++) {
      const a = route.waypoints[i - 1], b = route.waypoints[i];
      const interpolate = geoInterpolate(a, b);
      const steps = Math.max(2, Math.ceil(geoDistance(a, b) * 6371 / 10));
      for (let step = 0; step <= steps; step++) {
        const point = interpolate(step / steps);
        if (inCanal(point) || portBasins.some(port => geoDistance(point, port) * 6371 <= 3)) continue;
        const land = countries.find(({ country, bounds: [[w, s], [e, n]] }) =>
          point[1] >= s && point[1] <= n && (w <= e ? point[0] >= w && point[0] <= e : point[0] >= w || point[0] <= e) && geoContains(country, point));
        if (land) crossings.push(`${iso}: ${land.country.properties.name} at ${point}`);
      }
    }
    for (const dimension of [0, 1]) {
      expect(pointOnRoute(route.waypoints, 0)[dimension]).toBeCloseTo(route.waypoints[0][dimension], 8);
      expect(pointOnRoute(route.waypoints, 1)[dimension]).toBeCloseTo(route.waypoints.at(-1)![dimension], 8);
    }
  }
  expect(crossings).toEqual([]);
});

test('five featured routes render, expose sources and preserve the historical NZ caveat', async ({ page }) => {
  await page.goto('/');
  await page.locator('.popular-chips').getByRole('button', { name: /Australia/ }).click();
  await page.getByRole('button', { name: 'Preview journey' }).click();
  for (const [name, iso] of [['Australia','AU'], ['Canada','CA'], ['USA','US'], ['Spain','ES'], ['New Zealand','NZ']]) {
    await page.locator('.popular-chips').getByRole('button', { name: new RegExp(name) }).click();
    await expect(page.getByTestId('journey-route')).toHaveAttribute('data-destination', iso);
    await expect(page.locator('.rsm-zoomable-group')).toHaveAttribute('transform', /scale\(1\)/);
    await expect(page.getByTestId('journey-route')).toHaveAttribute('data-route-kind', 'researched');
    const path = await page.locator('.journey-line').getAttribute('d');
    expect(path).toBeTruthy();
    expect(path).not.toMatch(/NaN|Infinity/);
    await page.locator('.journey-details summary').click();
    await expect(page.locator('.journey-detail-body a').first()).toBeVisible();
    await expect(page.locator('.journey-detail-body a').first()).toHaveAttribute('href', /^https:\/\//);
  }
  await expect(page.locator('.journey-summary')).toContainText('Published 2024 sea-route example');
  await expect(page.locator('.journey-summary')).toContainText('no longer lists a UK call');
  // The Pacific corridor must split at the dateline, rather than cross the map.
  expect((await page.locator('.journey-line').getAttribute('d'))?.match(/M/g)?.length).toBeGreaterThan(1);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.journey-details summary')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});
