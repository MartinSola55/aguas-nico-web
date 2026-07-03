import { useImperativeHandle, useState } from 'react';
import { Button, Input, Modal } from '@components';

const emptyTercero = { id: 0, name: '', sodaQuantity: '', sodaAmount: '', b12lQuantity: '', b12lAmount: '', b20lQuantity: '', b20lAmount: '' };

export const TerceroFormModal = ({ onSave, ref }) => {
	const [open, setOpen] = useState(false);
	const [form, setForm] = useState(emptyTercero);

	const close = () => setOpen(false);

	useImperativeHandle(ref, () => ({
		open: (tercero = emptyTercero) => {
			setForm(tercero);
			setOpen(true);
		},
		close,
	}));

	const save = () => onSave?.(form, close);

	return (
		<Modal open={open} title={form.id ? 'Editar tercero' : 'Nuevo tercero'} onClose={close} footer={<><Button variant="secondary" onClick={close}>Cerrar</Button><Button onClick={save}>Guardar</Button></>}>
			<div className="grid gap-3">
				<Input label="Distribuidora" value={form.name} onChange={(value) => setForm((f) => ({ ...f, name: value }))} />
				<div className="grid grid-cols-2 gap-3">
					<Input label="Soda cantidad" type="number" min={0} value={form.sodaQuantity} onChange={(value) => setForm((f) => ({ ...f, sodaQuantity: value }))} />
					<Input label="Soda importe" type="number" min={0} value={form.sodaAmount} onChange={(value) => setForm((f) => ({ ...f, sodaAmount: value }))} />
					<Input label="BidÃ³n 12L cantidad" type="number" min={0} value={form.b12lQuantity} onChange={(value) => setForm((f) => ({ ...f, b12lQuantity: value }))} />
					<Input label="BidÃ³n 12L importe" type="number" min={0} value={form.b12lAmount} onChange={(value) => setForm((f) => ({ ...f, b12lAmount: value }))} />
					<Input label="BidÃ³n 20L cantidad" type="number" min={0} value={form.b20lQuantity} onChange={(value) => setForm((f) => ({ ...f, b20lQuantity: value }))} />
					<Input label="BidÃ³n 20L importe" type="number" min={0} value={form.b20lAmount} onChange={(value) => setForm((f) => ({ ...f, b20lAmount: value }))} />
				</div>
			</div>
		</Modal>
	);
};
