import { MathConstruct } from 'math/types';
import { Vector } from '../vector';
export declare class Ray {
    vertex: Vector;
    direction: Vector;
    get slope(): number | undefined;
    constructor(vertex: Vector, direction: Vector);
    intersects(other: MathConstruct): boolean;
    toRight(pt: Vector): boolean;
    [Symbol.toPrimitive](): string;
}
