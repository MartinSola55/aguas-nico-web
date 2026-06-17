import { LocalStorage, Helpers } from '@app';
import { Messages } from '@constants';
import { toast } from 'react-toastify';

const URL = import.meta.env.VITE_API_URL;

const buildQuery = (rq = {}) => {
	const params = new URLSearchParams();
	Object.entries(rq || {}).forEach(([key, value]) => {
		if (value === undefined || value === null || value === '') return;
		params.append(key, value);
	});
	const qs = params.toString();
	return qs ? `?${qs}` : '';
};

const headers = (json = true) => ({
	...(json ? { 'Content-Type': 'application/json' } : {}),
	...(LocalStorage.getToken() ? { Authorization: `Bearer ${LocalStorage.getToken()}` } : {}),
});

const notifyError = (error, message) => {
	if (error && typeof error === 'object') error.toastShown = true;
	toast.error(message);
	return error;
};

const readJson = async (response) => {
	if (!response.ok) {
		const message = Messages.Error[response.status] || Messages.Error.generic;
		throw notifyError(new Error(message), message);
	}
	const json = await response.json();
	if (!json.success) {
		const message = json.error?.message || Messages.Error.generic;
		throw notifyError(json, message);
	}
	return json;
};

export const get = async (path, rq) => {
	const response = await fetch(`${URL}/${path}${buildQuery(rq)}`, {
		method: 'GET',
		headers: headers(),
	});
	return readJson(response);
};

export const post = async (path, rq = {}) => {
	const response = await fetch(`${URL}/${path}`, {
		method: 'POST',
		headers: headers(),
		body: JSON.stringify(rq ?? {}),
	});
	return readJson(response);
};

export const download = async (path, rq, filename) => {
	const response = await fetch(`${URL}/${path}${buildQuery(rq)}`, {
		method: 'GET',
		headers: headers(false),
	});
	if (!response.ok) {
		const message = Messages.Error[response.status] || Messages.Error.generic;
		throw notifyError(new Error(message), message);
	}
	const blob = await response.blob();
	Helpers.downloadBlob(blob, filename);
};

