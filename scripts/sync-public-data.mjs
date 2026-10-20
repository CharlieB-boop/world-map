// Keep the downloadable ODbL database in sync with the application's editable data.
import { copyFileSync } from 'node:fs';
copyFileSync('src/data/destinations.json', 'public/destinations.json');
copyFileSync('src/data/moving-guides.json', 'public/moving-guides.json');
copyFileSync('src/data/prototype-estimates.json', 'public/prototype-estimates.json');
