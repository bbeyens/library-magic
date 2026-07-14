import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Refined pixel-art terrain textures for the 3D mine.
// Each sprite tier gets a 16x16 top face plus two vertically-squished 16x8 side
// strips (the block layers render half-height, so 16x8 keeps texels square).
// Everything is procedural + seeded so re-running produces byte-identical PNGs.

const TOP_SIZE = 16;
const SIDE_HEIGHT = 8;
const OUT_ROOT = 'public/assets/mine/materials';

// --- deterministic PRNG (mulberry32) ---------------------------------------
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --- tiny RGBA PNG encoder --------------------------------------------------
const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buffer) {
  let crc = 0xffffffff;
  for (let i = 0; i < buffer.length; i += 1) {
    crc = crcTable[(crc ^ buffer[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBytes, data]);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([length, body, crc]);
}

// pixels: Uint8ClampedArray/Array of length width*height*4 (RGBA rows top->bottom)
function encodePng(width, height, pixels) {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0; // filter: none
    for (let x = 0; x < stride; x += 1) {
      raw[y * (stride + 1) + 1 + x] = pixels[y * stride + x];
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// --- colour helpers ---------------------------------------------------------
function hexToRgb(hex) {
  const value = hex.replace('#', '');
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ];
}

// Expand a weighted palette into a flat pick-list.
function weighted(entries) {
  const bag = [];
  for (const [hex, weight] of entries) {
    const rgb = hexToRgb(hex);
    for (let i = 0; i < weight; i += 1) {
      bag.push(rgb);
    }
  }
  return bag;
}

function scale(rgb, factor) {
  return [
    Math.max(0, Math.min(255, Math.round(rgb[0] * factor))),
    Math.max(0, Math.min(255, Math.round(rgb[1] * factor))),
    Math.max(0, Math.min(255, Math.round(rgb[2] * factor))),
  ];
}

// --- noise fields -----------------------------------------------------------
// Per-texel weighted noise, matching the blocky reference art (1 texel = 1 chunk).
function noiseGrid(size, palette, rng) {
  const grid = [];
  for (let i = 0; i < size * size; i += 1) {
    grid.push(palette[Math.floor(rng() * palette.length)]);
  }
  return grid;
}

// Low-frequency blotch mask (bilinear-upsampled coarse noise) for moss patches.
function blotchMask(size, cells, threshold, rng) {
  const coarse = [];
  for (let i = 0; i < cells * cells; i += 1) {
    coarse.push(rng());
  }
  const sample = (cx, cy) => coarse[Math.min(cells - 1, cy) * cells + Math.min(cells - 1, cx)];
  const mask = new Array(size * size);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const gx = (x / (size - 1)) * (cells - 1);
      const gy = (y / (size - 1)) * (cells - 1);
      const x0 = Math.floor(gx);
      const y0 = Math.floor(gy);
      const fx = gx - x0;
      const fy = gy - y0;
      const top = sample(x0, y0) * (1 - fx) + sample(x0 + 1, y0) * fx;
      const bottom = sample(x0, y0 + 1) * (1 - fx) + sample(x0 + 1, y0 + 1) * fx;
      mask[y * size + x] = top * (1 - fy) + bottom * fy > threshold;
    }
  }
  return mask;
}

// Squish a 16x16 grid to 16x8 by averaging vertical texel pairs, then darken.
function toSideStrip(topGrid, factor) {
  const strip = [];
  for (let y = 0; y < SIDE_HEIGHT; y += 1) {
    for (let x = 0; x < TOP_SIZE; x += 1) {
      const a = topGrid[(y * 2) * TOP_SIZE + x];
      const b = topGrid[(y * 2 + 1) * TOP_SIZE + x];
      strip.push(scale([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2], factor));
    }
  }
  return strip;
}

function gridToRgba(width, height, grid) {
  const pixels = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < width * height; i += 1) {
    pixels[i * 4] = grid[i][0];
    pixels[i * 4 + 1] = grid[i][1];
    pixels[i * 4 + 2] = grid[i][2];
    pixels[i * 4 + 3] = 255;
  }
  return pixels;
}

// --- material definitions ---------------------------------------------------
const dirtPalette = weighted([
  ['#5f3a1c', 2],
  ['#6f4522', 3],
  ['#7f5228', 4],
  ['#925f30', 3],
  ['#a67240', 2],
  ['#b9884f', 1],
  ['#8f8a82', 1], // stray pebble
]);

const grassPalette = weighted([
  ['#45781f', 2],
  ['#548f28', 3],
  ['#63a833', 4],
  ['#71bd3f', 3],
  ['#7ecb4b', 1],
]);

const sandPalette = weighted([
  ['#c7b56c', 2],
  ['#d5c47c', 3],
  ['#e0d08b', 4],
  ['#ebdc9c', 3],
  ['#f4ebbc', 1],
]);

