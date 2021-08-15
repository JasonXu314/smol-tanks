interface Props {
	icon: string;
	hotkey: string;
	trigger: () => void;
	label: string;
}

const OrderButton: React.FC<Props> = ({ icon, hotkey, trigger, label }) => {
	return (
		<div onClick={() => trigger()}>
			<img src={icon} alt={label} />
		</div>
	);
};

export default OrderButton;
