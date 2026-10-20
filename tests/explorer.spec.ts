import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('https://www.pssremovals.com/**', route => route.fulfill({contentType:'text/html',body:'<h1>External navigation intercepted</h1>'}));
  await page.goto('/');
  await expect(page.locator('[data-country="AU"]').first()).toBeVisible();
});

test('loads local map, initial guidance and all provisional destinations without runtime errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Your Next Adventure Starts Here' })).toBeVisible();
  await expect(page.getByText('94 destinations to explore')).toBeVisible();
  await expect(page.locator('.country-shape').first()).toBeVisible();
  expect(await page.locator('.country-shape').count()).toBeGreaterThan(200);
  expect(errors).toEqual([]);
});

test('hover updates country facts and keeps the last selection on mouse leave', async ({ page }) => {
  await page.locator('[data-country="AU"]').first().hover();
  await expect(page.getByRole('heading', { name: 'Australia', exact: true })).toBeVisible();
  await expect(page.getByText('Canberra', { exact: true })).toBeVisible();
  await expect(page.getByText('Approx. 27 million', { exact: true })).toBeVisible();
  await expect(page.getByText('£3,500–£6,000', { exact: true })).toBeVisible();
  await expect(page.getByText('8–16 weeks', { exact: true })).toBeVisible();
  await page.locator('h1').hover();
  await expect(page.getByRole('heading', { name: 'Australia', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Explore Removals to Australia' })).toBeEnabled();
});

test('unsupported countries have no interactive handlers and UK is origin only', async ({ page }) => {
  expect(await page.locator('.country-shape:not(.is-supported)').count()).toBeGreaterThan(100);
  await expect(page.locator('[data-country="GB"]')).toHaveCount(0);
  await expect(page.locator('[data-country="RU"]')).toHaveCount(0);
  await page.locator('.country-shape:not(.is-supported)').first().dispatchEvent('mouseenter');
  await expect(page.getByRole('heading', { name: 'Your Next Adventure Starts Here' })).toBeVisible();
});

test('keyboard search selects country, highlights the geometry and recentres map', async ({ page }) => {
  const input = page.getByRole('combobox', { name: 'Your next chapter starts with a destination' });
  await input.fill('New Zea');
  await expect(page.getByRole('option', { name: /New Zealand/ })).toBeVisible();
  await input.press('ArrowDown');
  await input.press('Enter');
  await expect(page.getByRole('heading', { name: 'New Zealand', exact: true })).toBeVisible();
  await expect(page.locator('.country-shape[data-country="NZ"]')).toHaveClass(/is-selected/);
  await expect(page.getByRole('combobox', { name: 'Your next chapter starts with a destination' })).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('.rsm-zoomable-group')).toHaveAttribute('transform', /scale\(4\)/);
});

test('search handles no matches, clearing and escape', async ({ page }) => {
  const input = page.getByRole('combobox', { name: 'Your next chapter starts with a destination' });
  await input.fill('not-a-destination');
  await expect(page.getByText('No destinations found.', { exact: false })).toBeVisible();
  await input.press('Escape');
  await expect(page.getByRole('listbox')).toBeHidden();
  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(input).toHaveValue('');
  await expect(page.getByRole('option').first()).toBeVisible();
});

test('small countries and microstates are searchable and selectable on map', async ({ page }) => {
  const input = page.getByRole('combobox', { name: 'Your next chapter starts with a destination' });
  for (const [name, iso] of [['Monaco', 'MC'], ['Singapore', 'SG'], ['Samoa', 'WS'], ['Vatican City', 'VA']]) {
    await input.fill(name);
    await page.getByRole('option', { name: new RegExp(name) }).click();
    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
    await expect(page.locator(`[data-country="${iso}"].is-selected`).first()).toBeVisible();
  }
});

test('region filtering, zoom controls and reset work', async ({ page }) => {
  await page.getByRole('button', { name: 'Caribbean', exact: true }).click();
  await expect(page.getByText('10 destinations', { exact: true })).toBeVisible();
  await expect(page.locator('[data-country="AU"]')).toHaveCount(0);
  await expect(page.locator('[data-country="JM"]').first()).toBeVisible();
  await page.getByRole('button', { name: 'All destinations', exact: true }).click();
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await expect(page.locator('.rsm-zoomable-group')).toHaveAttribute('transform', /scale\(1.6\)/);
  await page.getByRole('button', { name: 'Zoom out', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Zoom out', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await page.getByRole('button', { name: 'Reset map view' }).click();
  await expect(page.locator('.rsm-zoomable-group')).toHaveAttribute('transform', /scale\(1\)/);
});

test('map destinations support keyboard focus and selection', async ({ page }) => {
  const australia = page.locator('.country-shape[data-country="AU"]').first();
  await australia.focus();
  await expect(page.getByRole('heading', { name: 'Australia', exact: true })).toBeVisible();
  await australia.press('Space');
  await expect(australia).toHaveAttribute('aria-pressed', 'true');
});

test('mobile layout supports touch, country search and no horizontal overflow', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto('/');
  const australia = page.locator('.country-shape[data-country="AU"]').first();
  await expect(australia).toBeVisible();
  await australia.tap();
  await expect(page.getByRole('heading', { name: 'Australia', exact: true })).toBeVisible();
  const mapBox = await page.locator('.map-column').boundingBox();
  const panelBox = await page.locator('.info-panel').boundingBox();
  expect(panelBox!.y).toBeGreaterThanOrEqual(mapBox!.y + mapBox!.height - 1);
  await page.getByRole('combobox', { name: 'Your next chapter starts with a destination' }).fill('Singapore');
  await page.getByRole('option', { name: /Singapore/ }).tap();
  await expect(page.getByRole('heading', { name: 'Singapore', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole('combobox', { name: 'Your next chapter starts with a destination' }).fill('');
  await page.getByRole('combobox', { name: 'Your next chapter starts with a destination' }).press('Escape');
  await page.screenshot({ path: '/tmp/pss-mobile.png', fullPage: true });
  await context.close();
});

test('reduced motion preference disables decorative animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await page.locator('.map-stage > svg').evaluate(element => getComputedStyle(element).animationName)).toBe('none');
});

test('map has a recoverable loading error', async ({ page }) => {
  await page.route('**/countries-50m.json', route => route.abort());
  await page.reload();
  await expect(page.getByText('We couldn’t load the map.')).toBeVisible();
  await page.unroute('**/countries-50m.json');
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.locator('[data-country="AU"]').first()).toBeVisible();
});

test('dragging pans the world and reset restores the initial view', async ({ page }) => {
  const group = page.locator('.rsm-zoomable-group');
  const initial = await group.getAttribute('transform');
  await page.locator('.map-stage > svg').scrollIntoViewIfNeeded();
  const box = await page.locator('.map-stage > svg').boundingBox();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await page.mouse.down();
  await page.mouse.move(box!.x + box!.width / 2 + 90, box!.y + box!.height / 2 + 25, { steps: 8 });
  await page.mouse.up();
  await expect(group).not.toHaveAttribute('transform', initial!);
  await page.getByRole('button', { name: 'Reset map view' }).click();
  await expect(group).toHaveAttribute('transform', initial!);
});

test('configured destination URLs open in the same tab from map and panel', async ({ page }) => {
  // Test-only fixture: this URL is deliberately synthetic, not a verified PSS page.
  await page.route('**/src/data/destinations.json*', async route => {
    const { readFileSync } = await import('node:fs');
    const data = JSON.parse(readFileSync(new URL('../src/data/destinations.json', import.meta.url), 'utf8'));
    data.find((country: { iso: string }) => country.iso === 'AU').landingPageUrl = 'https://www.pssremovals.com/test-only-australia';
    await route.fulfill({ contentType: 'application/javascript', body: 'export default ' + JSON.stringify(data) });
  });
  await page.route('https://www.pssremovals.com/test-only-australia', route => route.fulfill({ contentType: 'text/html', body: '<h1>Navigation test destination</h1>' }));
  await page.reload();
  await page.locator('[data-country="AU"]').first().hover();
  await page.getByRole('button', { name: 'Explore Removals to Australia' }).click();
  await expect(page).toHaveURL('https://www.pssremovals.com/test-only-australia');
  await page.goto('/');
  await page.locator('[data-country="AU"]').first().click();
  await expect(page).toHaveURL('https://www.pssremovals.com/test-only-australia');
  expect(page.context().pages()).toHaveLength(1);
});

test('journey preview is opt-in, shows a labelled connection and updates with selection', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Preview journey' })).toBeDisabled();
  await expect(page.getByTestId('journey-route')).toHaveCount(0);
  await page.locator('.popular-chips').getByRole('button', { name: /Australia/ }).click();
  await page.getByRole('button', { name: 'Preview journey' }).click();
  await expect(page.getByTestId('journey-route')).toHaveAttribute('data-destination', 'AU');
  await expect(page.locator('.journey-summary')).toContainText('United Kingdom → Australia');
  await expect(page.getByText('Illustrative connection · not a shipping itinerary')).toBeVisible();
  await expect(page.locator('.rsm-zoomable-group')).toHaveAttribute('transform', /scale\(1\)/);
  const path = await page.locator('.journey-line').getAttribute('d');
  expect(path).toBeTruthy();
  expect(path).not.toContain('NaN');
  // The preview does not intercept the underlying country geometry.
  await page.locator('.country-shape[data-country="CA"]').first().hover();
  await expect(page.getByTestId('journey-route')).toHaveAttribute('data-destination', 'CA');
  await page.getByRole('button', { name: 'Hide journey' }).click();
  await expect(page.getByTestId('journey-route')).toHaveCount(0);
});

test('journey is hidden when its destination is outside the selected region', async ({ page }) => {
  await page.locator('.popular-chips').getByRole('button', { name: /Australia/ }).click();
  await page.getByRole('button', { name: 'Preview journey' }).click();
  await page.getByRole('button', { name: 'Europe', exact: true }).click();
  await expect(page.getByTestId('journey-route')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Preview journey' })).toBeDisabled();
});

test('published box guides stay distinct from illustrative household budgets', async ({ page }) => {
  await page.locator('.popular-chips').getByRole('button', { name: /Australia/ }).click();
  await expect(page.getByRole('button', { name: '2-bedroom home' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText('Removals cost · Illustrative', { exact: true })).toBeVisible();
  await expect(page.getByText('£3,500–£6,000', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '5–10 boxes' }).click();
  await expect(page.getByRole('button', { name: '5–10 boxes' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText('£315–£535', { exact: true })).toBeVisible();
  await expect(page.getByText('5 Boxes: £315–£355 · 10 Boxes: £495–£535', { exact: true })).toBeVisible();
  await expect(page.getByText('8–16 weeks', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Source: PSS International Removals' })).toHaveAttribute('href', 'https://www.pssremovals.com/shipping-boxes-to-australia');
});

test('journey routes work for a Pacific island without invalid antimeridian geometry', async ({ page }) => {
  await page.getByRole('combobox', { name: 'Your next chapter starts with a destination' }).fill('Samoa');
  await page.getByRole('option', { name: /Samoa/ }).click();
  await page.getByRole('button', { name: 'Preview journey' }).click();
  await expect(page.getByTestId('journey-route')).toHaveAttribute('data-destination', 'WS');
  expect(await page.locator('.journey-line').getAttribute('d')).not.toContain('NaN');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await page.locator('.journey-line').evaluate(element => getComputedStyle(element).animationName)).toBe('none');
});

test('desktop map remains stationary when destination details expand', async ({ page }) => {
  await page.locator('.map-stage').scrollIntoViewIfNeeded();
  const before = await page.locator('.map-stage').boundingBox();
  await page.locator('.country-shape[data-country="AU"]').first().hover();
  await expect(page.getByRole('heading', { name: 'Australia', exact: true })).toBeVisible();
  const after = await page.locator('.map-stage').boundingBox();
  expect(after!.height).toBeCloseTo(before!.height, 1);
  expect(after!.y).toBeCloseTo(before!.y, 1);
});

test('published guides show source and scope without leaking into another shipment size', async ({ page }) => {
  const guide = {
    priceRange: '£123–£456 (test fixture)', transitTime: 'Test transit window',
    shipmentScope: 'Two-bedroom test shipment', transportMode: 'Sea',
    transitBasis: 'Test port-to-port basis.', exclusions: 'Test exclusions.',
    source: { publisher: 'Test-only source', url: 'https://example.invalid/test-guide', checkedOn: '2026-10-20' },
  };
  await page.route('**/src/data/movingGuides.ts*', route => route.fulfill({
    contentType: 'application/javascript',
    body: `export const movingGuides = ${JSON.stringify({ AU: { household: guide } })}; export const shipmentLabels = {household:'2-bedroom home',boxes:'5–10 boxes'};`,
  }));
  await page.reload();
  await page.locator('.popular-chips').getByRole('button', { name: /Australia/ }).click();
  await expect(page.getByText('£123–£456 (test fixture)', { exact: true })).toBeVisible();
  await expect(page.getByText('Two-bedroom test shipment', { exact: true })).toBeVisible();
  await page.getByText('Timing & price assumptions', { exact: true }).click();
  await expect(page.getByText('Test port-to-port basis.', { exact: false })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Source: Test-only source' })).toHaveAttribute('href', 'https://example.invalid/test-guide');
  await page.getByRole('button', { name: '5–10 boxes' }).click();
  await expect(page.getByText('£500–£1,000', { exact: true })).toBeVisible();
  await expect(page.getByText('Box shipping cost · Illustrative', { exact: true })).toBeVisible();
  await expect(page.getByText('£123–£456 (test fixture)', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Source: Test-only source' })).toHaveCount(0);
});

test('missing researched guides show illustrative prices and times while links stay disabled', async ({ page }) => {
  await page.getByRole('combobox', { name: 'Your next chapter starts with a destination' }).fill('Armenia');
  await page.getByRole('option', { name: /Armenia/ }).click();
  await expect(page.getByText('£4,500–£7,500', { exact: true })).toBeVisible();
  await expect(page.getByText('8–14 weeks', { exact: true })).toBeVisible();
  await expect(page.getByText('Removals cost · Illustrative', { exact: true })).toBeVisible();
  await expect(page.getByText('Transit time · Illustrative', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: /Source:/ })).toHaveCount(0);
  await page.getByRole('button', { name: '5–10 boxes' }).click();
  await expect(page.getByText('£450–£950', { exact: true })).toBeVisible();
  await expect(page.getByText('Box shipping cost · Illustrative', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Explore Removals to Armenia' })).toBeDisabled();
});

test('published household prices and single-size box examples retain their actual basis', async ({ page }) => {
  await page.locator('.popular-chips').getByRole('button', { name: /Spain/ }).click();
  await expect(page.getByText('£2,022–£3,500', { exact: true })).toBeVisible();
  await expect(page.getByText('1–3 weeks', { exact: true })).toBeVisible();
  await expect(page.getByText('Part-load service', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '5–10 boxes' }).click();
  await expect(page.getByText('£443', { exact: true })).toBeVisible();
  await expect(page.getByText('5 Large Boxes: £443', { exact: true })).toBeVisible();
  await expect(page.getByText('no 10-box price in this table.', { exact: false })).toBeVisible();
});

test('broader household scopes and old source-table dates remain explicit', async ({ page }) => {
  const search = page.getByRole('combobox', { name: 'Your next chapter starts with a destination' });
  await search.fill('India');
  await page.getByRole('option', { name: /India/ }).click();
  await expect(page.getByText('From £3,500', { exact: true })).toBeVisible();
  await expect(page.getByText('this includes 3-bedroom moves', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: '5–10 boxes' }).click();
  await expect(page.getByText('2024 table · Checked 20 Oct 2026', { exact: true })).toBeVisible();
  await expect(page.getByText('£665–£1,075', { exact: true })).toBeVisible();
});

test('manual example prices stay labelled illustrative beside a sourced transit guide', async ({ page }) => {
  await page.route('**/src/data/destinations.json*', async route => {
    const { readFileSync } = await import('node:fs');
    const data = JSON.parse(readFileSync(new URL('../src/data/destinations.json', import.meta.url), 'utf8'));
    const australia = data.find((country: { iso: string }) => country.iso === 'AU');
    australia.removalCost = '£99 (test-only example)';
    australia.estimatesIllustrative = true;
    await route.fulfill({contentType:'application/javascript',body:'export default '+JSON.stringify(data)});
  });
  await page.reload();
  await page.locator('.popular-chips').getByRole('button', { name: /Australia/ }).click();
  await expect(page.getByText('£99 (test-only example)', { exact: true })).toBeVisible();
  await expect(page.getByText('Removals cost · Illustrative', { exact: true })).toBeVisible();
  await expect(page.getByText('8–16 weeks', { exact: true })).toBeVisible();
});

test('all 94 destinations have both figures for both sizes and published fields take priority', async ({ page }) => {
  const coverage = await page.evaluate(async () => {
    const load = (path: string) => import(path);
    const { countries } = await load('/src/data/countries.ts');
    const { movingGuides } = await load('/src/data/movingGuides.ts');
    const { resolveEstimate } = await load('/src/data/estimateDisplay.ts');
    const errors: string[] = [];
    let rows = 0, illustrativePrices = 0, illustrativeTimes = 0;
    for (const country of countries) for (const shipment of ['household', 'boxes']) {
      const source = movingGuides[country.iso]?.[shipment];
      const result = resolveEstimate(country, shipment, source);
      rows++;
      if (!result.price || !result.price.includes('£') || !result.transit || !/\d/.test(result.transit)) errors.push(country.iso + ': missing figures');
      if (source?.priceRange && (result.price !== source.priceRange || result.priceIllustrative)) errors.push(country.iso + ': published price replaced');
      if (source?.transitTime && (result.transit !== source.transitTime || result.transitIllustrative)) errors.push(country.iso + ': published time replaced');
      if (result.priceIllustrative) illustrativePrices++;
      if (result.transitIllustrative) illustrativeTimes++;
    }
    return { countries: countries.length, rows, errors, illustrativePrices, illustrativeTimes };
  });
  expect(coverage.countries).toBe(94);
  expect(coverage.rows).toBe(188);
  expect(coverage.errors).toEqual([]);
  expect(coverage.illustrativePrices).toBe(161);
  expect(coverage.illustrativeTimes).toBe(108);
});
