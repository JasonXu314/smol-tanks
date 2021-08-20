import { EventSrc } from '@smol-tanks/evt-src';
import { nanoid } from 'nanoid';
import { Rectangle, Vector } from './math';
import { Cursor } from './utils/Cursor';
import { SelectBox } from './utils/SelectBox';
import { isDynamic } from './utils/utils';
var Engine = /** @class */ (function () {
    function Engine(canvas, RenderEngine, orderEvents) {
        this.canvas = canvas;
        this.orderEvents = orderEvents;
        this.running = false;
        this.mousePos = new Vector();
        this.downPos = null;
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
        this.units = [];
        this.events = new EventSrc(['INIT', 'TICK']);
        this.domEvents = EventSrc.fromSrc(window, [
            'mousemove',
            'mouseleave',
            'mouseenter',
            'mousedown',
            'mouseup',
            'keydown',
            'keyup',
            'contextmenu'
        ]);
        this.renderEngine = new RenderEngine(canvas);
        this.cursor = new Cursor(this);
        this.selectBox = new SelectBox(this);
        this.attachListeners();
        this.events.dispatch('INIT');
    }
    Object.defineProperty(Engine.prototype, "selectedUnits", {
        get: function () {
            return this.units.filter(function (unit) { return unit.selected; });
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
                if (isDynamic(obj)) {
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
            _this.mousePos = Vector.fromRaw(_this.renderEngine.canvasToGame([evt.clientX, evt.clientY]));
        }));
        this.unsubscribers.push(this.domEvents.on('mousedown', function (evt) {
            if (evt.button === 0) {
                _this.downPos = _this.mousePos.clone();
            }
        }));
        this.unsubscribers.push(this.domEvents.on('mouseup', function (evt) {
            if (evt.button === 0) {
                _this.upPos = _this.mousePos.clone();
                _this.selection = Rectangle.from(_this.downPos, _this.upPos);
                var unsub_1 = _this.events.on('TICK', function () {
                    _this.downPos = null;
                    _this.upPos = null;
                    _this.selection = null;
                    unsub_1();
                });
            }
            else if (evt.button === 2) {
                _this.selectedUnits.forEach(function (unit) {
                    unit.move(_this.mousePos);
                });
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
            evt.preventDefault();
        }));
    };
    Engine.prototype.addObj = function (Obj, layer) {
        while (this.layers[layer] === undefined) {
            this.layers.push([]);
        }
        var id = nanoid(10);
        this.layers[layer].push(new Obj(this, id));
    };
    Engine.prototype.addUnit = function (Unit) {
        if (!this.layers[0]) {
            this.layers.push([]);
        }
        var id = nanoid(10);
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
export { Engine };
