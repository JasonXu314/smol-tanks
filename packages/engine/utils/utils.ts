import { atan } from '../math/functions';
import { Vector } from '../math/vector';
import { DynamicGameObject, Entity, GameObject } from '../types';

export const TRANSPARENT = 'rgba(0, 0, 0, 0)';

export function isGameObject(entity: Entity): entity is GameObject {
	return entity.type === 'GAME_OBJECT';
}

export function isDynamic(obj: GameObject): obj is DynamicGameObject {
	return obj.dynamic;
}

export function random(max: number = 1): number {
	return Math.random() * max;
}

export function sortClockwise(pts: Vector[]): Vector[] {
	const centroid = pts.reduce((c, v) => new Vector(c.x + v.x, c.y + v.y), new Vector()).divide(pts.length);

	return pts.sort((a, b) => atan((b.y - centroid.y) / (b.x - centroid.x) - atan((a.y - centroid.y) / (a.x - centroid.x))));
}
