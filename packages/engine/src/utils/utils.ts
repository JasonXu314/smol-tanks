import { DynamicGameObject, Entity, GameObject } from '../types';

export const TRANSPARENT = 'rgba(0, 0, 0, 0)';

export function isGameObject(entity: Entity): entity is GameObject {
	return entity.type === 'GAME_OBJECT';
}

export function isDynamic(obj: GameObject): obj is DynamicGameObject {
	return obj.dynamic;
}
