const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'public', 'flyers');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. MINOR THREAT (1983 - Buff Hall / Washington DC)
const minorThreatSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100">
  <defs>
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.12 0" />
      <feComposite in2="SourceGraphic" in="color" operator="in" />
    </filter>
  </defs>

  <!-- Weathered Xerox Paper -->
  <rect width="800" height="1100" fill="#f4efe6"/>
  <rect width="800" height="1100" fill="#000000" opacity="0.04" filter="url(#noise)"/>

  <!-- Rough Cut Photocopy Border -->
  <rect x="25" y="25" width="750" height="1050" fill="none" stroke="#111111" stroke-width="8" stroke-dasharray="24 6 12 6"/>
  <rect x="35" y="35" width="730" height="1030" fill="none" stroke="#111111" stroke-width="2"/>

  <!-- Top Banner -->
  <rect x="40" y="50" width="720" height="70" fill="#111111"/>
  <text x="400" y="100" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="44" fill="#ffffff" text-anchor="middle" letter-spacing="6">DISCHORD RECORDS PRESENTS</text>

  <!-- Giant Headliner -->
  <g transform="translate(400, 240)">
    <text x="0" y="0" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="88" fill="#111111" text-anchor="middle" letter-spacing="4">MINOR THREAT</text>
    <line x1="-340" y1="20" x2="340" y2="20" stroke="#111111" stroke-width="10"/>
    <text x="0" y="60" font-family="Courier New, monospace" font-weight="900" font-size="28" fill="#111111" text-anchor="middle" letter-spacing="12">OUT OF STEP // D.C. HARDCORE</text>
  </g>

  <!-- Center Artwork: Iconic Black Sheep & Stencil -->
  <g transform="translate(400, 480)">
    <circle cx="0" cy="0" r="140" fill="#111111"/>
    <!-- Sheep silhouette in negative space -->
    <path d="M -50 -40 C -70 -70 -20 -90 10 -70 C 40 -90 90 -60 70 -30 C 100 0 80 50 50 60 L 50 90 L 30 90 L 30 65 L -10 65 L -10 90 L -30 90 L -30 60 C -60 60 -80 10 -50 -40 Z" fill="#f4efe6"/>
    <!-- Stylized Horns & Ear -->
    <circle cx="-25" cy="-45" r="14" fill="#111111"/>
    <circle cx="35" cy="-45" r="14" fill="#111111"/>
    <!-- Inverted Cross / Straight Edge X -->
    <text x="0" y="30" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="64" fill="#111111" text-anchor="middle">X</text>
  </g>

  <!-- Support Acts -->
  <g transform="translate(400, 710)">
    <text x="0" y="0" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="52" fill="#111111" text-anchor="middle" letter-spacing="3">W/ FAITH • VOID</text>
    <text x="0" y="55" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="44" fill="#111111" text-anchor="middle" letter-spacing="2">IRON CROSS • TEEN IDLES</text>
  </g>

  <!-- Show Date & Venue -->
  <rect x="50" y="810" width="700" height="150" fill="#111111"/>
  <text x="400" y="865" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="48" fill="#f4efe6" text-anchor="middle" letter-spacing="4">FRIDAY NIGHT // 8:00 PM SHARP</text>
  <text x="400" y="915" font-family="Courier New, monospace" font-weight="900" font-size="28" fill="#ffffff" text-anchor="middle" letter-spacing="3">BUFF HALL - 1500 BELMONT ST NW, DC</text>
  <text x="400" y="945" font-family="Courier New, monospace" font-weight="900" font-size="22" fill="#dc2626" text-anchor="middle" letter-spacing="2">ALL AGES • $4 DAMAGE • NO BOOZE • NO VIOLENCE</text>

  <!-- Bottom Stamp -->
  <text x="400" y="1030" font-family="Courier New, monospace" font-weight="900" font-size="18" fill="#111111" text-anchor="middle" letter-spacing="6">YOU'RE NOT THE FIRST, I HOPE YOU'RE NOT THE LAST</text>
