import { useImperativeHandle, useState } from 'react';
import { Formatters } from '@app';
import { DataTable, Modal } from '@components';

const emptyState = { open: false, title: '', clients: [] };

export const ClientsSummaryModal = ({ ref }) => {
	const [state, setState] = useState(emptyState);

	const close = () => setState(emptyState);

	useImperativeHandle(ref, () => ({
		open: ({ title = '', clients = [] } = {}) => setState({ open: true, title, clients }),
		close,
	}));

	return (
		<Modal open={state.open} title={state.title} size="lg" onClose={close}>
			<DataTable
				columns={[
					{ name: 'name', text: 'Cliente' },
					{ name: 'address', text: 'Direccion' },
					{ name: 'dealerName', text: 'Reparto', render: (_, row) => `${row.dealerName || 'Sin repartidor'} - ${row.deliveryDay ? Formatters.dayName(row.deliveryDay) : 'Sin dia de reparto'}` },
					{ name: 'debt', text: 'Deuda', render: Formatters.formatCurrency },
				]}
				rows={state.clients}
				infinite
			/>
		</Modal>
	);
};
