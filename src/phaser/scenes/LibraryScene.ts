import Phaser from 'phaser';
import { books, type BookDefinition } from '../../game/content/books';
import { gameStore } from '../../game/store';

const world = {
  width: 960,
  height: 540,
};

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

    const decor = this.add.image(480, 270, 'library-background');
    decor.setDisplaySize(676, 540);
    decor.setDepth(1);

    const frame = this.add.graphics().setDepth(2);
    frame.lineStyle(3, 0xb3835a, 0.9);
    frame.strokeRoundedRect(142, 0, 676, 540, 6);
  }

  private drawManaBar(): void {
    const depth = 12;
    this.add.graphics()
      .setDepth(depth)
      .fillStyle(0x3c2b2f, 1)
      .fillRoundedRect(344, 26, 272, 28, 14)
      .lineStyle(2, 0xb3835a, 1)
      .strokeRoundedRect(344, 26, 272, 28, 14);
    this.add.circle(354, 40, 18, 0x25304f).setStrokeStyle(2, 0xb3835a).setDepth(depth + 1);
    this.add.text(346, 28, '♦', { color: '#75cfff', fontSize: '24px' }).setDepth(depth + 2);
    this.manaBar = this.add.rectangle(464, 40, 168, 14, 0x70c7ff).setOrigin(0.5).setDepth(depth + 1);
    this.manaLabel = this.add.text(418, 32, 'Mana 0', {
      color: '#f4dfbc',
      fontSize: '14px',
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
    const lockedVeil = this.add.rectangle(0, 0, 78, 104, 0x120d12, 0.52).setOrigin(0.5);
    const selection = this.add.rectangle(0, 0, 84, 112, 0xffffff, 0).setOrigin(0.5);
    selection.setStrokeStyle(3, 0xf3d28b, 0);
    container.add([lockedVeil, selection]);
    container.setSize(84, 112);
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
    const manaWidth = Phaser.Math.Clamp(state.mana / 400, 0.08, 1) * 168;
    this.manaBar?.setDisplaySize(manaWidth, 14);
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
        view.lock = this.add.text(-10, -22, '×', {
          color: '#f0d7aa',
          fontSize: '32px',
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
      return { x: 336, y: 162 };
    case 'serpent':
      return { x: 616, y: 162 };
    case 'typing':
      return { x: 615, y: 285 };
    case 'herbarium':
      return { x: 522, y: 162 };
  }
}
