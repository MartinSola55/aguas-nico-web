import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ChevronRight, Edit, PackageCheck, Play, Plus, Search, UserPlus } from 'lucide-react';
import { API, App, Formatters, Helpers, useCatalog } from '@app';
import { ProductType, State } from '@constants';
import { Badge, Button, Card, ConfirmButton, DataTable, Field, Input, Modal, PageHeader, Select, StatCard } from '@components';
import CartEditor from './CartEditor.jsx';
import { confirmCartRequest } from './Routes.helpers.js';
import TransferFormModal from '../transfers/TransferFormModal.jsx';
import { toast } from 'react-toastify';

const stateVariant = (state) => {
	if (state === State.Confirmed) return 'success';
	if (state === State.Pending) return 'neutral';
	return 'warning';
};

const productFilterItems = [
	{ value: ProductType.B20L, label: 'Bidón 20L' },
	{ value: ProductType.B12L, label: 'Bidón 12L' },
	{ value: ProductType.Soda, label: 'Soda' },
	{ value: ProductType.B5L, label: 'Bidón 5L' },
];
const serviceFilterItems = [
	{ value: 'abono', label: 'Abono' },
	{ value: 'bajada', label: 'Bajada' },
];
const paymentFilterItems = [
	{ value: 'paid', label: 'Realizado' },
	{ value: 'pending', label: 'Pendiente' },
];

const cartPreview = (data) => {
	if (!data) return 'Cargando…';
	const items = [...(data.products || []), ...(data.abonoProducts || [])]
		.filter((item) => Number(item.quantity) > 0)
		.map((item) => `${item.quantity}x ${item.typeName}`);
	return items.length ? items.join(', ') : 'Sin productos';
};

