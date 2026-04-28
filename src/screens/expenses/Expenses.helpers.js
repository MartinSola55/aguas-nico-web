import { DateHelper, Helpers } from '@app';

export const emptyExpense = {
	id: 0,
	userId: '',
	description: '',
	amount: '',
};

export const buildExpenseRequest = (expense) => ({
	...(expense.id ? { id: expense.id } : {}),
	userId: expense.userId,
	description: expense.description,
	amount: Helpers.numberOrZero(expense.amount),
});

export const expenseFiltersRequest = ({ dateFrom, dateTo, userId }) => ({
	dateFrom: DateHelper.toApiDate(dateFrom),
	dateTo: DateHelper.toApiDate(dateTo),
	userId: userId || '',
});
