"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectBox = void 0;
var math_1 = require("../math");
var SelectBox = /** @class */ (function () {
    function SelectBox(engine) {
        this.engine = engine;
        this.type = 'GAME_OBJECT';
        this.dynamic = true;
        this.id = 'select-box';
    }
    SelectBox.prototype.update = function () { };
    SelectBox.prototype.render = function (engine) {
        if (this.engine.mouseDown && this.engine.mouseButton === 0) {
            engine.tracePath([
                this.engine.downPos.toRaw(),
                [this.engine.downPos.x, this.engine.mousePos.y],
                this.engine.mousePos.toRaw(),
                [this.engine.mousePos.x, this.engine.downPos.y]
            ], 1, 'white');
            this.engine.selection = math_1.Rectangle.from(this.engine.downPos, this.engine.mousePos);
        }
    };
    SelectBox.prototype.destroy = function () { };
    return SelectBox;
}());
exports.SelectBox = SelectBox;
