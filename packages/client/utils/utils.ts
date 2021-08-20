import { Rectangle, Vector } from '@smol-tanks/engine/dist/math';

export function intersects(a: Rectangle, b: Rectangle) {
	return b.minX <= a.maxX && b.minY <= a.maxY && b.maxX >= a.minX && b.maxY >= a.minY;
}

export function rotateBy(vec: Vector, angle: number) {
	return new Vector(
		vec.x * Math.cos(angle) - vec.y * Math.sin(angle),
		vec.x * Math.sin(angle) + vec.y * Math.cos(angle)
	).scale(1);
}
