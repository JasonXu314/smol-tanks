import { Vector } from '../vector';

export class Rectangle {
	constructor(public minX: number, public minY: number, public maxX: number, public maxY: number) {}

	public contains([x, y]: Vector, inclusive: boolean = true): boolean {
		return inclusive
			? x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY
			: x > this.minX && x < this.maxX && y > this.minY && y > this.maxY;
	}

	public static from(p1: Vector, p2: Vector): Rectangle {
		return new Rectangle(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y), Math.max(p1.x, p2.x), Math.max(p1.y, p2.y));
	}
}
