import { useImperativeHandle, useState } from 'react';
import { Formatters } from '@app';
import { Button, DataTable, Modal } from '@components';

const emptyState = { open: false, title: '', transfers: [] };

export const TransfersViewModal = ({ ref }) => {
	const [state, setState] = useState(emptyState);

	const close = () => setState(emptyState);
	const total = (state.transfers || []).reduce((sum, x) => sum + Number(x.amount || 0), 0);

	useImperativeHandle(ref, () => ({
		open: ({ dayOfWeek, title, transfers = [] } = {}) => setState({ open: true, title: title || `Transferencias - ${Formatters.dayName(dayOfWeek)}`, transfers }),
		close,
	}));

	return (
		<Modal open={state.open} title={state.title} onClose={close} footer={<Button variant="secondary" onClick={close}>Cerrar</Button>}>
			{(state.transfers || []).length === 0 ? (
				<p className="m-0 py-2 text-sm text-text-muted">No hay transferencias para esta planilla.</p>
			) : (
				<>
					<DataTable
						columns={[
							{ name: 'clientName', text: 'Cliente' },
							{ name: 'amount', text: 'Monto', render: Formatters.formatCurrency },
							{ name: 'date', text: 'Fecha', render: Formatters.formatDate },
						]}
						rows={state.transfers || []}
						infinite
					/>
					<div className="mt-3 flex justify-between border-t border-border-subtle pt-3 text-sm"><span className="font-medium">Total</span><strong>{Formatters.formatCurrency(total)}</strong></div>
				</>
			)}
		</Modal>
	);
};
