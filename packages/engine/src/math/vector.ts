import { abs, acos, sqrt } from './functions';
import { RawVector } from './types';
import { sign } from './utils';

export class Vector {
	static readonly I = new Vector(1, 0);
	static readonly J = new Vector(0, 1);
	static readonly ZERO = new Vector();

	constructor(public x: number = 0, public y: number = 0) {}

	public get magnitude(): number {
		return sqrt(this.x ** 2 + this.y ** 2);
	}

	public get reflexAngle(): number {
		const out = this.angleTo(Vector.I);
		return out < 0 ? 360 + out : out;
	}

	public add(v: Vector): Vector {
		return new Vector(this.x + v.x, this.y + v.y);
	}

	public subtract(v: Vector): Vector {
		return new Vector(this.x - v.x, this.y - v.y);
	}

	public multiply(s: number): Vector {
		return new Vector(this.x * s, this.y * s);
	}

	public divide(s: number): Vector {
		return new Vector(this.x / s, this.y / s);
	}

	public equals(v: Vector): boolean {
		return this.x === v.x && this.y === v.y;
	}

	public clone(): Vector {
		return new Vector(this.x, this.y);
	}

	public inv(): Vector {
		return new Vector(-this.x, -this.y);
	}

	public dot(v: Vector): number {
		return this.x * v.x + this.y * v.y;
	}

	public scale(mag: number): Vector {
		return this.magnitude === 0 ? this.multiply(0) : this.multiply(mag / this.magnitude);
	}

	public scaleBy(fac: number): Vector {
		return this.scale(this.magnitude * fac);
	}

	public angleTo(v: Vector): number {
		const dot = this.dot(v);
		const q = this.magnitude * v.magnitude;
		return dot === 0
			? (sign(this.x) !== sign(v.x)) !== (sign(this.y) !== sign(v.y))
				? -90
				: 90
			: q === 0
			? 0
			: acos(dot / q);
	}

	public proj(v: Vector): Vector {
		const angle = abs(this.angleTo(v));

		if (angle > Math.PI / 2) {
			return v.inv().multiply(this.dot(v.inv()) / v.magnitude ** 2);
		} else {
			return v.multiply(this.dot(v) / v.magnitude ** 2);
		}
	}

	public toRaw(): RawVector {
		return [this.x, this.y];
	}

	*[Symbol.iterator]() {
		yield this.x;
		yield this.y;
	}

	public static fromRaw(raw: RawVector): Vector {
		return new Vector(...raw);
	}
}
