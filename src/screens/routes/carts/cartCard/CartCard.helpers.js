import { State } from '@constants';

export const stateVariant = (state) => {
	if (state === State.Confirmed) return 'success';
	if (state === State.Pending) return 'neutral';
	return 'warning';
};

export const cartPreview = (data) => {
	if (!data) return 'Cargando…';
	const items = [...(data.products || []), ...(data.abonoProducts || [])]
		.filter((item) => Number(item.quantity) > 0)
		.map((item) => `${item.quantity}x ${item.typeName}`);
	return items.length ? items.join(', ') : 'Sin productos';
};