const cobblePalette = weighted([
  ['#5a5a5a', 2],
  ['#727272', 3],
  ['#888888', 4],
  ['#9d9d9d', 3],
  ['#b1b1b1', 2],
  ['#c3c3c3', 1],
]);

const mossPalette = weighted([
  ['#3e6128', 2],
  ['#4a7233', 3],
  ['#57843d', 3],
  ['#649048', 1],
]);

// Gray host rock the ore veins sit in (a touch lighter + smoother than cobble).
const oreStonePalette = weighted([
  ['#6f6f6f', 2],
  ['#828282', 4],
  ['#939393', 4],
  ['#a2a2a2', 3],
  ['#b0b0b0', 1],
]);

// Smooth bedrock (tier 6): tight mid-gray, barely any mortar contrast.
const stonePalette = weighted([
  ['#7c7c7c', 1],
  ['#8b8b8b', 3],
  ['#989898', 4],
  ['#a3a3a3', 4],
  ['#b0b0b0', 2],
]);

// Near-black basalt flecked with the odd violet crystal (tier 20).
const obsidianPalette = weighted([
  ['#0c0912', 5],
  ['#14101d', 4],
  ['#1c1526', 3],
  ['#291d3c', 2],
  ['#3d2a5e', 1],
  ['#5a2d9c', 1],
  ['#7a3fd0', 1],
]);

// An ore vein colour set: a bright highlight, a few mids, and a shadow.
function oreSet(highlight, mids, dark) {
  return {
    highlight: hexToRgb(highlight),
    mids: mids.map(hexToRgb),
    dark: hexToRgb(dark),
  };
}

const oreSets = {
  iron: oreSet('#f6ddc9', ['#e3ab82', '#d2966a', '#c9885a'], '#a86c44'),
  gold: oreSet('#fff4c2', ['#ffd21e', '#ffca00', '#f2b400'], '#c98a00'),
  ruby: oreSet('#ffd2d6', ['#ff3038', '#e01f2a', '#c8161f'], '#8f0f1a'),
  lapis: oreSet('#88b0ff', ['#2f6bff', '#1f52e0', '#1a45c0'], '#122f8f'),
  diamond: oreSet('#ffffff', ['#bff4fb', '#8fe8f2', '#6fdcea'], '#3fb8c8'),
  emerald: oreSet('#e0fce8', ['#3af07a', '#1fd45f', '#17b84c'], '#0d8f3c'),
};

// Scatter Minecraft-style 2x2 nuggets (one bright highlight cell each) into host rock.
function oreGrid(size, ore, clusters, rng) {
  const grid = noiseGrid(size, oreStonePalette, rng);
  const shape = [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ];
  for (let c = 0; c < clusters; c += 1) {
    const cx = 1 + Math.floor(rng() * (size - 3));
    const cy = 1 + Math.floor(rng() * (size - 3));
    const highlightCell = Math.floor(rng() * shape.length);
    shape.forEach(([dx, dy], cell) => {
      if (cell !== highlightCell && rng() < 0.14) {
        return; // ragged edge
      }
      const value =
        cell === highlightCell
          ? ore.highlight
          : rng() < 0.32
            ? ore.dark
            : ore.mids[Math.floor(rng() * ore.mids.length)];
      grid[(cy + dy) * size + (cx + dx)] = value;
    });
  }
  return grid;
}

// Solid mineral block: subtle noise + a beveled rim (bright top-left, dark bottom-right),
// with an optional radial darkening toward the centre for the gem blocks.
function solidGrid(size, palette, opts, rng) {
  const grid = noiseGrid(size, palette, rng);
  const radius = (size - 1) / 2;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      let factor = 1;
      if (x === 0 || y === 0) {
        factor = opts.highlight;
      } else if (x === size - 1 || y === size - 1) {
        factor = opts.shadow;
      }
      if (opts.radialCenter != null) {
        const dx = (x - radius) / radius;
        const dy = (y - radius) / radius;
        const r = Math.min(1, Math.hypot(dx, dy));
        factor *= opts.radialCenter + (1 - opts.radialCenter) * r;
      }
      grid[y * size + x] = scale(grid[y * size + x], factor);
    }
  }
  return grid;
}

