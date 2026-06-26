type TiledTileLayer = {
  name: string;
  type: 'tilelayer';
  width: number;
  height: number;
  visible?: boolean;
  opacity?: number;
  data: number[];
};

type TiledMapFile = {
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  layers: TiledTileLayer[];
  tilesets: TiledTileset[];
};

type TiledTileset = {
  firstgid: number;
  source?: string;
  name?: string;
  tilewidth?: number;
  tileheight?: number;
  spacing?: number;
  margin?: number;
  columns?: number;
  tilecount?: number;
  imagewidth?: number;
  imageheight?: number;
  image?: string;
  tiles?: Array<{
    id: number;
    animation?: Array<{
      tileid: number;
      duration: number;
    }>;
  }>;
};

type TilesetDefinition = {
  firstgid: number;
  name: string;
  tileWidth: number;
  tileHeight: number;
  spacing: number;
  margin: number;
  columns: number;
  tileCount: number;
  imageWidth: number;
  imageHeight: number;
  imageUrl: string;
  fallbackAnimation?: TilesetAnimationFrame[];
  animations: Map<number, TilesetAnimation>;
};

type TilesetAnimationFrame = {
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  duration?: number;
  sourceOffsetX?: number;
  sourceOffsetY?: number;
};

type TilesetAnimation = {
  frames: TilesetAnimationFrame[];
  duration: number;
};

const DEFENSE_MAP_URL = '/assets/td/tiled/exports/bastion.json';
const DEFENSE_MAP_BACKGROUND_URL = '/assets/td/tiled/reference/bastion.png';
const GID_FLIP_HORIZONTAL = 0x80000000;
const GID_FLIP_VERTICAL = 0x40000000;
const GID_FLIP_DIAGONAL = 0x20000000;
const GID_MASK = 0x1fffffff;
const DEFENSE_FOREGROUND_LAYER_NAMES = new Set([
  'Rock',
  'Mousse arbre/ tente/ fleur',
  'Flag/camp',
  'Forest',
  'Forest 2 ombre',
]);
const DEFENSE_NON_OCCLUDING_OBJECT_TILES = new Set([2006, 2007, 2012, 2013, 2042, 2043, 2048, 2049, 2054, 2055, 2060, 2061, 2067, 2072, 2073]);

type TileRenderMode = 'animated-only' | 'all';

const TILESET_MANIFEST: Record<string, Omit<TilesetDefinition, 'firstgid'>> = {
  'TD.tsx': {
    name: 'TD',
    tileWidth: 16,
    tileHeight: 16,
    spacing: 0,
    margin: 0,
    columns: 16,
    tileCount: 256,
    imageWidth: 256,
    imageHeight: 256,
    imageUrl: '/assets/td/tiles/Tileset%20TD/1%20Tiles/FieldsTileset.png',
    animations: new Map(),
  },
  'tileset_sunnysideworld_tiled.tsx': {
    name: 'tileset_sunnysideworld',
    tileWidth: 16,
    tileHeight: 16,
    spacing: 4,
    margin: 2,
    columns: 64,
    tileCount: 4096,
    imageWidth: 1280,
    imageHeight: 1280,
    imageUrl: '/assets/td/tiles/sunnyside/output_tileset.png',
    animations: new Map(),
  },
  'Object Tileset TD.tsx': {
    name: 'Object Tileset TD',
    tileWidth: 16,
    tileHeight: 16,
    spacing: 0,
    margin: 0,
    columns: 60,
    tileCount: 3000,
    imageWidth: 960,
    imageHeight: 800,
    imageUrl: '/assets/td/tiles/Tileset%20TD/objects_tiled_tileset.png',
    animations: new Map(),
  },
  'Flag A.tsx': {
    name: 'Flag A',
    tileWidth: 16,
    tileHeight: 16,
    spacing: 0,
    margin: 0,
    columns: 12,
    tileCount: 48,
    imageWidth: 192,
    imageHeight: 64,
    imageUrl: '/assets/td/tiles/Tileset%20TD/3%20Animated%20Objects/1%20Flag/1.png',
    animations: new Map(),
  },
  'Campfire A.tsx': {
    name: 'Campfire A',
    tileWidth: 16,
    tileHeight: 16,
    spacing: 0,
    margin: 0,
    columns: 12,
    tileCount: 24,
    imageWidth: 192,
    imageHeight: 32,
    imageUrl: '/assets/td/tiles/Tileset%20TD/3%20Animated%20Objects/2%20Campfire/2.png',
    fallbackAnimation: Array.from({ length: 6 }, (_, frame) => ({
      imageUrl: '/assets/td/tiles/Tileset%20TD/3%20Animated%20Objects/2%20Campfire/2.png',
      imageWidth: 192,
      imageHeight: 32,
      sourceOffsetX: frame * 32,
    })),
    animations: new Map(),
  },
  'tower.tsx': {
    name: 'tower',
    tileWidth: 16,
    tileHeight: 16,
    spacing: 0,
    margin: 0,
    columns: 16,
    tileCount: 64,
    imageWidth: 256,
    imageHeight: 72,
    imageUrl: '/assets/td/tiles/Tower%20TD/2%20Idle/3_tiled_framed.png',
    animations: new Map(),
  },
};

