import { GameObject } from 'engine';
import { MutableRefObject } from 'react';
import Game from '../../utils/Game';
import styles from './Console.module.scss';
import OrderButton from './OrderButton/OrderButton';

interface Props {
	gameRef: MutableRefObject<Game | null>;
	units: GameObject[];
}

const Console: React.FC<Props> = ({ gameRef, units }) => {
	return (
		<div className={styles.main}>
			<div>
				<OrderButton
					icon="move_order.svg"
					label="Move"
					hotkey="M"
					trigger={() => {
						gameRef.current?.orders.dispatch('MOVE');
					}}
				/>
			</div>
		</div>
	);
};

export default Console;