</svg>`;

// 2. BAD BRAINS (1982 - CBGB NYC)
const badBrainsSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100">
  <rect width="800" height="1100" fill="#f1ece1"/>

  <!-- Distress Frame -->
  <rect x="25" y="25" width="750" height="1050" fill="none" stroke="#111111" stroke-width="12"/>
  <line x1="25" y1="130" x2="775" y2="130" stroke="#111111" stroke-width="6"/>

  <!-- Venue Heading -->
  <text x="400" y="95" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="54" fill="#111111" text-anchor="middle" letter-spacing="8">CBGB &amp; OMFUG</text>
  <text x="400" y="120" font-family="Courier New, monospace" font-weight="900" font-size="20" fill="#111111" text-anchor="middle" letter-spacing="4">315 BOWERY AT BLEECKER ST, NYC</text>

  <!-- Huge Band Name -->
  <g transform="translate(400, 270)">
    <rect x="-350" y="-85" width="700" height="135" fill="#111111"/>
    <text x="0" y="15" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="110" fill="#ffffff" text-anchor="middle" letter-spacing="10">BAD BRAINS</text>
    <text x="0" y="80" font-family="Courier New, monospace" font-weight="900" font-size="30" fill="#dc2626" text-anchor="middle" letter-spacing="8">P.M.A. HARDCORE MATINEE</text>
  </g>

  <!-- Center Artwork: Lightning Bolt Striking Capitol -->
  <g transform="translate(400, 520)">
    <!-- Capitol Dome Silhouette -->
    <path d="M -120 110 L 120 110 L 120 60 L 90 60 C 90 0 0 -20 0 -60 C 0 -20 -90 0 -90 60 L -120 60 Z" fill="#111111"/>
    <rect x="-160" y="110" width="320" height="40" fill="#111111"/>
    
    <!-- Yellow/Red Lightning Bolt -->
    <polygon points="10,-170 -60,-20 0,-20 -50,130 90,-40 30,-40 70,-170" fill="#dc2626" stroke="#111111" stroke-width="6"/>
  </g>

  <!-- Lineup Support -->
  <g transform="translate(400, 750)">
    <text x="0" y="0" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="48" fill="#111111" text-anchor="middle" letter-spacing="4">SPECIAL GUESTS:</text>
    <text x="0" y="60" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="62" fill="#111111" text-anchor="middle" letter-spacing="6">BEASTIE BOYS</text>
    <text x="0" y="115" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="44" fill="#111111" text-anchor="middle" letter-spacing="4">REAGAN YOUTH • KRAUT</text>
  </g>

  <!-- Bottom Details -->
  <rect x="35" y="910" width="730" height="130" fill="#111111"/>
  <text x="400" y="965" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="46" fill="#ffffff" text-anchor="middle" letter-spacing="6">SUNDAY OCT 24 // 2:00 PM</text>
  <text x="400" y="1015" font-family="Courier New, monospace" font-weight="900" font-size="24" fill="#e5e5e5" text-anchor="middle" letter-spacing="4">DAMAGE $5.00 • ALL AGES WELCOME</text>
</svg>`;

// 3. BLACK FLAG (1982 - Olympic Auditorium Los Angeles)
const blackFlagSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100">
  <rect width="800" height="1100" fill="#f8f4ed"/>

  <!-- Bold Stark Frame -->
  <rect x="30" y="30" width="740" height="1040" fill="none" stroke="#000000" stroke-width="14"/>

  <!-- Four Black Bars (Iconic Raymond Pettibon Logo) -->
  <g transform="translate(180, 80)">
    <rect x="0" y="0" width="60" height="160" fill="#000000"/>
    <rect x="120" y="0" width="60" height="160" fill="#000000"/>
    <rect x="240" y="0" width="60" height="160" fill="#000000"/>
    <rect x="360" y="0" width="60" height="160" fill="#000000"/>
  </g>

  <!-- Band Name -->
  <text x="400" y="330" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="124" fill="#000000" text-anchor="middle" letter-spacing="12">BLACK FLAG</text>
  <line x1="50" y1="360" x2="750" y2="360" stroke="#000000" stroke-width="8"/>

  <!-- Pettibon Style Stark Text -->
  <text x="400" y="420" font-family="Courier New, monospace" font-weight="900" font-size="34" fill="#dc2626" text-anchor="middle" letter-spacing="6">DAMAGED // 1982 ASSAULT</text>

  <!-- Stark Illustration Box -->
  <rect x="120" y="450" width="560" height="280" fill="#000000"/>
  <text x="400" y="550" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="64" fill="#ffffff" text-anchor="middle" letter-spacing="4">NO POLICE</text>
  <text x="400" y="620" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="52" fill="#ffffff" text-anchor="middle" letter-spacing="4">NO BARRICADES</text>
  <text x="400" y="680" font-family="Courier New, monospace" font-weight="900" font-size="24" fill="#dc2626" text-anchor="middle" letter-spacing="4">TOTAL SOUND SYSTEM TERROR</text>

  <!-- Lineup -->
  <g transform="translate(400, 790)">
    <text x="0" y="0" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="52" fill="#000000" text-anchor="middle" letter-spacing="6">W/ MEAT PUPPETS</text>
    <text x="0" y="55" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="46" fill="#000000" text-anchor="middle" letter-spacing="4">MINUTEMEN • DESCENDENTS</text>
  </g>

  <!-- Venue / Date -->
  <rect x="40" y="880" width="720" height="160" fill="#000000"/>
  <text x="400" y="940" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="52" fill="#ffffff" text-anchor="middle" letter-spacing="4">SATURDAY NIGHT // DOORS 7:30</text>
  <text x="400" y="990" font-family="Courier New, monospace" font-weight="900" font-size="28" fill="#f8f4ed" text-anchor="middle" letter-spacing="3">OLYMPIC AUDITORIUM, LOS ANGELES</text>
  <text x="400" y="1025" font-family="Courier New, monospace" font-weight="900" font-size="20" fill="#dc2626" text-anchor="middle" letter-spacing="4">ADMISSION $6.50 • ALL AGES</text>
