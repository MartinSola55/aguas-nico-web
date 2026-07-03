import { useImperativeHandle, useState } from 'react';
import { Button, DataTable, Input, Modal } from '@components';

export const DispatchedProductsModal = ({ onSave, ref }) => {
	const [open, setOpen] = useState(false);
	const [rows, setRows] = useState([]);

	const close = () => setOpen(false);

	useImperativeHandle(ref, () => ({
		open: (items = []) => {
			setRows(items);
			setOpen(true);
		},
		close,
	}));

	const save = () => onSave?.(rows, close);

	return (
		<Modal open={open} title="Productos cargados" onClose={close} footer={<><Button variant="secondary" onClick={close}>Cerrar</Button><Button onClick={save}>Guardar</Button></>}>
			<DataTable
				columns={[
					{ name: 'typeName', text: 'Producto' },
					{ name: 'quantity', text: 'Cantidad', render: (_, row) => <Input type="number" min={0} value={row.quantity} onChange={(value) => setRows((current) => current.map((item) => item.type === row.type ? { ...item, quantity: value } : item))} /> },
				]}
				rows={rows}
			/>
		</Modal>
	);
};
