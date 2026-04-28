import { DateHelper, Helpers } from '@app';

export const emptyTransfer = {
	id: 0,
	clientId: null,
	clientName: '',
	userId: '',
	amount: '',
	date: DateHelper.toInputDate(),
	updateDate: false,
};

export const buildTransferRequest = (transfer) => ({
	...(transfer.id ? { id: transfer.id, updateDate: !!transfer.updateDate } : {}),
	clientId: Number(transfer.clientId),
	userId: transfer.userId || '',
	amount: Helpers.numberOrZero(transfer.amount),
	date: DateHelper.toApiDate(transfer.date),
});

export const transferFiltersRequest = ({ dateFrom, dateTo, userId }) => ({
	dateFrom: DateHelper.toApiDate(dateFrom),
	dateTo: DateHelper.toApiDate(dateTo),
	userId: userId || '',
});