const CartCard = ({ route, cart, paymentMethods, onChanged }) => {
	const expanded = !route.isStatic;
	const [returnRows, setReturnRows] = useState([]);
	const [returnModal, setReturnModal] = useState(false);

	const confirm = (payload) => {
		API.endpoints.carts.confirm(confirmCartRequest(cart, payload)).then((rs) => {
			toast.success(rs.message);
			onChanged();
		});
	};

	const setState = (state) => {
		API.endpoints.carts.setState({ cartId: cart.id, state }).then((rs) => {
			toast.success(rs.message);
			onChanged();
		});
	};

	const resetState = () => {
		API.endpoints.carts.resetState({ cartId: cart.id }).then((rs) => {
			toast.success(rs.message);
			onChanged();
		});
	};

	const deleteCart = () => {
		API.endpoints.carts.delete({ cartId: cart.id }).then((rs) => {
			toast.success(rs.message);
			onChanged();
		});
	};

	const openReturn = () => {
		API.endpoints.carts.getReturnedProducts({ cartId: cart.id }).then((rs) => {
			setReturnRows((rs.data.items || []).map((item) => ({ ...item, quantity: item.quantity || '' })));
			setReturnModal(true);
		});
	};

	const saveReturn = () => {
		API.endpoints.carts.returnProducts({
			cartId: cart.id,
			products: returnRows.filter((item) => Helpers.numberOrZero(item.quantity) > 0).map((item) => ({ type: item.type, quantity: Helpers.numberOrZero(item.quantity) })),
		}).then((rs) => {
			toast.success(rs.message);
			setReturnModal(false);
			onChanged();
		});
	};

	return (
		<Card
			className="mb-8"
			style={{ backgroundColor: 'var(--color-bg-secondary-alt)' }}
			title={<span>{cart.clientName} {!route.isStatic && <Badge variant={stateVariant(cart.state)}>{Formatters.stateName(cart.state)}</Badge>}</span>}
			subtitle={`${cart.clientAddress || ''} - ${Formatters.debtLabel(cart.clientDebt)}`}
		>
			<div className="flex flex-wrap gap-x-6 gap-y-1 text-xs">
				<span className="text-text-muted">Bajada <span className="font-medium text-text-primary">#{cart.id}</span></span>
				<span className="text-text-muted">Cobrado <span className="font-medium text-text-primary">{Formatters.formatCurrency(cart.collected || 0)}</span></span>
				<span className="text-text-muted">Estado <span className="font-medium text-text-primary">{Formatters.stateName(cart.state)}</span></span>
			</div>
			{cart.state === State.Confirmed && (
				<div className="mt-3">
					<div className="text-xs font-medium uppercase tracking-wide text-text-muted">Bajada</div>
					<div className="mt-1 text-sm text-text-primary">{cartPreview(cart)}</div>
				</div>
			)}
			{expanded && cart.state === State.Pending && (
				<div className="mt-4">
					<CartEditor
						title="Confirmar bajada"
						products={cart.availableProducts || []}
						abonoProducts={cart.availableAbonoProducts || []}
						paymentMethods={paymentMethods}
						onSubmit={confirm}
					/>
					<div className="mt-3 flex flex-wrap gap-2">
						{[State.Ausent, State.NotNeeded, State.Holidays].map((state) => (
							<Button key={state} size="sm" variant="secondary" onClick={() => setState(state)}>{Formatters.stateName(state)}</Button>
						))}
					</div>
				</div>
			)}
			{expanded && cart.state === State.Confirmed && (
				<div className="mt-4 space-y-3">
					<div className="grid gap-4 md:grid-cols-3">
						<div>
							<h4 className="mb-2 border-b border-border-subtle pb-1 text-xs font-semibold uppercase tracking-wide text-text-muted">Productos</h4>
							<DataTable columns={[{ name: 'typeName', text: 'Producto' }, { name: 'quantity', text: 'Cantidad' }, { name: 'settedPrice', text: 'Precio', render: Formatters.formatCurrency }]} rows={cart.products || []} infinite />
						</div>
						<div>
							<h4 className="mb-2 border-b border-border-subtle pb-1 text-xs font-semibold uppercase tracking-wide text-text-muted">Abonos</h4>
							<DataTable columns={[{ name: 'typeName', text: 'Abono' }, { name: 'quantity', text: 'Cantidad' }]} rows={cart.abonoProducts || []} infinite />
						</div>
						<div>
							<h4 className="mb-2 border-b border-border-subtle pb-1 text-xs font-semibold uppercase tracking-wide text-text-muted">Pagos</h4>
							<DataTable columns={[{ name: 'name', text: 'Metodo' }, { name: 'amount', text: 'Monto', render: Formatters.formatCurrency }]} rows={cart.paymentMethods || []} infinite />
						</div>
					</div>
					<div className="flex flex-wrap justify-end gap-2">
						{App.isDealer() && <Button size="sm" variant="secondary" onClick={openReturn}>Devuelve</Button>}
						<Link to={`/bajadas/${cart.id}/editar`}><Button size="sm" variant="secondary"><Edit size={14} />Editar bajada</Button></Link>
						{App.isAdmin() && <ConfirmButton size="sm" variant="danger" message="Eliminar bajada?" onConfirm={deleteCart}>Eliminar</ConfirmButton>}
					</div>
				</div>
			)}
			{expanded && cart.state !== State.Pending && cart.state !== State.Confirmed && (
				<div className="mt-4 flex justify-end">
					<Button size="sm" variant="warning" onClick={resetState}>Cancelar estado</Button>
				</div>
			)}
			<Modal open={returnModal} title={`Devolucion - ${cart.clientName}`} onClose={() => setReturnModal(false)} footer={<><Button variant="secondary" onClick={() => setReturnModal(false)}>Cerrar</Button><Button onClick={saveReturn}>Confirmar</Button></>}>
				<DataTable
					columns={[
						{ name: 'typeName', text: 'Producto' },
						{ name: 'quantity', text: 'Cantidad', render: (_, row) => <Input type="number" min={0} value={row.quantity} onChange={(value) => setReturnRows((rows) => rows.map((item) => item.type === row.type ? { ...item, quantity: value } : item))} /> },
					]}
					rows={returnRows}
				/>
			</Modal>
		</Card>
	);
};

const RouteDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { catalog } = useCatalog();
	const [route, setRoute] = useState(null);
	const [dispatched, setDispatched] = useState([]);
	const [dispatchedOpen, setDispatchedOpen] = useState(false);
	const [dispenserOpen, setDispenserOpen] = useState(false);
	const [dispenserPrice, setDispenserPrice] = useState('');
	const [cartSearch, setCartSearch] = useState('');
	const [productFilter, setProductFilter] = useState(null);
	const [serviceFilter, setServiceFilter] = useState(null);
	const [paymentFilter, setPaymentFilter] = useState(null);
	const [transferOpen, setTransferOpen] = useState(false);
	const [transfersViewOpen, setTransfersViewOpen] = useState(false);

	const paymentMethods = useMemo(() => catalog?.paymentMethods || [], [catalog]);

	const load = () => {
		API.endpoints.routes.getOne({ id }).then((rs) => {
			setRoute(rs.data);
			setDispenserPrice(rs.data.dispenserPrice || 0);
		});
	};

	useEffect(load, [id]);

	if (!route) return <PageHeader title="Planilla" breadcrumbs={['Inicio', 'Planillas']} />;

	const startRoute = () => {
		API.endpoints.routes.createByDealer({ routeId: route.id }).then((rs) => {
			toast.success(rs.message);
			navigate(`/planillas/${rs.data.id}`);
		});
	};

	const closeRoute = () => API.endpoints.routes.close({ routeId: route.id }).then((rs) => { toast.success(rs.message); load(); });
	const deleteRoute = () => API.endpoints.routes.delete({ routeId: route.id }).then((rs) => { toast.success(rs.message); navigate('/planillas'); });
	const renewByRoute = () => API.endpoints.abonos.renewByRoute({ routeId: route.id }).then((rs) => toast.success(rs.message));

	const openDispatched = () => {
		API.endpoints.routes.getDispatched({ routeId: route.id }).then((rs) => {
			setDispatched(rs.data.items || []);
			setDispatchedOpen(true);
		});
	};

	const saveDispatched = () => {
		API.endpoints.routes.updateDispatched({
			routeId: route.id,
			products: dispatched.map((item) => ({ type: item.type, quantity: Helpers.numberOrZero(item.quantity) })),
		}).then((rs) => {
			toast.success(rs.message);
			setDispatchedOpen(false);
			load();
		});
	};

	const saveDispenser = () => {
		API.endpoints.routes.setDispenserPrice({ routeId: route.id, price: Helpers.numberOrZero(dispenserPrice) }).then((rs) => {
			toast.success(rs.message);
			setDispenserOpen(false);
			load();
		});
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
			<PageHeader
				title={`Planilla de ${route.dealerName}`}
				breadcrumbs={['Inicio', 'Planillas', 'Detalles']}
				actions={
					<>
						{route.isStatic && App.isAdmin() && <Button onClick={startRoute}><Play size={16} />Comenzar</Button>}
						{App.isAdmin() && <Link to="/clientes/nuevo" target="_blank"><Button variant="secondary"><UserPlus size={16} />Nuevo cliente</Button></Link>}
						{App.isAdmin() && <Link to={`/planillas/${route.id}/editar`}><Button variant="secondary"><Edit size={16} />Editar clientes</Button></Link>}
						{!route.isStatic && <Link to={`/planillas/${route.id}/manual`}><Button variant="secondary"><Plus size={16} />Fuera de reparto</Button></Link>}
						{!route.isStatic && <Button onClick={() => setTransferOpen(true)}>Nueva transferencia</Button>}
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
						{!route.isStatic && <Button variant="secondary" onClick={openDispatched}>Productos cargados</Button>}
						{!route.isStatic && <Button variant="secondary" onClick={() => setDispenserOpen(true)}>Precio dispenser</Button>}
						{route.isStatic && <ConfirmButton variant="secondary" message="Renovar abonos de esta planilla?" onConfirm={renewByRoute}>Renovar abonos</ConfirmButton>}
						{!route.isStatic && !route.isClosed && <ConfirmButton variant="warning" message="Cerrar planilla?" onConfirm={closeRoute}>Cerrar</ConfirmButton>}
						<ConfirmButton variant="danger" message="Eliminar planilla?" onConfirm={deleteRoute}>Eliminar</ConfirmButton>
					</>
				}>
					<div className="grid gap-3 md:grid-cols-3">
						<Field label="Dia" value={Formatters.dayName(route.dayOfWeek)} />
						<Field label="Fecha" value={Formatters.formatDate(route.createdAt)} />
						<Field label="Precio dispenser" value={Formatters.formatCurrency(route.dispenserPrice)} />
					</div>
				</Card>
			)}
			{!route.isStatic && App.isAdmin() && <div className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
				<Card title="Productos vendidos">
					<DataTable
						columns={[
							{ name: 'name', text: 'Producto' },
							{ name: 'dispatched', text: 'Cargados' },
							{ name: 'sold', text: 'Vendidos' },
							{ name: 'returned', text: 'Devueltos' },
							{ name: 'clientStock', text: 'Stock clientes' },
							{ name: 'total', text: 'Total', render: Formatters.formatCurrency },
						]}
						rows={route.soldProducts || []}
						infinite
					/>
				</Card>
				<Card title="Cobros y gastos">
					<div className="space-y-2 text-sm">
						{(route.payments || []).map((payment) => <div key={payment.paymentMethodId} className="flex justify-between"><span>{payment.paymentMethodName}</span><strong>{Formatters.formatCurrency(payment.amount)}</strong></div>)}
						{(() => {
							const transfers = route.transfers || [];
							const transfersTotal = transfers.reduce((sum, x) => sum + Number(x.amount || 0), 0);
							const hasTransfers = transfers.length > 0;
							return (
								<button
									type="button"
									onClick={() => setTransfersViewOpen(true)}
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
				</Card>
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
			<Modal open={dispatchedOpen} title="Productos cargados" onClose={() => setDispatchedOpen(false)} footer={<><Button variant="secondary" onClick={() => setDispatchedOpen(false)}>Cerrar</Button><Button onClick={saveDispatched}>Guardar</Button></>}>
				<DataTable
					columns={[
						{ name: 'typeName', text: 'Producto' },
						{ name: 'quantity', text: 'Cantidad', render: (_, row) => <Input type="number" min={0} value={row.quantity} onChange={(value) => setDispatched((rows) => rows.map((item) => item.type === row.type ? { ...item, quantity: value } : item))} /> },
					]}
					rows={dispatched}
				/>
			</Modal>
			<Modal open={dispenserOpen} title="Precio dispenser" onClose={() => setDispenserOpen(false)} footer={<><Button variant="secondary" onClick={() => setDispenserOpen(false)}>Cerrar</Button><Button onClick={saveDispenser}>Guardar</Button></>}>
				<Input label="Precio" type="number" min={0} value={dispenserPrice} onChange={setDispenserPrice} />
			</Modal>
			<Modal open={transfersViewOpen} title={`Transferencias - ${Formatters.dayName(route.dayOfWeek)}`} onClose={() => setTransfersViewOpen(false)} footer={<Button variant="secondary" onClick={() => setTransfersViewOpen(false)}>Cerrar</Button>}>
				{(route.transfers || []).length === 0 ? (
					<p className="m-0 py-2 text-sm text-text-muted">No hay transferencias para esta planilla.</p>
				) : (
					<>
						<DataTable
							columns={[
								{ name: 'clientName', text: 'Cliente' },
								{ name: 'amount', text: 'Monto', render: Formatters.formatCurrency },
								{ name: 'date', text: 'Fecha', render: Formatters.formatDate },
							]}
							rows={route.transfers || []}
							infinite
						/>
						<div className="mt-3 flex justify-between border-t border-border-subtle pt-3 text-sm"><span className="font-medium">Total</span><strong>{Formatters.formatCurrency((route.transfers || []).reduce((sum, x) => sum + Number(x.amount || 0), 0))}</strong></div>
					</>
				)}
			</Modal>
			<TransferFormModal open={transferOpen} onClose={() => setTransferOpen(false)} onSaved={load} />
		</>
	);
};

export default RouteDetails;
