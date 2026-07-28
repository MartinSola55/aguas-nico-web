import { useImperativeHandle, useState } from 'react';
import { Formatters } from '@app';
import { Button, DataTable, Modal } from '@components';

const emptyState = { open: false, title: '', items: [], showDealer: false };

export const MercadoPagoPaymentsModal = ({ ref }) => {
	const [state, setState] = useState(emptyState);

	const close = () => setState(emptyState);
	const total = (state.items || []).reduce((sum, x) => sum + Number(x.amount || 0), 0);

	useImperativeHandle(ref, () => ({
		open: ({ title = 'Pagos de Mercado Pago', items = [], showDealer = false } = {}) => setState({ open: true, title, items, showDealer }),
		close,
	}));

	const columns = [
		{ name: 'clientName', text: 'Cliente' },
		state.showDealer && { name: 'dealerName', text: 'Repartidor' },
		{ name: 'amount', text: 'Monto', render: Formatters.formatCurrency },
		{ name: 'date', text: 'Fecha', render: Formatters.formatDateTime },
	].filter(Boolean);

	return (
		<Modal open={state.open} title={state.title} onClose={close} footer={<Button variant="secondary" onClick={close}>Cerrar</Button>}>
			{(state.items || []).length === 0 ? (
				<p className="m-0 py-2 text-sm text-text-muted">No hay pagos de Mercado Pago para mostrar.</p>
			) : (
				<>
					<DataTable columns={columns} rows={state.items || []} infinite />
					<div className="mt-3 flex justify-between border-t border-border-subtle pt-3 text-sm"><span className="font-medium">Total</span><strong>{Formatters.formatCurrency(total)}</strong></div>
				</>
			)}
		</Modal>
	);
};
