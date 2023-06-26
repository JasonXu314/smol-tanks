import { Unit } from '@smol-tanks/engine';
import { Ray, sign } from '@smol-tanks/engine/math';

export class Driver {
	constructor(private unit: Unit) {}

	public drive(): [speed: number, rotation: number] {
		const target = this.unit.target!;
		const pos = this.unit.position;
		const dir = this.unit.direction;
		const angleDiff = dir.angleTo(target.subtract(pos));

		return [
			pos.distanceTo(target) > this.unit.maxSpeed ? this.unit.maxSpeed : pos.distanceTo(target),
			Math.abs(angleDiff) > this.unit.turnRate ? sign(angleDiff) * this.unit.turnRate : angleDiff
		];
	}

	public diffDrive(): [left: number, right: number] {
		if (this.unit.target) {
			const target = this.unit.target!;
			const pos = this.unit.position;
			const dir = this.unit.direction;
			const dirRay = new Ray(pos, dir);
			const dirToTarget = target.subtract(pos);

			const angleBetween = dirRay.direction.angleTo(dirToTarget);
			if (angleBetween >= -Math.PI / 6 && angleBetween <= Math.PI / 6) {
				if (pos.distanceTo(target) <= this.unit.speed ** 2 / (2 * this.unit.accel)) {
					return [0, 0];
				}

				if (dir.closeTo(dirToTarget)) {
					return [1, 1];
				} else {
					if (dir.dirToRight(dirToTarget)) {
						return [1, 0.5];
					} else {
						return [0.5, 1];
					}
				}
			} else if (angleBetween < -Math.PI / 6 && angleBetween > -(5 * Math.PI) / 6) {
				return [1, -1];
			} else if (angleBetween > Math.PI / 6 && angleBetween < (5 * Math.PI) / 6) {
				return [-1, 1];
			} else {
				const invDirRay = dirRay.inv();

				if (pos.distanceTo(target) <= this.unit.speed ** 2 / (2 * this.unit.accel)) {
					return [0, 0];
				}

				if (dir.inv().closeTo(dirToTarget)) {
					return [-1, -1];
				}

				if (invDirRay.direction.dirToRight(dirToTarget)) {
					return [-0.5, -1];
				} else {
					return [-1, -0.5];
				}
			}
		} else {
			return [0, 0];
		}
	}
}
