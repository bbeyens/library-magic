import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { deflateSync } from 'node:zlib';

const frameWidth = 96;
const frameHeight = 32;
const frames = 4;
const outDir = 'public/assets/spriterrific/wand/arcane-wand/export';
const outPath = join(outDir, 'spritesheet.png');

mkdirSync(outDir, { recursive: true });

const width = frameWidth * frames;
const height = frameHeight;
const pixels = new Uint8Array(width * height * 4);

const palette = {
  outline: '#2a1515',
  outlineSoft: '#4a2522',
  woodDark: '#6b3425',
  wood: '#a65d34',
  woodLight: '#e2a15a',
  goldDark: '#8b5a24',
  gold: '#d59a3c',
  goldLight: '#ffe09a',
  crystalDark: '#1b6f9d',
  crystal: '#45c8ff',
  crystalLight: '#d7fbff',
  glow: '#9feaff',
  white: '#ffffff',
  shadow: 'rgba(38, 18, 18, 0.36)',
};

for (let frame = 0; frame < frames; frame += 1) {
  drawFrame(frame);
}

writePng(outPath, width, height, pixels);
writeFileSync(
  join(outDir, 'manifest.json'),
  JSON.stringify(
    {
      version: 1,
      generator: 'scripts/generate-wand-sprite.mjs',
      action: 'cast',
      direction: 'e',
      mode: 'deterministic-pixel-art',
      spritesheet: 'spritesheet.png',
      frameWidth,
      frameHeight,
      columns: frames,
      rows: 1,
      frames,
      fps: 12,
      publicAssetReady: true,
    },
    null,
    2,
  ),
);

function drawFrame(frame) {
  const x0 = frame * frameWidth;
  const glowSize = frame === 0 ? 0 : frame === 1 ? 1 : frame === 2 ? 2 : 1;
  const lift = frame === 1 ? -1 : frame === 2 ? -2 : frame === 3 ? -1 : 0;

  rect(x0 + 9, 22 + lift, 62, 2, palette.shadow);
  rect(x0 + 3, 13 + lift, 10, 7, palette.outline);
  rect(x0 + 5, 11 + lift, 9, 11, palette.outline);
  rect(x0 + 6, 12 + lift, 7, 9, palette.woodDark);
  rect(x0 + 8, 13 + lift, 5, 5, palette.wood);
  px(x0 + 10, 13 + lift, palette.woodLight);

  rect(x0 + 13, 14 + lift, 56, 6, palette.outline);
  rect(x0 + 14, 14 + lift, 54, 4, palette.wood);
  rect(x0 + 15, 15 + lift, 50, 1, palette.woodLight);
  rect(x0 + 16, 18 + lift, 51, 2, palette.woodDark);
  rect(x0 + 20, 12 + lift, 5, 10, palette.outlineSoft);
  rect(x0 + 21, 12 + lift, 3, 10, palette.gold);
  rect(x0 + 22, 13 + lift, 1, 3, palette.goldLight);
  rect(x0 + 45, 12 + lift, 5, 10, palette.outlineSoft);
  rect(x0 + 46, 12 + lift, 3, 10, palette.gold);
  rect(x0 + 47, 13 + lift, 1, 3, palette.goldLight);

  rect(x0 + 66, 13 + lift, 8, 8, palette.outline);
  rect(x0 + 67, 14 + lift, 6, 6, palette.goldDark);
  rect(x0 + 69, 14 + lift, 3, 3, palette.goldLight);

  diamond(x0 + 80, 16 + lift, 10, palette.outline);
  diamond(x0 + 80, 16 + lift, 7, palette.crystalDark);
  diamond(x0 + 79, 15 + lift, 5, palette.crystal);
  px(x0 + 77, 13 + lift, palette.crystalLight);
  px(x0 + 82, 18 + lift, palette.crystalLight);

  if (glowSize > 0) {
    plus(x0 + 87, 16 + lift, glowSize, frame === 2 ? palette.white : palette.glow);
    px(x0 + 85, 11 + lift, palette.glow);
    px(x0 + 90, 20 + lift, palette.glow);
  }
}

function diamond(cx, cy, radius, color) {
  for (let y = -radius; y <= radius; y += 1) {
    const span = radius - Math.abs(y);
    rect(cx - span, cy + y, span * 2 + 1, 1, color);
  }
}

function plus(cx, cy, radius, color) {
  rect(cx - radius, cy, radius * 2 + 1, 1, color);
  rect(cx, cy - radius, 1, radius * 2 + 1, color);
}

function rect(x, y, w, h, color) {
  for (let yy = y; yy < y + h; yy += 1) {
    for (let xx = x; xx < x + w; xx += 1) {
      px(xx, yy, color);
    }
  }
}

function px(x, y, color) {
  if (x < 0 || y < 0 || x >= width || y >= height) {
    return;
  }
  const [r, g, b, a] = rgba(color);
  const index = (Math.floor(y) * width + Math.floor(x)) * 4;
  pixels[index] = r;
  pixels[index + 1] = g;
  pixels[index + 2] = b;
  pixels[index + 3] = a;
}

function rgba(color) {
  if (color.startsWith('rgba')) {
    const [r, g, b, a] = color
      .slice(5, -1)
      .split(',')
      .map((part) => part.trim());
    return [Number(r), Number(g), Number(b), Math.round(Number(a) * 255)];
  }
  const hex = color.slice(1);
  return [Number.parseInt(hex.slice(0, 2), 16), Number.parseInt(hex.slice(2, 4), 16), Number.parseInt(hex.slice(4, 6), 16), 255];
}

function writePng(path, pngWidth, pngHeight, rgbaPixels) {
  mkdirSync(dirname(path), { recursive: true });
  const scanlines = Buffer.alloc((pngWidth * 4 + 1) * pngHeight);
  for (let y = 0; y < pngHeight; y += 1) {
    const rowStart = y * (pngWidth * 4 + 1);
    scanlines[rowStart] = 0;
    scanlines.set(rgbaPixels.subarray(y * pngWidth * 4, (y + 1) * pngWidth * 4), rowStart + 1);
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = chunk('IHDR', Buffer.from([pngWidth >> 24, pngWidth >> 16, pngWidth >> 8, pngWidth, pngHeight >> 24, pngHeight >> 16, pngHeight >> 8, pngHeight, 8, 6, 0, 0, 0]));
  const idat = chunk('IDAT', deflateSync(scanlines));
  const iend = chunk('IEND', Buffer.alloc(0));
  writeFileSync(path, Buffer.concat([signature, ihdr, idat, iend]));
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}
