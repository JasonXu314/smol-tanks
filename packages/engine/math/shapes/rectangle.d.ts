import { Vector } from '../vector';
export declare class Rectangle {
    a: Vector;
    b: Vector;
    c: Vector;
    d: Vector;
    constructor(a: Vector, b: Vector, c: Vector, d: Vector);
    contains(entity: Vector, inclusive?: boolean): boolean;
    contains(entity: Rectangle, inclusive?: boolean): boolean;
    intersects(rect: Rectangle): boolean;
    static from(p1: Vector, p2: Vector): Rectangle;
}
