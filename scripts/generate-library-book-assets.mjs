import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.join(process.cwd(), 'public/assets/library/books');
const sceneOutDir = path.join(process.cwd(), 'public/assets/library');

const books = [
  { id: 'mana', label: 'MANA', base: '#2368a2', dark: '#17304c', accent: '#70c7ff', metal: '#d7c4a2', icon: 'drop' },
  { id: 'serpent', label: 'SERPENT', base: '#5c4aa0', dark: '#2b2148', accent: '#a78cff', metal: '#c8bba3', icon: 'coil' },
  { id: 'typing', label: 'GLYPHES', base: '#9b4eb0', dark: '#3d1e4a', accent: '#ed9fff', metal: '#dcc3a0', icon: 'spark' },
  { id: 'herbarium', label: 'HERBIER', base: '#4e7c36', dark: '#21351d', accent: '#91d980', metal: '#d2c097', icon: 'leaf' },
  { id: 'defense', label: 'BASTION', base: '#b56c2d', dark: '#4b2819', accent: '#ffc36e', metal: '#dbc59f', icon: 'tower' },
  { id: 'blackjack', label: 'BLACKJACK', base: '#2f7a4a', dark: '#17351f', accent: '#74d88f', metal: '#d5c29b', icon: 'card' },
  { id: 'hundred', label: 'CENT', base: '#315aa0', dark: '#172748', accent: '#7ea4ff', metal: '#cfc1a6', icon: 'number' },
  { id: 'mine', label: 'MINE', base: '#8b5731', dark: '#351e14', accent: '#d69a58', metal: '#d2b58d', icon: 'pickaxe' },
  { id: 'targets', label: 'CIBLES', base: '#9f3844', dark: '#3a171d', accent: '#ff7a80', metal: '#d8b99b', icon: 'target' },
  { id: 'slimeTrainer', label: 'SLIME', base: '#3b8b5c', dark: '#193926', accent: '#7df0a3', metal: '#d1c39d', icon: 'slime' },
];

await mkdir(outDir, { recursive: true });
await mkdir(sceneOutDir, { recursive: true });
for (const book of books) {
  await writeFile(path.join(outDir, `${book.id}.svg`), makeBookSvg(book), 'utf8');
}
await writeFile(path.join(outDir, '_contact-sheet.svg'), makeContactSheet(), 'utf8');
await writeFile(path.join(sceneOutDir, 'shelf.svg'), makeShelfSvg(), 'utf8');

