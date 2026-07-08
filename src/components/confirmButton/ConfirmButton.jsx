import { Button } from "@components";

export const ConfirmButton = ({
	message = 'Confirmar operación?',
	onConfirm,
	children,
	...props
}) => {
	const handleClick = (event) => {
		event.stopPropagation();

		if (window.confirm(message))
			onConfirm?.();
	};
	return <Button {...props} onClick={handleClick}>{children}</Button>;
};
