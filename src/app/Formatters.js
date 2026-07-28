import { CartsTransfersType, Day, ProductActionType, State } from '@constants';

const DATE_OPTIONS = {
	day: '2-digit',
	month: '2-digit',
	year: 'numeric'
};

export const formatCurrency = (value, decimals = 0) => {
	if (value === null || value === undefined || value === '') return '-';
	const number = Number(value);
	if (Number.isNaN(number)) return '-';
	const fractionDigits = Number.isInteger(Number(decimals)) ? Math.min(Math.max(Number(decimals), 0), 20) : 0;
	return new Intl.NumberFormat('es-AR', {
		style: 'currency',
		currency: 'ARS',
		minimumFractionDigits: fractionDigits,
		maximumFractionDigits: fractionDigits,
	}).format(number);
};

export const formatDate = (value) => {
	if (!value) return '-';
	const dateOnlyMatch = typeof value === 'string' ? value.match(/^(\d{4})-(\d{2})-(\d{2})$/) : null;
	const date = dateOnlyMatch
		? new Date(Number(dateOnlyMatch[1]), Number(dateOnlyMatch[2]) - 1, Number(dateOnlyMatch[3]))
		: new Date(value);
	if (Number.isNaN(date.getTime())) return '-';
	return date.toLocaleDateString('es-AR', DATE_OPTIONS);
};

// Formatea una fecha de calendario (sin hora) ignorando la zona horaria.
// Sirve para campos que representan un dia (ej. la fecha establecida de una
// transferencia), que el backend puede devolver como "2026-07-20" o como
// "2026-07-20T00:00:00Z". A diferencia de formatDate, toma el prefijo de la
// fecha del string y NO convierte a hora local, evitando el corrimiento de dia.
export const formatDateOnly = (value) => {
	if (!value) return '-';
	const dateOnlyMatch = typeof value === 'string' ? value.match(/^(\d{4})-(\d{2})-(\d{2})/) : null;
	const date = dateOnlyMatch
		? new Date(Number(dateOnlyMatch[1]), Number(dateOnlyMatch[2]) - 1, Number(dateOnlyMatch[3]))
		: new Date(value);
	if (Number.isNaN(date.getTime())) return '-';
	return date.toLocaleDateString('es-AR', DATE_OPTIONS);
};

export const formatDateTime = (value) => {
	if (!value) return '-';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return '-';
	return `${date.toLocaleDateString('es-AR', DATE_OPTIONS)} ${date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs`;
};

export const stateName = (value) => ({
	[State.Pending]: 'Pendiente',
	[State.Confirmed]: 'Confirmado',
	[State.Ausent]: 'No estaba',
	[State.NotNeeded]: 'No necesitaba',
	[State.Holidays]: 'De vacaciones',
	[State.Debe]: 'Debe',
}[Number(value)] ?? '-');

export const dayName = (value) => ({
	[Day.Lunes]: 'Lunes',
	[Day.Martes]: 'Martes',
	[Day.Miercoles]: 'Miercoles',
	[Day.Jueves]: 'Jueves',
	[Day.Viernes]: 'Viernes',
}[Number(value)] ?? '-');

// Nombre del dia de la semana a partir de un objeto Date (getDay(): 0=Domingo).
export const weekdayName = (date) => {
	if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '-';
	return dayName(date.getDay());
};

export const historyTypeName = (value) => ({
	[CartsTransfersType.Transfer]: 'Transferencia',
	[CartsTransfersType.Cart]: 'Bajada',
	[CartsTransfersType.Abono]: 'Abono',
}[Number(value)] ?? '-');

export const productActionName = (value) => ({
	[ProductActionType.Baja]: 'Baja',
	[ProductActionType.Devuelve]: 'Devuelve',
	[ProductActionType.Abono]: 'Baja (abono)',
}[Number(value)] ?? '-');

export const debtLabel = (value) => {
	const amount = Number(value || 0);
	if (amount === 0) return 'Sin deuda';
	if (amount > 0) return `Deuda: ${formatCurrency(amount)}`;
	return `A favor: ${formatCurrency(Math.abs(amount))}`;
};