function makeBookSvg(book) {
  const safeId = book.id.replace(/[^a-zA-Z0-9_-]/g, '');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="190" height="252" viewBox="0 0 190 252" fill="none">
  <defs>
    <linearGradient id="${safeId}-cover" x1="42" y1="18" x2="151" y2="226" gradientUnits="userSpaceOnUse">
      <stop stop-color="${book.base}"/>
      <stop offset="0.48" stop-color="${book.dark}"/>
      <stop offset="1" stop-color="#120b0b"/>
    </linearGradient>
    <linearGradient id="${safeId}-spine" x1="28" y1="24" x2="60" y2="232" gradientUnits="userSpaceOnUse">
      <stop stop-color="#160c0b"/>
      <stop offset="0.35" stop-color="${book.base}"/>
      <stop offset="1" stop-color="#0b0606"/>
    </linearGradient>
    <linearGradient id="${safeId}-pages" x1="132" y1="23" x2="173" y2="224" gradientUnits="userSpaceOnUse">
      <stop stop-color="#f1dfbc"/>
      <stop offset="0.5" stop-color="#b99f79"/>
      <stop offset="1" stop-color="#6c523c"/>
    </linearGradient>
    <linearGradient id="${safeId}-top-pages" x1="43" y1="12" x2="159" y2="38" gradientUnits="userSpaceOnUse">
      <stop stop-color="#f4e5c3"/>
      <stop offset="1" stop-color="#927557"/>
    </linearGradient>
    <filter id="${safeId}-shadow" x="0" y="0" width="190" height="252" filterUnits="userSpaceOnUse">
      <feDropShadow dx="10" dy="13" stdDeviation="7" flood-color="#000000" flood-opacity="0.48"/>
    </filter>
    <filter id="${safeId}-leather" x="20" y="12" width="152" height="228" filterUnits="userSpaceOnUse">
      <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="3" seed="${book.id.length + 8}" result="noise"/>
      <feColorMatrix in="noise" type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncA type="table" tableValues="0 0.18"/>
      </feComponentTransfer>
      <feBlend in2="SourceGraphic" mode="overlay"/>
    </filter>
    <radialGradient id="${safeId}-gem" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(92 92) rotate(90) scale(47)">
      <stop stop-color="#fff6d0"/>
      <stop offset="0.32" stop-color="${book.accent}"/>
      <stop offset="1" stop-color="${book.base}"/>
    </radialGradient>
  </defs>
  <g filter="url(#${safeId}-shadow)">
    <path d="M39 21C40 14 45 10 53 10H139C153 10 166 23 166 37V218C166 230 156 240 144 240H47C38 240 31 233 31 224L39 21Z" fill="#070405" opacity="0.72"/>
    <path d="M57 15H142C154 15 164 25 164 37H67C60 37 55 31 57 15Z" fill="url(#${safeId}-top-pages)"/>
    <path d="M135 31H158C166 35 172 43 172 55V213C172 226 162 235 149 235H132V31Z" fill="url(#${safeId}-pages)"/>
    <path d="M139 45H168M139 58H170M139 71H170M139 84H170M139 97H170M139 110H170M139 123H170M139 136H170M139 149H170M139 162H170M139 175H170M139 188H170M139 201H168M139 214H163" stroke="#5b4634" stroke-width="1.35" opacity="0.34"/>
    <path d="M30 25C30 18 36 13 43 13H132C141 13 148 20 148 29V220C148 229 141 236 132 236H41C34 236 28 230 28 223L30 25Z" fill="url(#${safeId}-cover)"/>
    <path d="M30 25C30 18 36 13 43 13H62V236H41C34 236 28 230 28 223L30 25Z" fill="url(#${safeId}-spine)" opacity="0.95"/>
    <path d="M66 30H130C134 30 137 33 137 37V214C137 218 134 221 130 221H66V30Z" filter="url(#${safeId}-leather)" opacity="0.96"/>
    <path d="M62 24V229" stroke="#f0d29f" stroke-width="4" opacity="0.32"/>
    <path d="M76 47H125M75 203H126" stroke="#f7dfb1" stroke-width="3" stroke-linecap="round" opacity="0.27"/>
    <path d="M35 33C47 26 50 41 50 60V202C50 219 44 228 35 222V33Z" fill="#000000" opacity="0.18"/>
    <circle cx="98" cy="98" r="44" fill="#0e090e" opacity="0.62"/>
    <circle cx="98" cy="98" r="36" stroke="${book.metal}" stroke-width="5" opacity="0.72"/>
    <circle cx="98" cy="98" r="27" fill="url(#${safeId}-gem)" opacity="0.18"/>
    ${iconMarkup(book.icon, book.accent)}
    <path d="M41 183H55V236H41V183Z" fill="${book.accent}"/>
    <path d="M41 183H55V236H41V183Z" fill="#ffffff" opacity="0.12"/>
    ${corner(29, 15, book.metal)}
    ${corner(124, 15, book.metal)}
    ${corner(29, 210, book.metal)}
    ${corner(124, 210, book.metal)}
    <path d="M76 160H121" stroke="${book.metal}" stroke-width="2" opacity="0.36"/>
    <text x="99" y="181" text-anchor="middle" fill="#f6ddb0" font-family="Georgia, serif" font-size="14" font-weight="700" letter-spacing="1.2">${book.label}</text>
    <path d="M39 17H130C138 17 144 23 144 31V217C144 225 138 232 130 232H41" stroke="#fff0c2" stroke-width="2.4" opacity="0.2"/>
  </g>
</svg>
`;
}

function corner(x, y, metal) {
  return `<path d="M${x} ${y}H${x + 22}V${y + 10}C${x + 47} ${y + 10} ${x + 35} ${y + 22} ${x + 35} ${y + 22}H${x}V${y}Z" fill="${metal}" opacity="0.9"/>
    <circle cx="${x + 9}" cy="${y + 9}" r="3.2" fill="#6d5d4c" opacity="0.72"/>`;
}

function iconMarkup(icon, accent) {
  switch (icon) {
    case 'drop':
      return `<path d="M94 55C105 70 114 82 114 96C114 109 105 119 94 119C83 119 74 109 74 96C74 82 83 70 94 55Z" fill="${accent}"/>
      <path d="M90 73C84 83 81 90 82 97" stroke="#ffffff" stroke-width="3" opacity="0.34" stroke-linecap="round"/>`;
    case 'coil':
      return `<path d="M111 96C111 108 101 117 89 117C78 117 70 109 70 99C70 88 79 80 90 80C100 80 107 87 107 96C107 104 101 110 92 110C85 110 80 105 80 99C80 93 85 89 91 89C96 89 100 92 100 97" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>`;
    case 'spark':
      return `<path d="M94 51L105 82L136 93L105 104L94 135L83 104L52 93L83 82L94 51Z" fill="${accent}"/>
      <path d="M94 71L101 89L119 93L101 99L94 117L87 99L69 93L87 89L94 71Z" fill="#fff2ff" opacity="0.45"/>`;
    case 'leaf':
      return `<path d="M127 70C92 69 66 86 63 119C98 122 124 104 127 70Z" fill="${accent}"/>
      <path d="M67 116C80 101 96 89 121 73" stroke="#17351f" stroke-width="5" stroke-linecap="round" opacity="0.5"/>`;
    case 'tower':
      return `<path d="M65 122H123L113 69H75L65 122Z" fill="${accent}"/>
      <path d="M73 69V55H84V69M91 69V55H102V69M109 69V55H120V69" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>
      <path d="M84 122V96H104V122" fill="#5b321d" opacity="0.62"/>`;
    case 'card':
      return `<rect x="68" y="60" width="52" height="66" rx="7" fill="${accent}"/>
      <rect x="78" y="50" width="52" height="66" rx="7" fill="#f2dfbd" opacity="0.9"/>
      <path d="M104 66C113 77 121 86 121 97C121 108 113 116 104 116C95 116 87 108 87 97C87 86 95 77 104 66Z" fill="#17351f" opacity="0.82"/>`;
    case 'number':
      return `<text x="94" y="114" text-anchor="middle" fill="${accent}" font-family="Georgia, serif" font-size="74" font-weight="700">#</text>`;
    case 'pickaxe':
      return `<path d="M70 79C93 58 117 57 132 67C113 70 99 80 84 99L70 79Z" fill="${accent}"/>
      <path d="M78 121L119 77" stroke="#f0d7aa" stroke-width="10" stroke-linecap="round"/>
      <path d="M78 121L119 77" stroke="#5b321d" stroke-width="5" stroke-linecap="round"/>`;
    case 'target':
      return `<circle cx="94" cy="94" r="34" stroke="${accent}" stroke-width="7"/>
      <circle cx="94" cy="94" r="20" stroke="${accent}" stroke-width="6" opacity="0.78"/>
      <circle cx="94" cy="94" r="7" fill="${accent}"/>`;
    case 'slime':
      return `<path d="M63 109C63 88 76 69 94 69C112 69 125 88 125 109C125 123 112 130 94 130C76 130 63 123 63 109Z" fill="${accent}"/>
      <circle cx="84" cy="105" r="5" fill="#17351f" opacity="0.68"/>
      <circle cx="104" cy="105" r="5" fill="#17351f" opacity="0.68"/>
      <path d="M85 117C92 123 101 123 108 117" stroke="#17351f" stroke-width="4" stroke-linecap="round" opacity="0.48"/>`;
  }
}

