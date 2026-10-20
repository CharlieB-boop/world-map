// One-time source preparation. Runtime data is checked into src/data and public.
import world from 'world-countries';
import { writeFileSync, copyFileSync } from 'node:fs';
const groups = {
  'North America': 'US CA',
  Asia: 'CN JP KR MN IN PK BD SG MY TH VN KH LA ID PH BN TW NP LK',
  'Middle East': 'AE SA QA KW BH OM',
  Africa: 'ZA',
  Oceania: 'AU NZ FJ PG WS TO VU SB',
  Caribbean: 'JM BB BS TT AG LC GD KN DM DO',
};
// Approximate, rounded demographic context (2024-era); not live statistics.
const populations = {
 US:'340 million',CA:'41 million',AL:'2.4 million',AD:'81,000',AT:'9.2 million',BE:'11.8 million',BG:'6.4 million',BA:'3.2 million',BY:'9.1 million',CH:'9 million',CY:'1.4 million',CZ:'10.9 million',DE:'84 million',DK:'6 million',ES:'49 million',EE:'1.4 million',FI:'5.6 million',FR:'68 million',GR:'10.4 million',HR:'3.9 million',HU:'9.6 million',IE:'5.4 million',IS:'390,000',IT:'59 million',XK:'1.6 million',LI:'40,000',LT:'2.9 million',LU:'670,000',LV:'1.9 million',MC:'39,000',MD:'2.4 million',MK:'1.8 million',MT:'560,000',ME:'620,000',NL:'18 million',NO:'5.6 million',PL:'37 million',PT:'10.6 million',RO:'19 million',SM:'34,000',RS:'6.6 million',SK:'5.4 million',SI:'2.1 million',SE:'10.6 million',UA:'38 million',VA:'800',TR:'85 million',GE:'3.7 million',AM:'3 million',AZ:'10.2 million',
 CN:'1.4 billion',JP:'124 million',KR:'52 million',MN:'3.5 million',IN:'1.4 billion',PK:'250 million',BD:'174 million',SG:'6 million',MY:'35 million',TH:'72 million',VN:'101 million',KH:'17 million',LA:'7.8 million',ID:'283 million',PH:'116 million',BN:'460,000',TW:'23 million',NP:'30 million',LK:'22 million',AE:'11 million',SA:'34 million',QA:'3 million',KW:'4.9 million',BH:'1.6 million',OM:'5.3 million',ZA:'64 million',AU:'27 million',NZ:'5.3 million',FJ:'930,000',PG:'10.6 million',WS:'220,000',TO:'104,000',VU:'330,000',SB:'820,000',JM:'2.8 million',BB:'280,000',BS:'400,000',TT:'1.5 million',AG:'94,000',LC:'180,000',GD:'117,000',KN:'47,000',DM:'66,000',DO:'11.4 million'
};
const descriptions = {
 AU:'A new chapter, a little more sunshine. Discover the possibilities of life Down Under.',
 NZ:'Wide-open landscapes and fresh possibilities. Make room for a new life in New Zealand.',
 CA:'From vibrant cities to the great outdoors. Find your next chapter in Canada.',
 US:'Big cities, open roads and new beginnings. Explore your move to the United States.',
 ES:'A slower pace and a brighter outlook. Start imagining your new life in Spain.',
 FR:'From city apartments to countryside living. Discover your own corner of France.'
};
const countries = world.flatMap(c => {
 let region = Object.entries(groups).find(([,codes])=>codes.split(' ').includes(c.cca2))?.[0];
 if ((c.region==='Europe' && (c.independent || c.cca2==='XK') && !['GB','RU'].includes(c.cca2)) || ['TR','GE','AM','AZ'].includes(c.cca2)) region='Europe';
 if(!region) return [];
 if(!populations[c.cca2]) throw new Error('Population missing: '+c.cca2);
 return [{iso:c.cca2,numericCode:c.ccn3 || (c.cca2==='XK'?'383':''),name:c.name.common,flag:c.flag,capital:c.capital.join(' / '),population:'Approx. '+populations[c.cca2],region,coordinates:[c.latlng[1],c.latlng[0]],description:descriptions[c.cca2] || `New surroundings. New possibilities. Explore your next chapter in ${c.name.common}.`,removalCost:null,transitTime:null,estimatesIllustrative:false,landingPageUrl:null}];
}).sort((a,b)=>a.name.localeCompare(b.name));
writeFileSync('src/data/destinations.json', JSON.stringify(countries,null,2)+'\n');
copyFileSync('node_modules/world-atlas/countries-50m.json','public/countries-50m.json');
console.log(`Prepared ${countries.length} destinations`);
