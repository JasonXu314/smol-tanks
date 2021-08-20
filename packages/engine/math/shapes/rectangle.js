"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rectangle = void 0;
var Rectangle = /** @class */ (function () {
    function Rectangle(minX, minY, maxX, maxY) {
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
    }
    Rectangle.prototype.contains = function (_a, inclusive) {
        var _b = __read(_a, 2), x = _b[0], y = _b[1];
        if (inclusive === void 0) { inclusive = true; }
        return inclusive
            ? x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY
            : x > this.minX && x < this.maxX && y > this.minY && y > this.maxY;
    };
    Rectangle.from = function (p1, p2) {
        return new Rectangle(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y), Math.max(p1.x, p2.x), Math.max(p1.y, p2.y));
    };
    return Rectangle;
}());
exports.Rectangle = Rectangle;
