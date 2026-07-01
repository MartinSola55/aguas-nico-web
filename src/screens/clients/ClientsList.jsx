import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Plus } from 'lucide-react';
import { API, Formatters, Helpers, useCatalog } from '@app';
import { Button, Card, ConfirmButton, DataTable, Input, PageHeader, Select } from '@components';
import { clientFilterRequest } from './Clients.helpers.js';
import { toast } from 'react-toastify';

const ClientsList = () => {
	const navigate = useNavigate();
	const { combos } = useCatalog();
	const [clients, setClients] = useState([]);
	const [dealers, setDealers] = useState([]);
	const [filters, setFilters] = useState({ search: '', dealerId: '', deliveryDay: '', activeOnly: true });
	const [loading, setLoading] = useState(false);

	const dealerItems = useMemo(() => Helpers.dealerComboItems(dealers), [dealers]);

	const load = () => {
		setLoading(true);
		API.endpoints.clients.getAll(clientFilterRequest(filters))
			.then((rs) => setClients(rs.data.items || []))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		API.endpoints.dealers.getAll().then((rs) => setDealers(rs.data.items || []));
		load();
	}, []);

	const deleteClient = (id) => {
		API.endpoints.clients.delete({ id }).then((rs) => {
			toast.success(rs.message);
			load();
		});
	};

	const copyClient = (row) => {
		const line = [
			`#${row.id}`,
			row.name,
			row.address,
			row.phone,
			row.email || '-',
			row.dealerName,
			Formatters.dayName(row.deliveryDay),
			Formatters.formatCurrency(row.debt),
		].join('\t');
		navigator.clipboard.writeText(line)
			.then(() => toast.success('Datos del cliente copiados'))
			.catch(() => toast.error('No se pudo copiar'));
	};

	return (
		<>
			<PageHeader
				title="Clientes"
				breadcrumbs={['Inicio', 'Clientes']}
				actions={<div className="flex gap-2"><Link to="/clientes/sin-asignar"><Button variant="secondary">Sin asignar</Button></Link><Link to="/clientes/nuevo"><Button><Plus size={16} />Nuevo cliente</Button></Link></div>}
			/>
			<Card title="Listado">
				<div className="mb-4 grid gap-3 md:grid-cols-4">
					<Input label="Buscar" value={filters.search} onChange={(value) => setFilters((f) => ({ ...f, search: value }))} />
					<Select label="Repartidor" clearable items={dealerItems} value={filters.dealerId} onChange={(value) => setFilters((f) => ({ ...f, dealerId: value || '' }))} />
					<Select label="Dia" clearable items={combos.days} value={filters.deliveryDay} onChange={(value) => setFilters((f) => ({ ...f, deliveryDay: value || '' }))} />
					<div className="flex items-end gap-2">
						<Button variant="secondary" onClick={load}>Buscar</Button>
						<Button variant="ghost" onClick={() => setFilters({ search: '', dealerId: '', deliveryDay: '', activeOnly: true })}>Limpiar</Button>
					</div>
				</div>
				<DataTable
					loading={loading}
					columns={[
						{ name: 'id', text: 'Código', render: (value, row) => <Button size="sm" variant="ghost" title="Copiar datos del cliente" onClick={(e) => { e.stopPropagation(); copyClient(row); }}>{`#${value}`}</Button> },
						{ name: 'name', text: 'Nombre' },
						{ name: 'address', text: 'Direccion' },
						{ name: 'phone', text: 'Telefono' },
						{ name: 'email', text: 'Email', render: (value) => value || '-' },
						{ name: 'dealerName', text: 'Repartidor' },
						{ name: 'deliveryDay', text: 'Dia', render: Formatters.dayName },
						{ name: 'debt', text: 'Deuda', render: Formatters.formatCurrency },
						{
							name: 'actions',
							text: 'Acciones',
							render: (_, row) => (
								<div className="flex gap-2">
									<Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); navigate(`/clientes/${row.id}`); }}>Ver</Button>
									<ConfirmButton size="sm" variant="danger" message="Eliminar cliente?" onConfirm={() => deleteClient(row.id)}>Eliminar</ConfirmButton>
								</div>
							),
						},
					]}
					rows={clients}
					pagination
					onRowClick={(row) => navigate(`/clientes/${row.id}`)}
				/>
			</Card>
		</>
	);
};

export default ClientsList;