</svg>`;

// 4. AGNOSTIC FRONT (1986 - CBGB Sunday Matinee)
const agnosticFrontSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100">
  <rect width="800" height="1100" fill="#f0ebe0"/>

  <!-- Heavy Outer Border -->
  <rect x="25" y="25" width="750" height="1050" fill="none" stroke="#000000" stroke-width="12"/>

  <!-- NYHC Top Banner -->
  <rect x="35" y="45" width="730" height="75" fill="#000000"/>
  <text x="400" y="98" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="46" fill="#ffffff" text-anchor="middle" letter-spacing="12">NEW YORK HARDCORE</text>

  <!-- Headliner -->
  <g transform="translate(400, 240)">
    <text x="0" y="0" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="94" fill="#000000" text-anchor="middle" letter-spacing="6">AGNOSTIC FRONT</text>
    <line x1="-340" y1="20" x2="340" y2="20" stroke="#000000" stroke-width="10"/>
    <text x="0" y="65" font-family="Courier New, monospace" font-weight="900" font-size="30" fill="#dc2626" text-anchor="middle" letter-spacing="8">VICTIM IN PAIN // NYC MATINEE</text>
  </g>

  <!-- Combat Boots & Skull graphic -->
  <g transform="translate(400, 480)">
    <rect x="-240" y="-120" width="480" height="240" fill="#000000"/>
    <!-- Crossbones & Combat Boots stencil -->
    <line x1="-180" y1="-90" x2="180" y2="90" stroke="#f0ebe0" stroke-width="24" stroke-linecap="round"/>
    <line x1="180" y1="-90" x2="-180" y2="90" stroke="#f0ebe0" stroke-width="24" stroke-linecap="round"/>
    <circle cx="0" cy="0" r="80" fill="#dc2626"/>
    <text x="0" y="25" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="70" fill="#ffffff" text-anchor="middle">NYHC</text>
  </g>

  <!-- Supports -->
  <g transform="translate(400, 720)">
    <text x="0" y="0" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="56" fill="#000000" text-anchor="middle" letter-spacing="4">W/ WARZONE</text>
    <text x="0" y="60" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="48" fill="#000000" text-anchor="middle" letter-spacing="4">MURPHY'S LAW • SHEER TERROR</text>
  </g>

  <!-- Venue / Schedule -->
  <rect x="40" y="840" width="720" height="190" fill="#000000"/>
  <text x="400" y="905" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="52" fill="#ffffff" text-anchor="middle" letter-spacing="6">SUNDAY MATINEE // 2:00 PM</text>
  <text x="400" y="960" font-family="Courier New, monospace" font-weight="900" font-size="32" fill="#f0ebe0" text-anchor="middle" letter-spacing="4">CBGB - 315 BOWERY, NYC</text>
  <text x="400" y="1005" font-family="Courier New, monospace" font-weight="900" font-size="22" fill="#dc2626" text-anchor="middle" letter-spacing="4">STAGE DIVES STRICTLY ENCOURAGED • $5 DOOR</text>
</svg>`;

