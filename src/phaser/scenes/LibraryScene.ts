import Phaser from 'phaser';
import { books, type BookDefinition, type ResourceId } from '../../game/content/books';
import {
  forbiddenGrimoireCanOffer,
  forbiddenGrimoireCurrentSeal,
  forbiddenGrimoireRequirementProgress,
  forbiddenGrimoireSealReady,
} from '../../game/simulation/actions';
import type { GameState } from '../../game/simulation/state';
import { gameStore } from '../../game/store';

const world = {
  width: 1280,
  height: 720,
};
const WORLD_SCALE = world.width / 960;
const scaled = (value: number): number => value * WORLD_SCALE;
const BOOK_WIDTH = scaled(78);
const BOOK_HEIGHT = scaled(108);
const FORBIDDEN_GRIMOIRE_TARGET = {
  x: scaled(778),
  y: scaled(202),
};

interface BookView {
  definition: BookDefinition;
  container: Phaser.GameObjects.Container;
  glow: Phaser.GameObjects.Ellipse;
  medallionGlow: Phaser.GameObjects.Ellipse;
  hoverHalo: Phaser.GameObjects.Ellipse;
  hoverSpark: Phaser.GameObjects.Text;
  resourceHud: Phaser.GameObjects.Container;
  resourceHudBack: Phaser.GameObjects.Rectangle;
  resourceHudGlow: Phaser.GameObjects.Ellipse;
  resourceHudValue: Phaser.GameObjects.Text;
  idleSpark: Phaser.GameObjects.Text;
  lockedVeil: Phaser.GameObjects.Rectangle;
  lockGlow: Phaser.GameObjects.Ellipse;
  lock: Phaser.GameObjects.Image;
}

type LibraryResourceId = 'mana' | ResourceId;

interface ResourceDefinition {
  id: LibraryResourceId;
  label: string;
  color: number;
  accent: string;
  bookId?: BookDefinition['id'];
}

interface RitualRequirementView {
  definition: ResourceDefinition;
  container: Phaser.GameObjects.Container;
  back: Phaser.GameObjects.Rectangle;
  fill: Phaser.GameObjects.Rectangle;
  label: Phaser.GameObjects.Text;
  value: Phaser.GameObjects.Text;
  stock: Phaser.GameObjects.Text;
}

const resourceDefinitions: ResourceDefinition[] = [
  { id: 'mana', label: 'Mana', color: 0x70c7ff, accent: '#70c7ff', bookId: 'mana' },
  { id: 'scales', label: 'Ecailles', color: 0xa78cff, accent: '#a78cff', bookId: 'serpent' },
  { id: 'runes', label: 'Runes', color: 0xed9fff, accent: '#ed9fff', bookId: 'typing' },
  { id: 'spores', label: 'Spores', color: 0x91d980, accent: '#91d980', bookId: 'herbarium' },
  { id: 'sigils', label: 'Sceaux', color: 0xffc36e, accent: '#ffc36e', bookId: 'defense' },
  { id: 'chips', label: 'Jetons', color: 0x74d88f, accent: '#74d88f', bookId: 'blackjack' },
  { id: 'fragments', label: 'Fragments', color: 0x7ea4ff, accent: '#7ea4ff', bookId: 'hundred' },
  { id: 'minerals', label: 'Pieces mine', color: 0xd69a58, accent: '#d69a58', bookId: 'mine' },
  { id: 'marks', label: 'Marques', color: 0xff7a80, accent: '#ff7a80', bookId: 'runner' },
  { id: 'gels', label: 'Gels', color: 0x7df0a3, accent: '#7df0a3', bookId: 'slimeTrainer' },
];

export class LibraryScene extends Phaser.Scene {
  private bookViews: BookView[] = [];
  private ritualViews: RitualRequirementView[] = [];
  private hoveredBookId: BookDefinition['id'] | null = null;
  private displayedResourceStocks = new Map<LibraryResourceId, number>();
  private manaBar?: Phaser.GameObjects.Rectangle;
  private manaLabel?: Phaser.GameObjects.Text;
  private keyLabel?: Phaser.GameObjects.Text;
  private ritualPanel?: Phaser.GameObjects.Graphics;
  private ritualSeal?: Phaser.GameObjects.Ellipse;
  private ritualSealGlyph?: Phaser.GameObjects.Text;
  private ritualHeader?: Phaser.GameObjects.Text;
  private ritualSubtitle?: Phaser.GameObjects.Text;
  private ritualReadyRunes: Phaser.GameObjects.Text[] = [];
  private ritualReadyOrbit = { angle: 0 };
  private lastReadySealKey: string | null = null;
  private ritualButtonFrame?: Phaser.GameObjects.Graphics;
  private ritualButton?: Phaser.GameObjects.Rectangle;
  private ritualButtonLabel?: Phaser.GameObjects.Text;
  private grimoireAura?: Phaser.GameObjects.Ellipse;

  constructor() {
    super('LibraryScene');
  }

  preload(): void {
    this.load.image('library-hub-plate', '/assets/library/generated/forbidden-hub/forbidden-hub-gameplay-covers-1.jpg');
    this.load.svg('library-lock', '/assets/library/lock.svg', {
      width: 96,
      height: 116,
    });
    for (const resource of resourceDefinitions) {
      this.load.svg(resourceIconKey(resource.id), `/assets/library/resources/${resource.id}.svg`, {
        width: 64,
        height: 64,
      });
    }
  }

  create(): void {
    this.drawRoom();
    this.drawManaBar();
    this.drawBookcase();
    this.drawForbiddenGrimoireFocus();
    this.drawForbiddenRitualPanel();
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => this.activateHoveredBook(pointer));

