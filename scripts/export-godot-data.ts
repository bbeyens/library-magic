import { copyFile, mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { books } from '../src/game/content/books';
import { forbiddenGrimoireSeals } from '../src/game/content/forbiddenGrimoire';
import { runeWords } from '../src/game/content/runeWords';

const repoRoot = process.cwd();
const godotRoot = path.join(repoRoot, 'godot');
const dataRoot = path.join(godotRoot, 'data');
const assetRoot = path.join(godotRoot, 'assets');

const copiedRuntimePaths = [
  'library',
  'fonts',
  'blackjack',
  'Crystal/Crystal.png',
  'Crystal/Crystal.json',
  'Crystal/crystal-cover-rock.png',
  'Crystal/companions',
  'Crystal/cursors',
  'Crystal/gems',
  'Crystal/orbs',
  'Snake dragon/Snake sprite.png',
  'Snake dragon/crops',
  'Snake dragon/food',
  'td/Map TD .png',
  'td/Map TD .tmj',
  'td/effects',
  'td/enemies',
  'td/hud',
  'td/ice',
  'td/icons',
  'td/lightning',
  'td/orb',
  'td/tiled/exports',
  'td/tiled/reference',
  'td/tiles',
] as const;

const spriterrificRuntimeExports = [
  'crystal/idle-s/export',
  'crystal/relic-idle-s/export',
  'crystal/relic-use-s/export',
  'crystal/use-s-v2/export',
  'slime-trainer/monsters/dust-imp/export',
  'slime-trainer/monsters/ink-mite/export',
  'slime-trainer/monsters/moss-spine/export',
  'slime-trainer/monsters/thorn-blob/export',
  'slime-trainer/slime/idle/export',
  'snake/idle-s/export',
  'snake/use-s/export',
  'wand/arcane-wand/export',
] as const;

const allowedAssetExtensions = new Set(['.gif', '.jpg', '.jpeg', '.json', '.png', '.svg', '.tmj', '.ttf']);

async function main(): Promise<void> {
  await rm(dataRoot, { recursive: true, force: true });
  await rm(assetRoot, { recursive: true, force: true });
  await mkdir(dataRoot, { recursive: true });
  await mkdir(assetRoot, { recursive: true });

  await writeJson('books.json', books);
  await writeJson('forbidden_grimoire_seals.json', forbiddenGrimoireSeals);
  await writeJson('rune_words.json', runeWords);
  await copyCuratedAssets();
  await writeJson('migration_manifest.json', {
    generatedAt: new Date().toISOString(),
    source: {
      content: ['src/game/content/books.ts', 'src/game/content/forbiddenGrimoire.ts', 'src/game/content/runeWords.ts'],
      assets: 'public/assets',
    },
    target: {
      data: 'godot/data',
      assets: 'godot/assets',
    },
    renderer: 'mobile',
    note: 'The TypeScript game remains the source of truth until each Godot subsystem reaches parity.',
    copiedRuntimePaths,
    spriterrificRuntimeExports,
  });

  console.log(`Exported Godot data and curated assets to ${path.relative(repoRoot, godotRoot)}`);
}

async function writeJson(filename: string, value: unknown): Promise<void> {
  await writeFile(path.join(dataRoot, filename), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function copyCuratedAssets(): Promise<void> {
  for (const sourcePath of copiedRuntimePaths) {
    await copyIfExists(path.join(repoRoot, 'public/assets', sourcePath), path.join(assetRoot, sourcePath));
  }

  for (const exportPath of spriterrificRuntimeExports) {
    const source = path.join(repoRoot, 'public/assets/spriterrific', exportPath);
    const target = path.join(assetRoot, 'spriterrific', exportPath);
    await copyRuntimeExport(source, target);
  }
}

async function copyRuntimeExport(source: string, target: string): Promise<void> {
  try {
    const entries = await readdir(source);
    await mkdir(target, { recursive: true });
    for (const entry of entries) {
      if (!['manifest.json', 'spritesheet.png', 'spritesheet.clean.png', 'preview.gif'].includes(entry)) {
        continue;
      }
      await copyIfExists(path.join(source, entry), path.join(target, entry));
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }
}

async function copyIfExists(source: string, target: string): Promise<void> {
  try {
    const sourceStat = await stat(source);
    if (sourceStat.isDirectory()) {
      await copyDirectory(source, target);
      return;
    }
    if (!isAllowedAssetFile(source)) {
      return;
    }
    await mkdir(path.dirname(target), { recursive: true });
    await copyFile(source, target);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }
}

async function copyDirectory(source: string, target: string): Promise<void> {
  const entries = await readdir(source, { withFileTypes: true });
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);
    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, targetPath);
      continue;
    }
    if (!entry.isFile() || !isAllowedAssetFile(entry.name)) {
      continue;
    }
    await mkdir(path.dirname(targetPath), { recursive: true });
    await copyFile(sourcePath, targetPath);
  }
}

function isAllowedAssetFile(filename: string): boolean {
  return allowedAssetExtensions.has(path.extname(filename).toLowerCase());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
