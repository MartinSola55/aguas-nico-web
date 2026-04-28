import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Banknote, ClipboardList, Package, ReceiptText, Truck } from 'lucide-react';
import { API, DateHelper, Formatters, Helpers } from '@app';
import { App } from '@app';
import { Button, Card, DataTable, Input, Modal, PageHeader, Select, StatCard } from '@components';
import { toast } from 'react-toastify';

const Home = () => {
	const navigate = useNavigate();
	const [dashboard, setDashboard] = useState(null);
	const [dealers, setDealers] = useState([]);
	const [date, setDate] = useState(DateHelper.toInputDate());
	const [routes, setRoutes] = useState([]);
	const [expenses, setExpenses] = useState([]);
	const [balance, setBalance] = useState(null);
	const [expenseModal, setExpenseModal] = useState(false);
	const [expenseForm, setExpenseForm] = useState({ userId: '', description: '', amount: '' });
	const [loading, setLoading] = useState(true);

	const dealerItems = useMemo(() => Helpers.dealerComboItems(dealers), [dealers]);

	const loadDashboard = () => {
		setLoading(true);
		API.endpoints.home.getDashboard()
			.then((rs) => {
				setDashboard(rs.data);
				setDealers(rs.data.dealers || []);
			})
			.finally(() => setLoading(false));
	};

	const loadDaily = (selectedDate = date) => {
		const rq = { date: DateHelper.toApiDate(selectedDate) };
		Promise.all([
			API.endpoints.routes.searchByDate(rq).then((rs) => setRoutes(rs.data.routes || [])),
			API.endpoints.expenses.searchByDate(rq).then((rs) => setExpenses(rs.data.items || [])),
			API.endpoints.stats.getBalanceByDate(rq).then((rs) => setBalance(rs.data)),
		]).catch(() => null);
	};

	useEffect(() => {
		loadDashboard();
		if (App.isAdmin()) loadDaily();
	}, []);

	const createExpense = () => {
		API.endpoints.expenses.create({
			userId: expenseForm.userId,
			description: expenseForm.description,
			amount: Number(expenseForm.amount),
		}).then((rs) => {
			toast.success(rs.message);
			setExpenseModal(false);
			setExpenseForm({ userId: '', description: '', amount: '' });
			loadDashboard();
			loadDaily();
		});
	};

	const adminTotals = (
		<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
			<StatCard label="Vendido hoy" value={Formatters.formatCurrency(dashboard?.totalSold || 0)} icon={<ReceiptText size={18} />} />
			<StatCard label="Transferencias" value={Formatters.formatCurrency((dashboard?.transfers || []).reduce((s, x) => s + Number(x.amount || 0), 0))} icon={<Banknote size={18} />} tone="info" />
			<StatCard label="Dispenser" value={Formatters.formatCurrency(dashboard?.dispensers || 0)} icon={<Truck size={18} />} tone="warning" />
			<StatCard label="Gastos" value={Formatters.formatCurrency((dashboard?.expenses || []).reduce((s, x) => s + Number(x.amount || 0), 0))} icon={<ClipboardList size={18} />} tone="danger" />
		</div>
	);

	if (loading && !dashboard) {
		return <PageHeader title="Inicio" breadcrumbs={['Inicio']} />;
	}

	if (App.isDealer()) {
		return (
			<>
				<PageHeader title="Inicio" breadcrumbs={['Inicio']} />
				<Card title="Repartos del dia">
					<DataTable
						columns={[
							{ name: 'dealerName', text: 'Nombre' },
							{ name: 'completedCarts', text: 'Envios completados', render: (_, row) => `${row.completedCarts}/${row.totalCarts}` },
							{ name: 'isClosed', text: 'Estado', render: (_, row) => row.isClosed ? 'Cerrada' : row.pendingCarts === 0 ? 'Completado' : 'Pendiente' },
							{ name: 'createdAt', text: 'Fecha', render: Formatters.formatDate },
						]}
						rows={dashboard?.dealerRoutes || []}
						empty="No hay repartos para hoy"
						infinite
						onRowClick={(row) => navigate(`/planillas/${row.id}`)}
					/>
				</Card>
			</>
		);
	}

	return (
		<>
			<PageHeader
				title="Inicio"
				breadcrumbs={['Inicio']}
				actions={<Button onClick={() => setExpenseModal(true)}>Agregar gasto</Button>}
			/>
			{adminTotals}
			<div className="mt-4 grid gap-4 xl:grid-cols-2">
				<Card title="Productos vendidos hoy">
					<DataTable
						columns={[
							{ name: 'name', text: 'Producto' },
							{ name: 'dispatched', text: 'Cargados' },
							{ name: 'sold', text: 'Vendidos' },
							{ name: 'returned', text: 'Devueltos' },
							{ name: 'total', text: 'Total', render: Formatters.formatCurrency },
						]}
						rows={dashboard?.soldProducts || []}
						infinite
					/>
				</Card>
				<Card title="Gastos de hoy">
					<DataTable
						columns={[
							{ name: 'dealerName', text: 'Repartidor' },
							{ name: 'description', text: 'Descripcion' },
							{ name: 'amount', text: 'Monto', render: Formatters.formatCurrency },
						]}
						rows={dashboard?.expenses || []}
						infinite
					/>
				</Card>
			</div>
			<div className="mt-4 grid gap-4 xl:grid-cols-[2fr_1fr]">
				<Card
					title="Repartos por fecha"
					actions={
						<div className="flex items-end gap-2">
							<Input type="date" value={date} onChange={setDate} />
							<Button variant="secondary" onClick={() => loadDaily(date)}>Buscar</Button>
						</div>
					}
				>
					<DataTable
						columns={[
							{ name: 'dealerName', text: 'Nombre' },
							{ name: 'completedCarts', text: 'Envios completados', render: (_, row) => `${row.completedCarts}/${row.totalCarts}` },
							{ name: 'createdAt', text: 'Fecha', render: Formatters.formatDate },
						]}
						rows={routes}
						infinite
						onRowClick={(row) => navigate(`/planillas/${row.id}`)}
					/>
				</Card>
				<Card title="Balance por fecha">
					<div className="space-y-2 text-sm">
						<div className="flex justify-between"><span>Efectivo</span><strong>{Formatters.formatCurrency(balance?.cartPaymentMethods || 0)}</strong></div>
						<div className="flex justify-between"><span>Transferencias</span><strong>{Formatters.formatCurrency(balance?.transfers || 0)}</strong></div>
						<div className="flex justify-between"><span>Dispenser</span><strong>{Formatters.formatCurrency(balance?.dispenserPrice || 0)}</strong></div>
						<div className="flex justify-between"><span>Gastos</span><strong>{Formatters.formatCurrency(balance?.expenses || 0)}</strong></div>
						<hr className="border-border-subtle" />
						<div className="flex justify-between text-base"><span>Total</span><strong>{Formatters.formatCurrency(balance?.total || 0)}</strong></div>
					</div>
				</Card>
			</div>
			<Modal
				open={expenseModal}
				title="Agregar gasto"
				onClose={() => setExpenseModal(false)}
				footer={<><Button variant="secondary" onClick={() => setExpenseModal(false)}>Cerrar</Button><Button onClick={createExpense}>Agregar</Button></>}
			>
				<div className="grid gap-3">
					<Select label="Repartidor" items={dealerItems} value={expenseForm.userId} onChange={(value) => setExpenseForm((f) => ({ ...f, userId: value }))} />
					<Input label="Descripcion" value={expenseForm.description} onChange={(value) => setExpenseForm((f) => ({ ...f, description: value }))} />
					<Input label="Monto" type="number" min={0} value={expenseForm.amount} onChange={(value) => setExpenseForm((f) => ({ ...f, amount: value }))} />
				</div>
			</Modal>
		</>
	);
};

export default Home;
