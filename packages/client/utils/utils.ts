import { Rectangle } from '@smol-tanks/engine/math';

export function intersects(a: Rectangle, b: Rectangle) {
	return b.minX <= a.maxX && b.minY <= a.maxY && b.maxX >= a.minX && b.maxY >= a.minY;
}
