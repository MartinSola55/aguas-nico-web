import { DateHelper, Helpers } from '@app';

export const routeRequest = ({ userId, dayOfWeek }) => ({
	userId,
	dayOfWeek: Number(dayOfWeek || 0),
});

export const confirmCartRequest = (cart, payload) => ({
	id: cart.id,
	clientId: cart.clientId,
	products: payload.products,
	abonoProducts: payload.abonoProducts,
	paymentMethods: payload.paymentMethods,
});

export const manualCartRequest = ({ routeId, clientId }, payload) => ({
	routeId: Number(routeId),
	clientId: Number(clientId),
	products: payload.products,
	abonoProducts: payload.abonoProducts,
	paymentMethods: payload.paymentMethods,
});

export const updateCartRequest = (cart, payload) => ({
	id: Number(cart.id),
	clientId: Number(cart.clientId),
	routeId: Number(cart.routeId),
	products: payload.products,
	abonoProducts: payload.abonoProducts,
	returnedProducts: payload.returnedProducts || [],
	paymentMethods: payload.paymentMethods,
});
