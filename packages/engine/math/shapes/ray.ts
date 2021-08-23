import { MathConstruct } from 'math/types';
import { Vector } from '../vector';
import { Line } from './line';

export class Ray {
	public get slope(): number | undefined {
		return this.direction.x === 0 ? undefined : this.direction.y / this.direction.x;
	}

	constructor(public vertex: Vector, public direction: Vector) {}

	public intersects(other: MathConstruct): boolean {
		if (other instanceof Line) {
			return false;
		} else if (other instanceof Ray) {
			return false;
		} else {
			return false;
		}
	}

	public toRight(pt: Vector): boolean {
		const dirToPt = pt.subtract(this.vertex);
		return this.direction.angleTo(dirToPt) < 0;
	}

	// public intersection(other: Line): Vector {
	// 	if (!this.intersects(other)) {
	// 		throw new Error(`Lines ${this}, ${other} do not intersect`);
	// 	}

	// 	if (this.slope === undefined) {
	// 		if (other.slope === undefined) {
	// 			if (this.intercept.x === other.intercept.x) {
	// 				return new Vector(this.intercept.x, 0);
	// 			}
	// 		} else {
	// 			return new Vector(this.intercept.x, other.intercept.y + this.intercept.x * other.slope);
	// 		}
	// 	} else if (other.slope === undefined) {
	// 		if (this.slope === undefined) {
	// 			if (this.intercept.x === other.intercept.x) {
	// 				return new Vector(this.intercept.x, 0);
	// 			}
	// 		} else {
	// 			return new Vector(other.intercept.x, this.intercept.y + other.intercept.x * this.slope);
	// 		}
	// 	}

	// 	if (this.slope === 0 && other.slope === 0 && this.intercept.y === other.intercept.y) {
	// 		return this.intercept.clone();
	// 	}

	// 	const a1 = this.slope,
	// 		c1 = this.intercept.y,
	// 		a2 = other.slope,
	// 		c2 = other.intercept.y;

	// 	return new Vector((c1 - c2) / (a2! - a1!), (c1 * a2! - c2 * a1!) / (a2! - a1!));
	// }

	[Symbol.toPrimitive]() {
		return `vertex: ${this.vertex}, dir: ${this.direction}`;
	}
}

if (typeof window !== 'undefined') {
	(window as any).Ray = Ray;
}
