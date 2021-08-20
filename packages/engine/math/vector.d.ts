import { RawVector } from './types';
export declare class Vector {
    x: number;
    y: number;
    static readonly I: Vector;
    static readonly J: Vector;
    static readonly ZERO: Vector;
    constructor(x?: number, y?: number);
    get magnitude(): number;
    get reflexAngle(): number;
    add(v: Vector): Vector;
    subtract(v: Vector): Vector;
    multiply(s: number): Vector;
    divide(s: number): Vector;
    equals(v: Vector): boolean;
    clone(): Vector;
    inv(): Vector;
    dot(v: Vector): number;
    scale(mag: number): Vector;
    scaleBy(fac: number): Vector;
    angleTo(v: Vector): number;
    proj(v: Vector): Vector;
    toRaw(): RawVector;
    [Symbol.iterator](): Generator<number, void, unknown>;
    static fromRaw(raw: RawVector): Vector;
}
