export function sign(num: number): number {
	return num === 0 ? 0 : num > 0 ? 1 : -1;
}
