import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { API, DateHelper, Formatters } from '@app';
import { Button, Card, ConfirmButton, DataTable, Input, PageHeader } from '@components';
import { DealerCombo } from '@screens/shared';
import { transferFiltersRequest } from './Transfers.helpers.js';
import { TransferFormModal } from './TransferFormModal.jsx';

export const TransfersList = () => {
	const [transfers, setTransfers] = useState([]);
	const [dealers, setDealers] = useState([]);
	const [filters, setFilters] = useState({ dateFrom: DateHelper.monthStart(), dateTo: DateHelper.monthEnd(), userId: '' });
	const [loading, setLoading] = useState(false);
	const formModalRef = useRef(null);


	const load = () => API.endpoints.transfers.getAll(transferFiltersRequest(filters)).then((rs) => setTransfers(rs.data.items || []));

	useEffect(() => {
		API.endpoints.dealers.getAll().then((rs) => setDealers(rs.data.items || []));
		load();
	}, []);

	const remove = (id) => {
		setLoading(true);
		API.endpoints.transfers.delete({ id })
			.then((rs) => {
				toast.success(rs.message);
				load();
			})
			.finally(() => setLoading(false));
	};

	return (
		<>
			<TransferFormModal ref={formModalRef} onSaved={load} />
			<PageHeader title="Transferencias" breadcrumbs={['Inicio', 'Transferencias']} actions={<Button onClick={() => formModalRef.current?.open()}>Nueva transferencia</Button>} />
			<Card title="Listado">
				<div className="mb-4 grid gap-3 md:grid-cols-[180px_180px_1fr_auto] md:items-end">
					<Input label="Desde" type="date" value={filters.dateFrom} onChange={(value) => setFilters((f) => ({ ...f, dateFrom: value }))} />
					<Input label="Hasta" type="date" value={filters.dateTo} onChange={(value) => setFilters((f) => ({ ...f, dateTo: value }))} />
					<DealerCombo label="Repartidor" clearable dealers={dealers} value={filters.userId} onChange={(value) => setFilters((f) => ({ ...f, userId: value || '' }))} />
					<Button variant="secondary" className="justify-self-start" onClick={load}>Buscar</Button>
				</div>
				<DataTable
					columns={[
						{ name: 'date', text: 'Fecha establecida', render: Formatters.formatDate },
						{ name: 'createdAt', text: 'Recibida', render: Formatters.formatDate },
						{ name: 'clientName', text: 'Cliente' },
						{ name: 'dealerName', text: 'Repartidor' },
						{ name: 'amount', text: 'Monto', render: Formatters.formatCurrency },
						{ name: 'actions', text: 'Acciones', render: (_, row) => (
							<div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
								<Button size="sm" variant="secondary" onClick={() => formModalRef.current?.open(row)}>Editar</Button>
								<ConfirmButton size="sm" variant="danger" loading={loading} message="Eliminar transferencia?" onConfirm={() => remove(row.id)}>Eliminar</ConfirmButton>
							</div>
						) },
					]}
					rows={transfers}
					pagination
				/>
			</Card>
		</>
	);
};
