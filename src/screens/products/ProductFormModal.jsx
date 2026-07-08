import { useImperativeHandle, useState } from 'react';
import { Button, Input, Modal } from '@components';
import { ProductTypeCombo } from '@screens/shared';
import { emptyProduct } from './Products.helpers.js';

export const ProductFormModal = ({ onSave, loading = false, ref }) => {
	const [open, setOpen] = useState(false);
	const [form, setForm] = useState(emptyProduct);

	const close = () => setOpen(false);

	useImperativeHandle(ref, () => ({
		open: (product = emptyProduct) => {
			setForm(product);
			setOpen(true);
		},
		close,
	}));

	const save = () => onSave?.(form, close);

	return (
		<Modal
			open={open}
			title={form.id ? 'Editar producto' : 'Nuevo producto'}
			onClose={close}
			footer={<><Button variant="secondary" onClick={close}>Cerrar</Button><Button loading={loading} onClick={save}>Guardar</Button></>}
		>
			<div className="grid gap-3">
				<Input label="Nombre" value={form.name} onChange={(value) => setForm((f) => ({ ...f, name: value }))} />
				<Input label="Precio" type="number" min={0} value={form.price} onChange={(value) => setForm((f) => ({ ...f, price: value }))} />
				<ProductTypeCombo label="Tipo" value={form.type} onChange={(value) => setForm((f) => ({ ...f, type: value }))} />
				<Input label="Orden" type="number" min={0} value={form.sortOrder} onChange={(value) => setForm((f) => ({ ...f, sortOrder: value }))} />
			</div>
		</Modal>
	);
};
