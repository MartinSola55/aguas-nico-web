export const routeRequest = ({ userId, dayOfWeek }) => ({
	userId,
	dayOfWeek: Number(dayOfWeek || 0),
});

export const confirmCartRequest = (cart, payload, sendReturned = false) => ({
	id: cart.id,
	clientId: cart.clientId,
	products: payload.products,
	abonoProducts: payload.abonoProducts,
	// Sin devoluciones explícitas la API asume que vuelve un vacío por cada producto bajado,
	// así que solo se mandan cuando el repartidor las completó en pantalla.
	returnedProducts: sendReturned ? payload.returnedProducts : null,
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
