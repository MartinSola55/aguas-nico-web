export const Roles = {
	Admin: 'ADMIN',
	Dealer: 'DEALER',
};

export const StorageKey = {
	TOKEN: 'aguas_nico_token',
	USER_ID: 'aguas_nico_user_id',
	USER_ROLE: 'aguas_nico_user_role',
	USER_NAME: 'aguas_nico_user_name',
	USER_EMAIL: 'aguas_nico_user_email',
	TRUCK_NUMBER: 'aguas_nico_truck_number',
	SESSION_EXPIRATION: 'aguas_nico_session_expiration',
};

export const State = {
	Pending: 0,
	Confirmed: 1,
	Ausent: 2,
	NotNeeded: 3,
	Holidays: 4,
};

export const ProductType = {
	B20L: 1,
	B12L: 2,
	Soda: 3,
	Maquina: 4,
	B5L: 5,
};

export const Day = {
	Lunes: 1,
	Martes: 2,
	Miercoles: 3,
	Jueves: 4,
	Viernes: 5,
};

export const InvoiceType = {
	A: 1,
	B: 2,
};

export const TaxCondition = {
	RI: 1,
	MO: 2,
	EX: 3,
	CF: 4,
};

export const CartsTransfersType = {
	Transfer: 0,
	Cart: 1,
	Abono: 2,
};

export const ProductActionType = {
	Baja: 0,
	Devuelve: 1,
	Abono: 2,
};

export const Messages = {
	Error: {
		403: 'No tenes permisos para realizar esta operacion.',
		404: 'No se encontro el recurso solicitado.',
		500: 'Ha ocurrido un error inesperado.',
		generic: 'No se pudo completar la operacion.',
	},
};

export const BusinessConstants = {
	invoiceUnitType: 7,
	invoiceSalesPoint: 5,
};
