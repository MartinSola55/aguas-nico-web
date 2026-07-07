import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { API, DateHelper, Formatters } from '@app';
import { Button, Card, DataTable, Input, PageHeader, StatCard } from '@components';
import { DayCombo, MonthCombo, YearCombo } from '@screens/shared';

export const DealerDetails = () => {
	const { id } = useParams();
	const [month, setMonth] = useState(DateHelper.currentMonth());
	const [year, setYear] = useState(DateHelper.currentYear());
	const [years, setYears] = useState([]);
	const [data, setData] = useState(null);
	const [day, setDay] = useState('');
	const [clientsByDay, setClientsByDay] = useState([]);
	const [from, setFrom] = useState(DateHelper.monthStart());
	const [to, setTo] = useState(DateHelper.monthEnd());
	const [notVisited, setNotVisited] = useState(null);
	const [sold, setSold] = useState([]);

	const load = () => {
		API.endpoints.dealers.getOne({ id, month, year }).then((rs) => setData(rs.data));
	};

	useEffect(load, [id, month, year]);

	useEffect(() => {
		API.endpoints.stats.getYears().then((rs) => setYears(rs.data.years || []));
	}, []);

	const loadClientsByDay = () => {
		API.endpoints.dealers.getClientsByDay({ dealerId: id, day }).then((rs) => setClientsByDay(rs.data.items || []));
	};

	const loadRange = () => {
		const rq = { dealerId: id, dateFrom: DateHelper.toApiDate(from), dateTo: DateHelper.toApiDate(to) };
		API.endpoints.dealers.getClientsNotVisited(rq).then((rs) => setNotVisited(rs.data));
		API.endpoints.dealers.getSoldProducts(rq).then((rs) => setSold(rs.data.items || []));
	};

	return (
		<>
			<PageHeader
				title={data?.dealer?.name || 'Repartidor'}
				breadcrumbs={['Inicio', 'Repartidores', 'Detalles']}
				actions={
					<>
						<Link to={`/repartidores/${id}/perfil`}><Button variant="secondary">Editar perfil</Button></Link>
						<Link to={`/repartidores/${id}/planillas`}><Button variant="secondary">Imprimir planillas</Button></Link>
					</>
				}
			/>
			<div className="mb-4 grid gap-3 md:grid-cols-2">
				<MonthCombo label="Mes" value={month} onChange={setMonth} />
				<YearCombo label="Anio" years={years} value={year} onChange={setYear} />
			</div>
			<div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
				<StatCard label="Total bajadas" value={data?.totalCarts || 0} />
				<StatCard label="Completadas" value={data?.completedCarts || 0} tone="success" />
				<StatCard label="Pendientes" value={data?.pendingCarts || 0} tone="warning" />
				<StatCard label="Cobrado" value={Formatters.formatCurrency(data?.totalCollected || 0)} tone="info" />
				<StatCard label="Deuda total" value={Formatters.formatCurrency(data?.totalDebt || 0)} tone="danger" />
			</div>
			<div className="grid gap-4 xl:grid-cols-2">
				<Card title="Stock en clientes">
					<DataTable columns={[{ name: 'product', text: 'Producto' }, { name: 'stock', text: 'Stock' }]} rows={data?.clientsStock || []} infinite />
				</Card>
				<Card title="Clientes por dia">
					<div className="mb-3 flex items-end gap-2">
						<DayCombo label="Dia" value={day} onChange={setDay} />
						<Button variant="secondary" onClick={loadClientsByDay}>Buscar</Button>
					</div>
					<DataTable columns={[{ name: 'name', text: 'Cliente' }, { name: 'address', text: 'Direccion' }, { name: 'debt', text: 'Deuda', render: Formatters.formatCurrency }]} rows={clientsByDay} infinite />
				</Card>
			</div>
			<Card className="mt-4" title="Periodo">
				<div className="mb-3 grid gap-3 md:grid-cols-[200px_200px_auto] md:items-end">
					<Input label="Desde" type="date" value={from} onChange={setFrom} />
					<Input label="Hasta" type="date" value={to} onChange={setTo} />
					<Button variant="secondary" className="justify-self-start" onClick={loadRange}>Buscar</Button>
				</div>
				<div className="grid gap-4 xl:grid-cols-2">
					<div>
						<h3 className="mb-2 text-sm font-semibold">Clientes no visitados {notVisited ? `(${notVisited.totalNotVisited}/${notVisited.totalClients})` : ''}</h3>
						<DataTable columns={[{ name: 'name', text: 'Cliente' }, { name: 'address', text: 'Direccion' }]} rows={notVisited?.clients || []} infinite />
					</div>
					<div>
						<h3 className="mb-2 text-sm font-semibold">Productos vendidos</h3>
						<DataTable columns={[{ name: 'name', text: 'Producto' }, { name: 'sold', text: 'Vendidos' }, { name: 'total', text: 'Total', render: Formatters.formatCurrency }]} rows={sold} infinite />
					</div>
				</div>
			</Card>
		</>
	);
};
