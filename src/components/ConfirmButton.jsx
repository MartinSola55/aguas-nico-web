import Button from './Button.jsx';

const ConfirmButton = ({ message = 'Confirmar operacion?', onConfirm, children, ...props }) => {
	const handleClick = (event) => {
		event.stopPropagation();
		if (window.confirm(message)) onConfirm?.();
	};
	return <Button {...props} onClick={handleClick}>{children}</Button>;
};

export default ConfirmButton;
