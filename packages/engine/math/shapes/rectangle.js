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
var utils_1 = require("../../utils/utils");
var vector_1 = require("../vector");
var Rectangle = /** @class */ (function () {
    function Rectangle(a, b, c, d) {
        var _a;
        _a = __read(utils_1.sortClockwise([a, b, c, d]), 4), this.a = _a[0], this.b = _a[1], this.c = _a[2], this.d = _a[3];
    }
    Rectangle.prototype.contains = function (entity, inclusive) {
        var _this = this;
        if (inclusive === void 0) { inclusive = true; }
        if (entity instanceof Rectangle) {
            var a = entity.a, b = entity.b, c = entity.c, d = entity.d;
            return [a, b, c, d].every(function (pt) { return _this.contains(pt, inclusive); });
        }
        else {
            var pt = entity;
            var am = pt.subtract(this.a);
            var ab = this.b.subtract(this.a);
            var ad = this.d.subtract(this.a);
            return inclusive
                ? am.dot(ab) >= 0 && am.dot(ab) <= ab.dot(ab) && am.dot(ad) >= 0 && am.dot(ad) <= ad.dot(ad) && ad.magnitude !== 0 && ab.magnitude !== 0
                : am.dot(ab) > 0 && am.dot(ab) < ab.dot(ab) && am.dot(ad) > 0 && am.dot(ad) < ad.dot(ad) && ad.magnitude !== 0 && ab.magnitude !== 0;
        }
    };
    Rectangle.prototype.intersects = function (rect) {
        var _this = this;
        var a = rect.a, b = rect.b, c = rect.c, d = rect.d;
        return [a, b, c, d].some(function (pt) { return _this.contains(pt, false); }) && [a, b, c, d].some(function (pt) { return !_this.contains(pt, true); });
    };
    Rectangle.from = function (p1, p2) {
        return new Rectangle(p1, new vector_1.Vector(p2.x, p1.y), p2, new vector_1.Vector(p1.x, p2.y));
    };
    return Rectangle;
}());
exports.Rectangle = Rectangle;
if (typeof window !== 'undefined') {
    window.Rectangle = Rectangle;
}
