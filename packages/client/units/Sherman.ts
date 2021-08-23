import { Engine, RenderEngine, Template, Unit } from '@smol-tanks/engine';
import { Rectangle, Vector } from '@smol-tanks/engine/math';
import { TRANSPARENT } from '@smol-tanks/engine/utils/utils';
import { intersects } from '../utils/utils';
import { Driver } from './crew/Driver';

type TankTemplates = 'CHASSIS';

const TEMPLATES: Template<TankTemplates> = {
	CHASSIS: [new Vector(-10, -7.5), new Vector(10, -7.5), new Vector(10, 7.5), new Vector(-10, 7.5)]
};

export class Sherman implements Unit {
	public readonly type = 'UNIT';
	public readonly dynamic = true;
	public readonly name = 'Sherman';

	public readonly maxSpeed = 1.5;
	public readonly accel = 0.1;
	public readonly turnRate = Math.PI / 180;

	private driver: Driver;

	private _position: Vector = Vector.ZERO;
	private _speed: number = 0;
	private _direction: Vector = Vector.J;
	private _selected: boolean = false;
	private _target: Vector | null = null;

	public get target(): Vector | null {
		return this._target ? this._target.clone() : null;
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

	public get speed(): number {
		return this._speed;
	}

	constructor(private engine: Engine, public readonly id: string) {
		this.driver = new Driver(this);
	}

	public render(engine: RenderEngine): void {
		if (this._target && this._selected) {
			engine.line([this._position.toRaw(), this._target.toRaw()], 1, 'green');
		}
		engine.fillPath(
			TEMPLATES.CHASSIS.map((vec) =>
				vec.rotateBy(this._direction.reflexAngle).scale(vec.magnitude).add(this._position).toRaw()
			),
			1,
			this._selected ? 'white' : TRANSPARENT,
			'green'
		);
		engine.line([this._position.toRaw(), this._position.add(this._direction.scale(25)).toRaw()], 1, 'red');
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
		if (this._target) {
			const [speed, turn] = this.driver.drive();
			this._direction = this._direction.rotateBy(turn).scale(1);
			this._speed = speed;

			if (
				Math.abs(this._position.x - this._target.x) < 0.005 &&
				Math.abs(this._position.y - this._target.y) < 0.005
			) {
				this._target = null;
			}
		}

		this._position = this._position.add(this._direction.scale(this._speed));
	}

	public destroy(): void {}

	public move(dest: Vector): void {
		this._target = dest.clone();
	}
}
