"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Line = void 0;
var vector_1 = require("../vector");
var Line = /** @class */ (function () {
    function Line(pt, slope) {
        this.slope = slope;
        if (pt.x === 0) {
            this.intercept = pt;
        }
        else {
            if (slope === undefined) {
                if (pt.x === 0) {
                    this.intercept = vector_1.Vector.ZERO;
                }
                else {
                    this.intercept = new vector_1.Vector(pt.x, 0);
                }
            }
            else {
                var yDelta = pt.x * -slope;
                this.intercept = new vector_1.Vector(0, pt.y + yDelta);
            }
        }
    }
    Line.prototype.intersects = function (other) {
        return this.slope === other.slope
            ? this.slope === undefined
                ? this.intercept.x === other.intercept.x
                : this.intercept.y === other.intercept.y
            : true;
    };
    Line.prototype.eval = function (x) {
        return this.slope === undefined ? undefined : this.intercept.y + x * this.slope;
    };
    Line.prototype.below = function (pt) {
        return this.slope === undefined ? false : this.eval(pt.x) > pt.y;
    };
    Line.prototype.toRight = function (pt) {
        return this.slope === undefined ? this.intercept.x < pt.x : false;
    };
    Line.prototype.intersection = function (other) {
        if (!this.intersects(other)) {
            throw new Error("Lines " + this + ", " + other + " do not intersect");
        }
        if (this.slope === undefined) {
            if (other.slope === undefined) {
                if (this.intercept.x === other.intercept.x) {
                    return new vector_1.Vector(this.intercept.x, 0);
                }
            }
            else {
                return new vector_1.Vector(this.intercept.x, other.intercept.y + this.intercept.x * other.slope);
            }
        }
        else if (other.slope === undefined) {
            if (this.slope === undefined) {
                if (this.intercept.x === other.intercept.x) {
                    return new vector_1.Vector(this.intercept.x, 0);
                }
            }
            else {
                return new vector_1.Vector(other.intercept.x, this.intercept.y + other.intercept.x * this.slope);
            }
        }
        if (this.slope === 0 && other.slope === 0 && this.intercept.y === other.intercept.y) {
            return this.intercept.clone();
        }
        var a1 = this.slope, c1 = this.intercept.y, a2 = other.slope, c2 = other.intercept.y;
        return new vector_1.Vector((c1 - c2) / (a2 - a1), (c1 * a2 - c2 * a1) / (a2 - a1));
    };
    Line.prototype[Symbol.toPrimitive] = function () {
        return "int: " + this.intercept + ", slope: " + this.slope;
    };
    return Line;
}());
exports.Line = Line;
