import { EventSrc, Unsubscriber } from 'evt-src';
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
	public events: EventSrc<EngineEvents>;
	public domEvents: EventSrc<GlobalEventHandlersEventMap>;
	public running: boolean = false;
	public mousePos: Vector = new Vector();
	public downPos: Vector | null = null;
	public upPos: Vector | null = null;
	public ctrl: boolean = false;
	public alt: boolean = false;
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
	private units: Unit[] = [];

	public get selectedUnits(): Unit[] {
		return this.units.filter((unit) => unit.selected);
	}

	constructor(public canvas: HTMLCanvasElement, RenderEngine: RenderEngineConstructor, public orderEvents: OrderSrc) {
		this.events = new EventSrc(['INIT', 'TICK']);
		this.domEvents = EventSrc.fromSrc(window, ['mousemove', 'mouseleave', 'mouseenter', 'mousedown', 'mouseup', 'keydown', 'keyup', 'contextmenu']);

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
				this.mousePos = Vector.fromRaw(this.renderEngine.canvasToGame([evt.clientX, evt.clientY]));
			})
		);

		this.unsubscribers.push(
			this.domEvents.on('mousedown', (evt) => {
				if (evt.button === 0) {
					this.downPos = this.mousePos.clone();
				}
			})
		);

		this.unsubscribers.push(
			this.domEvents.on('mouseup', (evt) => {
				if (evt.button === 0) {
					this.upPos = this.mousePos.clone();
					this.selection = Rectangle.from(this.downPos!, this.upPos);
					const unsub = this.events.on('TICK', () => {
						this.downPos = null;
						this.upPos = null;
						this.selection = null;
						unsub();
					});
				} else if (evt.button === 2) {
					this.selectedUnits.forEach((unit) => {
						unit.move(this.mousePos);
					});
				}
			})
		);

		this.unsubscribers.push(
			this.domEvents.on('keydown', (evt: KeyboardEvent) => {
				if (evt.key === 'Control') {
					this.ctrl = true;
				} else if (evt.key === 'Alt') {
					this.alt = true;
				}
			})
		);

		this.unsubscribers.push(
			this.domEvents.on('keyup', (evt: KeyboardEvent) => {
				if (evt.key === 'Control') {
					this.ctrl = false;
				} else if (evt.key === 'Alt') {
					this.alt = false;
				}
			})
		);

		this.unsubscribers.push(
			this.domEvents.on('contextmenu', (evt) => {
				evt.preventDefault();
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
		const unit = new Unit(this, id);
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
