import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Helpers, Formatters } from '@app';
import { PaymentMethodCode } from '@constants';
import { Button, Card, DataTable, Input } from '@components';
import { PaymentMethodCombo } from '@screens/shared';

const EMPTY_ARRAY = [];

const methodId = (method) => method.id ?? method.paymentMethodId;

const normalizeProducts = (items = EMPTY_ARRAY) =>
	items.map((item) => ({
		type: Number(item.type),
		name: item.name || item.typeName,
		price: Number(item.price ?? item.settedPrice ?? 0),
		available: item.available,
		quantity: item.quantity ?? '',
	}));

const buildPaymentRows = (paymentMethods, defaultPaymentMethodCode) => {
	const selected = paymentMethods
		.filter((method) => method.selected || Helpers.numberOrZero(method.amount) > 0)
		.map((method) => ({ paymentMethodId: methodId(method), amount: method.amount ?? '' }));
	if (selected.length > 0) return selected;
	// Se busca por código, porque los métodos de pago viven en la base y pueden cambiar.
	const fallback = paymentMethods.find((method) => method.code === defaultPaymentMethodCode) ?? paymentMethods[0];
	return [{ paymentMethodId: fallback ? methodId(fallback) : null, amount: '' }];
};

export const CartEditor = ({
	title = 'Bajada',
	products = EMPTY_ARRAY,
	abonoProducts = EMPTY_ARRAY,
	returnedProducts = EMPTY_ARRAY,
	paymentMethods = EMPTY_ARRAY,
	showReturned = false,
	mirrorReturned = false,
	allowReturnedOnly = false,
	defaultPaymentMethodCode = PaymentMethodCode.Cash,
	submitText = 'Confirmar',
	onSubmit,
	disabled = false,
	loading = false,
}) => {
	const [regularRows, setRegularRows] = useState([]);
	const [abonoRows, setAbonoRows] = useState([]);
	const [returnedRows, setReturnedRows] = useState([]);
	const [paymentRows, setPaymentRows] = useState([]);

	useEffect(() => {
		setRegularRows(normalizeProducts(products));
		setAbonoRows(normalizeProducts(abonoProducts));
		setReturnedRows(normalizeProducts(returnedProducts));
		setPaymentRows(buildPaymentRows(paymentMethods, defaultPaymentMethodCode));
	}, [products, abonoProducts, returnedProducts, paymentMethods, defaultPaymentMethodCode]);

	const total = useMemo(() => regularRows.reduce((sum, row) => sum + Helpers.numberOrZero(row.quantity) * Helpers.numberOrZero(row.price), 0), [regularRows]);
	const showRegularTable = regularRows.length > 0;
	const showAbonosTable = abonoRows.length > 0;
	const showReturnedTable = showReturned && returnedRows.length > 0;
	const visibleTablesCount = [showRegularTable, showAbonosTable, showReturnedTable].filter(Boolean).length;
	const gridColsClass = { 1: 'xl:grid-cols-1', 2: 'xl:grid-cols-2', 3: 'xl:grid-cols-3' }[visibleTablesCount] || 'xl:grid-cols-1';

	const lastPaymentRow = paymentRows[paymentRows.length - 1];
	const canAddPaymentRow = paymentRows.length < paymentMethods.length
		&& Boolean(lastPaymentRow?.paymentMethodId)
		&& Helpers.numberOrZero(lastPaymentRow?.amount) > 0;

	const availableMethodsForRow = (index) => {
		const takenIds = paymentRows.filter((_, i) => i !== index).map((row) => row.paymentMethodId);
		return paymentMethods.filter((method) => {
			const id = methodId(method);
			return id === paymentRows[index]?.paymentMethodId || !takenIds.includes(id);
		});
	};

	const updateQuantity = (setter) => (type, value) => {
		setter((rows) => rows.map((row) => row.type === type ? { ...row, quantity: value } : row));
	};

	// Lo bajado arrastra a lo devuelto (se entrega lleno y se retira el vacío), pero no al revés:
	// una vez que el repartidor corrige una devolución, esa cantidad queda como la cargó.
	const updateDeliveredQuantity = (type, value) => {
		updateQuantity(setRegularRows)(type, value);
		if (mirrorReturned) updateQuantity(setReturnedRows)(type, value);
	};

	const setPaymentMethod = (index, value) => {
		setPaymentRows((rows) => rows.map((row, i) => i === index ? { ...row, paymentMethodId: value } : row));
	};

	const setPaymentAmount = (index, value) => {
		setPaymentRows((rows) => rows.map((row, i) => i === index ? { ...row, amount: value } : row));
	};

	const removePaymentRow = (index) => {
		setPaymentRows((rows) => rows.filter((_, i) => i !== index));
	};

	const addPaymentRow = () => {
		setPaymentRows((rows) => {
			const takenIds = rows.map((row) => row.paymentMethodId);
			const nextMethod = paymentMethods.find((method) => !takenIds.includes(methodId(method)));
			if (!nextMethod) return rows;
			return [...rows, { paymentMethodId: methodId(nextMethod), amount: '' }];
		});
	};

	const fillTotal = () => {
		setPaymentRows((rows) => {
			const others = rows.slice(1).reduce((sum, row) => sum + Helpers.numberOrZero(row.amount), 0);
			const remaining = Math.max(total - others, 0);
			return rows.map((row, i) => i === 0 ? { ...row, amount: remaining } : row);
		});
	};

	const buildPayload = () => {
		const anyNegative = [...regularRows, ...abonoRows, ...returnedRows].some((item) => Helpers.numberOrZero(item.quantity) < 0);
		if (anyNegative) throw new Error('No puede haber cantidades negativas.');

		const abonoOverflow = abonoRows.some((item) => item.available !== undefined && Helpers.numberOrZero(item.quantity) > item.available);
		if (abonoOverflow) throw new Error('No se puede bajar mas productos del abono de los que dispone.');

		const paidRows = paymentRows.filter((row) => Helpers.numberOrZero(row.amount) > 0);
		if (paidRows.some((row) => !row.paymentMethodId)) throw new Error('Selecciona un metodo de pago para cada monto ingresado.');

		const payload = {
			products: Helpers.positiveItems(regularRows).map((item) => ({ type: item.type, quantity: Helpers.numberOrZero(item.quantity) })),
			abonoProducts: Helpers.positiveItems(abonoRows).map((item) => ({ type: item.type, quantity: Helpers.numberOrZero(item.quantity) })),
			returnedProducts: Helpers.positiveItems(returnedRows).map((item) => ({ type: item.type, quantity: Helpers.numberOrZero(item.quantity) })),
			paymentMethods: paidRows.map((row) => ({ paymentMethodId: Number(row.paymentMethodId), amount: Helpers.numberOrZero(row.amount) })),
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
					disabled={disabled || loading}
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
			<div className={`grid gap-4 ${gridColsClass}`}>
				{showRegularTable > 0 && (
					<div className="xl:col-span-1">
						<h3 className="mb-2 text-sm font-semibold">Bajada</h3>
						<DataTable columns={productColumns(updateDeliveredQuantity, true)} rows={regularRows} empty="Sin productos" />
					</div>
				)}
				{showAbonosTable && (
					<div className="xl:col-span-1">
						<h3 className="mb-2 text-sm font-semibold">Abonos</h3>
						<DataTable columns={productColumns(updateQuantity(setAbonoRows), false, true)} rows={abonoRows} empty="Sin abonos disponibles" />
					</div>
				)}
				{showReturnedTable && (
					<div className="xl:col-span-1">
						<h3 className="mb-2 text-sm font-semibold">Devoluciones</h3>
						<DataTable columns={productColumns(updateQuantity(setReturnedRows))} rows={returnedRows} empty="Sin productos para devolver" />
					</div>
				)}
			</div>
			<div className="mt-4 space-y-2">
				<h3 className="text-sm font-semibold">Metodos de pago</h3>
				{paymentRows.map((row, index) => (
					<div key={index} className="grid gap-3 md:grid-cols-[240px_180px_auto] md:items-end">
						<PaymentMethodCombo
							label={index === 0 ? 'Metodo de pago' : undefined}
							paymentMethods={availableMethodsForRow(index)}
							value={row.paymentMethodId}
							disabled={disabled || loading}
							onChange={(value) => setPaymentMethod(index, value)}
						/>
						<Input
							label={index === 0 ? 'Entrega' : undefined}
							type="number"
							min={0}
							value={row.amount}
							disabled={disabled || loading}
							onChange={(value) => setPaymentAmount(index, value)}
						/>
						<div className="flex gap-2">
							{paymentRows.length > 1 && (
								<Button variant="secondary" size="icon" disabled={disabled || loading} onClick={() => removePaymentRow(index)}><Trash2 size={16} /></Button>
							)}
							{index === paymentRows.length - 1 && (
								<Button variant="secondary" size="icon" disabled={disabled || loading || !canAddPaymentRow} onClick={addPaymentRow}><Plus size={16} /></Button>
							)}
						</div>
					</div>
				))}
			</div>
			<div className="mt-4 flex flex-wrap justify-end gap-2">
				<Button variant="secondary" disabled={disabled || loading} onClick={fillTotal}>Usar total</Button>
				<Button onClick={submit} disabled={disabled} loading={loading}>{submitText}</Button>
			</div>
		</Card>
	);
};
