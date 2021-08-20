import { Vector } from '../../math';

describe('Vector Test suite', () => {
	it('Should have correct values', () => {
		const vec = new Vector(2, 2);

		expect(vec).toBeDefined();
		expect(vec.magnitude).toBeCloseTo(2 * Math.sqrt(2), 6);
		expect(vec.reflexAngle).toBeCloseTo(45, 6);
		expect(vec.x).toBeCloseTo(2, 6);
		expect(vec.y).toBeCloseTo(2, 6);
	});

	it('Should handle special cases', () => {
		const vec = new Vector(2, 0);

		expect(vec).toBeDefined();
		expect(vec.magnitude).toBeCloseTo(2, 6);
		expect(vec.reflexAngle).toBeCloseTo(0, 6);
		expect(vec.x).toBeCloseTo(2, 6);
		expect(vec.y).toBeCloseTo(0, 6);

		const vec2 = new Vector(0, 2);
		expect(vec2).toBeDefined();
		expect(vec2.magnitude).toBeCloseTo(2, 6);
		expect(vec2.reflexAngle).toBeCloseTo(90, 6);
		expect(vec2.x).toBeCloseTo(0, 6);
		expect(vec2.y).toBeCloseTo(2, 6);

		const vec3 = new Vector(-2, 0);
		expect(vec3).toBeDefined();
		expect(vec3.magnitude).toBeCloseTo(2, 6);
		expect(vec3.reflexAngle).toBeCloseTo(180, 6);
		expect(vec3.x).toBeCloseTo(-2, 6);
		expect(vec3.y).toBeCloseTo(0, 6);

		const vec4 = new Vector(0, -2);
		expect(vec4).toBeDefined();
		expect(vec4.magnitude).toBeCloseTo(2, 6);
		expect(vec4.reflexAngle).toBeCloseTo(270, 6);
		expect(vec4.x).toBeCloseTo(0, 6);
		expect(vec4.y).toBeCloseTo(-2, 6);
	});
});
