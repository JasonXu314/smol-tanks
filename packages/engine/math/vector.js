"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector = void 0;
var functions_1 = require("./functions");
var Vector = /** @class */ (function () {
    function Vector(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    Object.defineProperty(Vector.prototype, "magnitude", {
        get: function () {
            return functions_1.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "quadrant", {
        get: function () {
            return this.x >= 0 && this.y >= 0 ? 1 : this.x <= 0 && this.y >= 0 ? 2 : this.x <= 0 && this.y < 0 ? 3 : 4;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "reflexAngle", {
        get: function () {
            switch (this.quadrant) {
                case 1:
                    return functions_1.atan(this.y / this.x);
                case 2:
                    return Math.PI + functions_1.atan(this.y / this.x);
                case 3:
                    return functions_1.atan(this.y / this.x) - Math.PI;
                case 4:
                    return functions_1.atan(this.y / this.x);
            }
        },
        enumerable: false,
        configurable: true
    });
    Vector.prototype.add = function (v) {
        return new Vector(this.x + v.x, this.y + v.y);
    };
    Vector.prototype.subtract = function (v) {
        return new Vector(this.x - v.x, this.y - v.y);
    };
    Vector.prototype.multiply = function (s) {
        return new Vector(this.x * s, this.y * s);
    };
    Vector.prototype.divide = function (s) {
        return new Vector(this.x / s, this.y / s);
    };
    Vector.prototype.equals = function (v) {
        return this.x === v.x && this.y === v.y;
    };
    Vector.prototype.closeTo = function (v) {
        return Math.abs(this.x - v.x) <= 0.0005 && Math.abs(this.y - v.y) <= 0.0005;
    };
    Vector.prototype.clone = function () {
        return new Vector(this.x, this.y);
    };
    Vector.prototype.inv = function () {
        return new Vector(-this.x, -this.y);
    };
    Vector.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y;
    };
    Vector.prototype.scale = function (mag) {
        return this.magnitude === 0 ? this : this.multiply(mag / this.magnitude);
    };
    Vector.prototype.scaleBy = function (fac) {
        return this.scale(this.magnitude * fac);
    };
    Vector.prototype.rotateBy = function (angle) {
        return new Vector(this.x * functions_1.cos(angle) - this.y * functions_1.sin(angle), this.x * functions_1.sin(angle) + this.y * functions_1.cos(angle)).scale(this.magnitude);
    };
    Vector.prototype.dirToRight = function (v) {
        // normalize other angle
        var normalized = v.rotateBy(-this.reflexAngle);
        return normalized.y < 0;
    };
    Vector.prototype.angleTo = function (v) {
        var dot = this.dot(v);
        var q = this.magnitude * v.magnitude;
        return q === 0 ? 0 : (dot === 0 ? Math.PI / 2 : functions_1.acos(dot / q)) * (this.dirToRight(v) ? -1 : 1);
    };
    Vector.prototype.proj = function (v) {
        var angle = functions_1.abs(this.angleTo(v));
        if (angle > Math.PI / 2) {
            return v.inv().multiply(this.dot(v.inv()) / Math.pow(v.magnitude, 2));
        }
        else {
            return v.multiply(this.dot(v) / Math.pow(v.magnitude, 2));
        }
    };
    Vector.prototype.distanceTo = function (v) {
        return functions_1.sqrt(Math.pow((v.y - this.y), 2) + Math.pow((v.x - this.x), 2));
    };
    Vector.prototype.toRaw = function () {
        return [this.x, this.y];
    };
    Vector.prototype[Symbol.iterator] = function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.x];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.y];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    };
    Vector.fromRaw = function (raw) {
        return new (Vector.bind.apply(Vector, __spreadArray([void 0], __read(raw))))();
    };
    Vector.I = new Vector(1, 0);
    Vector.J = new Vector(0, 1);
    Vector.ZERO = new Vector();
    return Vector;
}());
exports.Vector = Vector;
if (typeof window !== 'undefined') {
    window.Vector = Vector;
}
