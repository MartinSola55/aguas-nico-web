import { useEffect, useMemo, useState } from 'react';
import { API, DateHelper, Formatters, Helpers } from '@app';
import { Button, Card, ConfirmButton, DataTable, Input, Modal, PageHeader, Select } from '@components';
import { buildTransferRequest, emptyTransfer, transferFiltersRequest } from './Transfers.helpers.js';
import { toast } from 'react-toastify';

const TransfersList = () => {
	const [transfers, setTransfers] = useState([]);
	const [dealers, setDealers] = useState([]);
	const [clientSearch, setClientSearch] = useState('');
	const [clientOptions, setClientOptions] = useState([]);
	const [filters, setFilters] = useState({ dateFrom: DateHelper.monthStart(), dateTo: DateHelper.monthEnd(), userId: '' });
	const [form, setForm] = useState(emptyTransfer);
	const [modal, setModal] = useState(false);

	const dealerItems = useMemo(() => Helpers.dealerComboItems(dealers), [dealers]);
	const clientItems = useMemo(() => clientOptions.map((c) => ({ value: c.id, label: `${c.name} - ${c.address}`, raw: c })), [clientOptions]);

	const load = () => API.endpoints.transfers.getAll(transferFiltersRequest(filters)).then((rs) => setTransfers(rs.data.items || []));

	useEffect(() => {
		API.endpoints.dealers.getAll().then((rs) => setDealers(rs.data.items || []));
		load();
	}, []);

	const searchClients = () => {
		API.endpoints.clients.getAll({ activeOnly: true, search: clientSearch }).then((rs) => setClientOptions(rs.data.items || []));
	};

	const open = (transfer = emptyTransfer) => {
		setForm({
			...emptyTransfer,
			...transfer,
			date: transfer.date ? DateHelper.toInputDate(transfer.date) : DateHelper.toInputDate(),
			clientId: transfer.clientId || null,
		});
		if (transfer.clientId) setClientOptions([{ id: transfer.clientId, name: transfer.clientName, address: '' }]);
		setModal(true);
	};

	const save = () => {
		const action = form.id ? API.endpoints.transfers.update : API.endpoints.transfers.create;
		action(buildTransferRequest(form)).then((rs) => {
			toast.success(rs.message);
			setModal(false);
			load();
		});
	};

	const remove = (id) => API.endpoints.transfers.delete({ id }).then((rs) => { toast.success(rs.message); load(); });

	return (
		<>
			<PageHeader title="Transferencias" breadcrumbs={['Inicio', 'Transferencias']} actions={<Button onClick={() => open()}>Nueva transferencia</Button>} />
			<Card title="Listado">
				<div className="mb-4 grid gap-3 md:grid-cols-[180px_180px_1fr_auto] md:items-end">
					<Input label="Desde" type="date" value={filters.dateFrom} onChange={(value) => setFilters((f) => ({ ...f, dateFrom: value }))} />
					<Input label="Hasta" type="date" value={filters.dateTo} onChange={(value) => setFilters((f) => ({ ...f, dateTo: value }))} />
					<Select label="Repartidor" clearable items={dealerItems} value={filters.userId} onChange={(value) => setFilters((f) => ({ ...f, userId: value || '' }))} />
					<Button variant="secondary" onClick={load}>Buscar</Button>
				</div>
				<DataTable
					columns={[
						{ name: 'date', text: 'Fecha', render: Formatters.formatDate },
						{ name: 'clientName', text: 'Cliente' },
						{ name: 'dealerName', text: 'Repartidor' },
						{ name: 'amount', text: 'Monto', render: Formatters.formatCurrency },
						{ name: 'actions', text: 'Acciones', render: (_, row) => (
							<div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
								<Button size="sm" variant="secondary" onClick={() => open(row)}>Editar</Button>
								<ConfirmButton size="sm" variant="danger" message="Eliminar transferencia?" onConfirm={() => remove(row.id)}>Eliminar</ConfirmButton>
							</div>
						) },
					]}
					rows={transfers}
					pagination
				/>
			</Card>
			<Modal open={modal} title={form.id ? 'Editar transferencia' : 'Nueva transferencia'} onClose={() => setModal(false)} footer={<><Button variant="secondary" onClick={() => setModal(false)}>Cerrar</Button><Button onClick={save}>Guardar</Button></>}>
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
		</>
	);
};

export default TransfersList;
