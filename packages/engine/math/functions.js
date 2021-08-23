"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.atan = exports.acos = exports.cos = exports.sin = exports.log = exports.ln = exports.abs = exports.sqrt = exports.degToRad = exports.radToDeg = void 0;
function radToDeg(num) {
    return (num * 180) / Math.PI;
}
exports.radToDeg = radToDeg;
function degToRad(num) {
    return (num * Math.PI) / 180;
}
exports.degToRad = degToRad;
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
function sin(angle) {
    return Math.sin(angle);
}
exports.sin = sin;
function cos(angle) {
    return Math.cos(angle);
}
exports.cos = cos;
function acos(num) {
    return Math.acos(num > 1 || num < -1 ? Math.round(num) : num);
}
exports.acos = acos;
function atan(num) {
    return Math.atan(num > 1 || num < -1 ? Math.round(num) : num);
}
exports.atan = atan;
