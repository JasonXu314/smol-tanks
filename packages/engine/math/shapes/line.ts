import { MathConstruct } from 'math/types';
import { Vector } from '../vector';
import { Ray } from './ray';

export class Line {
	public intercept: Vector;
	public slope: number | undefined;

	constructor(pt: Vector, slope: number | undefined) {
		this.slope = slope;

		if (pt.x === 0) {
			this.intercept = pt;
		} else {
			if (slope === undefined) {
				if (pt.x === 0) {
					this.intercept = Vector.ZERO;
				} else {
					this.intercept = new Vector(pt.x, 0);
				}
			} else {
				const yDelta = pt.x * -slope;

				this.intercept = new Vector(0, pt.y + yDelta);
			}
		}
	}

	public intersects(other: MathConstruct): boolean {
		if (other instanceof Line) {
			return this.slope === other.slope
				? this.slope === undefined
					? this.intercept.x === other.intercept.x
					: this.intercept.y === other.intercept.y
				: true;
		} else if (other instanceof Ray) {
			return false;
		} else {
			return false;
		}
	}

	public eval(x: number): number | undefined {
		return this.slope === undefined ? undefined : this.intercept.y + x * this.slope;
	}

	public below(pt: Vector): boolean {
		return this.slope === undefined ? false : this.eval(pt.x)! > pt.y;
	}

	public toRight(pt: Vector): boolean {
		return this.slope === undefined ? this.intercept.x < pt.x : false;
	}

	public intersection(other: Line): Vector {
		if (!this.intersects(other)) {
			throw new Error(`Lines ${this}, ${other} do not intersect`);
		}

		if (this.slope === undefined) {
			if (other.slope === undefined) {
				if (this.intercept.x === other.intercept.x) {
					return new Vector(this.intercept.x, 0);
				}
			} else {
				return new Vector(this.intercept.x, other.intercept.y + this.intercept.x * other.slope);
			}
		} else if (other.slope === undefined) {
			if (this.slope === undefined) {
				if (this.intercept.x === other.intercept.x) {
					return new Vector(this.intercept.x, 0);
				}
			} else {
				return new Vector(other.intercept.x, this.intercept.y + other.intercept.x * this.slope);
			}
		}

		if (this.slope === 0 && other.slope === 0 && this.intercept.y === other.intercept.y) {
			return this.intercept.clone();
		}

		const a1 = this.slope,
			c1 = this.intercept.y,
			a2 = other.slope,
			c2 = other.intercept.y;

		return new Vector((c1 - c2) / (a2! - a1!), (c1 * a2! - c2 * a1!) / (a2! - a1!));
	}

	[Symbol.toPrimitive]() {
		return `int: ${this.intercept}, slope: ${this.slope}`;
	}
}
