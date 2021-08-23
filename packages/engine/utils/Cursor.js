"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cursor = void 0;
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
        switch (this.cursorType) {
            case 'DEFAULT':
                engine.drawImage(this.engine.mousePos.toRaw(), [10, 16], 'default.svg', false);
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
