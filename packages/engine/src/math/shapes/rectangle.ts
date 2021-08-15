import { Vector } from '../vector';

export class Rectangle {
	constructor(public minX: number, public minY: number, public maxX: number, public maxY: number) {}

	public static from(p1: Vector, p2: Vector): Rectangle {
		return new Rectangle(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y), Math.max(p1.x, p2.x), Math.max(p1.y, p2.y));
	}
}
