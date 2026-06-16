import { useEffect, useMemo, useState } from 'react';
import { Helpers, Formatters } from '@app';
import { Button, Card, DataTable, Input, Select } from '@components';

const EMPTY_ARRAY = [];

const normalizeProducts = (items = EMPTY_ARRAY) =>
	items.map((item) => ({
		type: Number(item.type),
		name: item.name || item.typeName,
		price: Number(item.price ?? item.settedPrice ?? 0),
		available: item.available,
		quantity: item.quantity ?? '',
	}));

const CartEditor = ({
	title = 'Bajada',
	products = EMPTY_ARRAY,
	abonoProducts = EMPTY_ARRAY,
	returnedProducts = EMPTY_ARRAY,
	paymentMethods = EMPTY_ARRAY,
	showReturned = false,
	allowReturnedOnly = false,
	defaultPaymentMethodId = 1,
	submitText = 'Confirmar',
	onSubmit,
	disabled = false,
}) => {
	const [regularRows, setRegularRows] = useState([]);
	const [abonoRows, setAbonoRows] = useState([]);
	const [returnedRows, setReturnedRows] = useState([]);
	const [paymentMethodId, setPaymentMethodId] = useState(defaultPaymentMethodId);
	const [amount, setAmount] = useState('');

	useEffect(() => {
		setRegularRows(normalizeProducts(products));
		setAbonoRows(normalizeProducts(abonoProducts));
		setReturnedRows(normalizeProducts(returnedProducts));
		const selected = paymentMethods.find((method) => method.selected || method.amount > 0);
		setPaymentMethodId(selected?.id ?? selected?.paymentMethodId ?? defaultPaymentMethodId);
		setAmount(selected?.amount ?? '');
	}, [products, abonoProducts, returnedProducts, paymentMethods, defaultPaymentMethodId]);

	const total = useMemo(() => regularRows.reduce((sum, row) => sum + Helpers.numberOrZero(row.quantity) * Helpers.numberOrZero(row.price), 0), [regularRows]);

	const updateQuantity = (setter) => (type, value) => {
		setter((rows) => rows.map((row) => row.type === type ? { ...row, quantity: value } : row));
	};

	const buildPayload = () => {
		const anyNegative = [...regularRows, ...abonoRows, ...returnedRows].some((item) => Helpers.numberOrZero(item.quantity) < 0);
		if (anyNegative) throw new Error('No puede haber cantidades negativas.');

		const abonoOverflow = abonoRows.some((item) => item.available !== undefined && Helpers.numberOrZero(item.quantity) > item.available);
		if (abonoOverflow) throw new Error('No se puede bajar mas productos del abono de los que dispone.');

		const payload = {
			products: Helpers.positiveItems(regularRows).map((item) => ({ type: item.type, quantity: Helpers.numberOrZero(item.quantity) })),
			abonoProducts: Helpers.positiveItems(abonoRows).map((item) => ({ type: item.type, quantity: Helpers.numberOrZero(item.quantity) })),
			returnedProducts: Helpers.positiveItems(returnedRows).map((item) => ({ type: item.type, quantity: Helpers.numberOrZero(item.quantity) })),
			paymentMethods: Helpers.numberOrZero(amount) > 0 ? [{ paymentMethodId: Number(paymentMethodId), amount: Helpers.numberOrZero(amount) }] : [],
		};

		if (!allowReturnedOnly && payload.products.length === 0 && payload.abonoProducts.length === 0 && payload.paymentMethods.length === 0) {
			throw new Error('No se puede confirmar una bajada sin productos y dinero.');
		}
		return payload;
	};

	const submit = () => {
		try {
			onSubmit?.(buildPayload());
		} catch (error) {
			window.alert(error.message);
		}
	};

	const productColumns = (onChange, includePrice = false, includeAvailable = false) => [
		{ name: 'name', text: 'Producto' },
		includeAvailable && { name: 'available', text: 'Disponible' },
		includePrice && { name: 'price', text: 'Precio', render: (value) => Formatters.formatCurrency(value) },
		{
			name: 'quantity',
			text: 'Cantidad',
			render: (_, row) => (
				<Input
					type="number"
					min={0}
					max={row.available}
					value={row.quantity}
					disabled={disabled}
					onChange={(value) => onChange(row.type, value)}
				/>
			),
		},
	].filter(Boolean);

	return (
		<Card
			title={title}
			actions={<div className="text-sm font-semibold text-text-primary">Total: {Formatters.formatCurrency(total)}</div>}
		>
			<div className="grid gap-4 xl:grid-cols-3">
				{regularRows.length > 0 && (
					<div className="xl:col-span-1">
						<h3 className="mb-2 text-sm font-semibold">Bajada</h3>
						<DataTable columns={productColumns(updateQuantity(setRegularRows), true)} rows={regularRows} empty="Sin productos" />
					</div>
				)}
				{abonoRows.length > 0 && (
					<div className="xl:col-span-1">
						<h3 className="mb-2 text-sm font-semibold">Abonos</h3>
						<DataTable columns={productColumns(updateQuantity(setAbonoRows), false, true)} rows={abonoRows} empty="Sin abonos disponibles" />
					</div>
				)}
				{showReturned && returnedRows.length > 0 && (
					<div className="xl:col-span-1">
						<h3 className="mb-2 text-sm font-semibold">Devoluciones</h3>
						<DataTable columns={productColumns(updateQuantity(setReturnedRows))} rows={returnedRows} empty="Sin productos para devolver" />
					</div>
				)}
			</div>
			<div className="mt-4 grid gap-3 md:grid-cols-[240px_180px_auto] md:items-end">
				<Select
					label="Metodo de pago"
					items={paymentMethods.map((item) => ({ value: item.id ?? item.paymentMethodId, label: item.name ?? item.paymentMethodName ?? item.description }))}
					value={paymentMethodId}
					onChange={setPaymentMethodId}
				/>
				<Input label="Entrega" type="number" min={0} value={amount} onChange={setAmount} />
				<div className="flex gap-2">
					<Button variant="secondary" onClick={() => setAmount(total)}>Usar total</Button>
					<Button onClick={submit} disabled={disabled}>{submitText}</Button>
				</div>
			</div>
		</Card>
	);
};

export default CartEditor;
