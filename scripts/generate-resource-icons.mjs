import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const outDir = 'public/assets/library/resources';
mkdirSync(outDir, { recursive: true });

const icons = [
  { id: 'mana', primary: '#78d4ff', secondary: '#1f558a', symbol: 'drop' },
  { id: 'scales', primary: '#a78cff', secondary: '#4b327a', symbol: 'scale' },
  { id: 'runes', primary: '#ed9fff', secondary: '#79358c', symbol: 'rune' },
  { id: 'spores', primary: '#91d980', secondary: '#385f2f', symbol: 'leaf' },
  { id: 'sigils', primary: '#ffc36e', secondary: '#875320', symbol: 'sigil' },
  { id: 'chips', primary: '#74d88f', secondary: '#276e3e', symbol: 'chip' },
  { id: 'fragments', primary: '#7ea4ff', secondary: '#2a477f', symbol: 'fragment' },
  { id: 'minerals', primary: '#d69a58', secondary: '#684022', symbol: 'mineral' },
  { id: 'marks', primary: '#ff7a80', secondary: '#7e2930', symbol: 'target' },
  { id: 'gels', primary: '#7df0a3', secondary: '#2e7650', symbol: 'gel' },
];

function symbolShape(symbol) {
  switch (symbol) {
    case 'drop':
      return '<path d="M50 19C40 33 32 43 32 57c0 13 10 23 22 23s22-10 22-23c0-14-10-25-26-38Z" fill="url(#paint)" stroke="#f4fbff" stroke-width="4"/><path d="M44 61c7 5 17 1 20-8" fill="none" stroke="#d8f4ff" stroke-width="4" stroke-linecap="round" opacity=".55"/>';
    case 'scale':
      return '<path d="M22 60h56M50 24v44M31 36l-12 22h24L31 36Zm38 0L57 58h24L69 36ZM36 32c8-6 20-6 28 0" fill="none" stroke="url(#paint)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="50" cy="24" r="7" fill="url(#paint)" stroke="#f4eaff" stroke-width="3"/>';
    case 'rune':
      return '<path d="M50 16 61 40l25 10-25 10-11 24-11-24-25-10 25-10 11-24Z" fill="url(#paint)" stroke="#fff1ff" stroke-width="4"/><circle cx="50" cy="50" r="10" fill="none" stroke="#fff1ff" stroke-width="4" opacity=".75"/>';
    case 'leaf':
      return '<path d="M76 22C42 24 24 42 25 76c33 0 52-20 51-54Z" fill="url(#paint)" stroke="#f0ffe9" stroke-width="4"/><path d="M29 72c15-19 28-30 44-45M43 57l-15-2M55 45l-4-15" fill="none" stroke="#f0ffe9" stroke-width="4" stroke-linecap="round"/>';
    case 'sigil':
      return '<circle cx="50" cy="50" r="30" fill="url(#paint)" stroke="#fff0c8" stroke-width="4"/><path d="M50 22v56M22 50h56M30 30l40 40M70 30 30 70" stroke="#fff0c8" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="50" r="10" fill="#fff0c8"/>';
    case 'chip':
      return '<circle cx="50" cy="50" r="31" fill="url(#paint)" stroke="#efffec" stroke-width="4"/><circle cx="50" cy="50" r="17" fill="none" stroke="#efffec" stroke-width="5"/><path d="M50 19v15M50 66v15M19 50h15M66 50h15" stroke="#efffec" stroke-width="6" stroke-linecap="round"/>';
    case 'fragment':
      return '<path d="M50 15 72 36 65 73 37 85 24 47 50 15Z" fill="url(#paint)" stroke="#edf3ff" stroke-width="4"/><path d="M50 15 48 82M26 48l40-12" stroke="#edf3ff" stroke-width="3" opacity=".5"/>';
    case 'mineral':
      return '<path d="M24 73 38 32l15-13 22 28 1 26H24Z" fill="url(#paint)" stroke="#fff1d8" stroke-width="4" stroke-linejoin="round"/><path d="M38 32 52 73M53 19 52 73M75 47 52 73" stroke="#fff1d8" stroke-width="3" opacity=".55"/>';
    case 'target':
      return '<circle cx="50" cy="50" r="31" fill="none" stroke="url(#paint)" stroke-width="8"/><circle cx="50" cy="50" r="17" fill="none" stroke="#ffe5e5" stroke-width="6"/><circle cx="50" cy="50" r="6" fill="#ffe5e5"/><path d="M70 30 83 17M75 17h8v8" stroke="#ffe5e5" stroke-width="5" stroke-linecap="round"/>';
    case 'gel':
      return '<path d="M25 64c0-18 9-39 25-39s25 21 25 39c0 12-9 19-25 19s-25-7-25-19Z" fill="url(#paint)" stroke="#ecfff0" stroke-width="4"/><circle cx="42" cy="56" r="4" fill="#1f6143"/><circle cx="58" cy="56" r="4" fill="#1f6143"/><path d="M42 68c5 4 12 4 16 0" stroke="#1f6143" stroke-width="4" stroke-linecap="round" fill="none"/>';
    default:
      return '';
  }
}

function iconSvg(icon) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <radialGradient id="bg" cx="35%" cy="25%" r="72%">
      <stop offset="0" stop-color="#4d3428"/>
      <stop offset="1" stop-color="#140d10"/>
    </radialGradient>
    <linearGradient id="paint" x1="24" x2="78" y1="18" y2="84" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${icon.primary}"/>
      <stop offset="1" stop-color="${icon.secondary}"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000" flood-opacity=".45"/>
    </filter>
  </defs>
  <circle cx="50" cy="50" r="45" fill="url(#bg)" stroke="#c08b5b" stroke-width="4"/>
  <g filter="url(#shadow)">${symbolShape(icon.symbol)}</g>
</svg>
`;
}

for (const icon of icons) {
  writeFileSync(join(outDir, `${icon.id}.svg`), iconSvg(icon));
}
