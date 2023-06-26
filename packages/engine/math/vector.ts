import { abs, acos, atan, cos, sin, sqrt } from './functions';
import { RawVector } from './types';

export class Vector {
	static readonly I = new Vector(1, 0);
	static readonly J = new Vector(0, 1);
	static readonly ZERO = new Vector();

	constructor(public x: number = 0, public y: number = 0) {}

	public get magnitude(): number {
		return sqrt(this.x ** 2 + this.y ** 2);
	}

	public get quadrant(): 1 | 2 | 3 | 4 {
		return this.x >= 0 && this.y >= 0 ? 1 : this.x <= 0 && this.y >= 0 ? 2 : this.x <= 0 && this.y < 0 ? 3 : 4;
	}

	public get reflexAngle(): number {
		switch (this.quadrant) {
			case 1:
				return atan(this.y / this.x);
			case 2:
				return Math.PI + atan(this.y / this.x);
			case 3:
				return atan(this.y / this.x) - Math.PI;
			case 4:
				return atan(this.y / this.x);
		}
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

	public closeTo(v: Vector): boolean {
		return Math.abs(this.x - v.x) <= 0.0005 && Math.abs(this.y - v.y) <= 0.0005;
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
		return this.magnitude === 0 ? this : this.multiply(mag / this.magnitude);
	}

	public scaleBy(fac: number): Vector {
		return this.scale(this.magnitude * fac);
	}

	public rotateBy(angle: number): Vector {
		return new Vector(this.x * cos(angle) - this.y * sin(angle), this.x * sin(angle) + this.y * cos(angle)).scale(this.magnitude);
	}

	public dirToRight(v: Vector): boolean {
		// normalize other angle
		const normalized = v.rotateBy(-this.reflexAngle);
		return normalized.y < 0;
	}

	public angleTo(v: Vector): number {
		const dot = this.dot(v);
		const q = this.magnitude * v.magnitude;

		return q === 0 ? 0 : (dot === 0 ? Math.PI / 2 : acos(dot / q)) * (this.dirToRight(v) ? -1 : 1);
	}

	public proj(v: Vector): Vector {
		const angle = abs(this.angleTo(v));

		if (angle > Math.PI / 2) {
			return v.inv().multiply(this.dot(v.inv()) / v.magnitude ** 2);
		} else {
			return v.multiply(this.dot(v) / v.magnitude ** 2);
		}
	}

	public distanceTo(v: Vector): number {
		return sqrt((v.y - this.y) ** 2 + (v.x - this.x) ** 2);
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

if (typeof window !== 'undefined') {
	(window as any).Vector = Vector;
}
