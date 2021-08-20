import { Rectangle } from '../math';
var SelectBox = /** @class */ (function () {
    function SelectBox(engine) {
        this.engine = engine;
        this.type = 'GAME_OBJECT';
        this.dynamic = true;
        this.id = 'select-box';
    }
    SelectBox.prototype.update = function () { };
    SelectBox.prototype.render = function (engine) {
        if (this.engine.downPos && !this.engine.upPos) {
            engine.tracePath([
                this.engine.downPos.toRaw(),
                [this.engine.downPos.x, this.engine.mousePos.y],
                this.engine.mousePos.toRaw(),
                [this.engine.mousePos.x, this.engine.downPos.y]
            ], 1, 'white');
            this.engine.selection = Rectangle.from(this.engine.downPos, this.engine.mousePos);
        }
    };
    SelectBox.prototype.destroy = function () { };
    return SelectBox;
}());
export { SelectBox };
