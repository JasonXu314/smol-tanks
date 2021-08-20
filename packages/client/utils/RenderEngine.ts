import { RenderEngine } from '@smol-tanks/engine';
import { RawVector } from '@smol-tanks/engine/math';

export class ClientRenderEngine implements RenderEngine {
	private ctx: CanvasRenderingContext2D;

	constructor(private canvas: HTMLCanvasElement) {
		this.ctx = canvas.getContext('2d')!;
	}

	public clear(): void {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	public renderBackground(): void {
		this.ctx.fillStyle = 'burlywood';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	public fillPath(
		path: RawVector[],
		width: number,
		outline: string | CanvasGradient,
		fill: string | CanvasGradient
	): void {
		const offsetPath = path.map((pt) => this.gameToCanvas(pt));
		this.ctx.fillStyle = fill;
		this.ctx.strokeStyle = outline;
		this.ctx.lineWidth = width;
		this.ctx.beginPath();
		this.ctx.moveTo(...offsetPath[0]);
		offsetPath.slice(1).forEach((point) => this.ctx.lineTo(...point));
		this.ctx.closePath();
		this.ctx.fill();
		this.ctx.stroke();
	}

	public tracePath(path: RawVector[], width: number, stroke: string | CanvasGradient): void {
		const offsetPath = path.map((pt) => this.gameToCanvas(pt));
		this.ctx.strokeStyle = stroke;
		this.ctx.lineWidth = width;
		this.ctx.beginPath();
		this.ctx.moveTo(...offsetPath[0]);
		offsetPath.slice(1).forEach((point) => this.ctx.lineTo(...point));
		this.ctx.closePath();
		this.ctx.stroke();
	}

	public line(path: RawVector[], width: number, stroke: string | CanvasGradient): void {
		const offsetPath = path.map((pt) => this.gameToCanvas(pt));
		this.ctx.strokeStyle = stroke;
		this.ctx.lineWidth = width;
		this.ctx.beginPath();
		this.ctx.moveTo(...offsetPath[0]);
		offsetPath.slice(1).forEach((point) => this.ctx.lineTo(...point));
		this.ctx.stroke();
	}

	public drawImage(pos: RawVector, [width, height]: RawVector, image: string, center: boolean = true): void {
		const [x, y] = this.gameToCanvas(pos);
		const img = new Image();
		img.src = image;
		this.ctx.drawImage(img, center ? x - width / 2 : x, center ? y - height / 2 : y, width, height);
	}

	public gameToCanvas([x, y]: RawVector): RawVector {
		return [x + this.canvas.width / 2, this.canvas.height / 2 - y];
	}

	public canvasToGame([x, y]: RawVector): RawVector {
		return [x - this.canvas.width / 2, this.canvas.height / 2 - y];
	}
}
