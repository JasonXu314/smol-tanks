"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortClockwise = exports.random = exports.isDynamic = exports.isGameObject = exports.TRANSPARENT = void 0;
var functions_1 = require("../math/functions");
var vector_1 = require("../math/vector");
exports.TRANSPARENT = 'rgba(0, 0, 0, 0)';
function isGameObject(entity) {
    return entity.type === 'GAME_OBJECT';
}
exports.isGameObject = isGameObject;
function isDynamic(obj) {
    return obj.dynamic;
}
exports.isDynamic = isDynamic;
function random(max) {
    if (max === void 0) { max = 1; }
    return Math.random() * max;
}
exports.random = random;
function sortClockwise(pts) {
    var centroid = pts.reduce(function (c, v) { return new vector_1.Vector(c.x + v.x, c.y + v.y); }, new vector_1.Vector()).divide(pts.length);
    return pts.sort(function (a, b) { return functions_1.atan((b.y - centroid.y) / (b.x - centroid.x) - functions_1.atan((a.y - centroid.y) / (a.x - centroid.x))); });
}
exports.sortClockwise = sortClockwise;
