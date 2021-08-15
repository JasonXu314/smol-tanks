import { Engine } from '../engine';
import { Vector } from '../math';
import { DynamicGameObject, RenderEngine, Template } from '../types';

type CursorTypes = 'DEFAULT' | 'MOVE';

const TEMPLATES: Template<CursorTypes> = {
	DEFAULT: [new Vector(12, -13), new Vector(2, -3), new Vector(2, -19), new Vector(7, -14)],
	MOVE: [
		new Vector(-7.5, -7.5),
		new Vector(7.5, -7.5),
		new Vector(7.5, 7.5),
		new Vector(-7.5, 7.5),
		new Vector(-7.5, -7.5),
		new Vector(7.5, 7.5),
		new Vector(7.5, -7.5),
		new Vector(-7.5, 7.5)
	]
};

const STYLES = {
	DEFAULT: [2, 'white', 'black'],
	MOVE: [1, 'green']
} as const;

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
				engine.fillPath(
					TEMPLATES[this.cursorType].map((template) => template.add(this.engine.mousePos).toRaw()),
					...STYLES[this.cursorType]
				);
				break;
			case 'MOVE':
				engine.drawImage(this.engine.mousePos.toRaw(), [15 - this.animTick / 5, 15 - this.animTick / 5], 'move.svg');
				break;
		}
	}

	public destroy(): void {}
}
