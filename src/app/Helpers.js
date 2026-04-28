import { DateHelper } from '@app';
import { Roles } from '@constants';

export const toComboItems = (items = [], valueKey = 'id', labelKey = 'description') =>
	items.map((item) => ({
		value: item[valueKey],
		label: item[labelKey],
		raw: item,
	}));

export const dealerComboItems = (items = []) =>
	items.map((item) => ({
		value: item.id,
		label: item.truckNumber ? `${item.name} - Camion ${item.truckNumber}` : item.name,
		raw: item,
	}));

export const buildDateRangeRequest = ({ dateFrom, dateTo, userId } = {}) => ({
	dateFrom: DateHelper.toApiDate(dateFrom),
	dateTo: DateHelper.toApiDate(dateTo),
	userId: userId || '',
});

export const numberOrZero = (value) => {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : 0;
};

export const positiveItems = (items = [], quantityKey = 'quantity') =>
	items.filter((item) => numberOrZero(item[quantityKey]) > 0);

export const getRoleName = (role) => {
	switch (role) {
		case Roles.Admin:
			return 'Administrador';
		case Roles.Dealer:
			return 'Repartidor';
		default:
			return 'Usuario';
	}
};

export const normalizePaymentMethods = (items = []) =>
	items
		.map((item) => ({
			paymentMethodId: item.paymentMethodId ?? item.id,
			amount: numberOrZero(item.amount),
		}))
		.filter((item) => item.paymentMethodId && item.amount >= 0);

export const downloadBlob = (blob, filename) => {
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
};
