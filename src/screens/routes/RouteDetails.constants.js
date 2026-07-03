import { ProductType } from '@constants';

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
