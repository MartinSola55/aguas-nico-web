import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { API, Formatters } from '@app';
import { Button, Card, DataTable, Input, PageHeader } from '@components';
import CartEditor from './CartEditor.jsx';
import { manualCartRequest } from './Routes.helpers.js';
import { toast } from 'react-toastify';

const ManualCart = () => {
	const { id } = useParams();
	const [route, setRoute] = useState(null);
	const [paymentMethods, setPaymentMethods] = useState([]);
	const [search, setSearch] = useState('');
	const [clients, setClients] = useState([]);
	const [selected, setSelected] = useState(null);
	const [clientData, setClientData] = useState(null);

	useEffect(() => {
		API.endpoints.routes.getManualCartData({ routeId: id }).then((rs) => {
			setRoute(rs.data.route);
			setPaymentMethods(rs.data.paymentMethods || []);
		});
	}, [id]);

	const searchClients = () => {
		const rq = { routeId: id };
		const call = /^\d+$/.test(search)
			? API.endpoints.routes.clientsByIDNotInRoute({ ...rq, clientId: Number(search) })
			: API.endpoints.routes.clientsByNameNotInRoute({ ...rq, name: search });
		call.then((rs) => setClients(rs.data.items || []));
	};

	const selectClient = (client) => {
		setSelected(client);
		API.endpoints.clients.getProductsAndAbono({ id: client.id }).then((rs) => setClientData(rs.data));
	};

	const confirm = (payload) => {
		API.endpoints.carts.confirmManual(manualCartRequest({ routeId: id, clientId: selected.id }, payload)).then((rs) => {
			toast.success(rs.message);
			setSelected(null);
			setClientData(null);
			if (search) searchClients();
		});
	};

	return (
		<>
			<PageHeader title="Agregar fuera de reparto" breadcrumbs={['Inicio', 'Planillas', 'Fuera de reparto']} />
			<div className="grid gap-4 xl:grid-cols-[420px_1fr]">
				<Card title={`Planilla ${route ? Formatters.dayName(route.dayOfWeek) : ''}`}>
					<div className="mb-3 flex items-end gap-2">
						<Input label="Cliente" value={search} onChange={setSearch} />
						<Button variant="secondary" onClick={searchClients}>Buscar</Button>
					</div>
					<DataTable
						columns={[
							{ name: 'id', text: 'Código' },
							{ name: 'name', text: 'Cliente' },
							{ name: 'address', text: 'Direccion' },
							{ name: 'route', text: 'Reparto / Día', render: (_, row) => {
								const parts = [row.dealerName, row.deliveryDay ? Formatters.dayName(row.deliveryDay) : ''].filter(Boolean);
								return parts.length ? parts.join(' - ') : '-';
							} },
							{ name: 'actions', text: '', render: (_, row) => <Button size="sm" onClick={() => selectClient(row)}>Seleccionar</Button> },
						]}
						rows={clients}
						pagination
					/>
				</Card>
				{selected && clientData ? (
					<CartEditor
						title={`Confirmar bajada para ${selected.name}`}
						products={clientData.products || []}
						abonoProducts={clientData.abonoProducts || []}
						paymentMethods={paymentMethods}
						onSubmit={confirm}
					/>
				) : (
					<Card title="Bajada"><p className="text-text-muted">Selecciona un cliente para cargar productos.</p></Card>
				)}
			</div>
		</>
	);
};

export default ManualCart;