let loadPromise: Promise<void> | null = null;
let renderedTerrain = '';
let renderedForeground = '';

export function hasDefenseTiledMap(): boolean {
  return renderedTerrain.length > 0;
}

export function loadDefenseTiledMap(): Promise<void> {
  loadPromise ??= fetch(DEFENSE_MAP_URL, { cache: 'no-cache' })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Unable to load TD map: ${response.status}`);
      }
      return response.json() as Promise<TiledMapFile>;
    })
    .then((map) => {
      const renderedMap = renderTiledMap(map);
      renderedTerrain = renderedMap.terrain;
      renderedForeground = renderedMap.foreground;
    })
    .catch((error: unknown) => {
      console.warn(error);
      renderedTerrain = '';
      renderedForeground = '';
    });

  return loadPromise;
}

export function renderDefenseTiledTerrain(): string {
  if (renderedTerrain) {
    return renderedTerrain;
  }

  return `
    <span class="defense-path is-vertical"></span>
    <span class="defense-path is-horizontal"></span>
    <span class="defense-path is-clearing"></span>
  `;
}

export function renderDefenseTiledForeground(): string {
  return renderedForeground;
}

function renderTiledMap(map: TiledMapFile): { terrain: string; foreground: string } {
  const tilesets = map.tilesets
    .map((tileset) => normalizeTileset(tileset))
    .filter((tileset): tileset is TilesetDefinition => tileset !== null)
    .sort((a, b) => a.firstgid - b.firstgid);

  const layers = map.layers
    .filter((layer) => layer.type === 'tilelayer' && layer.visible !== false)
    .filter((layer) => !DEFENSE_FOREGROUND_LAYER_NAMES.has(layer.name))
    .map((layer, index) => renderLayer(layer, index, tilesets, 'animated-only'))
    .join('');
  const foregroundLayers = map.layers
    .filter((layer) => layer.type === 'tilelayer' && layer.visible !== false)
    .filter((layer) => DEFENSE_FOREGROUND_LAYER_NAMES.has(layer.name))
    .map((layer, index) => renderLayer(layer, index, tilesets, 'all'))
    .join('');

  return {
    terrain: `
    <div
      class="defense-tiled-map"
      data-map-source="${DEFENSE_MAP_URL}"
      style="--td-map-width:${map.width}; --td-map-height:${map.height}; background-image:url('${DEFENSE_MAP_BACKGROUND_URL}');"
    >
      ${layers}
    </div>
  `,
    foreground: foregroundLayers
      ? `
    <div
      class="defense-tiled-foreground"
      data-map-source="${DEFENSE_MAP_URL}"
      style="--td-map-width:${map.width}; --td-map-height:${map.height};"
    >
      ${foregroundLayers}
    </div>
  `
      : '',
  };
}

function renderLayer(layer: TiledTileLayer, index: number, tilesets: TilesetDefinition[], mode: TileRenderMode): string {
  const tiles = layer.data
    .map((rawGid, tileIndex) => renderTile(rawGid, tileIndex, layer.width, tilesets, mode))
    .join('');

  return `
    <div
      class="defense-tiled-layer"
      data-layer="${escapeAttribute(layer.name)}"
      style="--td-layer:${index}; opacity:${layer.opacity ?? 1};"
    >
      ${tiles}
    </div>
  `;
}

function renderTile(
  rawGid: number,
  tileIndex: number,
  layerWidth: number,
  tilesets: TilesetDefinition[],
  mode: TileRenderMode,
): string {
  if (rawGid === 0) {
    return '';
  }

  const unsignedGid = rawGid >>> 0;
  const gid = unsignedGid & GID_MASK;
  const tileset = findTileset(gid, tilesets);
  if (!tileset) {
    return '';
  }

  const localId = gid - tileset.firstgid;
  if (localId < 0 || localId >= tileset.tileCount) {
    return '';
  }
  if (mode === 'all' && tileset.name === 'Object Tileset TD' && DEFENSE_NON_OCCLUDING_OBJECT_TILES.has(localId)) {
    return '';
  }

  const column = localId % tileset.columns;
  const row = Math.floor(localId / tileset.columns);
  const sourceX = tileset.margin + column * (tileset.tileWidth + tileset.spacing);
  const sourceY = tileset.margin + row * (tileset.tileHeight + tileset.spacing);
  const gridColumn = (tileIndex % layerWidth) + 1;
  const gridRow = Math.floor(tileIndex / layerWidth) + 1;
  const transform = tiledTransform(unsignedGid);
  const animation = tileset.animations.get(localId) ?? fallbackAnimation(tileset);
  const frames = animation.frames;
  const frameCount = frames.length;
  if (mode === 'animated-only' && frameCount === 1) {
    return '';
  }

  const frameDuration = animation.duration;
  const frameImage = renderTileFrame(frames, sourceX, sourceY, frameDuration);

  return `
    <span
      class="defense-tiled-tile ${frameCount > 1 ? 'is-animated' : 'is-static'}"
      data-tileset="${escapeAttribute(tileset.name)}"
      data-local-id="${localId}"
      data-frame-count="${frameCount}"
      style="
        grid-column:${gridColumn};
        grid-row:${gridRow};
        --td-tile-transform:${transform};
        --td-frame-duration:${frameDuration}ms;
      "
    >
      ${frameImage}
    </span>
  `;
}

function normalizeTileset(tileset: TiledTileset): TilesetDefinition | null {
  if (tileset.image && tileset.name) {
    const definition: TilesetDefinition = {
      firstgid: tileset.firstgid,
      name: tileset.name,
      tileWidth: tileset.tilewidth ?? 16,
      tileHeight: tileset.tileheight ?? 16,
      spacing: tileset.spacing ?? 0,
      margin: tileset.margin ?? 0,
      columns: tileset.columns ?? 1,
      tileCount: tileset.tilecount ?? 0,
      imageWidth: tileset.imagewidth ?? 16,
      imageHeight: tileset.imageheight ?? 16,
      imageUrl: resolveTiledAssetUrl(tileset.image),
      animations: new Map(),
    };

    definition.animations = normalizeAnimations(definition, tileset.tiles ?? []);
    if (definition.name === 'Campfire A' && definition.animations.size === 0) {
      definition.fallbackAnimation = campfireFallbackAnimation(definition.imageUrl);
    }

    return definition;
  }

  const sourceName = basename(tileset.source ?? '');
  const manifest = TILESET_MANIFEST[sourceName];
  return manifest ? { firstgid: tileset.firstgid, ...manifest } : null;
}

function normalizeAnimations(definition: TilesetDefinition, tiles: NonNullable<TiledTileset['tiles']>): Map<number, TilesetAnimation> {
  const animations = new Map<number, TilesetAnimation>();

  for (const tile of tiles) {
    if (!tile.animation?.length) {
      continue;
    }

    const frames = tile.animation.map((frame) => {
      const frameColumn = frame.tileid % definition.columns;
      const frameRow = Math.floor(frame.tileid / definition.columns);
      const frameSourceX = definition.margin + frameColumn * (definition.tileWidth + definition.spacing);
      const frameSourceY = definition.margin + frameRow * (definition.tileHeight + definition.spacing);
      const baseColumn = tile.id % definition.columns;
      const baseRow = Math.floor(tile.id / definition.columns);
      const baseSourceX = definition.margin + baseColumn * (definition.tileWidth + definition.spacing);
      const baseSourceY = definition.margin + baseRow * (definition.tileHeight + definition.spacing);

      return {
        imageUrl: definition.imageUrl,
        imageWidth: definition.imageWidth,
        imageHeight: definition.imageHeight,
        duration: frame.duration,
        sourceOffsetX: frameSourceX - baseSourceX,
        sourceOffsetY: frameSourceY - baseSourceY,
      };
    });

    animations.set(tile.id, {
      frames,
      duration: frames.reduce((total, frame) => total + (frame.duration ?? 0), 0) || 760,
    });
  }

  return animations;
}

function fallbackAnimation(tileset: TilesetDefinition): TilesetAnimation {
  const frames =
    tileset.fallbackAnimation ??
    [
      {
        imageUrl: tileset.imageUrl,
        imageWidth: tileset.imageWidth,
        imageHeight: tileset.imageHeight,
      },
    ];

  return {
    frames,
    duration: tileset.name === 'Campfire A' && frames.length > 1 ? 720 : 760,
  };
}

function campfireFallbackAnimation(imageUrl: string): TilesetAnimationFrame[] {
  return Array.from({ length: 6 }, (_, frame) => ({
    imageUrl,
    imageWidth: 192,
    imageHeight: 32,
    sourceOffsetX: frame * 32,
  }));
}

function renderTileFrame(
  frames: TilesetAnimationFrame[],
  sourceX: number,
  sourceY: number,
  frameDuration: number,
): string {
  const frame = frames[0];
  const sheetWidthScale = frame.imageWidth / 16;
  const sheetHeightScale = frame.imageHeight / 16;
  const phase = Date.now() % frameDuration;
  const delay = Math.round(-phase);
  const positions = frames
    .map((tileFrame, index) => {
      const frameSourceX = sourceX + (tileFrame.sourceOffsetX ?? 0);
      const frameSourceY = sourceY + (tileFrame.sourceOffsetY ?? 0);

      return `
        --td-frame-x-${index}:${percent(-frameSourceX / tileFrame.imageWidth)};
        --td-frame-y-${index}:${percent(-frameSourceY / tileFrame.imageHeight)};
      `;
    })
    .join('');

  return `
    <span
      class="defense-tiled-frame"
      style="
        width:${percent(sheetWidthScale)};
        height:${percent(sheetHeightScale)};
        background-image:url('${frame.imageUrl}');
        ${positions}
        --td-frame-delay:${delay}ms;
      "
    ></span>
  `;
}

function findTileset(gid: number, tilesets: TilesetDefinition[]): TilesetDefinition | null {
  let match: TilesetDefinition | null = null;
  for (const tileset of tilesets) {
    if (gid >= tileset.firstgid) {
      match = tileset;
    }
  }
  return match;
}

function tiledTransform(unsignedGid: number): string {
  const transforms: string[] = [];
  if ((unsignedGid & GID_FLIP_DIAGONAL) !== 0) {
    transforms.push('rotate(90deg)');
  }
  if ((unsignedGid & GID_FLIP_HORIZONTAL) !== 0) {
    transforms.push('scaleX(-1)');
  }
  if ((unsignedGid & GID_FLIP_VERTICAL) !== 0) {
    transforms.push('scaleY(-1)');
  }
  return transforms.length > 0 ? transforms.join(' ') : 'none';
}

function basename(source: string): string {
  return source.split(/[\\/]/).pop() ?? source;
}

function resolveTiledAssetUrl(source: string): string {
  if (source.startsWith('/')) {
    return source;
  }

  if (/^https?:\/\//.test(source)) {
    return source;
  }

  return new URL(source, window.location.origin + DEFENSE_MAP_URL).pathname;
}

function percent(value: number): string {
  return `${Number((value * 100).toFixed(4))}%`;
}

function escapeAttribute(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}
