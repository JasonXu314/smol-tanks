import { EventSrc } from '@smol-tanks/evt-src';
import { Rectangle, Vector } from './math';
import { GameObjectConstructor, Orders, OrderSrc, RenderEngineConstructor, TickInfo, Unit, UnitConstructor } from './types';
interface EngineEvents {
    INIT: undefined;
    TICK: TickInfo;
}
export declare class Engine {
    canvas: HTMLCanvasElement;
    orderEvents: OrderSrc;
    events: EventSrc<EngineEvents>;
    domEvents: EventSrc<GlobalEventHandlersEventMap>;
    running: boolean;
    mouseDown: boolean;
    mousePos: Vector;
    downPos: Vector | null;
    mouseButton: number | null;
    upPos: Vector | null;
    ctrl: boolean;
    alt: boolean;
    selection: Rectangle | null;
    order: keyof Orders | null;
    private gameLoop;
    private renderLoop;
    private renderEngine;
    private lastTime;
    private unsubscribers;
    private layers;
    private cursor;
    private selectBox;
    private scrolling;
    private panning;
    private zoomTarget;
    private units;
    private _selectedUnits;
    get selectedUnits(): Unit[];
    constructor(canvas: HTMLCanvasElement, RenderEngine: RenderEngineConstructor, orderEvents: OrderSrc);
    private tick;
    private render;
    private attachListeners;
    addObj(Obj: GameObjectConstructor, layer: number): void;
    addUnit(Unit: UnitConstructor): void;
    start(): void;
    stop(): void;
}
export {};
