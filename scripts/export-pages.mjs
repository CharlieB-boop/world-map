// Export the production build for GitHub Pages' "main /docs" deployment option.
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
mkdirSync('docs', { recursive: true });
// Remove old generated bundles so repeated exports do not accumulate hashes.
rmSync('docs/assets', { recursive: true, force: true });
cpSync('dist', 'docs', { recursive: true });
writeFileSync('docs/.nojekyll', '');
console.log('GitHub Pages site exported to docs/. Publish main /docs in repository Settings > Pages.');
