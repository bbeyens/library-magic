import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

function pngDimensions(path: URL): { width: number; height: number } {
  const bytes = readFileSync(path);
  assert.equal(bytes.toString('ascii', 1, 4), 'PNG', `${path.pathname} should be a PNG`);
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
  };
}

const terrainSource = readFileSync(new URL('../src/ui/miningThreeTerrain.ts', import.meta.url), 'utf8');
const faces = ['top', 'left', 'right'] as const;

// Every strata folder wired into the 3D terrain must ship pixel-native faces:
// a 16x16 top and two 16x8 side strips (the half-height layers keep texels square).
// One folder per sprite tier (grass..obsidian); coal keeps its hand-authored art.
const materialFolders = [
  'grass',
  'dirt',
  'sand',
  'mossy',
  'cobblestone',
  'stone',
  'coal',
  'iron',
  'gold',
  'ruby',
  'lapis',
  'diamond',
  'emerald',
  'iron_block',
  'gold_block',
  'ruby_block',
  'lapis_block',
  'diamond_block',
  'emerald_block',
  'obsidian',
] as const;

for (const folder of materialFolders) {
  for (const face of faces) {
    const assetPath = new URL(`../public/assets/mine/materials/${folder}/${face}.png`, import.meta.url);
    const expectedDimensions = face === 'top' ? { width: 16, height: 16 } : { width: 16, height: 8 };
    assert.deepEqual(pngDimensions(assetPath), expectedDimensions, `${folder}/${face} should stay pixel-native`);
  }
  // Each tier must be listed in the sprite -> folder table that the terrain textures from.
  assert.equal(
    terrainSource.includes(`'${folder}'`),
    true,
    `${folder} should be wired into the terrain sprite tier table`,
  );
}

// The terrain builds every face path from the folder name.
for (const face of faces) {
  assert.equal(terrainSource.includes('/assets/mine/materials/${folder}/' + `${face}.png`), true);
}

assert.equal(terrainSource.includes('texture.magFilter = NearestFilter;'), true);
assert.equal(terrainSource.includes('texture.minFilter = NearestFilter;'), true);
assert.equal(terrainSource.includes('texture.colorSpace = SRGBColorSpace;'), true);

console.log('miningTextureAssets ok');
