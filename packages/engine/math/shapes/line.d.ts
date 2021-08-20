import { Vector } from '../vector';
export declare class Line {
    intercept: Vector;
    slope: number | undefined;
    constructor(pt: Vector, slope: number | undefined);
    intersects(other: Line): boolean;
    eval(x: number): number | undefined;
    below(pt: Vector): boolean;
    toRight(pt: Vector): boolean;
    intersection(other: Line): Vector;
    [Symbol.toPrimitive](): string;
}
