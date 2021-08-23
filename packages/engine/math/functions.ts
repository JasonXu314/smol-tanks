export function radToDeg(num: number): number {
	return (num * 180) / Math.PI;
}

export function degToRad(num: number): number {
	return (num * Math.PI) / 180;
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

export function sin(angle: number): number {
	return Math.sin(angle);
}

export function cos(angle: number): number {
	return Math.cos(angle);
}

export function acos(num: number): number {
	return Math.acos(num > 1 || num < -1 ? Math.round(num) : num);
}

export function atan(num: number): number {
	return Math.atan(num > 1 || num < -1 ? Math.round(num) : num);
}
