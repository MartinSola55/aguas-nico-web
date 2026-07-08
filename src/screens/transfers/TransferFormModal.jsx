import { useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { API, DateHelper, Formatters } from '@app';
import { Button, Input, Modal, Select } from '@components';
import { DealerCombo } from '@screens/shared';
import { buildTransferRequest, emptyTransfer } from './Transfers.helpers.js';

export const TransferFormModal = ({ onSaved, ref }) => {
	const [open, setOpen] = useState(false);
	const [dealers, setDealers] = useState([]);
	const [clientSearch, setClientSearch] = useState('');
	const [clientOptions, setClientOptions] = useState([]);
	const [form, setForm] = useState(emptyTransfer);
	const [loading, setLoading] = useState(false);

	const clientItems = useMemo(() => clientOptions.map((c) => {
		const parts = [c.name, c.address, c.dealerName, c.deliveryDay ? Formatters.dayName(c.deliveryDay) : ''].filter(Boolean);
		return { value: c.id, label: parts.join(' - '), raw: c };
	}), [clientOptions]);

	const close = () => setOpen(false);

	useImperativeHandle(ref, () => ({
		open: (transfer = emptyTransfer) => {
			setForm({
				...emptyTransfer,
				...transfer,
				date: transfer.date ? DateHelper.toInputDate(transfer.date) : DateHelper.toInputDate(),
				clientId: transfer.clientId || null,
			});
			setClientSearch('');
			setClientOptions(transfer.clientId ? [{ id: transfer.clientId, name: transfer.clientName, address: '' }] : []);
			setOpen(true);
		},
		close,
	}));

	useEffect(() => {
		API.endpoints.dealers.getAll().then((rs) => setDealers(rs.data.items || []));
	}, []);

	const searchClients = () => {
		setLoading(true);
		API.endpoints.clients.getAll({ activeOnly: true, search: clientSearch })
			.then((rs) => setClientOptions(rs.data.items || []))
			.finally(() => setLoading(false));
	};

	const save = () => {
		setLoading(true);
		const action = form.id ? API.endpoints.transfers.update : API.endpoints.transfers.create;
		action(buildTransferRequest(form))
			.then((rs) => {
				toast.success(rs.message);
				close();
				onSaved?.();
			})
			.finally(() => setLoading(false));
	};

	return (
		<Modal open={open} title={form.id ? 'Editar transferencia' : 'Nueva transferencia'} onClose={close} footer={<><Button variant="secondary" onClick={close}>Cerrar</Button><Button loading={loading} onClick={save}>Guardar</Button></>}>
			<div className="grid gap-3">
				{!form.id && (
					<div className="flex items-end gap-2">
						<Input label="Buscar cliente" value={clientSearch} onChange={setClientSearch} />
						<Button variant="secondary" loading={loading} onClick={searchClients}>Buscar</Button>
					</div>
				)}
				<Select label="Cliente" disabled={!!form.id} items={clientItems} value={form.clientId} onChange={(value) => setForm((f) => ({ ...f, clientId: value }))} />
				<DealerCombo label="Repartidor opcional" clearable dealers={dealers} value={form.userId} onChange={(value) => setForm((f) => ({ ...f, userId: value || '' }))} />
				<Input label="Monto" type="number" min={0} value={form.amount} onChange={(value) => setForm((f) => ({ ...f, amount: value }))} />
				<Input label="Fecha" type="date" value={form.date} onChange={(value) => setForm((f) => ({ ...f, date: value, updateDate: true }))} />
			</div>
		</Modal>
	);
};
