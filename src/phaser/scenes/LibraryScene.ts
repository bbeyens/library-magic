import Phaser from 'phaser';
import { books, type BookDefinition } from '../../game/content/books';
import { gameStore } from '../../game/store';

const world = {
  width: 1280,
  height: 720,
};
const WORLD_SCALE = world.width / 960;
const scaled = (value: number): number => value * WORLD_SCALE;

interface BookView {
  definition: BookDefinition;
  container: Phaser.GameObjects.Container;
  selection: Phaser.GameObjects.Rectangle;
  lockedVeil: Phaser.GameObjects.Rectangle;
  lock?: Phaser.GameObjects.Text;
}

export class LibraryScene extends Phaser.Scene {
  private bookViews: BookView[] = [];
  private manaBar?: Phaser.GameObjects.Rectangle;
  private manaLabel?: Phaser.GameObjects.Text;

  constructor() {
    super('LibraryScene');
  }

  preload(): void {
    this.load.image('library-background', '/assets/decor/bookshelf-background-hires.png');
  }

  create(): void {
    this.drawRoom();
    this.drawManaBar();
    this.drawBookcase();

    gameStore.subscribe(() => this.syncState());
  }

  update(): void {
    gameStore.tick(performance.now());
  }

  private drawRoom(): void {
    this.cameras.main.setBackgroundColor('#19131b');

    const bg = this.add.graphics();
    bg.fillGradientStyle(0x21181b, 0x21181b, 0x0f0c10, 0x0f0c10, 1);
    bg.fillRect(0, 0, world.width, world.height);

    const decor = this.add.image(scaled(480), scaled(270), 'library-background');
    decor.setDisplaySize(scaled(676), world.height);
    decor.setDepth(1);

    const frame = this.add.graphics().setDepth(2);
    frame.lineStyle(3, 0xb3835a, 0.9);
    frame.strokeRoundedRect(scaled(142), 0, scaled(676), world.height, scaled(6));
  }

  private drawManaBar(): void {
    const depth = 12;
    this.add.graphics()
      .setDepth(depth)
      .fillStyle(0x3c2b2f, 1)
      .fillRoundedRect(scaled(344), scaled(26), scaled(272), scaled(28), scaled(14))
      .lineStyle(2, 0xb3835a, 1)
      .strokeRoundedRect(scaled(344), scaled(26), scaled(272), scaled(28), scaled(14));
    this.add.circle(scaled(354), scaled(40), scaled(18), 0x25304f).setStrokeStyle(2, 0xb3835a).setDepth(depth + 1);
    this.add.text(scaled(346), scaled(28), '♦', { color: '#75cfff', fontSize: `${scaled(24)}px` }).setDepth(depth + 2);
    this.manaBar = this.add.rectangle(scaled(464), scaled(40), scaled(168), scaled(14), 0x70c7ff).setOrigin(0.5).setDepth(depth + 1);
    this.manaLabel = this.add.text(scaled(418), scaled(32), 'Mana 0', {
      color: '#f4dfbc',
      fontSize: `${scaled(14)}px`,
      fontFamily: 'Georgia, serif',
    }).setDepth(depth + 2);
  }

  private drawBookcase(): void {
    books.forEach((book) => {
      const position = bookPosition(book.id);
      this.bookViews.push(this.createBookHotspot(book, position.x, position.y));
    });
  }

  private createBookHotspot(definition: BookDefinition, x: number, y: number): BookView {
    const container = this.add.container(x, y).setDepth(8);
    const lockedVeil = this.add.rectangle(0, 0, scaled(78), scaled(104), 0x120d12, 0.52).setOrigin(0.5);
    const selection = this.add.rectangle(0, 0, scaled(84), scaled(112), 0xffffff, 0).setOrigin(0.5);
    selection.setStrokeStyle(3, 0xf3d28b, 0);
    container.add([lockedVeil, selection]);
    container.setSize(scaled(84), scaled(112));
    container.setInteractive({ useHandCursor: true });
    container.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (isPointerInsideBookPanel(pointer)) {
        return;
      }
      const bookState = gameStore.snapshot.books[definition.id];
      if (bookState.unlocked) {
        gameStore.dispatch({ type: 'selectBook', bookId: definition.id });
        return;
      }
      gameStore.dispatch({ type: 'unlockBook', bookId: definition.id });
    });

    return { definition, container, selection, lockedVeil };
  }

  private syncState(): void {
    const state = gameStore.snapshot;
    const manaWidth = Phaser.Math.Clamp(state.mana / 400, 0.08, 1) * scaled(168);
    this.manaBar?.setDisplaySize(manaWidth, scaled(14));
    this.manaLabel?.setText(`Mana ${Math.floor(state.mana)}`);

    for (const view of this.bookViews) {
      const book = state.books[view.definition.id];
      view.lockedVeil.setVisible(!book.unlocked);
      view.selection.setStrokeStyle(
        state.selectedBook === view.definition.id ? 5 : 3,
        state.selectedBook === view.definition.id ? 0xf3d28b : 0x000000,
        state.selectedBook === view.definition.id ? 0.95 : 0,
      );
      if (!book.unlocked && !view.lock) {
        view.lock = this.add.text(scaled(-10), scaled(-22), '×', {
          color: '#f0d7aa',
          fontSize: `${scaled(32)}px`,
          fontFamily: 'Georgia, serif',
          stroke: '#23181a',
          strokeThickness: 4,
        });
        view.container.add(view.lock);
      }
      if (book.unlocked && view.lock) {
        view.lock.destroy();
        view.lock = undefined;
      }
    }
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

function bookPosition(id: BookDefinition['id']): { x: number; y: number } {
  switch (id) {
    case 'mana':
      return { x: scaled(336), y: scaled(162) };
    case 'serpent':
      return { x: scaled(616), y: scaled(162) };
    case 'typing':
      return { x: scaled(615), y: scaled(285) };
    case 'herbarium':
      return { x: scaled(522), y: scaled(162) };
    case 'defense':
      return { x: scaled(429), y: scaled(285) };
    case 'blackjack':
      return { x: scaled(708), y: scaled(285) };
    case 'hundred':
      return { x: scaled(429), y: scaled(532) };
    case 'mine':
      return { x: scaled(615), y: scaled(532) };
    case 'targets':
      return { x: scaled(708), y: scaled(532) };
    case 'slimeTrainer':
      return { x: scaled(336), y: scaled(285) };
  }
}
