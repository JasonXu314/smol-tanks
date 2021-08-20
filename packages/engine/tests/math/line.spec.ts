import { Line, Vector } from '../../math';
import { random } from '../../utils/utils';

describe('Line Test suite', () => {
	it('Should have correct values', () => {
		const line = new Line(new Vector(2, 5), -1);

		expect(line.intercept.equals(new Vector(0, 7))).toBe(true);
		expect(line.slope).toBe(-1);
	});

	for (let i = 0; i < 100; i++) {
		it('Should find intersections correctly', () => {
			const x1 = Math.floor(random(10)),
				y1 = Math.floor(random(10)),
				x2 = Math.floor(random(10)),
				y2 = Math.floor(random(10)),
				m1 = Math.floor(random(10)),
				m2 = Math.floor(random(10));

			const l1 = new Line(new Vector(x1, y1), m1),
				l2 = new Line(new Vector(x2, y2), m2);

			// precalc intersection, expect error if none
			if (m1 === m2 && y1 !== y2 - (x2 - x1) * m2) {
				expect(() => l1.intersection(l2)).toThrow();
			} else {
				const intersection = l1.intersection(l2);

				expect(l1.eval(intersection.x)).toBeCloseTo(intersection.y, 6);
				expect(l2.eval(intersection.x)).toBeCloseTo(intersection.y, 6);
			}
		});
	}
});
