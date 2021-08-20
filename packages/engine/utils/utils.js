export var TRANSPARENT = 'rgba(0, 0, 0, 0)';
export function isGameObject(entity) {
    return entity.type === 'GAME_OBJECT';
}
export function isDynamic(obj) {
    return obj.dynamic;
}
export function random(max) {
    if (max === void 0) { max = 1; }
    return Math.random() * max;
}
