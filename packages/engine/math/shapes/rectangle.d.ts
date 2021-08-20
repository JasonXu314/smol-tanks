import { Vector } from '../vector';
export declare class Rectangle {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    constructor(minX: number, minY: number, maxX: number, maxY: number);
    contains([x, y]: Vector, inclusive?: boolean): boolean;
    static from(p1: Vector, p2: Vector): Rectangle;
}
