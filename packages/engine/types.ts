import { EventSrc } from '@smol-tanks/evt-src';
import { Engine } from './engine';
import { Vector } from './math';
import { RawVector } from './math/types';

export type RenderEngineConstructor = new (canvas: HTMLCanvasElement) => RenderEngine;
export type GameObjectConstructor = new (engine: Engine, id: string) => GameObject;
export type UnitConstructor = new (engine: Engine, id: string, initPos: Vector) => Unit;
export type EntityType = 'GAME_OBJECT' | 'UNIT';
export type Template<T extends string> = Record<T, Vector[]>;
export type OrderSrc = EventSrc<Orders>;

export type Order = MoveOrder;
export type Orders = {
	MOVE: MoveOrder;
};

export interface RenderEngine {
	zoom: number;
	viewPos: RawVector;

	clear(): void;
	renderBackground(): void;
	fillPath(path: RawVector[], width: number, stroke: string | CanvasGradient, fill: string | CanvasGradient): void;
	tracePath(path: RawVector[], width: number, stroke: string | CanvasGradient): void;
	gameToCanvas(vec: RawVector): RawVector;
	canvasToGame(vec: RawVector): RawVector;
	drawImage(pos: RawVector, [width, height]: [number, number], image: string, center?: boolean): void;
	line(path: RawVector[], width: number, stroke: string | CanvasGradient): void;
}

export interface TickInfo {
	timeDelta: number;
}

export interface Entity {
	readonly type: EntityType;
	readonly id: string;
}

export interface GameObject extends Entity {
	readonly type: 'GAME_OBJECT' | 'UNIT';
	readonly dynamic: boolean;

	render(engine: RenderEngine): void;
	destroy(): void;
}

export interface DynamicGameObject extends GameObject {
	readonly dynamic: true;

	update(tick: TickInfo): void;
}

export interface Unit extends DynamicGameObject {
	readonly type: 'UNIT';
	readonly selected: boolean;
	readonly name: string;
	readonly target: Vector | null;
	readonly position: Vector;
	readonly direction: Vector;
	readonly speed: number;

	readonly turnRate: number;
	readonly maxSpeed: number;
	readonly accel: number;

	issueOrder(order: Order, queue: boolean): void;
}

export interface MoveOrder {
	type: 'MOVE';
	target: Vector;
}
