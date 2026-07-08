import { useImperativeHandle, useState } from 'react';
import { Button, Modal } from '@components';
import { DayCombo, DealerCombo } from '@screens/shared';

const emptyRoute = { userId: '', dayOfWeek: '' };

export const CreateRouteModal = ({ dealers = [], onCreate, loading = false, ref }) => {
	const [open, setOpen] = useState(false);
	const [form, setForm] = useState(emptyRoute);

	const close = () => setOpen(false);

	useImperativeHandle(ref, () => ({
		open: () => {
			setForm(emptyRoute);
			setOpen(true);
		},
		close,
	}));

	const create = () => onCreate?.(form, close);

	return (
		<Modal
			open={open}
			title="Nueva planilla"
			onClose={close}
			footer={<><Button variant="secondary" onClick={close}>Cerrar</Button><Button loading={loading} onClick={create}>Crear</Button></>}
		>
			<div className="grid gap-3">
				<DealerCombo label="Repartidor" dealers={dealers} value={form.userId} onChange={(value) => setForm((f) => ({ ...f, userId: value }))} />
				<DayCombo label="Dia" value={form.dayOfWeek} onChange={(value) => setForm((f) => ({ ...f, dayOfWeek: value }))} />
			</div>
		</Modal>
	);
};
