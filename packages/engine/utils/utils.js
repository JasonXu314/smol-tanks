"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = exports.isDynamic = exports.isGameObject = exports.TRANSPARENT = void 0;
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
