import { Unit } from '@smol-tanks/engine';
import { sign } from '@smol-tanks/engine/math';

export class Driver {
	constructor(private unit: Unit) {}

	public drive(): [number, number] {
		const target = this.unit.target!;
		const pos = this.unit.position;
		const dir = this.unit.direction;
		const angleDiff = dir.angleTo(target.subtract(pos));

		return [
			pos.distanceTo(target) > this.unit.maxSpeed ? this.unit.maxSpeed : pos.distanceTo(target),
			Math.abs(angleDiff) > this.unit.turnRate ? sign(angleDiff) * this.unit.turnRate : angleDiff
		];
	}
}
