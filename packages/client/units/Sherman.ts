import { Engine, RenderEngine, Template, Unit } from '@smol-tanks/engine';
import { Rectangle, Vector } from '@smol-tanks/engine/math';
import { TRANSPARENT } from '@smol-tanks/engine/utils/utils';
import { intersects, rotateBy } from '../utils/utils';
import { Driver } from './crew/Driver';

type TankTemplates = 'CHASSIS';

const TEMPLATES: Template<TankTemplates> = {
	CHASSIS: [new Vector(-10, -7.5), new Vector(10, -7.5), new Vector(10, 7.5), new Vector(-10, 7.5)]
};

export class Sherman implements Unit {
	public readonly type = 'UNIT';
	public readonly dynamic = true;
	public readonly name = 'Sherman';

	public readonly maxSpeed = 25;
	public readonly accel = 2.5;
	public readonly turnRate = Math.PI / 180;

	private driver: Driver;

	private _position: Vector = Vector.ZERO;
	private _direction: Vector = Vector.J;
	private _selected: boolean = false;
	private _target: Vector | null = null;

	public get target() {
		return this._target;
	}

	public get selected(): boolean {
		return this._selected;
	}

	public get position(): Vector {
		return this._position;
	}

	public get direction(): Vector {
		return this._direction;
	}

	constructor(private engine: Engine, public readonly id: string) {
		this.driver = new Driver(this);
	}

	public render(engine: RenderEngine): void {
		if (this._target && this._selected) {
			engine.line([this._position.toRaw(), this._target.toRaw()], 1, 'green');
		}
		engine.fillPath(
			TEMPLATES.CHASSIS.map((vec) => rotateBy(vec.scale(1), -this._direction.reflexAngle).scale(vec.magnitude)).map(
				(vec) => vec.add(this._position).toRaw()
			),
			1,
			this._selected ? 'white' : TRANSPARENT,
			'green'
		);
	}

	public update(): void {
		const outline = TEMPLATES.CHASSIS.map((vec) => vec.add(this._position));

		if (this.engine.selection) {
			if (intersects(this.engine.selection, Rectangle.from(outline[0], outline[1]))) {
				this._selected = true;
			} else {
				this._selected = false;
			}
		}

		if (this.target) {
			const [left, right] = this.driver.getDifferentials();
			this._direction = rotateBy(this._direction, right > left ? this.turnRate : -this.turnRate);
		}
	}

	public destroy(): void {}

	public move(dest: Vector): void {
		this._target = dest.clone();
	}
}
