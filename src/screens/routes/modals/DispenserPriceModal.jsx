import { useImperativeHandle, useState } from 'react';
import { Button, Input, Modal } from '@components';

export const DispenserPriceModal = ({ onSave, ref }) => {
	const [open, setOpen] = useState(false);
	const [price, setPrice] = useState('');

	const close = () => setOpen(false);

	useImperativeHandle(ref, () => ({
		open: (value = '') => {
			setPrice(value);
			setOpen(true);
		},
		close,
	}));

	const save = () => onSave?.(price, close);

	return (
		<Modal open={open} title="Precio dispenser" onClose={close} footer={<><Button variant="secondary" onClick={close}>Cerrar</Button><Button onClick={save}>Guardar</Button></>}>
			<Input label="Precio" type="number" min={0} value={price} onChange={setPrice} />
		</Modal>
	);
};
