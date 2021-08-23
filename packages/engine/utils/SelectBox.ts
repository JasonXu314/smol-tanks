import { Engine } from '../engine';
import { Rectangle } from '../math';
import { DynamicGameObject, RenderEngine } from '../types';

export class SelectBox implements DynamicGameObject {
	public readonly type = 'GAME_OBJECT';
	public readonly dynamic = true;
	public readonly id = 'select-box';

	constructor(private engine: Engine) {}

	public update(): void {}

	public render(engine: RenderEngine): void {
		if (this.engine.mouseDown && this.engine.mouseButton === 0) {
			engine.tracePath(
				[
					this.engine.downPos!.toRaw(),
					[this.engine.downPos!.x, this.engine.mousePos.y],
					this.engine.mousePos.toRaw(),
					[this.engine.mousePos.x, this.engine.downPos!.y]
				],
				1,
				'white'
			);
			this.engine.selection = Rectangle.from(this.engine.downPos!, this.engine.mousePos);
		}
	}

	public destroy(): void {}
}
