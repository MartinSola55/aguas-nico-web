import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { Edit } from 'lucide-react';
import { toast } from 'react-toastify';
import { API, Formatters, Helpers } from '@app';
import { App } from '@app';
import { State } from '@constants';
import { Badge, Button, Card, ConfirmButton, DataTable } from '@components';
import { CartEditor } from '../CartEditor.jsx';
import { ReturnProductsModal } from '../modals/ReturnProductsModal.jsx';
import { confirmCartRequest } from '../../Routes.helpers.js';
import { cartPreview, stateVariant } from './CartCard.helpers.js';

export const CartCard = ({ route, cart, paymentMethods, onChanged }) => {
	const expanded = !route.isStatic;
	const returnModalRef = useRef(null);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);

	const confirm = (payload) => {
		setLoading(true);
		API.endpoints.carts.confirm(confirmCartRequest(cart, payload, App.isDealer()))
			.then((rs) => {
				toast.success(rs.message);
				onChanged();
			})
			.finally(() => setLoading(false));
	};

	const setState = (state) => {
		setLoading(true);
		API.endpoints.carts.setState({ cartId: cart.id, state })
			.then((rs) => {
				toast.success(rs.message);
				onChanged();
			})
			.finally(() => setLoading(false));
	};

	const resetState = () => {
		setLoading(true);
		API.endpoints.carts.resetState({ cartId: cart.id })
			.then((rs) => {
				toast.success(rs.message);
				onChanged();
			})
			.finally(() => setLoading(false));
	};

	const deleteCart = () => {
		setLoading(true);
		API.endpoints.carts.delete({ cartId: cart.id })
			.then((rs) => {
				toast.success(rs.message);
				onChanged();
			})
			.finally(() => setLoading(false));
	};

	const openReturn = () => {
		setLoading(true);
		API.endpoints.carts.getReturnedProducts({ cartId: cart.id })
			.then((rs) => {
				const rows = (rs.data.items || []).map((item) => ({ ...item, quantity: item.quantity || '' }));
				returnModalRef.current?.open({ clientName: cart.clientName, rows });
			})
			.finally(() => setLoading(false));
	};

	const saveReturn = (rows, onSaved) => {
		setSaving(true);
		API.endpoints.carts.returnProducts({
			cartId: cart.id,
			products: rows.filter((item) => Helpers.numberOrZero(item.quantity) > 0).map((item) => ({ type: item.type, quantity: Helpers.numberOrZero(item.quantity) })),
		})
			.then((rs) => {
				toast.success(rs.message);
				onSaved?.();
				onChanged();
			})
			.finally(() => setSaving(false));
	};

	return (
		<>
			<ReturnProductsModal ref={returnModalRef} onConfirm={saveReturn} loading={saving} />
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
							returnedProducts={cart.availableProducts || []}
							showReturned={App.isDealer()}
							mirrorReturned={App.isDealer()}
							paymentMethods={paymentMethods}
							onSubmit={confirm}
							loading={loading}
						/>
						<div className="mt-3 flex flex-wrap gap-2">
							{[State.Ausent, State.NotNeeded, State.Holidays].map((state) => (
								<Button key={state} size="sm" variant="secondary" loading={loading} onClick={() => setState(state)}>{Formatters.stateName(state)}</Button>
							))}
						</div>
					</div>
				)}
				{expanded && cart.state === State.Confirmed && (
					<div className="mt-4 space-y-3">
						<div className="grid gap-4 md:grid-cols-3">
							<div>
								<h4 className="mb-2 border-b border-border-subtle pb-1 text-xs font-semibold uppercase tracking-wide text-text-muted">Productos</h4>
								{cart?.products?.length > 0 && (
									<DataTable
										columns={[{ name: 'typeName', text: 'Producto' }, { name: 'quantity', text: 'Cantidad' }, { name: 'settedPrice', text: 'Precio', render: Formatters.formatCurrency }]}
										rows={cart.products}
										infinite />
								)}
							</div>
							<div>
								<h4 className="mb-2 border-b border-border-subtle pb-1 text-xs font-semibold uppercase tracking-wide text-text-muted">Abonos</h4>
								{cart?.abonoProducts?.length > 0 && (
									<DataTable
										columns={[{ name: 'typeName', text: 'Abono' }, { name: 'quantity', text: 'Cantidad' }]}
										rows={cart.abonoProducts}
										infinite />
								)}
							</div>
							<div>
								<h4 className="mb-2 border-b border-border-subtle pb-1 text-xs font-semibold uppercase tracking-wide text-text-muted">Pagos</h4>
								{cart?.paymentMethods?.length > 0 && (
									<DataTable
										columns={[{ name: 'name', text: 'Metodo' }, { name: 'amount', text: 'Monto', render: Formatters.formatCurrency }]}
										rows={cart.paymentMethods}
										infinite />
								)}
							</div>
						</div>
						<div className="flex flex-wrap justify-end gap-2">
							{App.isDealer() && <Button size="sm" variant="secondary" loading={loading} onClick={openReturn}>Devuelve</Button>}
							<Link to={`/bajadas/${cart.id}/editar`}><Button size="sm" variant="secondary"><Edit size={14} />Editar bajada</Button></Link>
							{App.isAdmin() && <ConfirmButton size="sm" variant="danger" loading={loading} message="Eliminar bajada?" onConfirm={deleteCart}>Eliminar</ConfirmButton>}
						</div>
					</div>
				)}
				{expanded && cart.state !== State.Pending && cart.state !== State.Confirmed && (
					<div className="mt-4 flex justify-end">
						<Button size="sm" variant="warning" loading={loading} onClick={resetState}>Cancelar estado</Button>
					</div>
				)}
			</Card>
		</>
	);
};
