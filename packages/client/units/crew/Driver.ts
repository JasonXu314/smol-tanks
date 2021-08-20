import { Unit } from '@smol-tanks/engine';

export class Driver {
	constructor(private unit: Unit) {}

	public getDifferentials(): [number, number] {
		const target = this.unit.target!;
		const pos = this.unit.position;
		const dir = this.unit.direction;
		const angleDiff = dir.angleTo(target.subtract(pos));

		return angleDiff === 90
			? [1, 0]
			: angleDiff > 90
			? [...dir.proj(pos.subtract(target)).toRaw()]
			: [...dir.proj(target.subtract(pos)).toRaw()];
	}
}
