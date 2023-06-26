import { MathConstruct } from '../types';
import { Vector } from '../vector';
export declare class Ray {
    vertex: Vector;
    direction: Vector;
    get slope(): number | undefined;
    constructor(vertex: Vector, direction: Vector);
    intersects(other: MathConstruct): boolean;
    toRight(c: Vector | Ray): boolean;
    behind(pt: Vector): boolean;
    inv(): Ray;
    [Symbol.toPrimitive](): string;
}