    gameStore.subscribe(() => this.syncState());
  }

  update(): void {
    gameStore.tick(performance.now());
    this.syncPointerHover();
  }

  private drawRoom(): void {
    this.cameras.main.setBackgroundColor('#100c11');

    this.add.image(world.width / 2, world.height / 2, 'library-hub-plate').setDisplaySize(world.width, world.height).setDepth(0);

    const shade = this.add.graphics().setDepth(1);
    shade.fillGradientStyle(0x050306, 0x050306, 0x050306, 0x050306, 0.18, 0.38, 0.72, 0.64);
    shade.fillRect(0, 0, world.width, world.height);
    shade.lineStyle(2, 0xc18a5d, 0.45);
    shade.strokeRoundedRect(scaled(16), scaled(14), world.width - scaled(32), world.height - scaled(28), scaled(8));

    this.drawAmbientMotes();
    this.drawCozyAmbience();
  }

  private drawManaBar(): void {
    const depth = 20;
    const bar = this.add.graphics().setDepth(depth);
    bar.fillStyle(0x1e1720, 0.78);
    bar.fillRoundedRect(scaled(326), scaled(24), scaled(308), scaled(34), scaled(17));
    bar.fillStyle(0x38282d, 1);
    bar.fillRoundedRect(scaled(350), scaled(29), scaled(274), scaled(24), scaled(12));
    bar.lineStyle(2, 0xb9895f, 1);
    bar.strokeRoundedRect(scaled(326), scaled(24), scaled(308), scaled(34), scaled(17));

    const gemGlow = this.add.circle(scaled(348), scaled(41), scaled(23), 0x6fcfff, 0.14).setDepth(depth + 1);
    this.add.circle(scaled(348), scaled(41), scaled(18), 0x233153).setStrokeStyle(2, 0xc08c60).setDepth(depth + 2);
    this.add.text(scaled(340), scaled(28), '♦', { color: '#78d4ff', fontSize: `${scaled(24)}px` }).setDepth(depth + 3);
    this.tweens.add({
      targets: gemGlow,
      alpha: 0.42,
      scale: 1.18,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.manaBar = this.add.rectangle(scaled(404), scaled(41), scaled(32), scaled(12), 0x70c7ff, 0.9).setOrigin(0, 0.5).setDepth(depth + 2);
    this.manaLabel = this.add
      .text(scaled(434), scaled(30), 'Mana 0', {
        color: '#f4dfbc',
        fontSize: `${scaled(14)}px`,
        fontFamily: 'Georgia, serif',
        stroke: '#140d10',
        strokeThickness: 3,
      })
      .setDepth(depth + 3);

    const keyBadge = this.add.graphics().setDepth(depth);
    keyBadge.fillStyle(0x1e1720, 0.78);
    keyBadge.fillRoundedRect(scaled(1036), scaled(24), scaled(118), scaled(34), scaled(17));
    keyBadge.lineStyle(2, 0xd8ad68, 0.95);
    keyBadge.strokeRoundedRect(scaled(1036), scaled(24), scaled(118), scaled(34), scaled(17));
    this.add
      .text(scaled(1050), scaled(29), 'Cle', {
        color: '#f3d49a',
        fontSize: `${scaled(12)}px`,
        fontFamily: 'Georgia, serif',
        stroke: '#140d10',
        strokeThickness: 3,
      })
      .setDepth(depth + 3);
    this.keyLabel = this.add
      .text(scaled(1104), scaled(29), '0', {
        color: '#ffe6a6',
        fontSize: `${scaled(14)}px`,
        fontFamily: 'Georgia, serif',
        stroke: '#140d10',
        strokeThickness: 3,
      })
      .setDepth(depth + 3);
  }

  private drawBookcase(): void {
    books.forEach((book) => {
      const position = bookPosition(book.id);
      this.bookViews.push(this.createBookHotspot(book, position.x, position.y));
    });
  }

  private createBookHotspot(definition: BookDefinition, x: number, y: number): BookView {
    const container = this.add.container(x, y).setDepth(10);
    const glow = this.add
      .ellipse(0, scaled(1), BOOK_WIDTH * 1.2, BOOK_HEIGHT * 1.06, 0xffd797, 0)
      .setOrigin(0.5)
      .setBlendMode(Phaser.BlendModes.ADD);
    const medallionGlow = this.add
      .ellipse(0, scaled(-7), BOOK_WIDTH * 0.58, BOOK_WIDTH * 0.52, definition.color, 0)
      .setOrigin(0.5);
    const hoverHalo = this.add
      .ellipse(0, scaled(-3), BOOK_WIDTH * 1.26, BOOK_HEIGHT * 1.12, definition.color, 0)
      .setOrigin(0.5)
      .setBlendMode(Phaser.BlendModes.ADD);
    const hoverSpark = this.add
      .text(BOOK_WIDTH * 0.33, -BOOK_HEIGHT * 0.47, '✦', {
        color: '#ffe7a7',
        fontSize: `${scaled(24)}px`,
        fontFamily: 'Georgia, serif',
        stroke: '#4b2b16',
        strokeThickness: 3,
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setBlendMode(Phaser.BlendModes.ADD);
    const resourceDefinition = resourceDefinitionForBook(definition);
    const resourceHud = this.add.container(0, -BOOK_HEIGHT * 0.66);
    const resourceHudGlow = this.add
      .ellipse(0, 0, scaled(64), scaled(25), resourceDefinition.color, 0.16)
      .setBlendMode(Phaser.BlendModes.ADD);
    const resourceHudBack = this.add
      .rectangle(0, 0, scaled(62), scaled(23), 0x0b080b, 0.78)
      .setOrigin(0.5)
      .setStrokeStyle(1, resourceDefinition.color, 0.66);
    const resourceHudIcon = this.add.image(scaled(-20), 0, resourceIconKey(resourceDefinition.id)).setDisplaySize(scaled(15), scaled(15));
    const resourceHudValue = this.add
      .text(scaled(-7), scaled(-7), '0', {
        color: '#fff1c8',
        fontSize: `${scaled(11)}px`,
        fontFamily: 'Georgia, serif',
        stroke: '#10090d',
        strokeThickness: 3,
      })
      .setOrigin(0, 0);
    resourceHud.add([resourceHudGlow, resourceHudBack, resourceHudIcon, resourceHudValue]);
    const idleSpark = this.add
      .text(BOOK_WIDTH * 0.24, -BOOK_HEIGHT * 0.43, '✦', {
        color: '#ffe7a7',
        fontSize: `${scaled(14)}px`,
        fontFamily: 'Georgia, serif',
        stroke: '#4b2b16',
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setBlendMode(Phaser.BlendModes.ADD);
    const lockedVeil = this.add.rectangle(0, 0, BOOK_WIDTH * 0.94, BOOK_HEIGHT * 0.96, 0x070407, 0.52).setOrigin(0.5);
    const lockGlow = this.add
      .ellipse(BOOK_WIDTH * 0.34, -BOOK_HEIGHT * 0.34, scaled(26), scaled(30), 0xffd88a, 0)
      .setBlendMode(Phaser.BlendModes.ADD);
    const lock = this.add
      .image(BOOK_WIDTH * 0.34, -BOOK_HEIGHT * 0.34, 'library-lock')
      .setDisplaySize(scaled(18), scaled(22))
      .setAlpha(0);

    container.add([glow, hoverHalo, medallionGlow, hoverSpark, idleSpark, lockedVeil, lockGlow, lock, resourceHud]);
    container.setSize(BOOK_WIDTH + scaled(16), BOOK_HEIGHT + scaled(22));
    container.setInteractive(
      new Phaser.Geom.Rectangle(
        -(BOOK_WIDTH + scaled(16)) / 2,
        -(BOOK_HEIGHT + scaled(22)) / 2,
        BOOK_WIDTH + scaled(16),
        BOOK_HEIGHT + scaled(22),
      ),
      Phaser.Geom.Rectangle.Contains,
    );
    container.input!.cursor = 'pointer';
    container.on('pointerover', () => this.setHoveredBook(definition.id, true));
    container.on('pointerout', () => this.setHoveredBook(definition.id, false));
    this.startBookIdleAnimation(container, definition.id);
    this.scheduleBookIdleSpark(definition.id, idleSpark);

    return { definition, container, glow, medallionGlow, hoverHalo, hoverSpark, resourceHud, resourceHudBack, resourceHudGlow, resourceHudValue, idleSpark, lockedVeil, lockGlow, lock };
  }

  private drawForbiddenGrimoireFocus(): void {
    this.grimoireAura = this.add
      .ellipse(scaled(778), scaled(202), scaled(150), scaled(156), 0x55d6ff, 0.12)
      .setDepth(4)
      .setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({
      targets: this.grimoireAura,
      alpha: 0.26,
      scale: 1.08,
      duration: 1600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private drawForbiddenRitualPanel(): void {
    const depth = 21;
    const x = scaled(708);
    const y = scaled(304);
    const width = scaled(214);
    this.ritualPanel = this.add.graphics().setDepth(depth);
    this.drawRitualFrame(x, y, width, scaled(154), false);
    this.ritualSeal = this.add
      .ellipse(x + scaled(28), y + scaled(28), scaled(34), scaled(34), 0x11111b, 0.92)
      .setStrokeStyle(2, 0x72d7ff, 0.72)
      .setDepth(depth + 1);
    this.ritualSealGlyph = this.add
      .text(x + scaled(28), y + scaled(27), '✦', {
        color: '#8edfff',
        fontSize: `${scaled(17)}px`,
        fontFamily: 'Georgia, serif',
        stroke: '#07070d',
        strokeThickness: 3,
      })
      .setOrigin(0.5)
      .setDepth(depth + 2);
    this.ritualHeader = this.add
      .text(x + scaled(52), y + scaled(14), 'Sceau I', {
        color: '#f8e7bd',
        fontSize: `${scaled(12)}px`,
        fontFamily: 'Georgia, serif',
        stroke: '#120a0d',
        strokeThickness: 3,
      })
      .setDepth(depth + 1);
    this.ritualSubtitle = this.add
      .text(x + scaled(52), y + scaled(31), 'ouvre un livre', {
        color: '#8edfff',
        fontSize: `${scaled(9)}px`,
        fontFamily: 'Georgia, serif',
        stroke: '#08080d',
        strokeThickness: 2,
      })
      .setDepth(depth + 1);
    for (let index = 0; index < 4; index += 1) {
      const rune = this.add
        .text(x + scaled(28), y + scaled(28), '✦', {
          color: '#ffe6a6',
          fontSize: `${scaled(9)}px`,
          fontFamily: 'Georgia, serif',
          stroke: '#2b190c',
          strokeThickness: 2,
        })
        .setOrigin(0.5)
        .setAlpha(0)
        .setDepth(depth + 3)
        .setBlendMode(Phaser.BlendModes.ADD);
      this.ritualReadyRunes.push(rune);
    }
    this.tweens.add({
      targets: this.ritualReadyOrbit,
      angle: 360,
      duration: 2600,
      repeat: -1,
      ease: 'Linear',
    });

    for (const definition of resourceDefinitions) {
      const container = this.add.container(x + scaled(12), y + scaled(66)).setDepth(depth + 1).setVisible(false);
      const back = this.add
        .rectangle(0, 0, width - scaled(24), scaled(30), 0x171118, 0.62)
        .setOrigin(0, 0.5)
        .setStrokeStyle(1, definition.color, 0.18);
      const icon = this.add.image(scaled(15), 0, resourceIconKey(definition.id)).setDisplaySize(scaled(22), scaled(22));
      const barBack = this.add.rectangle(scaled(64), scaled(9), scaled(118), scaled(4), 0x08070a, 0.92).setOrigin(0, 0.5);
      const fill = this.add.rectangle(scaled(64), scaled(9), scaled(1), scaled(4), definition.color, 0.94).setOrigin(0, 0.5);
      const label = this.add
        .text(scaled(32), scaled(-11), definition.label, {
          color: '#dec59c',
          fontSize: `${scaled(9)}px`,
          fontFamily: 'Georgia, serif',
        })
        .setOrigin(0, 0);
      const value = this.add
        .text(scaled(32), scaled(1), '0 / 0', {
          color: '#fff0c7',
          fontSize: `${scaled(9)}px`,
          fontFamily: 'Georgia, serif',
          stroke: '#120a0d',
          strokeThickness: 2,
        })
        .setOrigin(0, 0);
      const stock = this.add
        .text(scaled(132), scaled(-11), 'reserve 0', {
          color: '#a89a83',
          fontSize: `${scaled(8)}px`,
          fontFamily: 'Georgia, serif',
        })
        .setOrigin(0, 0);
      container.add([back, icon, label, value, stock, barBack, fill]);
      this.ritualViews.push({ definition, container, back, fill, label, value, stock });
    }

    this.ritualButton = this.add
      .rectangle(x + width / 2, y + scaled(124), width - scaled(24), scaled(32), 0x000000, 0)
      .setDepth(depth + 2)
      .setInteractive({ useHandCursor: true });
    this.ritualButtonFrame = this.add.graphics().setDepth(depth + 2);
    this.drawRitualButton(x + scaled(13), y + scaled(108), width - scaled(26), scaled(32), false, true);
    this.ritualButtonLabel = this.add
      .text(x + width / 2, y + scaled(124), 'Offrir', {
        color: '#f7f0da',
        fontSize: `${scaled(11)}px`,
        fontFamily: 'Georgia, serif',
        stroke: '#10252b',
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setDepth(depth + 3);
    this.ritualButton.on('pointerdown', () => this.activateForbiddenRitual());
  }

  private drawRitualButton(x: number, y: number, width: number, height: number, ready: boolean, enabled: boolean): void {
    if (!this.ritualButtonFrame) {
      return;
    }

    const fill = ready ? 0x6b3214 : enabled ? 0x14333b : 0x171017;
    const line = ready ? 0xffdfa0 : enabled ? 0xa8efff : 0x715743;
    const alpha = enabled ? 0.94 : 0.62;
    this.ritualButtonFrame.clear();
    this.ritualButtonFrame.fillStyle(0x050306, 0.36);
    this.ritualButtonFrame.fillRoundedRect(x + scaled(2), y + scaled(3), width, height, scaled(5));
    this.ritualButtonFrame.fillStyle(fill, alpha);
    this.ritualButtonFrame.fillRoundedRect(x, y, width, height, scaled(5));
    this.ritualButtonFrame.lineStyle(1, line, enabled ? 0.82 : 0.38);
    this.ritualButtonFrame.strokeRoundedRect(x, y, width, height, scaled(5));
    this.ritualButtonFrame.lineStyle(1, 0xf3d49a, ready ? 0.62 : 0.22);
    this.ritualButtonFrame.beginPath();
    this.ritualButtonFrame.moveTo(x + scaled(12), y + height / 2);
    this.ritualButtonFrame.lineTo(x + scaled(32), y + height / 2);
    this.ritualButtonFrame.moveTo(x + width - scaled(12), y + height / 2);
    this.ritualButtonFrame.lineTo(x + width - scaled(32), y + height / 2);
    this.ritualButtonFrame.strokePath();
  }

  private drawRitualFrame(x: number, y: number, width: number, height: number, ready: boolean): void {
    if (!this.ritualPanel) {
      return;
    }

    const glowColor = ready ? 0xf2c86b : 0x65d7ff;
    const corner = scaled(10);
    const notch = scaled(13);
    this.ritualPanel.clear();
    this.ritualPanel.fillStyle(0x050306, 0.42);
    this.ritualPanel.fillRoundedRect(x + scaled(5), y + scaled(7), width, height, corner);
    this.ritualPanel.fillStyle(0x10090d, 0.74);
    this.ritualPanel.fillRoundedRect(x, y, width, height, corner);
    this.ritualPanel.lineStyle(3, glowColor, ready ? 0.2 : 0.12);
    this.ritualPanel.strokeRoundedRect(x - scaled(2), y - scaled(2), width + scaled(4), height + scaled(4), corner + scaled(2));
    this.ritualPanel.lineStyle(1, glowColor, ready ? 0.9 : 0.56);
    this.ritualPanel.strokeRoundedRect(x, y, width, height, corner);
    this.ritualPanel.lineStyle(1, 0xc58b57, 0.35);
    this.ritualPanel.beginPath();
    this.ritualPanel.moveTo(x + scaled(16), y + scaled(48));
    this.ritualPanel.lineTo(x + width - scaled(16), y + scaled(48));
    this.ritualPanel.strokePath();

    this.ritualPanel.lineStyle(2, 0xf3d49a, ready ? 0.82 : 0.42);
    for (const [sx, sy, dx, dy] of [
      [x + notch, y + notch, scaled(18), 0],
      [x + notch, y + notch, 0, scaled(18)],
      [x + width - notch, y + notch, -scaled(18), 0],
      [x + width - notch, y + notch, 0, scaled(18)],
      [x + notch, y + height - notch, scaled(18), 0],
      [x + notch, y + height - notch, 0, -scaled(18)],
      [x + width - notch, y + height - notch, -scaled(18), 0],
      [x + width - notch, y + height - notch, 0, -scaled(18)],
    ] as const) {
      this.ritualPanel.beginPath();
      this.ritualPanel.moveTo(sx, sy);
      this.ritualPanel.lineTo(sx + dx, sy + dy);
      this.ritualPanel.strokePath();
    }
  }

  private drawAmbientMotes(): void {
    for (let index = 0; index < 28; index += 1) {
      const mote = this.add
        .circle(Phaser.Math.Between(scaled(210), scaled(850)), Phaser.Math.Between(scaled(70), scaled(480)), Phaser.Math.FloatBetween(0.8, 2.2), 0xf5d28a, Phaser.Math.FloatBetween(0.12, 0.32))
        .setDepth(3);
      this.tweens.add({
        targets: mote,
        x: mote.x + Phaser.Math.Between(-20, 28),
        y: mote.y - Phaser.Math.Between(22, 58),
        alpha: Phaser.Math.FloatBetween(0.04, 0.36),
        duration: Phaser.Math.Between(2200, 5200),
        delay: Phaser.Math.Between(0, 900),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  private drawCozyAmbience(): void {
    const candleGlow = this.add
      .ellipse(scaled(874), scaled(246), scaled(46), scaled(94), 0xffc66d, 0.12)
      .setDepth(4)
      .setBlendMode(Phaser.BlendModes.ADD);
    const candleCore = this.add
      .ellipse(scaled(874), scaled(246), scaled(16), scaled(46), 0xffe6a6, 0.14)
      .setDepth(5)
      .setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({
      targets: [candleGlow, candleCore],
      alpha: { from: 0.1, to: 0.32 },
      scaleX: { from: 0.92, to: 1.08 },
      scaleY: { from: 0.94, to: 1.12 },
      duration: 860,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    for (let index = 0; index < 10; index += 1) {
      const glint = this.add
        .text(Phaser.Math.Between(scaled(240), scaled(780)), Phaser.Math.Between(scaled(96), scaled(452)), '✦', {
          color: '#ffe6a6',
          fontSize: `${scaled(8 + Phaser.Math.Between(0, 5))}px`,
          fontFamily: 'Georgia, serif',
          stroke: '#4b2b16',
          strokeThickness: 2,
        })
        .setOrigin(0.5)
        .setAlpha(0)
        .setDepth(8)
        .setBlendMode(Phaser.BlendModes.ADD);
      this.time.addEvent({
        delay: Phaser.Math.Between(1400, 3600),
        loop: true,
        callback: () => {
          glint.setPosition(Phaser.Math.Between(scaled(240), scaled(780)), Phaser.Math.Between(scaled(96), scaled(452)));
          glint.setAngle(Phaser.Math.Between(-16, 16));
          this.tweens.add({
            targets: glint,
            alpha: { from: 0, to: 0.72 },
            scale: { from: 0.72, to: 1.22 },
            duration: 520,
            yoyo: true,
            ease: 'Sine.easeOut',
          });
        },
      });
    }
  }

  private startBookIdleAnimation(container: Phaser.GameObjects.Container, bookId: BookDefinition['id']): void {
    this.tweens.add({
      targets: container,
      y: container.y - scaled(2),
      scaleX: 1.012,
      scaleY: 1.012,
      duration: Phaser.Math.Between(1700, 2600),
      delay: bookPosition(bookId).x % 420,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private scheduleBookIdleSpark(bookId: BookDefinition['id'], spark: Phaser.GameObjects.Text): void {
    this.time.addEvent({
      delay: Phaser.Math.Between(1800, 4200),
      loop: true,
      callback: () => {
        const state = gameStore.snapshot;
        const book = state.books[bookId];
        const isNext = state.forbiddenGrimoire.selectedBookId === bookId;
        if (!book.unlocked && !isNext) {
          return;
        }

        spark.setPosition(Phaser.Math.Between(Math.round(BOOK_WIDTH * -0.24), Math.round(BOOK_WIDTH * 0.32)), Phaser.Math.Between(Math.round(BOOK_HEIGHT * -0.48), Math.round(BOOK_HEIGHT * -0.22)));
        spark.setColor(book.unlocked ? '#ffe7a7' : '#8edfff');
        this.tweens.add({
          targets: spark,
          alpha: { from: 0, to: isNext ? 0.9 : 0.56 },
          scale: { from: 0.72, to: isNext ? 1.32 : 1.05 },
          angle: { from: -12, to: 18 },
          duration: 420,
          yoyo: true,
          ease: 'Sine.easeOut',
        });
      },
    });
  }

  private setHoveredBook(bookId: BookDefinition['id'], isHovered: boolean): void {
    const nextBookId = isHovered ? bookId : this.hoveredBookId === bookId ? null : this.hoveredBookId;
    if (nextBookId === this.hoveredBookId) {
      return;
    }
    const previousBookId = this.hoveredBookId;
    this.hoveredBookId = nextBookId;
    if (previousBookId) {
      this.animateBookHover(previousBookId, false);
    }
    if (nextBookId) {
      this.animateBookHover(nextBookId, true);
    }
    this.syncState();
  }

  private syncPointerHover(): void {
    const pointer = this.input.activePointer;
    const nextView = this.bookViews.find((view) => {
      const bounds = hoverBounds(view.definition.id);
      return pointer.x >= bounds.left && pointer.x <= bounds.right && pointer.y >= bounds.top && pointer.y <= bounds.bottom;
    });
    const nextBookId = nextView?.definition.id ?? null;
    if (nextBookId === this.hoveredBookId) {
      return;
    }
    const previousBookId = this.hoveredBookId;
    this.hoveredBookId = nextBookId;
    if (previousBookId) {
      this.animateBookHover(previousBookId, false);
    }
    if (nextBookId) {
      this.animateBookHover(nextBookId, true);
    }
    this.syncState();
  }

  private activateHoveredBook(pointer: Phaser.Input.Pointer): void {
    if (isPointerInsideBookPanel(pointer)) {
      return;
    }

    const view = this.bookViews.find((candidate) => {
      const bounds = hoverBounds(candidate.definition.id);
      return pointer.x >= bounds.left && pointer.x <= bounds.right && pointer.y >= bounds.top && pointer.y <= bounds.bottom;
    });
    if (!view) {
      return;
    }

    const bookState = gameStore.snapshot.books[view.definition.id];
    if (bookState.unlocked) {
      this.tweens.add({ targets: view.medallionGlow, alpha: 0.62, scale: 1.16, duration: 90, yoyo: true, ease: 'Sine.easeOut' });
      gameStore.dispatch({ type: 'selectBook', bookId: view.definition.id });
      return;
    }
    this.tweens.add({ targets: [view.lock, view.lockGlow], alpha: 0.34, angle: 5, duration: 65, yoyo: true, repeat: 2 });
    gameStore.dispatch({ type: 'selectForbiddenSealBook', bookId: view.definition.id });
  }

  private activateForbiddenRitual(): void {
    const state = gameStore.snapshot;
    if (forbiddenGrimoireSealReady(state) && state.forbiddenGrimoire.keys > 0) {
      const seal = forbiddenGrimoireCurrentSeal(state);
      const unlockedBookId = seal?.unlocksBookId ?? null;
      gameStore.dispatch({ type: 'breakForbiddenSeal' });
      if (unlockedBookId) {
        this.animateSealBreakCeremony(unlockedBookId);
        this.time.delayedCall(950, () => gameStore.dispatch({ type: 'selectBook', bookId: unlockedBookId }));
      }
      this.tweens.add({ targets: this.grimoireAura, alpha: 0.7, scale: 1.22, duration: 150, yoyo: true, ease: 'Sine.easeOut' });
      return;
    }
    if (forbiddenGrimoireCanOffer(state)) {
      gameStore.dispatch({ type: 'offerForbiddenGrimoire' });
      this.animateForbiddenOfferingTransfer(gameStore.snapshot.forbiddenGrimoire.lastOffered);
      this.tweens.add({ targets: this.grimoireAura, alpha: 0.48, scale: 1.14, duration: 120, yoyo: true, ease: 'Sine.easeOut' });
    }
  }

  private animateForbiddenOfferingTransfer(offered: Partial<Record<LibraryResourceId, number>>): void {
    const bursts = (Object.entries(offered) as Array<[LibraryResourceId, number | undefined]>).filter(([, amount]) => amount !== undefined && amount > 0);
    if (bursts.length === 0) {
      return;
    }

    bursts.forEach(([resourceId, amount], burstIndex) => {
      const definition = resourceDefinitions.find((candidate) => candidate.id === resourceId);
      if (!definition || amount === undefined) {
        return;
      }

      const source = bookPosition(definition.bookId ?? 'mana');
      const particleCount = Phaser.Math.Clamp(Math.ceil(10 + Math.log10(amount + 1) * 7), 14, 28);
      this.pulseRitualRequirement(resourceId);

      for (let index = 0; index < particleCount; index += 1) {
        const startX = source.x + Phaser.Math.Between(-Math.round(BOOK_WIDTH * 0.28), Math.round(BOOK_WIDTH * 0.28));
        const startY = source.y + Phaser.Math.Between(-Math.round(BOOK_HEIGHT * 0.22), Math.round(BOOK_HEIGHT * 0.18));
        const targetX = FORBIDDEN_GRIMOIRE_TARGET.x + Phaser.Math.Between(-scaled(28), scaled(26));
        const targetY = FORBIDDEN_GRIMOIRE_TARGET.y + Phaser.Math.Between(-scaled(24), scaled(24));
        const controlX = (startX + targetX) / 2 + Phaser.Math.Between(-scaled(36), scaled(44));
        const controlY = Math.min(startY, targetY) - Phaser.Math.Between(scaled(52), scaled(112));
        const size = scaled(8 + Phaser.Math.Between(0, 7));
        const particle = this.add
          .image(startX, startY, resourceIconKey(resourceId))
          .setDepth(32)
          .setAlpha(0)
          .setDisplaySize(size, size)
          .setBlendMode(Phaser.BlendModes.ADD);
        const trail = this.add
          .circle(startX, startY, size * 0.72, definition.color, 0)
          .setDepth(31)
          .setBlendMode(Phaser.BlendModes.ADD);
        const driver = { progress: 0 };

        this.tweens.add({
          targets: driver,
          progress: 1,
          delay: burstIndex * 120 + index * 18 + Phaser.Math.Between(0, 28),
          duration: Phaser.Math.Between(620, 860),
          ease: 'Cubic.easeInOut',
          onUpdate: () => {
            const progress = driver.progress;
            const inverse = 1 - progress;
            const x = inverse * inverse * startX + 2 * inverse * progress * controlX + progress * progress * targetX;
            const y = inverse * inverse * startY + 2 * inverse * progress * controlY + progress * progress * targetY;
            const pulse = 0.72 + Math.sin(progress * Math.PI) * 0.62;
            particle.setPosition(x, y);
            particle.setDisplaySize(size * pulse, size * pulse);
            particle.setAngle(progress * 220 + index * 13);
            particle.setAlpha(progress < 0.12 ? progress / 0.12 : progress > 0.86 ? (1 - progress) / 0.14 : 1);
            trail.setPosition(x, y);
            trail.setScale(0.7 + pulse * 1.1);
            trail.setAlpha(progress < 0.12 ? progress * 1.8 : progress > 0.82 ? (1 - progress) * 1.15 : 0.26);
          },
          onComplete: () => {
            particle.destroy();
            trail.destroy();
            this.flashForbiddenGrimoireImpact(definition.color, targetX, targetY);
          },
        });
      }
    });
  }

  private pulseRitualRequirement(resourceId: LibraryResourceId): void {
    const view = this.ritualViews.find((candidate) => candidate.definition.id === resourceId);
    if (!view) {
      return;
    }

    this.tweens.add({
      targets: [view.back, view.fill],
      alpha: 1,
      scaleY: 1.18,
      duration: 110,
      yoyo: true,
      repeat: 2,
      ease: 'Sine.easeOut',
    });
  }

  private flashForbiddenGrimoireImpact(color: number, x: number, y: number): void {
    const spark = this.add
      .circle(x, y, scaled(5), color, 0.72)
      .setDepth(31)
      .setBlendMode(Phaser.BlendModes.ADD);

    this.tweens.add({
      targets: spark,
      alpha: 0,
      scale: 3.4,
      duration: 280,
      ease: 'Sine.easeOut',
      onComplete: () => spark.destroy(),
    });
  }

  private animateSealReadyPulse(hasKey: boolean): void {
    const color = hasKey ? 0xf2c86b : 0x72d7ff;
    const ring = this.add
      .circle(FORBIDDEN_GRIMOIRE_TARGET.x, FORBIDDEN_GRIMOIRE_TARGET.y, scaled(34), color, 0)
      .setStrokeStyle(2, color, 0.78)
      .setDepth(30)
      .setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({
      targets: ring,
      alpha: { from: 0.62, to: 0 },
      scale: { from: 0.8, to: 2.15 },
      duration: 760,
      ease: 'Sine.easeOut',
      onComplete: () => ring.destroy(),
    });
  }

  private animateSealBreakCeremony(bookId: BookDefinition['id']): void {
    const wave = this.add
      .circle(FORBIDDEN_GRIMOIRE_TARGET.x, FORBIDDEN_GRIMOIRE_TARGET.y, scaled(28), 0xf2c86b, 0)
      .setStrokeStyle(3, 0xf2c86b, 0.92)
      .setDepth(33)
      .setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({
      targets: wave,
      alpha: { from: 0.95, to: 0 },
      scale: { from: 0.4, to: 3.2 },
      duration: 820,
      ease: 'Cubic.easeOut',
      onComplete: () => wave.destroy(),
    });

    for (let index = 0; index < 34; index += 1) {
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const distance = Phaser.Math.Between(scaled(24), scaled(108));
      const sparkle = this.add
        .text(FORBIDDEN_GRIMOIRE_TARGET.x, FORBIDDEN_GRIMOIRE_TARGET.y, index % 3 === 0 ? '✦' : '•', {
          color: index % 4 === 0 ? '#8edfff' : '#ffe6a6',
          fontSize: `${scaled(index % 3 === 0 ? 13 : 9)}px`,
          fontFamily: 'Georgia, serif',
          stroke: '#4b2b16',
          strokeThickness: 2,
        })
        .setOrigin(0.5)
        .setDepth(34)
        .setBlendMode(Phaser.BlendModes.ADD);
      this.tweens.add({
        targets: sparkle,
        x: FORBIDDEN_GRIMOIRE_TARGET.x + Math.cos(angle) * distance,
        y: FORBIDDEN_GRIMOIRE_TARGET.y + Math.sin(angle) * distance,
        alpha: { from: 1, to: 0 },
        scale: { from: 0.8, to: 1.6 },
        angle: Phaser.Math.Between(-80, 120),
        duration: Phaser.Math.Between(480, 920),
        ease: 'Sine.easeOut',
        onComplete: () => sparkle.destroy(),
      });
    }

    this.animateBookUnlockReveal(bookId);
  }

  private animateBookUnlockReveal(bookId: BookDefinition['id']): void {
    const view = this.bookViews.find((candidate) => candidate.definition.id === bookId);
    if (!view) {
      return;
    }

    this.tweens.add({
      targets: view.container,
      scaleX: 1.12,
      scaleY: 1.12,
      y: view.container.y - scaled(8),
      duration: 190,
      yoyo: true,
      ease: 'Back.easeOut',
    });
    this.tweens.add({
      targets: [view.glow, view.medallionGlow, view.hoverHalo],
      alpha: 0.88,
      scale: 1.24,
      duration: 180,
      yoyo: true,
      repeat: 2,
      ease: 'Sine.easeOut',
    });

    const lockDrop = this.add
      .image(view.container.x + BOOK_WIDTH * 0.34, view.container.y - BOOK_HEIGHT * 0.34, 'library-lock')
      .setDisplaySize(scaled(20), scaled(25))
      .setDepth(35)
      .setTint(0xffe2ad);
    this.tweens.add({
      targets: lockDrop,
      x: lockDrop.x + scaled(28),
      y: lockDrop.y + scaled(64),
      angle: 65,
      alpha: 0,
      duration: 640,
      ease: 'Cubic.easeIn',
      onComplete: () => lockDrop.destroy(),
    });

    for (let index = 0; index < 16; index += 1) {
      const sparkle = this.add
        .text(view.container.x + Phaser.Math.Between(-scaled(22), scaled(22)), view.container.y + Phaser.Math.Between(-scaled(42), scaled(24)), '✦', {
          color: '#ffe6a6',
          fontSize: `${scaled(9 + Phaser.Math.Between(0, 7))}px`,
          fontFamily: 'Georgia, serif',
          stroke: '#4b2b16',
          strokeThickness: 2,
        })
        .setOrigin(0.5)
        .setDepth(34)
        .setBlendMode(Phaser.BlendModes.ADD);
      this.tweens.add({
        targets: sparkle,
        y: sparkle.y - scaled(28),
        alpha: { from: 0.9, to: 0 },
        scale: { from: 0.8, to: 1.4 },
        duration: Phaser.Math.Between(520, 900),
        ease: 'Sine.easeOut',
        onComplete: () => sparkle.destroy(),
      });
    }
  }

  private positionRitualReadyRunes(centerX: number, centerY: number, active: boolean, hasKey: boolean): void {
    const radius = scaled(27);
    const color = hasKey ? '#ffe6a6' : '#8edfff';
    for (let index = 0; index < this.ritualReadyRunes.length; index += 1) {
      const rune = this.ritualReadyRunes[index];
      const angle = Phaser.Math.DegToRad(this.ritualReadyOrbit.angle + index * (360 / this.ritualReadyRunes.length));
      rune
        .setPosition(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius)
        .setColor(color)
        .setAlpha(active ? (hasKey ? 0.86 : 0.52) : 0);
    }
  }

  private animateBookHover(bookId: BookDefinition['id'], isHovered: boolean): void {
    const view = this.bookViews.find((candidate) => candidate.definition.id === bookId);
    if (!view) {
      return;
    }
    this.tweens.killTweensOf([view.glow, view.medallionGlow, view.hoverHalo, view.hoverSpark, view.lock, view.lockGlow]);
    this.tweens.add({ targets: view.hoverHalo, alpha: isHovered ? 0.48 : 0, scale: isHovered ? 1.14 : 0.98, duration: 120, ease: 'Sine.easeOut' });
    this.tweens.add({ targets: view.medallionGlow, alpha: isHovered ? 0.74 : 0, scale: isHovered ? 1.18 : 1, duration: 120, ease: 'Sine.easeOut' });
    this.tweens.add({ targets: view.hoverSpark, alpha: isHovered ? 0.95 : 0, scale: isHovered ? 1.12 : 0.8, angle: isHovered ? 12 : 0, duration: 140, ease: 'Sine.easeOut' });
    this.tweens.add({ targets: view.lockGlow, scale: isHovered ? 1.08 : 1, duration: 140, ease: 'Sine.easeOut' });
  }

  private syncState(): void {
    const state = gameStore.snapshot;
    const manaWidth = Phaser.Math.Clamp(state.mana / 400, 0.08, 1) * scaled(208);
    this.manaBar?.setDisplaySize(manaWidth, scaled(12));
    this.manaLabel?.setText(`Mana ${Math.floor(state.mana)}`);
    this.keyLabel?.setText(String(state.forbiddenGrimoire.keys));

    for (const view of this.bookViews) {
      const book = state.books[view.definition.id];
      const hovered = this.hoveredBookId === view.definition.id;
      const nextSealBook = state.forbiddenGrimoire.selectedBookId === view.definition.id;
      view.lockedVeil.setVisible(!book.unlocked);
      view.lockedVeil.setAlpha(hovered ? 0.06 : nextSealBook ? 0.18 : 0.48);
      view.glow.setAlpha(hovered ? 0.28 : 0);
      view.medallionGlow.setAlpha(hovered ? 0.74 : 0);
      view.hoverHalo.setAlpha(hovered ? 0.48 : 0);
      view.hoverSpark.setAlpha(hovered ? 0.95 : 0);
      view.resourceHud.setAlpha(book.unlocked ? 1 : nextSealBook ? 0.88 : 0.66);
      view.resourceHud.setScale(hovered ? 1.08 : 1);
      view.resourceHudGlow.setAlpha(hovered ? 0.36 : book.unlocked ? 0.18 : 0.08);
      view.resourceHudBack.setStrokeStyle(1, view.definition.color, hovered ? 0.95 : book.unlocked ? 0.66 : 0.34);
      const resourceId = bookResourceId(view.definition);
      const resourceStock = Math.floor(bookResourceStock(state, view.definition));
      const previousStock = this.displayedResourceStocks.get(resourceId);
      if (state.openBookPanels.length === 0 && previousStock !== undefined && resourceStock > previousStock) {
        this.showResourceHudGain(view, resourceStock - previousStock);
      }
      this.displayedResourceStocks.set(resourceId, resourceStock);
      view.resourceHudValue.setText(formatBookResourceStock(resourceStock));
      view.lock.setVisible(!book.unlocked);
      view.lock.setDisplaySize(scaled(18), scaled(22));
      view.lock.setAngle(0);
      view.lock.setAlpha(!book.unlocked ? (nextSealBook ? 0.92 : 0.48) : 0);
      view.lock.setTint(nextSealBook ? 0xffe2ad : 0xb28c69);
      view.lockGlow.setVisible(!book.unlocked);
      view.lockGlow.setAlpha(!book.unlocked && nextSealBook ? (hovered ? 0.34 : 0.18) : 0);
    }
    this.syncForbiddenRitualPanel(state);
  }

  private showResourceHudGain(view: BookView, amount: number): void {
    const gain = Math.max(1, Math.floor(amount));
    const popup = this.add
      .text(scaled(7), scaled(-15), `+${formatBookResourceStock(gain)}`, {
        color: '#ffffff',
        fontSize: `${scaled(15)}px`,
        fontFamily: 'Georgia, serif',
        fontStyle: 'bold',
        stroke: '#271c18',
        strokeThickness: 3,
        shadow: {
          offsetX: 0,
          offsetY: scaled(2),
          color: '#000000',
          blur: scaled(5),
          fill: true,
        },
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setScale(0.82);

    view.resourceHud.add(popup);
    this.tweens.add({
      targets: popup,
      y: scaled(-36),
      alpha: { from: 0, to: 1 },
      scale: { from: 0.82, to: 1.12 },
      duration: 180,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: popup,
          y: scaled(-53),
          alpha: 0,
          scale: 0.9,
          duration: 1320,
          ease: 'Cubic.easeOut',
          onComplete: () => popup.destroy(),
        });
      },
    });
  }

  private syncForbiddenRitualPanel(state: GameState): void {
    const seal = forbiddenGrimoireCurrentSeal(state);
    const panelX = scaled(708);
    const panelY = scaled(304);
    const panelWidth = scaled(214);
    if (!seal) {
      this.positionRitualReadyRunes(panelX + scaled(28), panelY + scaled(28), false, false);
      this.lastReadySealKey = null;
      this.drawRitualFrame(panelX, panelY, panelWidth, scaled(130), true);
      this.ritualSeal?.setPosition(panelX + scaled(28), panelY + scaled(28)).setFillStyle(0x11111b, 0.95).setStrokeStyle(2, 0x72d7ff, 0.72);
      this.ritualSealGlyph?.setPosition(panelX + scaled(28), panelY + scaled(27)).setText('✦').setColor('#8edfff');
      this.ritualHeader?.setPosition(panelX + scaled(52), panelY + scaled(14)).setText('Sceau libre').setColor('#f8e7bd');
      this.ritualSubtitle?.setPosition(panelX + scaled(52), panelY + scaled(31)).setText('choisis un livre').setColor('#8edfff');
      for (const view of this.ritualViews) {
        view.container.setVisible(false);
      }
      this.drawRitualButton(panelX + scaled(13), panelY + scaled(80), panelWidth - scaled(26), scaled(32), false, false);
      this.ritualButton?.setPosition(panelX + panelWidth / 2, panelY + scaled(96)).setDisplaySize(panelWidth - scaled(26), scaled(32));
      this.ritualButtonLabel?.setPosition(panelX + panelWidth / 2, panelY + scaled(96)).setText('Aucun sceau').setAlpha(0.58).setColor('#f7f0da');
      return;
    }

    const offeringsReady = forbiddenGrimoireSealReady(state);
    const ready = offeringsReady && state.forbiddenGrimoire.keys > 0;
    const canOffer = forbiddenGrimoireCanOffer(state);
    const panelHeight = scaled(112 + seal.requirements.length * 38);
    const buttonY = panelY + scaled(88 + seal.requirements.length * 38);
    this.drawRitualFrame(panelX, panelY, panelWidth, panelHeight, ready);
    this.ritualSeal?.setPosition(panelX + scaled(28), panelY + scaled(28)).setFillStyle(ready ? 0x2b190c : 0x11111b, 0.95).setStrokeStyle(2, ready ? 0xf2c86b : 0x72d7ff, ready ? 0.92 : 0.72);
    this.ritualSealGlyph?.setPosition(panelX + scaled(28), panelY + scaled(27)).setText(ready ? '◆' : '✦').setColor(ready ? '#ffe6a6' : '#8edfff');
    this.ritualHeader?.setPosition(panelX + scaled(52), panelY + scaled(14)).setText(`Sceau ${bookShortLabel(seal.unlocksBookId)}`).setColor(ready ? '#ffe6a6' : '#f8e7bd');
    this.ritualSubtitle?.setPosition(panelX + scaled(52), panelY + scaled(31)).setText(`ouvre ${bookShortLabel(seal.unlocksBookId)}`).setColor(ready ? '#f2c86b' : '#8edfff');
    this.ritualButton?.setPosition(panelX + panelWidth / 2, buttonY);
    this.ritualButtonLabel?.setPosition(panelX + panelWidth / 2, buttonY);
    this.positionRitualReadyRunes(panelX + scaled(28), panelY + scaled(28), offeringsReady, ready);
    const readyKey = offeringsReady ? `${seal.unlocksBookId}:${ready ? 'key' : 'no-key'}` : null;
    if (readyKey && readyKey !== this.lastReadySealKey) {
      this.animateSealReadyPulse(ready);
    }
    this.lastReadySealKey = readyKey;

    let visibleIndex = 0;
    for (const view of this.ritualViews) {
      const requirement = seal.requirements.find((candidate) => candidate.id === view.definition.id);
      const visible = requirement !== undefined;
      view.container.setVisible(visible);
      if (!visible || !requirement) {
        continue;
      }
      const y = panelY + scaled(64) + visibleIndex * scaled(38);
      const current = forbiddenGrimoireRequirementProgress(state, requirement);
      const progress = Phaser.Math.Clamp(current / requirement.amount, 0, 1);
      const stock = libraryResourceStock(state, requirement.id);
      view.container.setPosition(panelX + scaled(12), y);
      view.back.setStrokeStyle(1, view.definition.color, progress >= 1 ? 0.84 : 0.24).setFillStyle(progress >= 1 ? 0x1c160f : 0x171118, progress >= 1 ? 0.72 : 0.62);
      view.fill.setDisplaySize(Math.max(1, scaled(118) * progress), scaled(4));
      view.label.setColor(progress >= 1 ? '#ffe2ad' : '#dec59c');
      view.value.setText(`${Math.floor(current)} / ${requirement.amount}`);
      view.stock.setText(`reserve ${Math.floor(stock)}`);
      view.stock.setColor(stock > 0 ? (progress >= 1 ? '#f2c86b' : '#8edfff') : '#7a6b60');
      visibleIndex += 1;
    }

    this.drawRitualButton(panelX + scaled(13), buttonY - scaled(16), panelWidth - scaled(26), scaled(32), ready, ready || canOffer);
    this.ritualButton?.setDisplaySize(panelWidth - scaled(26), scaled(32));
    this.ritualButtonLabel?.setText(ready ? 'Briser le sceau' : offeringsReady ? 'Cle requise' : canOffer ? "Verser l'offrande" : 'Offrande vide');
    this.ritualButtonLabel?.setAlpha(ready || canOffer ? 1 : 0.58).setColor(ready ? '#ffe6a6' : '#f7f0da');
  }
}

function isPointerInsideBookPanel(pointer: Phaser.Input.Pointer): boolean {
  const panels = Array.from(document.querySelectorAll<HTMLElement>('.book-overlay'));
  const canvas = document.querySelector<HTMLCanvasElement>('#game-root canvas');
  if (panels.length === 0 || !canvas) {
    return false;
  }

  const canvasRect = canvas.getBoundingClientRect();
  const clientX = canvasRect.left + (pointer.x / world.width) * canvasRect.width;
  const clientY = canvasRect.top + (pointer.y / world.height) * canvasRect.height;
  return panels.some((panel) => {
    const rect = panel.getBoundingClientRect();
    return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
  });
}

function resourceIconKey(id: LibraryResourceId): string {
  return `library-resource-${id}`;
}

function libraryResourceStock(state: GameState, id: LibraryResourceId): number {
  return id === 'mana' ? state.mana : state.resources[id];
}

function bookResourceStock(state: GameState, book: BookDefinition): number {
  return libraryResourceStock(state, bookResourceId(book));
}

function bookResourceId(book: BookDefinition): LibraryResourceId {
  if (book.id === 'mana') {
    return 'mana';
  }
  if (!book.resourceId) {
    throw new Error(`Book has no resource id: ${book.id}`);
  }
  return book.resourceId;
}

function resourceDefinitionForBook(book: BookDefinition): ResourceDefinition {
  const resourceId = bookResourceId(book);
  const definition = resourceDefinitions.find((candidate) => candidate.id === resourceId);
  if (!definition) {
    throw new Error(`Unknown book resource: ${resourceId}`);
  }
  return definition;
}

function formatBookResourceStock(value: number): string {
  const floored = Math.floor(value);
  if (floored >= 1_000_000) {
    return `${Math.floor(floored / 100_000) / 10}M`;
  }
  if (floored >= 10_000) {
    return `${Math.floor(floored / 100) / 10}k`;
  }
  return String(floored);
}

function bookShortLabel(bookId: BookDefinition['id']): string {
  const book = books.find((candidate) => candidate.id === bookId);
  return book?.name.replace(/^Livre du |^Grimoire de |^Table du /, '') ?? bookId;
}

function bookPosition(id: BookDefinition['id']): { x: number; y: number } {
  switch (id) {
    case 'mana':
      return { x: scaled(145), y: scaled(160) };
    case 'serpent':
      return { x: scaled(285), y: scaled(160) };
    case 'typing':
      return { x: scaled(415), y: scaled(160) };
    case 'herbarium':
      return { x: scaled(548), y: scaled(160) };
    case 'defense':
      return { x: scaled(145), y: scaled(286) };
    case 'blackjack':
      return { x: scaled(285), y: scaled(286) };
    case 'hundred':
      return { x: scaled(415), y: scaled(286) };
    case 'mine':
      return { x: scaled(548), y: scaled(286) };
    case 'runner':
      return { x: scaled(145), y: scaled(422) };
    case 'slimeTrainer':
      return { x: scaled(548), y: scaled(422) };
  }
}

function hoverBounds(id: BookDefinition['id']): { left: number; right: number; top: number; bottom: number } {
  const position = bookPosition(id);
  return {
    left: position.x - (BOOK_WIDTH + scaled(18)) / 2,
    right: position.x + (BOOK_WIDTH + scaled(18)) / 2,
    top: position.y - (BOOK_HEIGHT + scaled(24)) / 2,
    bottom: position.y + (BOOK_HEIGHT + scaled(24)) / 2,
  };
}