const solidBlocks = {
  iron: { palette: weighted([['#e6e6e6', 4], ['#dcdcdc', 3], ['#efefef', 3], ['#d2d2d2', 2]]), opts: { highlight: 1.06, shadow: 0.84 } },
  gold: { palette: weighted([['#ffd21e', 4], ['#ffda45', 3], ['#f5c400', 3], ['#ecb800', 2]]), opts: { highlight: 1.08, shadow: 0.8 } },
  ruby: { palette: weighted([['#e01f2a', 4], ['#f03040', 3], ['#c8121f', 3], ['#d8202e', 2]]), opts: { highlight: 1.2, shadow: 0.82, radialCenter: 0.62 } },
  lapis: { palette: weighted([['#2150d8', 4], ['#2a5ee8', 3], ['#1a45c0', 3], ['#3466f0', 2]]), opts: { highlight: 1.12, shadow: 0.82 } },
  diamond: { palette: weighted([['#9fe9f2', 4], ['#b4f0f8', 3], ['#8adcea', 3], ['#c8f5fb', 2]]), opts: { highlight: 1.1, shadow: 0.82 } },
  emerald: { palette: weighted([['#1fc957', 4], ['#33d46a', 3], ['#17b84c', 3], ['#4ae07f', 2]]), opts: { highlight: 1.12, shadow: 0.8 } },
};

function oreMaterial(dir, seed, ore) {
  return {
    dir,
    seed,
    top: (rng) => oreGrid(TOP_SIZE, ore, 7, rng),
    side: (rng) => oreGrid(TOP_SIZE, ore, 6, rng),
  };
}

function solidMaterial(dir, seed, block) {
  return {
    dir,
    seed,
    top: (rng) => solidGrid(TOP_SIZE, block.palette, block.opts, rng),
    side: (rng) => solidGrid(TOP_SIZE, block.palette, block.opts, rng),
  };
}

// Each entry: dir + how to build the 16x16 top + the 16x16 side source grid.
const materials = [
  {
    dir: 'grass',
    seed: 0x91a1,
    top: (rng) => noiseGrid(TOP_SIZE, grassPalette, rng),
    side: (rng) => noiseGrid(TOP_SIZE, dirtPalette, rng), // grass block => dirt flanks
  },
  {
    dir: 'dirt',
    seed: 0x2b7d,
    top: (rng) => noiseGrid(TOP_SIZE, dirtPalette, rng),
    side: (rng) => noiseGrid(TOP_SIZE, dirtPalette, rng),
  },
  {
    dir: 'sand',
    seed: 0x5c3f,
    top: (rng) => noiseGrid(TOP_SIZE, sandPalette, rng),
    side: (rng) => noiseGrid(TOP_SIZE, sandPalette, rng),
  },
  {
    dir: 'mossy',
    seed: 0x7e02,
    top: (rng) => {
      const base = noiseGrid(TOP_SIZE, cobblePalette, rng);
      const mask = blotchMask(TOP_SIZE, 5, 0.55, rng);
      return base.map((rgb, i) => (mask[i] ? mossPalette[Math.floor(rng() * mossPalette.length)] : rgb));
    },
    side: (rng) => {
      const base = noiseGrid(TOP_SIZE, cobblePalette, rng);
      const mask = blotchMask(TOP_SIZE, 4, 0.62, rng);
      return base.map((rgb, i) => (mask[i] ? mossPalette[Math.floor(rng() * mossPalette.length)] : rgb));
    },
  },
  {
    dir: 'cobblestone',
    seed: 0x3af8,
    top: (rng) => noiseGrid(TOP_SIZE, cobblePalette, rng),
    side: (rng) => noiseGrid(TOP_SIZE, cobblePalette, rng),
  },
  {
    dir: 'stone',
    seed: 0x1d6c,
    top: (rng) => noiseGrid(TOP_SIZE, stonePalette, rng),
    side: (rng) => noiseGrid(TOP_SIZE, stonePalette, rng),
  },
  // Ore veins in host rock (tiers 8-13).
  oreMaterial('iron', 0x8f11, oreSets.iron),
  oreMaterial('gold', 0x9a22, oreSets.gold),
  oreMaterial('ruby', 0xab33, oreSets.ruby),
  oreMaterial('lapis', 0xbc44, oreSets.lapis),
  oreMaterial('diamond', 0xcd55, oreSets.diamond),
  oreMaterial('emerald', 0xde66, oreSets.emerald),
  // Solid mineral blocks (tiers 14-19).
  solidMaterial('iron_block', 0x1a01, solidBlocks.iron),
  solidMaterial('gold_block', 0x2b02, solidBlocks.gold),
  solidMaterial('ruby_block', 0x3c03, solidBlocks.ruby),
  solidMaterial('lapis_block', 0x4d04, solidBlocks.lapis),
  solidMaterial('diamond_block', 0x5e05, solidBlocks.diamond),
  solidMaterial('emerald_block', 0x6f06, solidBlocks.emerald),
  {
    dir: 'obsidian',
    seed: 0x0b51,
    top: (rng) => noiseGrid(TOP_SIZE, obsidianPalette, rng),
    side: (rng) => noiseGrid(TOP_SIZE, obsidianPalette, rng),
  },
];

