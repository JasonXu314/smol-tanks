import { DynamicGameObject, Entity, GameObject } from '../types';
export declare const TRANSPARENT = "rgba(0, 0, 0, 0)";
export declare function isGameObject(entity: Entity): entity is GameObject;
export declare function isDynamic(obj: GameObject): obj is DynamicGameObject;
export declare function random(max?: number): number;
