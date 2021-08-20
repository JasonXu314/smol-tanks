"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acos = exports.log = exports.ln = exports.abs = exports.sqrt = exports.radToDeg = void 0;
function radToDeg(num) {
    return (num * 180) / Math.PI;
}
exports.radToDeg = radToDeg;
function sqrt(num) {
    return Math.sqrt(num);
}
exports.sqrt = sqrt;
function abs(num) {
    return Math.abs(num);
}
exports.abs = abs;
function ln(num) {
    return Math.log(num);
}
exports.ln = ln;
function log(num) {
    return Math.log10(num);
}
exports.log = log;
function acos(num) {
    return radToDeg(Math.acos(num));
}
exports.acos = acos;
