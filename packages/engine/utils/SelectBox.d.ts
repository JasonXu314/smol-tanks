import { Engine } from '../engine';
import { DynamicGameObject, RenderEngine } from '../types';
export declare class SelectBox implements DynamicGameObject {
    private engine;
    readonly type = "GAME_OBJECT";
    readonly dynamic = true;
    readonly id = "select-box";
    constructor(engine: Engine);
    update(): void;
    render(engine: RenderEngine): void;
    destroy(): void;
}
