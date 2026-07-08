import { useImperativeHandle, useState } from 'react';
import { useCatalog } from '@app';
import { Button, DataTable, Input, Modal } from '@components';
import { emptyAbono } from './Abonos.helpers.js';

export const AbonoFormModal = ({ onSave, loading = false, ref }) => {
	const { combos } = useCatalog();
	const [open, setOpen] = useState(false);
	const [form, setForm] = useState(emptyAbono);

	const close = () => setOpen(false);

	useImperativeHandle(ref, () => ({
		openCreate: () => {
			setForm({ ...emptyAbono, products: combos.productTypes.map((type) => ({ type: type.value, typeName: type.label, quantity: '' })) });
			setOpen(true);
		},
		openEdit: (abono) => {
			setForm({ ...abono, products: abono.products || [] });
			setOpen(true);
		},
		close,
	}));

	const setProductQuantity = (type, quantity) => {
		setForm((current) => ({
			...current,
			products: current.products.map((item) => Number(item.type) === Number(type) ? { ...item, quantity } : item),
		}));
	};

	const save = () => onSave?.(form, close);

	return (
		<Modal
			open={open}
			title={form.id ? 'Editar abono' : 'Nuevo abono'}
			onClose={close}
			footer={<><Button variant="secondary" onClick={close}>Cerrar</Button><Button loading={loading} onClick={save}>Guardar</Button></>}
		>
			<div className="grid gap-3">
				<Input label="Nombre" value={form.name} onChange={(value) => setForm((f) => ({ ...f, name: value }))} />
				<Input label="Precio" type="number" min={0} value={form.price} onChange={(value) => setForm((f) => ({ ...f, price: value }))} />
				{!form.id && (
					<DataTable
						columns={[
							{ name: 'typeName', text: 'Producto' },
							{ name: 'quantity', text: 'Cantidad', render: (_, row) => <Input type="number" min={0} max={100} value={row.quantity} onChange={(value) => setProductQuantity(row.type, value)} /> },
						]}
						rows={form.products}
					/>
				)}
			</div>
		</Modal>
	);
};
