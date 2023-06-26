import { sortClockwise } from '../../utils/utils';
import { Vector } from '../vector';

export class Rectangle {
	public a: Vector;
	public b: Vector;
	public c: Vector;
	public d: Vector;

	constructor(a: Vector, b: Vector, c: Vector, d: Vector) {
		[this.a, this.b, this.c, this.d] = sortClockwise([a, b, c, d]);
	}

	public contains(entity: Vector, inclusive?: boolean): boolean;
	public contains(entity: Rectangle, inclusive?: boolean): boolean;
	public contains(entity: Vector | Rectangle, inclusive: boolean = true): boolean {
		if (entity instanceof Rectangle) {
			const { a, b, c, d } = entity;

			return [a, b, c, d].every((pt) => this.contains(pt, inclusive));
		} else {
			const pt = entity;
			const am = pt.subtract(this.a);
			const ab = this.b.subtract(this.a);
			const ad = this.d.subtract(this.a);

			return inclusive
				? am.dot(ab) >= 0 && am.dot(ab) <= ab.dot(ab) && am.dot(ad) >= 0 && am.dot(ad) <= ad.dot(ad) && ad.magnitude !== 0 && ab.magnitude !== 0
				: am.dot(ab) > 0 && am.dot(ab) < ab.dot(ab) && am.dot(ad) > 0 && am.dot(ad) < ad.dot(ad) && ad.magnitude !== 0 && ab.magnitude !== 0;
		}
	}

	public intersects(rect: Rectangle): boolean {
		const { a, b, c, d } = rect;

		return [a, b, c, d].some((pt) => this.contains(pt, false)) && [a, b, c, d].some((pt) => !this.contains(pt, true));
	}

	public static from(p1: Vector, p2: Vector): Rectangle {
		return new Rectangle(p1, new Vector(p2.x, p1.y), p2, new Vector(p1.x, p2.y));
	}
}

if (typeof window !== 'undefined') {
	(window as any).Rectangle = Rectangle;
}
