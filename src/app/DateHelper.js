export const toApiDate = (value) => {
	if (!value) return null;
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return null;
	const year = date.getFullYear();
	const month = `${date.getMonth() + 1}`.padStart(2, '0');
	const day = `${date.getDate()}`.padStart(2, '0');
	return `${year}-${month}-${day}T00:00:00Z`;
};

export const toInputDate = (value = new Date()) => {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return '';
	const year = date.getFullYear();
	const month = `${date.getMonth() + 1}`.padStart(2, '0');
	const day = `${date.getDate()}`.padStart(2, '0');
	return `${year}-${month}-${day}`;
};

export const monthStart = () => {
	const date = new Date();
	return toInputDate(new Date(date.getFullYear(), date.getMonth(), 1));
};

export const monthEnd = () => {
	const date = new Date();
	return toInputDate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
};

export const currentYear = () => new Date().getFullYear();
export const currentMonth = () => new Date().getMonth() + 1;
