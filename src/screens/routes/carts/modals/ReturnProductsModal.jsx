import { useImperativeHandle, useState } from 'react';
import { Button, DataTable, Input, Modal } from '@components';

const emptyState = { open: false, title: '', rows: [] };

export const ReturnProductsModal = ({ onConfirm, loading = false, ref }) => {
	const [state, setState] = useState(emptyState);

	const close = () => setState(emptyState);

	useImperativeHandle(ref, () => ({
		open: ({ clientName = '', rows = [] } = {}) => setState({ open: true, title: `Devolucion - ${clientName}`, rows }),
		close,
	}));

	const setQuantity = (row, quantity) => {
		setState((current) => ({
			...current,
			rows: current.rows.map((item) => item.type === row.type ? { ...item, quantity } : item),
		}));
	};

	const confirm = () => onConfirm?.(state.rows, close);

	return (
		<Modal open={state.open} title={state.title} onClose={close} footer={<><Button variant="secondary" onClick={close}>Cerrar</Button><Button loading={loading} onClick={confirm}>Confirmar</Button></>}>
			<DataTable
				columns={[
					{ name: 'typeName', text: 'Producto' },
					{ name: 'quantity', text: 'Cantidad', render: (_, row) => <Input type="number" min={0} value={row.quantity} onChange={(value) => setQuantity(row, value)} /> },
				]}
				rows={state.rows}
			/>
		</Modal>
	);
};
