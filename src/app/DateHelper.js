const getDateParts = (value) => {
	if (!value) return null;

	if (typeof value === 'string') {
		const dateOnlyMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
		if (dateOnlyMatch) {
			return {
				year: dateOnlyMatch[1],
				month: dateOnlyMatch[2],
				day: dateOnlyMatch[3],
			};
		}
	}

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return null;

	return {
		year: `${date.getFullYear()}`,
		month: `${date.getMonth() + 1}`.padStart(2, '0'),
		day: `${date.getDate()}`.padStart(2, '0'),
	};
};

export const toApiDate = (value) => {
	const parts = getDateParts(value);
	if (!parts) return null;
	return `${parts.year}-${parts.month}-${parts.day}`;
};

export const toInputDate = (value = new Date()) => {
	const parts = getDateParts(value);
	if (!parts) return '';
	return `${parts.year}-${parts.month}-${parts.day}`;
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
