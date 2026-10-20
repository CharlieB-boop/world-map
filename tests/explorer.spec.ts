import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
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
  await expect(page.getByText('Contact us for a quote')).toBeVisible();
  await expect(page.getByText('Transit time on request')).toBeVisible();
  await page.locator('h1').hover();
  await expect(page.getByRole('heading', { name: 'Australia', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Explore Removals to Australia' })).toBeDisabled();
  const url = page.url();
  await page.locator('[data-country="AU"]').first().click();
  expect(page.url()).toBe(url);
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
