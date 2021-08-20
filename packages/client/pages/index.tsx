import { Engine, GameObject, Orders, OrderSrc } from '@smol-tanks/engine';
import { EventSrc } from '@smol-tanks/evt-src';
import Head from 'next/head';
import { NextPage } from 'next/types';
import { useEffect, useRef, useState } from 'react';
import Console from '../components/Console/Console';
import { Sherman } from '../units/Sherman';
import Game from '../utils/Game';
import { ClientRenderEngine } from '../utils/RenderEngine';

const Index: NextPage = () => {
	const [height, setHeight] = useState<number>(600);
	const [width, setWidth] = useState<number>(800);
	const [units, setUnits] = useState<GameObject[]>([]);
	const game = useRef<Game | null>(null);
	const engine = useRef<Engine | null>(null);
	const canvas = useRef<HTMLCanvasElement | null>(null);
	const orderSrcRef = useRef<OrderSrc>(new EventSrc<Orders>(['MOVE']));

	useEffect(() => {
		const eng = new Engine(canvas.current!, ClientRenderEngine, orderSrcRef.current);
		engine.current = eng;

		game.current = new Game(eng, [Sherman]);

		game.current.events.on('SELECT_UNITS', (selUnits) => {
			setUnits(selUnits);
		});

		(window as any).engine = eng;

		return () => {
			eng.stop();
		};
	}, []);

	useEffect(() => {
		setHeight(window.innerHeight);
		setWidth(window.innerWidth);

		const resizeListener = () => {
			setHeight(window.innerHeight);
			setWidth(window.innerWidth);
		};

		window.addEventListener('resize', resizeListener);

		return () => {
			window.removeEventListener('resize', resizeListener);
		};
	}, []);

	return (
		<div>
			<Head>
				<style>{`body { margin: 0; } canvas { display: block; cursor: none; }`}</style>
				<title>Smol Tanks</title>
			</Head>
			<canvas
				width={width}
				height={height}
				ref={(elem) => {
					canvas.current = elem;
				}}
			/>
			<Console gameRef={game} units={units} />
		</div>
	);
};

export default Index;
