import { Helpers } from '@app';

export const emptyClient = {
	name: '',
	address: '',
	phone: '',
	email: '',
	observations: '',
	notes: '',
	debt: 0,
	dealerId: '',
	hasInvoice: false,
	onlyAbonos: false,
	invoiceType: null,
	taxCondition: null,
	cuit: '',
	deliveryDay: null,
	products: [],
	abonoIds: [],
};

export const buildClientRequest = (client) => ({
	name: client.name,
	address: client.address,
	phone: client.phone,
	email: client.email || '',
	observations: client.observations || '',
	notes: client.notes || '',
	debt: Helpers.numberOrZero(client.debt),
	dealerId: client.dealerId || null,
	hasInvoice: !!client.hasInvoice,
	onlyAbonos: !!client.onlyAbonos,
	invoiceType: client.hasInvoice ? Number(client.invoiceType || 0) : 0,
	taxCondition: client.hasInvoice ? Number(client.taxCondition || 0) : 0,
	cuit: client.hasInvoice ? client.cuit || '' : '',
	deliveryDay: Number(client.deliveryDay || 0),
	products: (client.products || []).filter((item) => item.assigned || Helpers.numberOrZero(item.stock) >= 0).map((item) => ({
		productId: Number(item.productId || item.id),
		stock: Helpers.numberOrZero(item.stock),
	})),
	abonoIds: client.abonoIds || [],
});

export const clientFilterRequest = ({ search, dealerId, deliveryDay, activeOnly = true }) => ({
	activeOnly,
	search: search || '',
	dealerId: dealerId || '',
	deliveryDay: Number(deliveryDay || 0),
});
