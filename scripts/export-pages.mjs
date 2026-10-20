// Export the production build for GitHub Pages' "main /docs" deployment option.
import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
mkdirSync('docs', { recursive: true });
cpSync('dist', 'docs', { recursive: true });
writeFileSync('docs/.nojekyll', '');
console.log('GitHub Pages site exported to docs/. Publish main /docs in repository Settings > Pages.');