// 5. GORILLA BISCUITS (1988 - The Anthrax Norwalk CT)
const gorillaBiscuitsSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100">
  <rect width="800" height="1100" fill="#fdfbf7"/>
  <rect x="25" y="25" width="750" height="1050" fill="none" stroke="#000000" stroke-width="12"/>

  <!-- Top Banner -->
  <rect x="35" y="45" width="730" height="65" fill="#000000"/>
  <text x="400" y="92" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="40" fill="#ffffff" text-anchor="middle" letter-spacing="8">REVELATION RECORDS SHOWCASE</text>

  <!-- Huge Logo -->
  <g transform="translate(400, 220)">
    <text x="0" y="0" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="82" fill="#000000" text-anchor="middle" letter-spacing="4">GORILLA BISCUITS</text>
    <line x1="-330" y1="18" x2="330" y2="18" stroke="#000000" stroke-width="8"/>
    <text x="0" y="60" font-family="Courier New, monospace" font-weight="900" font-size="28" fill="#dc2626" text-anchor="middle" letter-spacing="8">START TODAY // POSITIVE HARDCORE</text>
  </g>

  <!-- Comic Silhouette / Box -->
  <g transform="translate(400, 470)">
    <circle cx="0" cy="0" r="150" fill="#000000"/>
    <circle cx="0" cy="0" r="140" fill="#ffffff"/>
    <text x="0" y="30" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="88" fill="#000000" text-anchor="middle">HOLD</text>
    <text x="0" y="85" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="52" fill="#dc2626" text-anchor="middle">YOUR GROUND</text>
  </g>

  <!-- Support Acts -->
  <g transform="translate(400, 710)">
    <text x="0" y="0" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="54" fill="#000000" text-anchor="middle" letter-spacing="4">W/ JUDGE • YOUTH OF TODAY</text>
    <text x="0" y="55" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="44" fill="#000000" text-anchor="middle" letter-spacing="4">SIDE BY SIDE • BOLD</text>
  </g>

  <!-- Venue / Date -->
  <rect x="40" y="830" width="720" height="200" fill="#000000"/>
  <text x="400" y="895" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="52" fill="#ffffff" text-anchor="middle" letter-spacing="6">SATURDAY NIGHT // 7:00 PM</text>
  <text x="400" y="950" font-family="Courier New, monospace" font-weight="900" font-size="30" fill="#ffffff" text-anchor="middle" letter-spacing="4">THE ANTHRAX - NORWALK, CT</text>
  <text x="400" y="995" font-family="Courier New, monospace" font-weight="900" font-size="22" fill="#dc2626" text-anchor="middle" letter-spacing="3">ALL AGES • $6 AT DOOR • BRING ENERGY</text>
</svg>`;

// 6. HATEBREED (1997 - Satisfaction is the Death of Desire Tour)
const hatebreedSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100">
  <rect width="800" height="1100" fill="#0a0a0a"/>

  <!-- Barbed Wire & Distress Border -->
  <rect x="25" y="25" width="750" height="1050" fill="none" stroke="#dc2626" stroke-width="8" stroke-dasharray="18 6"/>
  <rect x="35" y="35" width="730" height="1030" fill="none" stroke="#ffffff" stroke-width="2"/>

  <!-- Top Bar -->
  <text x="400" y="90" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="40" fill="#ffffff" text-anchor="middle" letter-spacing="10">VICTORY RECORDS PRESENTS</text>

  <!-- Giant Headliner -->
  <g transform="translate(400, 240)">
    <text x="0" y="0" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="108" fill="#ffffff" text-anchor="middle" letter-spacing="8">HATEBREED</text>
    <line x1="-340" y1="20" x2="340" y2="20" stroke="#dc2626" stroke-width="8"/>
    <text x="0" y="65" font-family="Courier New, monospace" font-weight="900" font-size="24" fill="#dc2626" text-anchor="middle" letter-spacing="6">SATISFACTION IS THE DEATH OF DESIRE</text>
  </g>

  <!-- Metallic Hardcore Heavy Box -->
  <g transform="translate(400, 480)">
    <rect x="-260" y="-120" width="520" height="240" fill="#171717" stroke="#dc2626" stroke-width="4"/>
    <text x="0" y="-30" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="52" fill="#ffffff" text-anchor="middle" letter-spacing="4">HEAVYWEIGHT BEATDOWN</text>
    <text x="0" y="30" font-family="Courier New, monospace" font-weight="900" font-size="24" fill="#a3a3a3" text-anchor="middle" letter-spacing="4">PREPARE FOR WAR</text>
    <text x="0" y="70" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="34" fill="#dc2626" text-anchor="middle" letter-spacing="6">TOTAL PIT DESTRUCTION</text>
  </g>

  <!-- Supports -->
  <g transform="translate(400, 720)">
    <text x="0" y="0" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="58" fill="#ffffff" text-anchor="middle" letter-spacing="4">W/ EARTH CRISIS</text>
    <text x="0" y="60" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="48" fill="#ffffff" text-anchor="middle" letter-spacing="4">MADBALL • BURIED ALIVE</text>
  </g>

  <!-- Venue / Date -->
  <rect x="45" y="850" width="710" height="180" fill="#dc2626"/>
  <text x="400" y="910" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="48" fill="#ffffff" text-anchor="middle" letter-spacing="6">FRIDAY NOV 14 // DOORS 7:00 PM</text>
  <text x="400" y="960" font-family="Courier New, monospace" font-weight="900" font-size="28" fill="#ffffff" text-anchor="middle" letter-spacing="4">THE TUNE INN - WATERBURY, CT</text>
  <text x="400" y="1000" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="26" fill="#000000" text-anchor="middle" letter-spacing="4">ALL AGES • $8 ADVANCE • BRING HARD HAT</text>
</svg>`;

