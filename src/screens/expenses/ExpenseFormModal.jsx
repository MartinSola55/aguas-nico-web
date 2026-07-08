import { useImperativeHandle, useState } from 'react';
import { Button, Input, Modal } from '@components';
import { DealerCombo } from '@screens/shared';
import { emptyExpense } from './Expenses.helpers.js';

export const ExpenseFormModal = ({ dealers = [], onSave, loading = false, ref }) => {
	const [open, setOpen] = useState(false);
	const [form, setForm] = useState(emptyExpense);

	const close = () => setOpen(false);

	useImperativeHandle(ref, () => ({
		open: (expense = emptyExpense) => {
			setForm(expense);
			setOpen(true);
		},
		close,
	}));

	const save = () => onSave?.(form, close);

	return (
		<Modal open={open} title={form.id ? 'Editar gasto' : 'Nuevo gasto'} onClose={close} footer={<><Button variant="secondary" onClick={close}>Cerrar</Button><Button loading={loading} onClick={save}>Guardar</Button></>}>
			<div className="grid gap-3">
				<DealerCombo label="Repartidor" dealers={dealers} value={form.userId} onChange={(value) => setForm((f) => ({ ...f, userId: value }))} />
				<Input label="Descripcion" disabled={!!form.id} value={form.description} onChange={(value) => setForm((f) => ({ ...f, description: value }))} />
				{form.id && <p className="text-xs text-text-muted">El sistema legado no actualiza la descripcion al editar gastos; se conserva esa regla del backend.</p>}
				<Input label="Monto" type="number" min={0} value={form.amount} onChange={(value) => setForm((f) => ({ ...f, amount: value }))} />
			</div>
		</Modal>
	);
};
