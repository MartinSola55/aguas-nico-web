import { Helpers } from '@app';

export const emptyAbono = {
	id: 0,
	name: '',
	price: '',
	products: [],
};

export const buildAbonoRequest = (abono) => ({
	...(abono.id ? { id: abono.id } : {}),
	name: abono.name,
	price: Helpers.numberOrZero(abono.price),
	products: (abono.products || [])
		.filter((item) => Helpers.numberOrZero(item.quantity) > 0)
		.map((item) => ({ type: Number(item.type), quantity: Helpers.numberOrZero(item.quantity) })),
});
