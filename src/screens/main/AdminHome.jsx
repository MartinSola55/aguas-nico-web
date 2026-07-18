import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Banknote, ChevronRight, ClipboardList, FileSpreadsheet, ReceiptText, Truck } from 'lucide-react';
import { toast } from 'react-toastify';
import { API, DateHelper, Formatters, Helpers } from '@app';
import { Badge, Button, Card, DataTable, Input, PageHeader, StatCard } from '@components';
import { TransfersViewModal } from '../routes/modals/TransfersViewModal.jsx';
import { DashboardExpenseModal } from './modals/DashboardExpenseModal.jsx';

export const AdminHome = () => {
	const navigate = useNavigate();
	const [dealers, setDealers] = useState([]);
	const [date, setDate] = useState(DateHelper.toInputDate());
	const [routes, setRoutes] = useState([]);
	const [expenses, setExpenses] = useState([]);
	const [soldProducts, setSoldProducts] = useState([]);
	const [transfers, setTransfers] = useState([]);
	const [balance, setBalance] = useState(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const expenseModalRef = useRef(null);
	const transfersViewModalRef = useRef(null);

	const selectedDateLabel = Formatters.formatDate(date);
	const totalSold = Helpers.numberOrZero(balance?.cartPaymentMethods) + Helpers.numberOrZero(balance?.transfers) + Helpers.numberOrZero(balance?.dispenserPrice);
	const totalCollected = useMemo(() => routes.reduce((acc, route) => acc + Helpers.numberOrZero(route.collected), 0), [routes]);

	const normalizeExpense = (expense) => ({
		...expense,
		dealerName: expense.dealerName || expense.dealer || '-',
	});

	const loadDashboard = (selectedDate = date) => {
		setLoading(true);
		const rq = { date: DateHelper.toApiDate(selectedDate) };
		Promise.all([
			API.endpoints.routes.searchByDate(rq).then((rs) => setRoutes(rs.data.routes || [])),
			API.endpoints.routes.searchSoldProducts(rq).then((rs) => setSoldProducts(rs.data.items || [])),
			API.endpoints.expenses.searchByDate(rq).then((rs) => setExpenses((rs.data.items || []).map(normalizeExpense))),
			API.endpoints.transfers.getByDate(rq).then((rs) => setTransfers(rs.data.items || [])),
			API.endpoints.stats.getBalanceByDate(rq).then((rs) => setBalance(rs.data)),
			API.endpoints.dealers.getAll().then((rs) => setDealers(rs.data.items || [])),
		]).catch(() => null).finally(() => setLoading(false));
	};

	useEffect(() => {
		loadDashboard(date);
	}, [date]);

	const downloadCaja = () => API.endpoints.caja.downloadDailyClose({ date: DateHelper.toApiDate(date) });

	const createExpense = (expenseForm, onSaved) => {
		setSaving(true);
		API.endpoints.expenses.create({
			userId: expenseForm.userId,
			description: expenseForm.description,
			amount: Number(expenseForm.amount),
		}).then((rs) => {
			toast.success(rs.message);
			onSaved?.();
			loadDashboard(date);
		}).finally(() => setSaving(false));
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

	return (
		<>
			<TransfersViewModal ref={transfersViewModalRef} />
			<DashboardExpenseModal ref={expenseModalRef} dealers={dealers} onSave={createExpense} loading={saving} />
			<PageHeader
				title="Inicio"
				breadcrumbs={['Inicio']}
				actions={<div className="flex flex-wrap items-end gap-2">{dateAction}<Button variant="secondary" onClick={downloadCaja}><FileSpreadsheet size={16} />Cierre de caja</Button><Button onClick={() => expenseModalRef.current?.open()}>Agregar gasto</Button></div>}
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
				<Card title={`Repartos del ${selectedDateLabel}`} actions={<span className="text-sm text-text-muted">Recaudación total (con transferencias): <strong>{Formatters.formatCurrency(totalCollected)}</strong></span>}>
					<DataTable
						columns={[
							{ name: 'dealerName', text: 'Nombre' },
							{ name: 'completedCarts', text: 'Envios completados', render: (_, row) => `${row.completedCarts}/${row.totalCarts}` },
							{
								name: 'soldProducts',
								text: 'Productos vendidos',
								render: (_, row) => (
									<ul className="m-0 list-none p-0">
										{(row.soldProducts || []).map((product) => (
											<li key={product.name}>{product.name} ({product.sold})</li>
										))}
									</ul>
								),
							},
							{ name: 'collected', text: 'Recaudado', render: (value) => Formatters.formatCurrency(value) },
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
						<button
							type="button"
							onClick={() => transfersViewModalRef.current?.open({ title: `Transferencias del ${selectedDateLabel}`, transfers })}
							disabled={transfers.length === 0}
							title={transfers.length > 0 ? 'Ver detalle de transferencias' : 'No hay transferencias'}
							className="group -mx-1 flex w-full cursor-pointer items-center justify-between rounded-[var(--radius-sm)] px-1 py-1 text-left transition-colors enabled:hover:bg-bg-tertiary disabled:cursor-default disabled:opacity-100 focus-visible:outline-2 focus-visible:outline-accent-primary focus-visible:outline-offset-2"
						>
							<span className="flex items-center gap-1.5">
								<span className={transfers.length > 0 ? 'text-accent-primary' : ''}>Transferencias</span>
								{transfers.length > 0 && <Badge variant="neutral">{transfers.length}</Badge>}
							</span>
							<span className="flex items-center gap-1">
								<strong>{Formatters.formatCurrency(balance?.transfers || 0)}</strong>
								{transfers.length > 0 && <ChevronRight size={16} className="text-text-muted transition-transform group-hover:translate-x-0.5" />}
							</span>
						</button>
						<div className="flex justify-between"><span>Dispenser</span><strong>{Formatters.formatCurrency(balance?.dispenserPrice || 0)}</strong></div>
						<div className="flex justify-between"><span>Gastos</span><strong>{Formatters.formatCurrency(balance?.expenses || 0)}</strong></div>
						<hr className="border-border-subtle" />
						<div className="flex justify-between text-base"><span>Total</span><strong>{Formatters.formatCurrency(balance?.total || 0)}</strong></div>
					</div>
				</Card>
			</div>
		</>
	);
};
