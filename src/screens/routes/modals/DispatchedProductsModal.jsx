import { useImperativeHandle, useState } from 'react';
import { Button, DataTable, Input, Modal } from '@components';

export const DispatchedProductsModal = ({ onSave, loading = false, readOnly = false, ref }) => {
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

	const setShift = (row, field, value) =>
		setRows((current) => current.map((item) => item.type === row.type ? { ...item, [field]: value } : item));

	const shiftColumn = (name, text) => ({
		name,
		text,
		render: (_, row) => readOnly
			? (row[name] ?? 0)
			: <Input type="number" min={0} value={row[name]} onChange={(value) => setShift(row, name, value)} />,
	});

	const total = (row) => Number(row.quantityMorning || 0) + Number(row.quantityAfternoon || 0);

	return (
		<Modal
			open={open}
			title="Productos cargados"
			onClose={close}
			footer={readOnly
				? <Button variant="secondary" onClick={close}>Cerrar</Button>
				: <><Button variant="secondary" onClick={close}>Cerrar</Button><Button loading={loading} onClick={save}>Guardar</Button></>}>
			<DataTable
				columns={[
					{ name: 'typeName', text: 'Producto' },
					shiftColumn('quantityMorning', 'Cantidad mañana'),
					shiftColumn('quantityAfternoon', 'Cantidad tarde'),
					{ name: 'quantity', text: 'Total', render: (_, row) => total(row) },
				]}
				rows={rows}
			/>
		</Modal>
	);
};
