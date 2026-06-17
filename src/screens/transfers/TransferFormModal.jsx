import { useEffect, useMemo, useState } from 'react';
import { API, DateHelper, Formatters, Helpers } from '@app';
import { Button, Input, Modal, Select } from '@components';
import { buildTransferRequest, emptyTransfer } from './Transfers.helpers.js';
import { toast } from 'react-toastify';

const TransferFormModal = ({ open, onClose, onSaved, transfer = emptyTransfer }) => {
	const [dealers, setDealers] = useState([]);
	const [clientSearch, setClientSearch] = useState('');
	const [clientOptions, setClientOptions] = useState([]);
	const [form, setForm] = useState(emptyTransfer);

	const dealerItems = useMemo(() => Helpers.dealerComboItems(dealers), [dealers]);
	const clientItems = useMemo(() => clientOptions.map((c) => {
		const parts = [c.name, c.address, c.dealerName, c.deliveryDay ? Formatters.dayName(c.deliveryDay) : ''].filter(Boolean);
		return { value: c.id, label: parts.join(' - '), raw: c };
	}), [clientOptions]);

	useEffect(() => {
		API.endpoints.dealers.getAll().then((rs) => setDealers(rs.data.items || []));
	}, []);

	useEffect(() => {
		if (!open) return;
		setForm({
			...emptyTransfer,
			...transfer,
			date: transfer.date ? DateHelper.toInputDate(transfer.date) : DateHelper.toInputDate(),
			clientId: transfer.clientId || null,
		});
		setClientSearch('');
		setClientOptions(transfer.clientId ? [{ id: transfer.clientId, name: transfer.clientName, address: '' }] : []);
	}, [open, transfer]);

	const searchClients = () => {
		API.endpoints.clients.getAll({ activeOnly: true, search: clientSearch }).then((rs) => setClientOptions(rs.data.items || []));
	};

	const save = () => {
		const action = form.id ? API.endpoints.transfers.update : API.endpoints.transfers.create;
		action(buildTransferRequest(form)).then((rs) => {
			toast.success(rs.message);
			onClose();
			onSaved?.();
		});
	};

	return (
		<Modal open={open} title={form.id ? 'Editar transferencia' : 'Nueva transferencia'} onClose={onClose} footer={<><Button variant="secondary" onClick={onClose}>Cerrar</Button><Button onClick={save}>Guardar</Button></>}>
			<div className="grid gap-3">
				<div className="flex items-end gap-2">
					<Input label="Buscar cliente" value={clientSearch} onChange={setClientSearch} />
					<Button variant="secondary" onClick={searchClients}>Buscar</Button>
				</div>
				<Select label="Cliente" items={clientItems} value={form.clientId} onChange={(value) => setForm((f) => ({ ...f, clientId: value }))} />
				<Select label="Repartidor opcional" clearable items={dealerItems} value={form.userId} onChange={(value) => setForm((f) => ({ ...f, userId: value || '' }))} />
				<Input label="Monto" type="number" min={0} value={form.amount} onChange={(value) => setForm((f) => ({ ...f, amount: value }))} />
				<Input label="Fecha" type="date" value={form.date} onChange={(value) => setForm((f) => ({ ...f, date: value, updateDate: true }))} />
			</div>
		</Modal>
	);
};

export default TransferFormModal;