function makeContactSheet() {
  const width = 1030;
  const height = 580;
  const cells = books.map((book, index) => {
    const col = index % 5;
    const row = Math.floor(index / 5);
    const x = 30 + col * 198;
    const y = 30 + row * 270;
    return `<g transform="translate(${x} ${y})">
      <rect x="0" y="0" width="182" height="252" rx="14" fill="#151014"/>
      <image href="${book.id}.svg" x="-4" y="0" width="190" height="252"/>
    </g>`;
  }).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#09070a"/>
  ${cells}
</svg>
`;
}

function makeShelfSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="560" viewBox="0 0 760 560" fill="none">
  <defs>
    <linearGradient id="shelfOuter" x1="42" y1="12" x2="698" y2="548" gradientUnits="userSpaceOnUse">
      <stop stop-color="#a76838"/>
      <stop offset="0.42" stop-color="#63351f"/>
      <stop offset="1" stop-color="#2b1711"/>
    </linearGradient>
    <linearGradient id="shelfInner" x1="90" y1="66" x2="650" y2="500" gradientUnits="userSpaceOnUse">
      <stop stop-color="#3b2018"/>
      <stop offset="0.55" stop-color="#21110e"/>
      <stop offset="1" stop-color="#150b0a"/>
    </linearGradient>
    <linearGradient id="shelfBeam" x1="70" y1="0" x2="690" y2="42" gradientUnits="userSpaceOnUse">
      <stop stop-color="#b97942"/>
      <stop offset="0.55" stop-color="#7b4326"/>
      <stop offset="1" stop-color="#4a271b"/>
    </linearGradient>
    <filter id="shelfShadow" x="0" y="0" width="760" height="560" filterUnits="userSpaceOnUse">
      <feDropShadow dx="14" dy="18" stdDeviation="13" flood-color="#000" flood-opacity="0.46"/>
    </filter>
    <filter id="woodNoise" x="24" y="10" width="712" height="528" filterUnits="userSpaceOnUse">
      <feTurbulence type="fractalNoise" baseFrequency="0.035 0.22" numOctaves="4" seed="42"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="table" tableValues="0 0.16"/></feComponentTransfer>
      <feBlend in2="SourceGraphic" mode="multiply"/>
    </filter>
    <radialGradient id="warmBack" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(381 258) rotate(90) scale(293 346)">
      <stop stop-color="#402015"/>
      <stop offset="1" stop-color="#150b0a"/>
    </radialGradient>
  </defs>
  <g>
    <path d="M61 30C61 18 71 8 83 8H680C694 8 705 19 705 33V512C705 526 694 537 680 537H82C70 537 60 527 60 515L61 30Z" fill="#120b09" opacity="0.65"/>
    <path d="M50 35C50 21 61 10 75 10H681C695 10 706 21 706 35V505C706 519 695 530 681 530H75C61 530 50 519 50 505V35Z" fill="url(#shelfOuter)" filter="url(#woodNoise)"/>
    <path d="M95 75H662V486H95V75Z" fill="url(#warmBack)"/>
    <path d="M100 82H657V480H100V82Z" fill="url(#shelfInner)" opacity="0.82"/>

    <path d="M75 33H681V68H75V33Z" fill="url(#shelfBeam)"/>
    <path d="M75 486H681V520H75V486Z" fill="url(#shelfBeam)"/>
    <path d="M76 67H112V489H76V67Z" fill="url(#shelfBeam)"/>
    <path d="M644 67H680V489H644V67Z" fill="url(#shelfBeam)"/>
    <path d="M112 207H644V236H112V207Z" fill="url(#shelfBeam)"/>
    <path d="M112 350H644V379H112V350Z" fill="url(#shelfBeam)"/>

    <path d="M118 84H638" stroke="#d49455" stroke-width="4" opacity="0.28"/>
    <path d="M118 213H638M118 356H638M118 493H638" stroke="#f0b06c" stroke-width="4" opacity="0.25"/>
    <path d="M90 72V486M659 72V486" stroke="#2b160e" stroke-width="8" opacity="0.48"/>

    ${metalPlate(72, 200)}
    ${metalPlate(642, 200)}
    ${metalPlate(72, 343)}
    ${metalPlate(642, 343)}
    ${metalPlate(72, 482)}
    ${metalPlate(642, 482)}

    <path d="M92 39C185 57 270 30 377 49C484 68 578 35 672 52" stroke="#dba066" stroke-width="3" opacity="0.18"/>
    <path d="M102 507C193 493 300 517 395 503C501 486 590 511 667 498" stroke="#2a140e" stroke-width="5" opacity="0.35"/>
    <path d="M50 35C50 21 61 10 75 10H681C695 10 706 21 706 35V505C706 519 695 530 681 530H75C61 530 50 519 50 505V35Z" stroke="#d49a62" stroke-width="5" opacity="0.72"/>
    <path d="M63 42C63 30 73 22 84 22H672C684 22 694 32 694 44V494" stroke="#ffdaa0" stroke-width="2" opacity="0.22"/>
  </g>
</svg>`;
}

function metalPlate(x, y) {
  return `<g opacity="0.95">
    <rect x="${x}" y="${y}" width="54" height="31" rx="6" fill="#c9b89f"/>
    <rect x="${x + 4}" y="${y + 4}" width="46" height="23" rx="4" fill="#aa9983" opacity="0.38"/>
    <circle cx="${x + 16}" cy="${y + 16}" r="4" fill="#6b6258"/>
    <circle cx="${x + 38}" cy="${y + 16}" r="4" fill="#6b6258"/>
  </g>`;
}
