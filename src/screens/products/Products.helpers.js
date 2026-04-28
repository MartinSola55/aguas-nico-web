import { Helpers } from '@app';

export const emptyProduct = {
	id: 0,
	name: '',
	price: '',
	type: null,
	sortOrder: 0,
};

export const buildProductRequest = (product) => ({
	...(product.id ? { id: product.id } : {}),
	name: product.name,
	price: Helpers.numberOrZero(product.price),
	type: Number(product.type || 0),
	sortOrder: Helpers.numberOrZero(product.sortOrder),
});
