import { Engine } from '../engine';
import { DynamicGameObject, RenderEngine } from '../types';
export declare class Cursor implements DynamicGameObject {
    private engine;
    private cursorType;
    readonly type = "GAME_OBJECT";
    readonly dynamic = true;
    readonly id = "cursor";
    private animTick;
    constructor(engine: Engine);
    update(): void;
    render(engine: RenderEngine): void;
    destroy(): void;
}
