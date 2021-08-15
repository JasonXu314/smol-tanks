import { Engine, GameObject, Unit, UnitConstructor } from 'engine';
import { EventSrc } from 'evt-src';

interface GameEvts {
	SELECT_UNITS: GameObject[];
}

export default class Game {
	public events: EventSrc<GameEvts>;
	public orders: EventSrc<OrderEvts>;

	constructor(public engine: Engine, units: UnitConstructor[]) {
		this.events = new EventSrc(['SELECT_UNITS']);
		this.orders = new EventSrc(['MOVE']);

		units.forEach((unit) => {
			this.engine.addUnit(unit);
		});

		let prevSel: Unit[] = [];
		engine.events.on('TICK', () => {
			const sel = engine.selectedUnits;

			if (sel.length !== prevSel.length) {
				this.events.dispatch('SELECT_UNITS', sel);
			}
			if (!sel.every((unit) => prevSel.includes(unit))) {
				this.events.dispatch('SELECT_UNITS', sel);
			}

			prevSel = sel;
		});

		this.orders.on('MOVE', () => {
			engine.order = 'MOVE';
		});

		engine.start();
	}
}
