"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Segment = void 0;
var Segment = /** @class */ (function () {
    function Segment(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.slope = (p2.y - p1.y) / (p2.x - p1.x);
    }
    return Segment;
}());
exports.Segment = Segment;