const LEFT_SHADE = 0.9;
const RIGHT_SHADE = 0.8;

for (const material of materials) {
  const dir = join(OUT_ROOT, material.dir);
  mkdirSync(dir, { recursive: true });

  const topRng = mulberry32(material.seed);
  const topGrid = material.top(topRng);
  const sideGrid = material.side(topRng);

  writeFileSync(join(dir, 'top.png'), encodePng(TOP_SIZE, TOP_SIZE, gridToRgba(TOP_SIZE, TOP_SIZE, topGrid)));
  writeFileSync(
    join(dir, 'left.png'),
    encodePng(TOP_SIZE, SIDE_HEIGHT, gridToRgba(TOP_SIZE, SIDE_HEIGHT, toSideStrip(sideGrid, LEFT_SHADE))),
  );
  writeFileSync(
    join(dir, 'right.png'),
    encodePng(TOP_SIZE, SIDE_HEIGHT, gridToRgba(TOP_SIZE, SIDE_HEIGHT, toSideStrip(sideGrid, RIGHT_SHADE))),
  );

  console.log(`generated ${material.dir}/{top,left,right}.png`);
}

// --- TNT bomb block: cream-banded red crate with a fuse on top (Minecraft-style) ---
{
  const CREAM = hexToRgb('#d8c48c');
  const CREAM_D = hexToRgb('#bfa871');
  const RED = hexToRgb('#c0301f');
  const RED_D = hexToRgb('#9a2415');
  const RED_L = hexToRgb('#d8492f');
  const FUSE = hexToRgb('#221a12');
  const WHITE = hexToRgb('#f4ecd6');
  const rng = mulberry32(0x7717);
  const pick = (base, a, b) => (rng() < 0.42 ? a : rng() < 0.42 ? b : base);

  // TOP 16x16: RED crate face (so it reads as TNT from above, not sand) with a cream border
  // matching the sides, plus a lit fuse in the middle.
  const top = [];
  for (let y = 0; y < TOP_SIZE; y += 1) {
    for (let x = 0; x < TOP_SIZE; x += 1) {
      const border = x < 2 || y < 2 || x > 13 || y > 13;
      top.push(border ? pick(CREAM, CREAM_D, CREAM) : pick(RED, RED_D, RED_L));
    }
  }
  const setTop = (x, y, c) => { top[y * TOP_SIZE + x] = c; };
  // darker-red ring + dark fuse hole in the centre
  for (let y = 6; y <= 9; y += 1) for (let x = 6; x <= 9; x += 1) setTop(x, y, RED_D);
  setTop(7, 7, FUSE); setTop(8, 7, FUSE); setTop(7, 8, FUSE); setTop(8, 8, FUSE);
  // fuse curling out to a bright spark
  setTop(9, 5, FUSE); setTop(10, 4, FUSE); setTop(11, 4, RED_L); setTop(11, 3, WHITE);

  // SIDE 16x8: cream band, red middle with white "TNT", cream band. Built at final height
  // (no vertical squish) so the label stays crisp.
  const GLYPH_T = ['1111', '0110', '0110', '0110'];
  const GLYPH_N = ['1001', '1101', '1011', '1001'];
  const side = [];
  for (let y = 0; y < SIDE_HEIGHT; y += 1) {
    for (let x = 0; x < TOP_SIZE; x += 1) {
      let c;
      if (y === 0) c = CREAM;
      else if (y === 1 || y === 6) c = CREAM_D;
      else if (y === 7) c = CREAM;
      else c = pick(RED, RED_D, RED_L);
      side.push(c);
    }
  }
  const stamp = (gx, glyph) => {
    for (let ry = 0; ry < 4; ry += 1) for (let rx = 0; rx < 4; rx += 1) {
      if (glyph[ry][rx] === '1') side[(2 + ry) * TOP_SIZE + (gx + rx)] = WHITE;
    }
  };
  stamp(1, GLYPH_T); stamp(6, GLYPH_N); stamp(11, GLYPH_T);

  const dir = join(OUT_ROOT, 'tnt');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'top.png'), encodePng(TOP_SIZE, TOP_SIZE, gridToRgba(TOP_SIZE, TOP_SIZE, top)));
  writeFileSync(join(dir, 'left.png'), encodePng(TOP_SIZE, SIDE_HEIGHT, gridToRgba(TOP_SIZE, SIDE_HEIGHT, side.map((c) => scale(c, LEFT_SHADE)))));
  writeFileSync(join(dir, 'right.png'), encodePng(TOP_SIZE, SIDE_HEIGHT, gridToRgba(TOP_SIZE, SIDE_HEIGHT, side.map((c) => scale(c, RIGHT_SHADE)))));
  console.log('generated tnt/{top,left,right}.png');
}
