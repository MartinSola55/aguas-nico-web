import { Formatters } from '@app';
import { ProductType } from '@constants';

// "En el camión" es lo que quedó sin bajar: cargado menos vendido. Solo le sirve al repartidor,
// y el importe queda reservado para el administrador.
export const soldProductColumns = (isAdmin) => [
	{ name: 'name', text: 'Producto' },
	{ name: 'dispatched', text: 'Cargados' },
	{ name: 'sold', text: 'Vendidos' },
	...(isAdmin ? [] : [{ name: 'inTruck', text: 'En el camión', render: (_, row) => Number(row.dispatched || 0) - Number(row.sold || 0) }]),
	{ name: 'returned', text: 'Devueltos' },
	{ name: 'clientStock', text: 'Stock clientes' },
	...(isAdmin ? [{ name: 'total', text: 'Total', render: Formatters.formatCurrency }] : []),
];

export const productFilterItems = [
	{ value: ProductType.B20L, label: 'Bidón 20L' },
	{ value: ProductType.B12L, label: 'Bidón 12L' },
	{ value: ProductType.Soda, label: 'Soda' },
	{ value: ProductType.B5L, label: 'Bidón 5L' },
];

export const serviceFilterItems = [
	{ value: 'abono', label: 'Abono' },
	{ value: 'bajada', label: 'Bajada' },
];

export const paymentFilterItems = [
	{ value: 'paid', label: 'Realizado' },
	{ value: 'pending', label: 'Pendiente' },
];
