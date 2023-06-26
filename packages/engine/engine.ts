import { EventSrc, Unsubscriber } from '@smol-tanks/evt-src';
import { nanoid } from 'nanoid';
import { Rectangle, Vector } from './math';
import { GameObject, GameObjectConstructor, Orders, OrderSrc, RenderEngine, RenderEngineConstructor, TickInfo, Unit, UnitConstructor } from './types';
import { Cursor } from './utils/Cursor';
import { SelectBox } from './utils/SelectBox';
import { isDynamic } from './utils/utils';

interface EngineEvents {
	INIT: undefined;
	TICK: TickInfo;
}

export class Engine {
	public events: EventSrc<EngineEvents> = new EventSrc(['INIT', 'TICK']);
	public domEvents: EventSrc<GlobalEventHandlersEventMap> = EventSrc.fromSrc(window, [
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
	public running: boolean = false;
	public mouseDown: boolean = false;
	public mousePos: Vector = new Vector();
	public downPos: Vector | null = null;
	public mouseButton: number | null = null;
	public upPos: Vector | null = null;
	public ctrl: boolean = false;
	public alt: boolean = false;
	public shift: boolean = false;
	public selection: Rectangle | null = null;
	public order: keyof Orders | null = null;

	private gameLoop: number | null = null;
	private renderLoop: number | null = null;
	private renderEngine: RenderEngine;
	private lastTime: number = Date.now();
	private unsubscribers: Unsubscriber[] = [];

	private layers: GameObject[][] = [];
	private cursor: Cursor;
	private selectBox: SelectBox;
	private scrolling: boolean = false;
	private panning: boolean = false;
	private panTicks: number = 0;
	private zoomTarget: number = 1;
	private units: Unit[] = [];
	private _selectedUnits: Unit[] = [];

	public get selectedUnits(): Unit[] {
		return this._selectedUnits;
	}

	constructor(public canvas: HTMLCanvasElement, RenderEngine: RenderEngineConstructor, public orderEvents: OrderSrc) {
		this.renderEngine = new RenderEngine(canvas);
		this.cursor = new Cursor(this);
		this.selectBox = new SelectBox(this);

		this.attachListeners();

		this.events.dispatch('INIT');
	}

	private tick(): void {
		const nowTime = Date.now();
		const tickData = { timeDelta: nowTime - this.lastTime };
		this.lastTime = nowTime;

		this.layers.forEach((layer) =>
			layer.forEach((obj) => {
				if (isDynamic(obj)) {
					obj.update(tickData);
				}
			})
		);

		this.cursor.update();

		this.events.dispatch('TICK', tickData);
	}

	private render(): void {
		this.renderEngine.clear();
		this.renderEngine.renderBackground();
		this.layers.forEach((layer) => layer.forEach((obj) => obj.render(this.renderEngine)));
		this.cursor.render(this.renderEngine);
		this.selectBox.render(this.renderEngine);

		this.renderLoop = requestAnimationFrame(() => this.render());
	}

	private attachListeners(): void {
		this.unsubscribers.push(
			this.domEvents.on('mousemove', (evt: MouseEvent) => {
				if (this.mouseDown && this.mouseButton === 2) {
					const [ox, oy] = this.mousePos;
					const [nx, ny] = this.renderEngine.canvasToGame([evt.clientX, evt.clientY]);
					const [ovx, ovy] = this.renderEngine.viewPos;
					this.renderEngine.viewPos = [ovx - (nx - ox), ovy - (ny - oy)];
					if (this.panning) {
						this.panTicks++;
					}
					if (!this.panning) {
						this.panning = true;
					}
				} else {
					this.mousePos = Vector.fromRaw(this.renderEngine.canvasToGame([evt.clientX, evt.clientY]));
				}
			})
		);

		this.unsubscribers.push(
			this.domEvents.on('mousedown', (evt) => {
				if (evt.target === this.canvas) {
					this.mouseButton = evt.button;
					this.mouseDown = true;
					if (evt.button === 0 && !this.order) {
						this.downPos = this.mousePos.clone();
					} else if (evt.button === 2) {
						this.downPos = this.mousePos.clone();
					}
				}
			})
		);

		this.unsubscribers.push(
			this.domEvents.on('mouseup', (evt) => {
				if (evt.target === this.canvas) {
					this.mouseButton = null;
					this.mouseDown = false;
					if (evt.button === 0) {
						if (this.selection) {
							this.upPos = this.mousePos.clone();
							this.selection = Rectangle.from(this.downPos!, this.upPos);
							this._selectedUnits = this.units.filter((unit) => unit.selected);
							const unsub = this.events.on('TICK', () => {
								this.downPos = null;
								this.upPos = null;
								this.selection = null;
								unsub();
							});
						} else if (this.order === 'MOVE') {
							this.selectedUnits.forEach((unit) => {
								unit.issueOrder({ type: 'MOVE', target: this.mousePos }, this.shift);
							});
							this.order = null;
							this.downPos = null;
						}
					} else if (evt.button === 2 && (this.downPos!.equals(this.mousePos) || this.scrolling)) {
						if (!this.panning || this.panTicks < 3) {
							if (!this.order) {
								this.selectedUnits.forEach((unit) => {
									unit.issueOrder({ type: 'MOVE', target: this.mousePos }, this.shift);
								});
							} else {
								this.order = null;
							}
						}
						if (this.panning) {
							this.panning = false;
							this.panTicks = 0;
						}
						this.downPos = null;
					}
				}
			})
		);

		this.unsubscribers.push(
			this.domEvents.on('keydown', (evt: KeyboardEvent) => {
				if (evt.key === 'Control') {
					this.ctrl = true;
				} else if (evt.key === 'Alt') {
					this.alt = true;
				} else if (evt.key === 'Shift') {
					this.shift = true;
				}
			})
		);

		this.unsubscribers.push(
			this.domEvents.on('keyup', (evt: KeyboardEvent) => {
				if (evt.key === 'Control') {
					this.ctrl = false;
				} else if (evt.key === 'Alt') {
					this.alt = false;
				} else if (evt.key === 'Shift') {
					this.shift = false;
				}
			})
		);

		this.unsubscribers.push(
			this.domEvents.on('contextmenu', (evt) => {
				if (evt.target == this.canvas) {
					evt.preventDefault();
				}
			})
		);

		this.unsubscribers.push(
			this.domEvents.on('wheel', (evt) => {
				if (evt.target === this.canvas) {
					this.zoomTarget *= (2 ** (1 / 4)) ** (evt.deltaY / 100);

					if (!this.scrolling) {
						this.scrolling = true;
						const unbind = this.events.on('TICK', () => {
							if (Math.abs(this.zoomTarget - this.renderEngine.zoom) < 0.001) {
								const oldMousePos = this.renderEngine.gameToCanvas(this.mousePos.toRaw());
								this.renderEngine.zoom = this.zoomTarget;
								const [nx, ny] = this.renderEngine.canvasToGame(oldMousePos);
								this.mousePos = new Vector(nx, ny);
								this.scrolling = false;
								unbind();
							} else {
								const oldMousePos = this.renderEngine.gameToCanvas(this.mousePos.toRaw());
								this.renderEngine.zoom += 0.05 * (this.zoomTarget - this.renderEngine.zoom);
								const [nx, ny] = this.renderEngine.canvasToGame(oldMousePos);
								this.mousePos = new Vector(nx, ny);
							}
						});
					}
				}
			})
		);
	}

	public addObj(Obj: GameObjectConstructor, layer: number): void {
		while (this.layers[layer] === undefined) {
			this.layers.push([]);
		}
		const id = nanoid(10);
		this.layers[layer].push(new Obj(this, id));
	}

	public addUnit(Unit: UnitConstructor): void {
		if (!this.layers[0]) {
			this.layers.push([]);
		}
		const id = nanoid(10);
		const unit = new Unit(this, id, new Vector(Math.random() * 100 - 50, Math.random() * 100 - 50));
		this.layers[0].push(unit);
		this.units.push(unit);
	}

	public start(): void {
		if (typeof window === 'undefined') {
			this.gameLoop = setInterval(() => this.tick(), 10)[Symbol.toPrimitive]();
		} else {
			this.gameLoop = window.setInterval(() => this.tick(), 10);
			this.renderLoop = requestAnimationFrame(() => this.render());
		}
	}

	public stop(): void {
		if (this.gameLoop) {
			clearInterval(this.gameLoop);
		}
		if (this.renderLoop) {
			cancelAnimationFrame(this.renderLoop);
		}

		this.unsubscribers.forEach((unsub) => unsub());

		this.layers.forEach((layer) => layer.forEach((obj) => obj.destroy()));
		this.cursor.destroy();
		this.selectBox.destroy();
	}
}
