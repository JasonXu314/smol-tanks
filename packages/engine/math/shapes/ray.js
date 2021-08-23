"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ray = void 0;
var line_1 = require("./line");
var Ray = /** @class */ (function () {
    function Ray(vertex, direction) {
        this.vertex = vertex;
        this.direction = direction;
    }
    Object.defineProperty(Ray.prototype, "slope", {
        get: function () {
            return this.direction.x === 0 ? undefined : this.direction.y / this.direction.x;
        },
        enumerable: false,
        configurable: true
    });
    Ray.prototype.intersects = function (other) {
        if (other instanceof line_1.Line) {
            return false;
        }
        else if (other instanceof Ray) {
            return false;
        }
        else {
            return false;
        }
    };
    Ray.prototype.toRight = function (pt) {
        var dirToPt = pt.subtract(this.vertex);
        return this.direction.angleTo(dirToPt) < 0;
    };
    // public intersection(other: Line): Vector {
    // 	if (!this.intersects(other)) {
    // 		throw new Error(`Lines ${this}, ${other} do not intersect`);
    // 	}
    // 	if (this.slope === undefined) {
    // 		if (other.slope === undefined) {
    // 			if (this.intercept.x === other.intercept.x) {
    // 				return new Vector(this.intercept.x, 0);
    // 			}
    // 		} else {
    // 			return new Vector(this.intercept.x, other.intercept.y + this.intercept.x * other.slope);
    // 		}
    // 	} else if (other.slope === undefined) {
    // 		if (this.slope === undefined) {
    // 			if (this.intercept.x === other.intercept.x) {
    // 				return new Vector(this.intercept.x, 0);
    // 			}
    // 		} else {
    // 			return new Vector(other.intercept.x, this.intercept.y + other.intercept.x * this.slope);
    // 		}
    // 	}
    // 	if (this.slope === 0 && other.slope === 0 && this.intercept.y === other.intercept.y) {
    // 		return this.intercept.clone();
    // 	}
    // 	const a1 = this.slope,
    // 		c1 = this.intercept.y,
    // 		a2 = other.slope,
    // 		c2 = other.intercept.y;
    // 	return new Vector((c1 - c2) / (a2! - a1!), (c1 * a2! - c2 * a1!) / (a2! - a1!));
    // }
    Ray.prototype[Symbol.toPrimitive] = function () {
        return "vertex: " + this.vertex + ", dir: " + this.direction;
    };
    return Ray;
}());
exports.Ray = Ray;
if (typeof window !== 'undefined') {
    window.Ray = Ray;
}
