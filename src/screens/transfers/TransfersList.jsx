import { useEffect, useMemo, useState } from 'react';
import { API, DateHelper, Formatters, Helpers } from '@app';
import { Button, Card, ConfirmButton, DataTable, Input, PageHeader, Select } from '@components';
import { emptyTransfer, transferFiltersRequest } from './Transfers.helpers.js';
import TransferFormModal from './TransferFormModal.jsx';
import { toast } from 'react-toastify';

const TransfersList = () => {
	const [transfers, setTransfers] = useState([]);
	const [dealers, setDealers] = useState([]);
	const [filters, setFilters] = useState({ dateFrom: DateHelper.monthStart(), dateTo: DateHelper.monthEnd(), userId: '' });
	const [editing, setEditing] = useState(emptyTransfer);
	const [modal, setModal] = useState(false);

	const dealerItems = useMemo(() => Helpers.dealerComboItems(dealers), [dealers]);

	const load = () => API.endpoints.transfers.getAll(transferFiltersRequest(filters)).then((rs) => setTransfers(rs.data.items || []));

	useEffect(() => {
		API.endpoints.dealers.getAll().then((rs) => setDealers(rs.data.items || []));
		load();
	}, []);

	const open = (transfer = emptyTransfer) => {
		setEditing(transfer);
		setModal(true);
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
			<TransferFormModal open={modal} transfer={editing} onClose={() => setModal(false)} onSaved={load} />
		</>
	);
};

export default TransfersList;
