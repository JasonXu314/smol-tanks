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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cursor = void 0;
var math_1 = require("../math");
var TEMPLATES = {
    DEFAULT: [new math_1.Vector(12, -13), new math_1.Vector(2, -3), new math_1.Vector(2, -19), new math_1.Vector(7, -14)],
    MOVE: [
        new math_1.Vector(-7.5, -7.5),
        new math_1.Vector(7.5, -7.5),
        new math_1.Vector(7.5, 7.5),
        new math_1.Vector(-7.5, 7.5),
        new math_1.Vector(-7.5, -7.5),
        new math_1.Vector(7.5, 7.5),
        new math_1.Vector(7.5, -7.5),
        new math_1.Vector(-7.5, 7.5)
    ]
};
var STYLES = {
    DEFAULT: [2, 'white', 'black'],
    MOVE: [1, 'green']
};
var Cursor = /** @class */ (function () {
    function Cursor(engine) {
        this.engine = engine;
        this.cursorType = 'DEFAULT';
        this.type = 'GAME_OBJECT';
        this.dynamic = true;
        this.id = 'cursor';
        this.animTick = 0;
    }
    Cursor.prototype.update = function () {
        if (this.engine.order === 'MOVE') {
            this.cursorType = 'MOVE';
            if (this.animTick === 50) {
                this.animTick = 0;
            }
            else {
                this.animTick++;
            }
        }
        else {
            this.cursorType = 'DEFAULT';
            this.animTick = 0;
        }
    };
    Cursor.prototype.render = function (engine) {
        var _this = this;
        switch (this.cursorType) {
            case 'DEFAULT':
                engine.fillPath.apply(engine, __spreadArray([TEMPLATES[this.cursorType].map(function (template) { return template.add(_this.engine.mousePos).toRaw(); })], __read(STYLES[this.cursorType])));
                break;
            case 'MOVE':
                engine.drawImage(this.engine.mousePos.toRaw(), [15 - this.animTick / 5, 15 - this.animTick / 5], 'move.svg');
                break;
        }
    };
    Cursor.prototype.destroy = function () { };
    return Cursor;
}());
exports.Cursor = Cursor;
