export function radToDeg(num: number): number {
	return (num * 180) / Math.PI;
}

export function sqrt(num: number): number {
	return Math.sqrt(num);
}

export function abs(num: number): number {
	return Math.abs(num);
}

export function ln(num: number): number {
	return Math.log(num);
}

export function log(num: number): number {
	return Math.log10(num);
}

export function acos(num: number): number {
	return radToDeg(Math.acos(num));
}