export const endpoints = {
	auth: {
		login: (rq) => post('Auth/Login', rq),
		logout: () => post('Auth/Logout', {}),
	},
	home: {
		getDashboard: () => get('Home/GetDashboard'),
	},
	catalog: {
		getAll: () => get('Catalog/GetAll'),
	},
	clients: {
		getAll: (rq) => post('Client/GetAll', rq),
		getOne: (rq) => get('Client/GetOne', rq),
		create: (rq) => post('Client/Create', rq),
		update: (rq) => post('Client/Update', rq),
		updateInvoiceData: (rq) => post('Client/UpdateInvoiceData', rq),
		updateProducts: (rq) => post('Client/UpdateProducts', rq),
		updateAbonos: (rq) => post('Client/UpdateAbonos', rq),
		delete: (rq) => post('Client/Delete', rq),
		getProductsAndAbono: (rq) => get('Client/GetProductsAndAbono', rq),
		getProductsHistory: (rq) => get('Client/GetProductsHistory', rq),
		getUnassigned: () => get('Client/GetUnassigned'),
	},
	products: {
		getAll: (rq) => post('Product/GetAll', rq),
		getOne: (rq) => get('Product/GetOne', rq),
		create: (rq) => post('Product/Create', rq),
		update: (rq) => post('Product/Update', rq),
		delete: (rq) => post('Product/Delete', rq),
		getClients: (rq) => get('Product/GetClients', rq),
		getStats: (rq) => get('Product/GetStats', rq),
	},
	abonos: {
		getAll: () => get('Abono/GetAll'),
		create: (rq) => post('Abono/Create', rq),
		update: (rq) => post('Abono/Update', rq),
		delete: (rq) => post('Abono/Delete', rq),
		renewAll: () => post('Abono/RenewAll', {}),
		renewByRoute: (rq) => post('Abono/RenewByRoute', rq),
		getClients: (rq) => get('Abono/GetClients', rq),
	},
	routes: {
		getAll: (rq) => get('Route/GetAll', rq),
		getOne: (rq) => get('Route/GetOne', rq),
		create: (rq) => post('Route/Create', rq),
		createByDealer: (rq) => post('Route/CreateByDealer', rq),
		updateClients: (rq) => post('Route/UpdateClients', rq),
		delete: (rq) => post('Route/Delete', rq),
		close: (rq) => post('Route/Close', rq),
		searchByDate: (rq) => get('Route/SearchByDate', rq),
		searchByDay: (rq) => get('Route/SearchByDay', rq),
		searchSoldProducts: (rq) => get('Route/SearchSoldProducts', rq),
		clientsByIDNotInRoute: (rq) => get('Route/ClientsByIDNotInRoute', rq),
		clientsByNameNotInRoute: (rq) => get('Route/ClientsByNameNotInRoute', rq),
		getDispatched: (rq) => get('Route/GetDispatched', rq),
		updateDispatched: (rq) => post('Route/UpdateDispatched', rq),
		setDispenserPrice: (rq) => post('Route/SetDispenserPrice', rq),
		getManualCartData: (rq) => get('Route/GetManualCartData', rq),
	},
	carts: {
		getForEdit: (rq) => get('Cart/GetForEdit', rq),
		update: (rq) => post('Cart/Update', rq),
		confirm: (rq) => post('Cart/Confirm', rq),
		confirmManual: (rq) => post('Cart/ConfirmManual', rq),
		setState: (rq) => post('Cart/SetState', rq),
		resetState: (rq) => post('Cart/ResetState', rq),
		getReturnedProducts: (rq) => get('Cart/GetReturnedProducts', rq),
		returnProducts: (rq) => post('Cart/ReturnProducts', rq),
		delete: (rq) => post('Cart/Delete', rq),
	},
	dealers: {
		getAll: () => get('Dealer/GetAll'),
		getOne: (rq) => get('Dealer/GetOne', rq),
		getSheets: (rq) => get('Dealer/GetSheets', rq),
		getClientsByDay: (rq) => get('Dealer/GetClientsByDay', rq),
		getClientsNotVisited: (rq) => get('Dealer/GetClientsNotVisited', rq),
		getSoldProducts: (rq) => get('Dealer/GetSoldProducts', rq),
	},
	expenses: {
		getAll: (rq) => post('Expense/GetAll', rq),
		getOne: (rq) => get('Expense/GetOne', rq),
		create: (rq) => post('Expense/Create', rq),
		update: (rq) => post('Expense/Update', rq),
		delete: (rq) => post('Expense/Delete', rq),
		searchByDate: (rq) => get('Expense/SearchByDate', rq),
	},
	transfers: {
		getAll: (rq) => post('Transfer/GetAll', rq),
		create: (rq) => post('Transfer/Create', rq),
		update: (rq) => post('Transfer/Update', rq),
		delete: (rq) => post('Transfer/Delete', rq),
		getByDate: (rq) => get('Transfer/GetByDate', rq),
	},
	invoices: {
		getInvoices: (rq) => get('Invoice/GetInvoices', rq),
		getCsvRows: (rq) => get('Invoice/GetCsvRows', rq),
		downloadCsv: (rq) => download('Invoice/DownloadCsv', rq, 'facturas.csv'),
	},
	stats: {
		getYears: () => get('Stats/GetYears'),
		getAnnualProfits: (rq) => get('Stats/GetAnnualProfits', rq),
		getMonthlyProfits: (rq) => get('Stats/GetMonthlyProfits', rq),
		getProductsSold: (rq) => get('Stats/GetProductsSold', rq),
		getProductsSoldByDealer: (rq) => get('Stats/GetProductsSoldByDealer', rq),
		getBalanceByDate: (rq) => get('Stats/GetBalanceByDate', rq),
	},
	terceros: {
		getByDate: (rq) => get('Tercero/GetByDate', rq),
		create: (rq) => post('Tercero/Create', rq),
		update: (rq) => post('Tercero/Update', rq),
		delete: (rq) => post('Tercero/Delete', rq),
	},
	caja: {
		downloadDailyClose: (rq) => download('Caja/DownloadDailyClose', rq, `caja_diaria_${rq.date}.xlsx`),
	},
};
