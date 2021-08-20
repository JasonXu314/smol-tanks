import { Vector } from '../vector';

export class Segment {
	public slope: number;

	constructor(public p1: Vector, public p2: Vector) {
		this.slope = (p2.y - p1.y) / (p2.x - p1.x);
	}
}
