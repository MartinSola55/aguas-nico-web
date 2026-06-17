import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Banknote, ClipboardList, FileSpreadsheet, ReceiptText, Truck } from 'lucide-react';
import { API, DateHelper, Formatters, Helpers, LocalStorage } from '@app';
import { App } from '@app';
import { Button, Card, DataTable, Input, Modal, PageHeader, Select, StatCard } from '@components';
import { toast } from 'react-toastify';

const Home = () => {
	const navigate = useNavigate();
	const [dealers, setDealers] = useState([]);
	const [date, setDate] = useState(DateHelper.toInputDate());
	const [routes, setRoutes] = useState([]);
	const [expenses, setExpenses] = useState([]);
	const [soldProducts, setSoldProducts] = useState([]);
	const [balance, setBalance] = useState(null);
	const [expenseModal, setExpenseModal] = useState(false);
	const [expenseForm, setExpenseForm] = useState({ userId: '', description: '', amount: '' });
	const [loading, setLoading] = useState(true);

	const dealerItems = useMemo(() => Helpers.dealerComboItems(dealers), [dealers]);
	const selectedDateLabel = Formatters.formatDate(date);
	const totalSold = Helpers.numberOrZero(balance?.cartPaymentMethods) + Helpers.numberOrZero(balance?.transfers) + Helpers.numberOrZero(balance?.dispenserPrice);

	const normalizeExpense = (expense) => ({
		...expense,
		dealerName: expense.dealerName || expense.dealer || '-',
	});

	const filterRoutesForRole = (items = []) => {
		if (App.isAdmin()) return items;
		const userId = LocalStorage.getUserId();
		return items.filter((route) => route.userId === userId);
	};

	const loadDashboard = (selectedDate = date) => {
		setLoading(true);
		const rq = { date: DateHelper.toApiDate(selectedDate) };
		Promise.all([
			API.endpoints.routes.searchByDate(rq).then((rs) => setRoutes(filterRoutesForRole(rs.data.routes || []))),
			API.endpoints.routes.searchSoldProducts(rq).then((rs) => setSoldProducts(rs.data.items || [])),
			API.endpoints.expenses.searchByDate(rq).then((rs) => setExpenses((rs.data.items || []).map(normalizeExpense))),
			API.endpoints.stats.getBalanceByDate(rq).then((rs) => setBalance(rs.data)),
			App.isAdmin() ? API.endpoints.dealers.getAll().then((rs) => setDealers(rs.data.items || [])) : Promise.resolve(),
		]).catch(() => null).finally(() => setLoading(false));
	};

	useEffect(() => {
		loadDashboard(date);
	}, [date]);

	const downloadCaja = () => API.endpoints.caja.downloadDailyClose({ date: DateHelper.toApiDate(date) });

	const createExpense = () => {
		API.endpoints.expenses.create({
			userId: expenseForm.userId,
			description: expenseForm.description,
			amount: Number(expenseForm.amount),
		}).then((rs) => {
			toast.success(rs.message);
			setExpenseModal(false);
			setExpenseForm({ userId: '', description: '', amount: '' });
			loadDashboard(date);
		});
	};

	const adminTotals = (
		<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
			<StatCard label="Vendido" value={Formatters.formatCurrency(totalSold)} icon={<ReceiptText size={18} />} />
			<StatCard label="Transferencias" value={Formatters.formatCurrency(balance?.transfers || 0)} icon={<Banknote size={18} />} tone="info" />
			<StatCard label="Dispenser" value={Formatters.formatCurrency(balance?.dispenserPrice || 0)} icon={<Truck size={18} />} tone="warning" />
			<StatCard label="Gastos" value={Formatters.formatCurrency(balance?.expenses || 0)} icon={<ClipboardList size={18} />} tone="danger" />
		</div>
	);

	if (loading && !balance) {
		return <PageHeader title="Inicio" breadcrumbs={['Inicio']} />;
	}

	const dateAction = (
		<div className="w-44">
			<Input type="date" value={date} onChange={setDate} />
		</div>
	);

	if (App.isDealer()) {
		return (
			<>
				<PageHeader title="Inicio" breadcrumbs={['Inicio']} actions={dateAction} />
				<Card title={`Repartos del ${selectedDateLabel}`}>
					<DataTable
						columns={[
							{ name: 'dealerName', text: 'Nombre' },
							{ name: 'completedCarts', text: 'Envios completados', render: (_, row) => `${row.completedCarts}/${row.totalCarts}` },
							{ name: 'isClosed', text: 'Estado', render: (_, row) => row.isClosed ? 'Cerrada' : row.pendingCarts === 0 ? 'Completado' : 'Pendiente' },
							{ name: 'createdAt', text: 'Fecha', render: Formatters.formatDate },
						]}
						rows={routes}
						loading={loading}
						empty="No hay repartos para la fecha seleccionada"
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
				actions={<div className="flex flex-wrap items-end gap-2">{dateAction}<Button variant="secondary" onClick={downloadCaja}><FileSpreadsheet size={16} />Cierre de caja</Button><Button onClick={() => setExpenseModal(true)}>Agregar gasto</Button></div>}
			/>
			{adminTotals}
			<div className="mt-4 grid gap-4 xl:grid-cols-2">
				<Card title={`Productos vendidos el ${selectedDateLabel}`}>
					<DataTable
						columns={[
							{ name: 'name', text: 'Producto' },
							{ name: 'dispatched', text: 'Cargados' },
							{ name: 'sold', text: 'Vendidos' },
							{ name: 'returned', text: 'Devueltos' },
							{ name: 'total', text: 'Total', render: Formatters.formatCurrency },
						]}
						rows={soldProducts}
						loading={loading}
						infinite
					/>
				</Card>
				<Card title={`Gastos del ${selectedDateLabel}`}>
					<DataTable
						columns={[
							{ name: 'dealerName', text: 'Repartidor' },
							{ name: 'description', text: 'Descripcion' },
							{ name: 'amount', text: 'Monto', render: Formatters.formatCurrency },
						]}
						rows={expenses}
						loading={loading}
						infinite
					/>
				</Card>
			</div>
			<div className="mt-4 grid gap-4 xl:grid-cols-[2fr_1fr]">
				<Card title={`Repartos del ${selectedDateLabel}`}>
					<DataTable
						columns={[
							{ name: 'dealerName', text: 'Nombre' },
							{ name: 'completedCarts', text: 'Envios completados', render: (_, row) => `${row.completedCarts}/${row.totalCarts}` },
							{ name: 'createdAt', text: 'Fecha', render: Formatters.formatDate },
						]}
						rows={routes}
						loading={loading}
						infinite
						onRowClick={(row) => navigate(`/planillas/${row.id}`)}
					/>
				</Card>
				<Card title={`Balance del ${selectedDateLabel}`}>
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
