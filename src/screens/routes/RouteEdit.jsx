import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Plus } from 'lucide-react';
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { toast } from 'react-toastify';
import { API, Formatters } from '@app';
import { Button, Card, DataTable, EmptyState, Input, PageHeader } from '@components';
import { SortableClientRow } from './sortableClientRow/SortableClientRow.jsx';

export const RouteEdit = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [route, setRoute] = useState(null);
	const [clients, setClients] = useState([]);
	const [search, setSearch] = useState('');
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
	);

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
		setLoading(true);
		call
			.then((rs) => setResults(rs.data.items || []))
			.finally(() => setLoading(false));
	};

	const add = (client) => {
		setClients((current) => current.some((item) => item.id === client.id) ? current : [...current, client]);
		setResults((current) => current.filter((item) => item.id !== client.id));
	};

	const remove = (clientId) => setClients((current) => current.filter((item) => item.id !== clientId));

	const handleDragEnd = ({ active, over }) => {
		if (!over || active.id === over.id) return;
		setClients((current) => {
			const oldIndex = current.findIndex((item) => item.id === active.id);
			const newIndex = current.findIndex((item) => item.id === over.id);
			return arrayMove(current, oldIndex, newIndex);
		});
	};

	const save = () => {
		setLoading(true);
		API.endpoints.routes.updateClients({ routeId: Number(id), clientIds: clients.map((item) => item.id) })
			.then((rs) => {
				toast.success(rs.message);
				navigate(`/planillas/${id}`);
			})
			.finally(() => setLoading(false));
	};

	return (
		<>
			<PageHeader title="Editar clientes de planilla" breadcrumbs={['Inicio', 'Planillas', 'Editar']} actions={<Button loading={loading} onClick={save}>Guardar planilla</Button>} />
			<div className="grid gap-4 xl:grid-cols-2">
				<Card title={`Clientes en planilla ${route ? Formatters.dayName(route.dayOfWeek) : ''}`}>
					<div className="overflow-x-auto">
						<table className="w-full border-collapse text-sm">
							<thead>
								<tr className="bg-bg-tertiary">
									<th className="border border-border-subtle px-3 py-2 text-left font-semibold text-text-primary">Cliente</th>
									<th className="border border-border-subtle px-3 py-2 text-left font-semibold text-text-primary">Direccion</th>
									<th className="border border-border-subtle px-3 py-2 text-left font-semibold text-text-primary"></th>
								</tr>
							</thead>
							<DndContext sensors={sensors} collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
								<SortableContext items={clients.map((item) => item.id)} strategy={verticalListSortingStrategy}>
									<tbody>
										{clients.map((client) => (
											<SortableClientRow key={client.id} client={client} onRemove={remove} />
										))}
										{clients.length === 0 && (
											<tr>
												<td colSpan={3} className="border border-border-subtle px-3 py-8">
													<EmptyState text="No hay datos para mostrar" />
												</td>
											</tr>
										)}
									</tbody>
								</SortableContext>
							</DndContext>
						</table>
					</div>
				</Card>
				<Card title="Agregar clientes">
					<div className="mb-3 flex items-end gap-2">
						<Input label="Buscar por nombre, direccion o ID" value={search} onChange={setSearch} />
						<Button variant="secondary" loading={loading} onClick={searchClients}>Buscar</Button>
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
