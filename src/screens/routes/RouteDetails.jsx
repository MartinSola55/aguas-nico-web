import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ChevronRight, Edit, PackageCheck, Play, Plus, Search, UserPlus } from 'lucide-react';
import { toast } from 'react-toastify';
import { API, App, Formatters, Helpers, useCatalog } from '@app';
import { PaymentMethodCode } from '@constants';
import { Badge, Button, Card, ConfirmButton, DataTable, Field, PageHeader, Select, StatCard } from '@components';
import { MercadoPagoPaymentsModal } from '@screens/shared';
import { CartCard } from './carts/cartCard/CartCard.jsx';
import { DispatchedProductsModal } from './modals/DispatchedProductsModal.jsx';
import { DispenserPriceModal } from './modals/DispenserPriceModal.jsx';
import { TransfersViewModal } from './modals/TransfersViewModal.jsx';
import { TransferFormModal } from '../transfers/TransferFormModal.jsx';
import { paymentFilterItems, productFilterItems, serviceFilterItems, soldProductColumns } from './RouteDetails.constants.js';

export const RouteDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { catalog } = useCatalog();
	const [route, setRoute] = useState(null);
	const [cartSearch, setCartSearch] = useState('');
	const [productFilter, setProductFilter] = useState(null);
	const [serviceFilter, setServiceFilter] = useState(null);
	const [paymentFilter, setPaymentFilter] = useState(null);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [mercadoPagoPayments, setMercadoPagoPayments] = useState([]);
	const dispatchedModalRef = useRef(null);
	const dispenserModalRef = useRef(null);
	const transferModalRef = useRef(null);
	const transfersViewModalRef = useRef(null);
	const mercadoPagoModalRef = useRef(null);

	const paymentMethods = useMemo(() => catalog?.paymentMethods || [], [catalog]);

	const load = () => {
		API.endpoints.routes.getOne({ id }).then((rs) => {
			setRoute(rs.data);
			// Se traen junto con la planilla para poder mostrar cuántos son antes de abrir el modal.
			if (App.isAdmin() && !rs.data.isStatic) {
				API.endpoints.routes.getMercadoPagoPayments({ routeId: rs.data.id })
					.then((payments) => setMercadoPagoPayments(payments.data.items || []));
			}
		});
	};

	useEffect(load, [id]);

	if (!route) return <PageHeader title="Planilla" breadcrumbs={['Inicio', 'Planillas']} />;

	const startRoute = () => {
		setLoading(true);
		API.endpoints.routes.createByDealer({ routeId: route.id })
			.then((rs) => {
				toast.success(rs.message);
				navigate(`/planillas/${rs.data.id}`);
			})
			.finally(() => setLoading(false));
	};

	const closeRoute = () => {
		setLoading(true);
		API.endpoints.routes.close({ routeId: route.id })
			.then((rs) => { toast.success(rs.message); load(); })
			.finally(() => setLoading(false));
	};

	const deleteRoute = () => {
		setLoading(true);
		API.endpoints.routes.delete({ routeId: route.id })
			.then((rs) => { toast.success(rs.message); navigate('/planillas'); })
			.finally(() => setLoading(false));
	};

	const renewByRoute = () => {
		setLoading(true);
		API.endpoints.abonos.renewByRoute({ routeId: route.id })
			.then((rs) => toast.success(rs.message))
			.finally(() => setLoading(false));
	};

	const openMercadoPago = () => mercadoPagoModalRef.current?.open({
		title: `Pagos de Mercado Pago - ${route.dealerName}`,
		items: mercadoPagoPayments,
	});

	const openDispatched = () => {
		setLoading(true);
		API.endpoints.routes.getDispatched({ routeId: route.id })
			.then((rs) => {
				dispatchedModalRef.current?.open(rs.data.items || []);
			})
			.finally(() => setLoading(false));
	};

	const saveDispatched = (dispatched, onSaved) => {
		setSaving(true);
		API.endpoints.routes.updateDispatched({
			routeId: route.id,
			products: dispatched.map((item) => ({
				type: item.type,
				quantityMorning: Helpers.numberOrZero(item.quantityMorning),
				quantityAfternoon: Helpers.numberOrZero(item.quantityAfternoon),
			})),
		})
			.then((rs) => {
				toast.success(rs.message);
				onSaved?.();
				load();
			})
			.finally(() => setSaving(false));
	};

	const saveDispenser = (dispenserPrice, onSaved) => {
		setSaving(true);
		API.endpoints.routes.setDispenserPrice({ routeId: route.id, price: Helpers.numberOrZero(dispenserPrice) })
			.then((rs) => {
				toast.success(rs.message);
				onSaved?.();
				load();
			})
			.finally(() => setSaving(false));
	};

	const term = cartSearch.trim().toLowerCase();
	const visibleCarts = (route.carts || [])
		.filter((cart) => {
			if (term && !(cart.clientName?.toLowerCase().includes(term) || String(cart.clientId).includes(term))) return false;
			const products = cart.products || [];
			const abonoProducts = cart.abonoProducts || [];
			if (productFilter && !products.some((p) => p.type === productFilter) && !abonoProducts.some((p) => p.type === productFilter)) return false;
			if (serviceFilter === 'abono' && abonoProducts.length === 0) return false;
			if (serviceFilter === 'bajada' && products.length === 0) return false;
			if (paymentFilter === 'paid' && !(Number(cart.collected) > 0)) return false;
			if (paymentFilter === 'pending' && Number(cart.collected) > 0) return false;
			return true;
		})
		.sort((a, b) => a.priority - b.priority);

	return (
		<>
			<DispatchedProductsModal ref={dispatchedModalRef} onSave={saveDispatched} loading={saving} readOnly={!App.isAdmin()} />
			<DispenserPriceModal ref={dispenserModalRef} onSave={saveDispenser} loading={saving} />
			<TransfersViewModal ref={transfersViewModalRef} />
			<MercadoPagoPaymentsModal ref={mercadoPagoModalRef} />
			{App.isAdmin() && <TransferFormModal ref={transferModalRef} onSaved={load} />}

			<PageHeader
				title={`Planilla de ${route.dealerName}`}
				breadcrumbs={['Inicio', 'Planillas', 'Detalles']}
				actions={
					<>
						{route.isStatic && App.isAdmin() && <Button loading={loading} onClick={startRoute}><Play size={16} />Comenzar</Button>}
						{App.isAdmin() && <Link to="/clientes/nuevo" target="_blank"><Button variant="secondary"><UserPlus size={16} />Nuevo cliente</Button></Link>}
						{route.isStatic && App.isAdmin() && <Link to={`/planillas/${route.id}/editar`}><Button variant="secondary"><Edit size={16} />Editar clientes</Button></Link>}
						{!route.isStatic && <Link to={`/planillas/${route.id}/manual`}><Button variant="secondary"><Plus size={16} />Fuera de reparto</Button></Link>}
						{!route.isStatic && App.isAdmin() && <Button onClick={() => transferModalRef.current?.open()}>Nueva transferencia</Button>}
					</>
				}
			/>
			<div className="mb-4 grid gap-3 md:grid-cols-4">
				<StatCard label="Total repartos" value={route.totalCarts} icon={<PackageCheck size={18} />} />
				<StatCard label="Visitados" value={route.completedCarts} tone="success" />
				<StatCard label="Pendientes" value={route.pendingCarts} tone="warning" />
				{App.isAdmin() && <StatCard label="Recaudado" value={Formatters.formatCurrency(route.totalSold || 0)} tone="info" />}
			</div>
			{App.isAdmin() && (
				<Card className="mb-4" title="Administracion" actions={
					<>
						{!route.isStatic && <Button variant="secondary" loading={loading} onClick={openDispatched}>Productos cargados</Button>}
						{!route.isStatic && <Button variant="secondary" onClick={() => dispenserModalRef.current?.open(route.dispenserPrice || 0)}>Precio dispenser</Button>}
						{route.isStatic && <ConfirmButton variant="secondary" loading={loading} message="Renovar abonos de esta planilla?" onConfirm={renewByRoute}>Renovar abonos</ConfirmButton>}
						{!route.isStatic && !route.isClosed && <ConfirmButton variant="warning" loading={loading} message="Cerrar planilla?" onConfirm={closeRoute}>Cerrar</ConfirmButton>}
						<ConfirmButton variant="danger" loading={loading} message="Eliminar planilla?" onConfirm={deleteRoute}>Eliminar</ConfirmButton>
					</>
				}>
					<div className="grid gap-3 md:grid-cols-3">
						<Field label="Dia" value={Formatters.dayName(route.dayOfWeek)} />
						<Field label="Fecha" value={Formatters.formatDate(route.createdAt)} />
						<Field label="Precio dispenser" value={Formatters.formatCurrency(route.dispenserPrice)} />
					</div>
				</Card>
			)}
			{!route.isStatic && <div className={`grid gap-4 ${App.isAdmin() ? 'xl:grid-cols-[1.2fr_.8fr]' : ''}`}>
				<Card
					title="Productos vendidos"
					actions={!App.isAdmin() && <Button variant="secondary" loading={loading} onClick={openDispatched}>Productos cargados</Button>}>
					<DataTable
						columns={soldProductColumns(App.isAdmin())}
						rows={route.soldProducts || []}
						infinite
					/>
				</Card>
				{App.isAdmin() && <Card title="Cobros y gastos">
					<div className="space-y-2 text-sm">
						{(route.payments || []).map((payment) => payment.code === PaymentMethodCode.MercadoPago ? (
							<button
								key={payment.code}
								type="button"
								onClick={openMercadoPago}
								disabled={mercadoPagoPayments.length === 0}
								title={mercadoPagoPayments.length > 0 ? 'Ver detalle de pagos de Mercado Pago' : 'No hay pagos de Mercado Pago'}
								className="group -mx-1 flex w-full cursor-pointer items-center justify-between rounded-[var(--radius-sm)] px-1 py-1 text-left text-sm transition-colors enabled:hover:bg-bg-tertiary disabled:cursor-default disabled:opacity-100 focus-visible:outline-2 focus-visible:outline-accent-primary focus-visible:outline-offset-2"
							>
								<span className="flex items-center gap-1.5">
									<span className={mercadoPagoPayments.length > 0 ? 'text-accent-primary' : ''}>{payment.paymentMethodName}</span>
									{mercadoPagoPayments.length > 0 && <Badge variant="neutral">{mercadoPagoPayments.length}</Badge>}
								</span>
								<span className="flex items-center gap-1">
									<strong>{Formatters.formatCurrency(payment.amount)}</strong>
									{mercadoPagoPayments.length > 0 && <ChevronRight size={16} className="text-text-muted transition-transform group-hover:translate-x-0.5" />}
								</span>
							</button>
						) : (
							<div key={payment.code} className="flex justify-between"><span>{payment.paymentMethodName}</span><strong>{Formatters.formatCurrency(payment.amount)}</strong></div>
						))}
						{(() => {
							const transfers = route.transfers || [];
							const transfersTotal = transfers.reduce((sum, x) => sum + Number(x.amount || 0), 0);
							const hasTransfers = transfers.length > 0;
							return (
								<button
									type="button"
									onClick={() => transfersViewModalRef.current?.open({ dayOfWeek: route.dayOfWeek, transfers })}
									disabled={!hasTransfers}
									title={hasTransfers ? 'Ver detalle de transferencias' : 'No hay transferencias'}
									className="group -mx-1 cursor-pointer flex w-full items-center justify-between rounded-[var(--radius-sm)] px-1 py-1 text-left text-sm transition-colors enabled:hover:bg-bg-tertiary disabled:cursor-default disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-accent-primary focus-visible:outline-offset-2"
								>
									<span className="flex items-center gap-1.5">
										<span className={hasTransfers ? 'text-accent-primary' : ''}>Transferencias</span>
										{hasTransfers && <Badge variant="neutral">{transfers.length}</Badge>}
									</span>
									<span className="flex items-center gap-1">
										<strong>{Formatters.formatCurrency(transfersTotal)}</strong>
										{hasTransfers && <ChevronRight size={16} className="text-text-muted transition-transform group-hover:translate-x-0.5" />}
									</span>
								</button>
							);
						})()}
						<div className="flex justify-between"><span>Dispenser</span><strong>{Formatters.formatCurrency(route.dispenserPrice)}</strong></div>
						<div className="flex justify-between"><span>Gastos</span><strong>{Formatters.formatCurrency(route.totalExpenses || 0)}</strong></div>
					</div>
				</Card>}
			</div>}
			<Card
				className="mt-4"
				title={`Repartos para ${Formatters.dayName(route.dayOfWeek)}`}
				actions={
					<div className="relative w-full sm:w-auto">
						<Search size={16} className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-text-muted" />
						<input
							type="text"
							value={cartSearch}
							onChange={(e) => setCartSearch(e.target.value)}
							placeholder="Buscar por nombre o código"
							className="w-full rounded-[var(--radius-md)] border border-border-default bg-bg-elevated py-2 pl-8 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 sm:w-64"
						/>
					</div>
				}
			>
				<div className="mb-4 grid gap-3 sm:grid-cols-3">
					<Select clearable placeholder="Por producto" items={productFilterItems} value={productFilter} onChange={setProductFilter} />
					<Select clearable placeholder="Por tipo de servicio" items={serviceFilterItems} value={serviceFilter} onChange={setServiceFilter} />
					<Select clearable placeholder="Estado del pago" items={paymentFilterItems} value={paymentFilter} onChange={setPaymentFilter} />
				</div>
				{visibleCarts.length === 0 ? (
					<p className="m-0 py-2 text-sm text-text-muted">No se encontraron clientes.</p>
				) : (
					visibleCarts.map((cart) => (
						<CartCard key={cart.id} route={route} cart={cart} paymentMethods={paymentMethods} onChanged={load} />
					))
				)}
			</Card>
		</>
	);
};
