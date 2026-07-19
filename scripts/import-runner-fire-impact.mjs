#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
  copyFileSync,
  cpSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = resolve(process.argv[2] ?? '');
if (!source) {
  throw new Error('Usage: node scripts/import-runner-fire-impact.mjs <unitypackage>');
}

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = join(projectRoot, 'exports', 'runner', 'fire-impact');
const unpackRoot = mkdtempSync(join(tmpdir(), 'runner-fire-impact-'));
const selectedPrefab = 'Assets/Low Poly Fire Particles/Prefabs/Yellow-FireWood.prefab';

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function unityEntryForPath(pathname) {
  for (const entry of readdirSync(unpackRoot)) {
    const entryRoot = join(unpackRoot, entry);
    try {
      if (readFileSync(join(entryRoot, 'pathname'), 'utf8').trim() === pathname) {
        return entryRoot;
      }
    } catch {
      // Unity folders without a pathname are ignored.
    }
  }
  throw new Error(`Missing Unity package entry: ${pathname}`);
}

function scalarAfter(sourceText, label) {
  const match = sourceText.match(new RegExp(`${label}:\\r?\\n(?:.*\\r?\\n){0,5}?\\s+scalar: ([^\\r\\n]+)`));
  if (!match) throw new Error(`Missing ${label} scalar in Yellow-FireWood.prefab`);
  return Number(match[1]);
}

try {
  execFileSync('tar', ['-xzf', source, '-C', unpackRoot]);
  const prefabEntry = unityEntryForPath(selectedPrefab);
  const materialEntry = unityEntryForPath('Assets/Low Poly Fire Particles/Materials/FireMaterial.mat');
  const prefab = readFileSync(join(prefabEntry, 'asset'), 'utf8');
  if (!prefab.includes('m_Name: Yellow-FireWood') || !prefab.includes('m_Mesh: {fileID: 10202')) {
    throw new Error('Yellow-FireWood no longer uses the expected low-poly Unity mesh');
  }

  mkdirSync(outputRoot, { recursive: true });
  copyFileSync(source, join(outputRoot, 'low-poly-fire-particles.unitypackage'));
  copyFileSync(join(prefabEntry, 'asset'), join(outputRoot, 'Yellow-FireWood.prefab'));
  copyFileSync(join(materialEntry, 'asset'), join(outputRoot, 'FireMaterial.mat'));
  cpSync(join(prefabEntry, 'preview.png'), join(outputRoot, 'yellow-fire-preview.jpg'));

  const manifest = {
    sourceFile: basename(source),
    sourceBytes: readFileSync(source).byteLength,
    sourceSha256: sha256(source),
    selectedPrefab,
    particleMesh: 'Unity built-in low-poly mesh 10202',
    startLifetimeSeconds: scalarAfter(prefab, 'startLifetime'),
    startSpeed: scalarAfter(prefab, 'startSpeed'),
    startSize: scalarAfter(prefab, 'startSize'),
    emissionPerSecond: scalarAfter(prefab, 'rateOverTime'),
    coneAngleDegrees: 25,
    gradient: ['#ffffff', '#ffef38', '#ffcd00', '#ff7700', '#ff4500'],
    runtimeAdaptation: {
      mode: 'one-shot impact burst',
      lifetimeMs: 460,
      particlesPerImpact: 9,
      maxActiveImpacts: 24,
      geometry: 'instanced low-poly cubes',
    },
  };
  writeFileSync(join(outputRoot, 'source-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`RUNNER_FIRE_IMPACT_IMPORT=${JSON.stringify(manifest)}`);
} finally {
  rmSync(unpackRoot, { recursive: true, force: true });
}
