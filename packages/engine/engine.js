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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = void 0;
var evt_src_1 = require("@smol-tanks/evt-src");
var nanoid_1 = require("nanoid");
var math_1 = require("./math");
var Cursor_1 = require("./utils/Cursor");
var SelectBox_1 = require("./utils/SelectBox");
var utils_1 = require("./utils/utils");
var Engine = /** @class */ (function () {
    function Engine(canvas, RenderEngine, orderEvents) {
        this.canvas = canvas;
        this.orderEvents = orderEvents;
        this.events = new evt_src_1.EventSrc(['INIT', 'TICK']);
        this.domEvents = evt_src_1.EventSrc.fromSrc(window, [
            'mousemove',
            'mouseleave',
            'mouseenter',
            'mousedown',
            'mouseup',
            'keydown',
            'keyup',
            'contextmenu',
            'wheel'
        ]);
        this.running = false;
        this.mouseDown = false;
        this.mousePos = new math_1.Vector();
        this.downPos = null;
        this.mouseButton = null;
        this.upPos = null;
        this.ctrl = false;
        this.alt = false;
        this.selection = null;
        this.order = null;
        this.gameLoop = null;
        this.renderLoop = null;
        this.lastTime = Date.now();
        this.unsubscribers = [];
        this.layers = [];
        this.scrolling = false;
        this.panning = false;
        this.zoomTarget = 1;
        this.units = [];
        this._selectedUnits = [];
        this.renderEngine = new RenderEngine(canvas);
        this.cursor = new Cursor_1.Cursor(this);
        this.selectBox = new SelectBox_1.SelectBox(this);
        this.attachListeners();
        this.events.dispatch('INIT');
    }
    Object.defineProperty(Engine.prototype, "selectedUnits", {
        get: function () {
            return this._selectedUnits;
        },
        enumerable: false,
        configurable: true
    });
    Engine.prototype.tick = function () {
        var nowTime = Date.now();
        var tickData = { timeDelta: nowTime - this.lastTime };
        this.lastTime = nowTime;
        this.layers.forEach(function (layer) {
            return layer.forEach(function (obj) {
                if (utils_1.isDynamic(obj)) {
                    obj.update(tickData);
                }
            });
        });
        this.cursor.update();
        this.events.dispatch('TICK', tickData);
    };
    Engine.prototype.render = function () {
        var _this = this;
        this.renderEngine.clear();
        this.renderEngine.renderBackground();
        this.layers.forEach(function (layer) { return layer.forEach(function (obj) { return obj.render(_this.renderEngine); }); });
        this.cursor.render(this.renderEngine);
        this.selectBox.render(this.renderEngine);
        this.renderLoop = requestAnimationFrame(function () { return _this.render(); });
    };
    Engine.prototype.attachListeners = function () {
        var _this = this;
        this.unsubscribers.push(this.domEvents.on('mousemove', function (evt) {
            if (_this.mouseDown && _this.mouseButton === 2) {
                var _a = __read(_this.mousePos, 2), ox = _a[0], oy = _a[1];
                var _b = __read(_this.renderEngine.canvasToGame([evt.clientX, evt.clientY]), 2), nx = _b[0], ny = _b[1];
                var _c = __read(_this.renderEngine.viewPos, 2), ovx = _c[0], ovy = _c[1];
                _this.renderEngine.viewPos = [ovx - (nx - ox), ovy - (ny - oy)];
                if (!_this.panning) {
                    _this.panning = true;
                }
            }
            else {
                _this.mousePos = math_1.Vector.fromRaw(_this.renderEngine.canvasToGame([evt.clientX, evt.clientY]));
            }
        }));
        this.unsubscribers.push(this.domEvents.on('mousedown', function (evt) {
            if (evt.target === _this.canvas) {
                _this.mouseButton = evt.button;
                _this.mouseDown = true;
                if (evt.button === 0 && !_this.order) {
                    _this.downPos = _this.mousePos.clone();
                }
                else if (evt.button === 2) {
                    _this.downPos = _this.mousePos.clone();
                }
            }
        }));
        this.unsubscribers.push(this.domEvents.on('mouseup', function (evt) {
            if (evt.target === _this.canvas) {
                _this.mouseButton = null;
                _this.mouseDown = false;
                if (evt.button === 0) {
                    if (_this.selection) {
                        _this.upPos = _this.mousePos.clone();
                        _this.selection = math_1.Rectangle.from(_this.downPos, _this.upPos);
                        _this._selectedUnits = _this.units.filter(function (unit) { return unit.selected; });
                        var unsub_1 = _this.events.on('TICK', function () {
                            _this.downPos = null;
                            _this.upPos = null;
                            _this.selection = null;
                            unsub_1();
                        });
                    }
                    else if (_this.order === 'MOVE') {
                        _this.selectedUnits.forEach(function (unit) {
                            unit.move(_this.mousePos);
                        });
                        _this.order = null;
                        _this.downPos = null;
                    }
                }
                else if (evt.button === 2 && (_this.downPos.equals(_this.mousePos) || _this.scrolling)) {
                    if (_this.panning) {
                        _this.panning = false;
                    }
                    else {
                        if (!_this.order) {
                            _this.selectedUnits.forEach(function (unit) {
                                unit.move(_this.mousePos);
                            });
                        }
                        else {
                            _this.order = null;
                        }
                    }
                    _this.downPos = null;
                }
            }
        }));
        this.unsubscribers.push(this.domEvents.on('keydown', function (evt) {
            if (evt.key === 'Control') {
                _this.ctrl = true;
            }
            else if (evt.key === 'Alt') {
                _this.alt = true;
            }
        }));
        this.unsubscribers.push(this.domEvents.on('keyup', function (evt) {
            if (evt.key === 'Control') {
                _this.ctrl = false;
            }
            else if (evt.key === 'Alt') {
                _this.alt = false;
            }
        }));
        this.unsubscribers.push(this.domEvents.on('contextmenu', function (evt) {
            if (evt.target == _this.canvas) {
                evt.preventDefault();
            }
        }));
        this.unsubscribers.push(this.domEvents.on('wheel', function (evt) {
            if (evt.target === _this.canvas) {
                _this.zoomTarget *= Math.pow((Math.pow(2, (1 / 4))), (evt.deltaY / 100));
                if (!_this.scrolling) {
                    _this.scrolling = true;
                    var unbind_1 = _this.events.on('TICK', function () {
                        if (Math.abs(_this.zoomTarget - _this.renderEngine.zoom) < 0.001) {
                            var oldMousePos = _this.renderEngine.gameToCanvas(_this.mousePos.toRaw());
                            _this.renderEngine.zoom = _this.zoomTarget;
                            var _a = __read(_this.renderEngine.canvasToGame(oldMousePos), 2), nx = _a[0], ny = _a[1];
                            _this.mousePos = new math_1.Vector(nx, ny);
                            _this.scrolling = false;
                            unbind_1();
                        }
                        else {
                            var oldMousePos = _this.renderEngine.gameToCanvas(_this.mousePos.toRaw());
                            _this.renderEngine.zoom += 0.05 * (_this.zoomTarget - _this.renderEngine.zoom);
                            var _b = __read(_this.renderEngine.canvasToGame(oldMousePos), 2), nx = _b[0], ny = _b[1];
                            _this.mousePos = new math_1.Vector(nx, ny);
                        }
                    });
                }
            }
        }));
    };
    Engine.prototype.addObj = function (Obj, layer) {
        while (this.layers[layer] === undefined) {
            this.layers.push([]);
        }
        var id = nanoid_1.nanoid(10);
        this.layers[layer].push(new Obj(this, id));
    };
    Engine.prototype.addUnit = function (Unit) {
        if (!this.layers[0]) {
            this.layers.push([]);
        }
        var id = nanoid_1.nanoid(10);
        var unit = new Unit(this, id);
        this.layers[0].push(unit);
        this.units.push(unit);
    };
    Engine.prototype.start = function () {
        var _this = this;
        if (typeof window === 'undefined') {
            this.gameLoop = setInterval(function () { return _this.tick(); }, 10)[Symbol.toPrimitive]();
        }
        else {
            this.gameLoop = window.setInterval(function () { return _this.tick(); }, 10);
            this.renderLoop = requestAnimationFrame(function () { return _this.render(); });
        }
    };
    Engine.prototype.stop = function () {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
        if (this.renderLoop) {
            cancelAnimationFrame(this.renderLoop);
        }
        this.unsubscribers.forEach(function (unsub) { return unsub(); });
        this.layers.forEach(function (layer) { return layer.forEach(function (obj) { return obj.destroy(); }); });
        this.cursor.destroy();
        this.selectBox.destroy();
    };
    return Engine;
}());
exports.Engine = Engine;
