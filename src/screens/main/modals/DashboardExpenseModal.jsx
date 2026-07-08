import { useImperativeHandle, useState } from 'react';
import { Button, Input, Modal } from '@components';
import { DealerCombo } from '@screens/shared';

const emptyExpense = { userId: '', description: '', amount: '' };

export const DashboardExpenseModal = ({ dealers = [], onSave, loading = false, ref }) => {
	const [open, setOpen] = useState(false);
	const [form, setForm] = useState(emptyExpense);

	const close = () => setOpen(false);

	useImperativeHandle(ref, () => ({
		open: () => {
			setForm(emptyExpense);
			setOpen(true);
		},
		close,
	}));

	const save = () => onSave?.(form, () => {
		close();
		setForm(emptyExpense);
	});

	return (
		<Modal
			open={open}
			title="Agregar gasto"
			onClose={close}
			footer={<><Button variant="secondary" onClick={close}>Cerrar</Button><Button loading={loading} onClick={save}>Agregar</Button></>}
		>
			<div className="grid gap-3">
				<DealerCombo label="Repartidor" dealers={dealers} value={form.userId} onChange={(value) => setForm((f) => ({ ...f, userId: value }))} />
				<Input label="Descripcion" value={form.description} onChange={(value) => setForm((f) => ({ ...f, description: value }))} />
				<Input label="Monto" type="number" min={0} value={form.amount} onChange={(value) => setForm((f) => ({ ...f, amount: value }))} />
			</div>
		</Modal>
	);
};