// 7. SUNAMI & PAIN OF TRUTH (Modern Beatdown Masterpiece)
const sunamiSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100">
  <rect width="800" height="1100" fill="#09090b"/>

  <!-- Aggressive Red Crossbars -->
  <rect x="20" y="20" width="760" height="1060" fill="none" stroke="#dc2626" stroke-width="10"/>

  <text x="400" y="85" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="44" fill="#ffffff" text-anchor="middle" letter-spacing="10">TRIPLE B RECORDS PRESENTS</text>

  <!-- SUNAMI -->
  <g transform="translate(400, 220)">
    <rect x="-340" y="-80" width="680" height="130" fill="#dc2626"/>
    <text x="0" y="15" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="118" fill="#ffffff" text-anchor="middle" letter-spacing="12">SUNAMI</text>
    <text x="0" y="80" font-family="Courier New, monospace" font-weight="900" font-size="28" fill="#ffffff" text-anchor="middle" letter-spacing="6">REAL BAY SHIT // SAN JOSE HARDCORE</text>
  </g>

  <!-- AND -->
  <text x="400" y="380" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="54" fill="#dc2626" text-anchor="middle" letter-spacing="8">&amp;</text>

  <!-- PAIN OF TRUTH -->
  <g transform="translate(400, 480)">
    <text x="0" y="0" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="88" fill="#ffffff" text-anchor="middle" letter-spacing="6">PAIN OF TRUTH</text>
    <text x="0" y="45" font-family="Courier New, monospace" font-weight="900" font-size="24" fill="#a1a1aa" text-anchor="middle" letter-spacing="6">LONG ISLAND HARDCORE</text>
  </g>

  <!-- Supports -->
  <g transform="translate(400, 660)">
    <text x="0" y="0" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="48" fill="#dc2626" text-anchor="middle" letter-spacing="4">WITH SPECIAL GUESTS:</text>
    <text x="0" y="55" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="58" fill="#ffffff" text-anchor="middle" letter-spacing="6">GRIDIRON</text>
    <text x="0" y="115" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="46" fill="#e4e4e7" text-anchor="middle" letter-spacing="4">INGROWN • DARE</text>
  </g>

  <!-- Venue / Date -->
  <rect x="40" y="850" width="720" height="190" fill="#18181b" stroke="#dc2626" stroke-width="4"/>
  <text x="400" y="910" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="54" fill="#ffffff" text-anchor="middle" letter-spacing="6">SATURDAY NIGHT // DOORS 6:30 PM</text>
  <text x="400" y="965" font-family="Courier New, monospace" font-weight="900" font-size="30" fill="#ffffff" text-anchor="middle" letter-spacing="4">VFW HALL POST 11 // THE MEAT LOCKER</text>
  <text x="400" y="1010" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="24" fill="#dc2626" text-anchor="middle" letter-spacing="4">DAMAGE: $20 • NO BARRICADES • STAGE DIVES ENCOURAGED</text>
</svg>`;

console.log('Writing authentic historical hardcore flyers to public/flyers/...');
fs.writeFileSync(path.join(outDir, 'minor-threat-1983.svg'), minorThreatSVG);
fs.writeFileSync(path.join(outDir, 'bad-brains-cbgb-1982.svg'), badBrainsSVG);
fs.writeFileSync(path.join(outDir, 'black-flag-1982.svg'), blackFlagSVG);
fs.writeFileSync(path.join(outDir, 'agnostic-front-1986.svg'), agnosticFrontSVG);
fs.writeFileSync(path.join(outDir, 'gorilla-biscuits-1988.svg'), gorillaBiscuitsSVG);
fs.writeFileSync(path.join(outDir, 'hatebreed-1997.svg'), hatebreedSVG);
fs.writeFileSync(path.join(outDir, 'sunami-pot-2023.svg'), sunamiSVG);

console.log('Successfully generated 7 historical hardcore gig flyers in public/flyers/!');
