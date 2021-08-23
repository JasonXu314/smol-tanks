import { Engine } from '../engine';
import { DynamicGameObject, RenderEngine } from '../types';

type CursorTypes = 'DEFAULT' | 'MOVE';

export class Cursor implements DynamicGameObject {
	private cursorType: CursorTypes = 'DEFAULT';

	public readonly type = 'GAME_OBJECT';
	public readonly dynamic = true;
	public readonly id = 'cursor';

	private animTick: number = 0;

	constructor(private engine: Engine) {}

	public update(): void {
		if (this.engine.order === 'MOVE') {
			this.cursorType = 'MOVE';
			if (this.animTick === 50) {
				this.animTick = 0;
			} else {
				this.animTick++;
			}
		} else {
			this.cursorType = 'DEFAULT';
			this.animTick = 0;
		}
	}

	public render(engine: RenderEngine): void {
		switch (this.cursorType) {
			case 'DEFAULT':
				engine.drawImage(this.engine.mousePos.toRaw(), [10, 16], 'default.svg', false);
				break;
			case 'MOVE':
				engine.drawImage(
					this.engine.mousePos.toRaw(),
					[15 - this.animTick / 5, 15 - this.animTick / 5],
					'move.svg'
				);
				break;
		}
	}

	public destroy(): void {}
}
