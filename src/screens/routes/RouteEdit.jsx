import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowDown, ArrowUp, Plus, X } from 'lucide-react';
import { API, Formatters } from '@app';
import { Button, Card, DataTable, Input, PageHeader } from '@components';
import { toast } from 'react-toastify';

const RouteEdit = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [route, setRoute] = useState(null);
	const [clients, setClients] = useState([]);
	const [search, setSearch] = useState('');
	const [results, setResults] = useState([]);

	useEffect(() => {
		API.endpoints.routes.getOne({ id }).then((rs) => {
			setRoute(rs.data);
			setClients((rs.data.carts || []).sort((a, b) => a.priority - b.priority).map((cart) => ({
				id: cart.clientId,
				name: cart.clientName,
				address: cart.clientAddress,
			})));
		});
	}, [id]);

	const searchClients = () => {
		const rq = { routeId: id };
		const call = /^\d+$/.test(search)
			? API.endpoints.routes.clientsByIDNotInRoute({ ...rq, clientId: Number(search) })
			: API.endpoints.routes.clientsByNameNotInRoute({ ...rq, name: search });
		call.then((rs) => setResults(rs.data.items || []));
	};

	const add = (client) => {
		setClients((current) => current.some((item) => item.id === client.id) ? current : [...current, client]);
		setResults((current) => current.filter((item) => item.id !== client.id));
	};

	const remove = (clientId) => setClients((current) => current.filter((item) => item.id !== clientId));

	const move = (index, dir) => {
		setClients((current) => {
			const next = [...current];
			const target = index + dir;
			if (target < 0 || target >= next.length) return current;
			[next[index], next[target]] = [next[target], next[index]];
			return next;
		});
	};

	const save = () => {
		API.endpoints.routes.updateClients({ routeId: Number(id), clientIds: clients.map((item) => item.id) }).then((rs) => {
			toast.success(rs.message);
			navigate(`/planillas/${id}`);
		});
	};

	return (
		<>
			<PageHeader title="Editar clientes de planilla" breadcrumbs={['Inicio', 'Planillas', 'Editar']} actions={<Button onClick={save}>Guardar planilla</Button>} />
			<div className="grid gap-4 xl:grid-cols-2">
				<Card title={`Clientes en planilla ${route ? Formatters.dayName(route.dayOfWeek) : ''}`}>
					<DataTable
						columns={[
							{ name: 'name', text: 'Cliente' },
							{ name: 'address', text: 'Direccion' },
							{ name: 'actions', text: 'Orden', render: (_, row, index) => (
								<div className="flex gap-1">
									<Button size="sm" variant="ghost" onClick={() => move(index, -1)}><ArrowUp size={14} /></Button>
									<Button size="sm" variant="ghost" onClick={() => move(index, 1)}><ArrowDown size={14} /></Button>
									<Button size="sm" variant="danger" onClick={() => remove(row.id)}><X size={14} /></Button>
								</div>
							) },
						]}
						rows={clients}
					/>
				</Card>
				<Card title="Agregar clientes">
					<div className="mb-3 flex items-end gap-2">
						<Input label="Buscar por nombre, direccion o ID" value={search} onChange={setSearch} />
						<Button variant="secondary" onClick={searchClients}>Buscar</Button>
					</div>
					<DataTable
						columns={[
							{ name: 'name', text: 'Cliente' },
							{ name: 'address', text: 'Direccion' },
							{ name: 'dealerName', text: 'Repartidor' },
							{ name: 'actions', text: '', render: (_, row) => <Button size="sm" onClick={() => add(row)}><Plus size={14} />Agregar</Button> },
						]}
						rows={results}
						pagination
					/>
				</Card>
			</div>
		</>
	);
};

export default RouteEdit;
