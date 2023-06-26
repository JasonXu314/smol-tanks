import { Engine, Order, Orders, RenderEngine, Template, Unit } from '@smol-tanks/engine';
import { abs, Rectangle, sign, sqrt, Vector } from '@smol-tanks/engine/math';
import { TRANSPARENT } from '@smol-tanks/engine/utils/utils';
import { Driver } from './crew/Driver';

type TankTemplates = 'CHASSIS' | 'TURRET' | 'GUN';

const TEMPLATES: Template<TankTemplates> = {
	CHASSIS: [new Vector(-10, -7.5), new Vector(10, -7.5), new Vector(10, 7.5), new Vector(-10, 7.5)],
	TURRET: [
		new Vector(-5, -2.5),
		new Vector(-2.5, -5),
		new Vector(1.5, -5),
		new Vector(5, -1.5),
		new Vector(5, 1.5),
		new Vector(1.5, 5),
		new Vector(-2.5, 5),
		new Vector(-5, 2.5)
	],
	GUN: [new Vector(3.5, -1), new Vector(13.5, -1), new Vector(13.5, 1), new Vector(3.5, 1)]
};

export class Sherman implements Unit {
	public readonly type = 'UNIT';
	public readonly dynamic = true;
	public readonly name = 'Sherman';

	public readonly maxSpeed = 1.5;
	public readonly accel = 0.05;
	public readonly turnRate = Math.PI / 180;

	private driver: Driver;
	private orderQueue: Orders[keyof Orders][] = [];

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

	constructor(private engine: Engine, public readonly id: string, initPos: Vector) {
		this.driver = new Driver(this);
		this._position = initPos;

		if (typeof window !== 'undefined') {
			(window as any).tank = this;
		}
	}

	public render(engine: RenderEngine): void {
		if (this._target && this._selected) {
			engine.line([this._position.toRaw(), this._target.toRaw()], 1, 'green');

			if (this.engine.shift) {
				engine.line(
					[
						this._target.toRaw(),
						...this.orderQueue
							.slice(1)
							.filter((order) => order.type === 'MOVE')
							.map((order) => order.target.toRaw())
					],
					1,
					'green'
				);
			}
		}
		engine.fillPath(
			TEMPLATES.CHASSIS.map((vec) => vec.rotateBy(this._direction.reflexAngle).add(this._position).toRaw()),
			1,
			this._selected ? 'white' : TRANSPARENT,
			'green'
		);
		engine.fillPath(
			TEMPLATES.TURRET.map((vec) => vec.rotateBy(this._direction.reflexAngle).add(this._position).toRaw()),
			1,
			TRANSPARENT,
			'darkgreen'
		);
		engine.fillPath(
			TEMPLATES.GUN.map((vec) => vec.rotateBy(this._direction.reflexAngle).add(this._position).toRaw()),
			1,
			TRANSPARENT,
			'black'
		);
	}

	public update(): void {
		const outline = TEMPLATES.CHASSIS.map((vec) => vec.rotateBy(this._direction.reflexAngle).add(this._position));
		if (this.engine.selection) {
			if (this.engine.selection.contains(Rectangle.from(outline[0], outline[2]))) {
				// console.log(this.engine.selection, outline);
				this._selected = true;
			} else {
				this._selected = false;
			}
		}
		const [left, right] = this.driver.diffDrive();
		const power = sqrt(left ** 2 + right ** 2);
		const signedPower = sign(left + right) * power;
		if (signedPower > this._speed / this.maxSpeed) {
			this._speed += this.accel;
		} else if (signedPower < this._speed / this.maxSpeed) {
			this._speed -= this.accel;
		}
		if (left > right) {
			this._direction = this._direction.rotateBy((-this.turnRate * power) / sqrt(2));
		} else {
			this._direction = this._direction.rotateBy((this.turnRate * power) / sqrt(2));
		}

		if (this._target && abs(this._position.x - this._target.x) < 2.5 && abs(this._position.y - this._target.y) < 2.5) {
			this.fulfillOrder();
		}

		this._position = this._position.add(this._direction.scale(this._speed));
	}

	public destroy(): void {}

	public issueOrder(order: Order, queue: boolean): void {
		if (queue) {
			this.orderQueue.push(order);

			if (this.orderQueue.length === 0) {
				this.processOrder(order);
			}
		} else {
			this.orderQueue = [order];
			this.processOrder(order);
		}
	}

	private processOrder(order: Order): void {
		if (order.type === 'MOVE') {
			this._target = order.target;
		}
	}

	private fulfillOrder(): void {
		const currentOrder = this.orderQueue.shift();

		if (currentOrder) {
			if (currentOrder.type === 'MOVE') {
				this._target = null;
			}

			const nextOrder = this.orderQueue.at(0);
			if (nextOrder) {
				this.processOrder(nextOrder);
			}
		}
	}
}
