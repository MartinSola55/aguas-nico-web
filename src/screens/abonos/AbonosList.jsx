import { useEffect, useState } from 'react';
import { API, Formatters, useCatalog } from '@app';
import { Button, Card, ConfirmButton, DataTable, Input, Modal, PageHeader } from '@components';
import { buildAbonoRequest, emptyAbono } from './Abonos.helpers.js';
import { toast } from 'react-toastify';

const AbonosList = () => {
	const { combos } = useCatalog();
	const [abonos, setAbonos] = useState([]);
	const [form, setForm] = useState(emptyAbono);
	const [modal, setModal] = useState(false);
	const [clientsModal, setClientsModal] = useState({ open: false, abono: null, clients: [] });

	const load = () => {
		API.endpoints.abonos.getAll().then((rs) => setAbonos(rs.data.items || []));
	};

	useEffect(load, []);

	const openCreate = () => {
		setForm({ ...emptyAbono, products: combos.productTypes.map((type) => ({ type: type.value, typeName: type.label, quantity: '' })) });
		setModal(true);
	};

	const openEdit = (abono) => {
		setForm({ ...abono, products: abono.products || [] });
		setModal(true);
	};

	const save = () => {
		const action = form.id ? API.endpoints.abonos.update : API.endpoints.abonos.create;
		action(buildAbonoRequest(form)).then((rs) => {
			toast.success(rs.message);
			setModal(false);
			load();
		});
	};

	const remove = (id) => {
		API.endpoints.abonos.delete({ id }).then((rs) => {
			toast.success(rs.message);
			load();
		});
	};

	const renewAll = () => {
		API.endpoints.abonos.renewAll().then((rs) => toast.success(rs.message));
	};

	const showClients = (abono) => {
		API.endpoints.abonos.getClients({ abonoId: abono.id }).then((rs) => setClientsModal({ open: true, abono, clients: rs.data.items || [] }));
	};

	const setProductQuantity = (type, quantity) => {
		setForm((current) => ({
			...current,
			products: current.products.map((item) => Number(item.type) === Number(type) ? { ...item, quantity } : item),
		}));
	};

	return (
		<>
			<PageHeader
				title="Abonos"
				breadcrumbs={['Inicio', 'Abonos']}
				actions={<><ConfirmButton variant="secondary" message="Renovar todos los abonos?" onConfirm={renewAll}>Renovar todos</ConfirmButton><Button onClick={openCreate}>Nuevo abono</Button></>}
			/>
			<Card title="Listado">
				<DataTable
					columns={[
						{ name: 'name', text: 'Nombre' },
						{ name: 'price', text: 'Precio', render: Formatters.formatCurrency },
						{ name: 'products', text: 'Productos', render: (items = []) => items.map((item) => `${item.typeName} x ${item.quantity}`).join(', ') || '-' },
						{
							name: 'actions', text: 'Acciones', render: (_, row) => (
								<div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
									<Button size="sm" variant="secondary" onClick={() => openEdit(row)}>Editar</Button>
									<Button size="sm" variant="secondary" onClick={() => showClients(row)}>Clientes</Button>
									<ConfirmButton size="sm" variant="danger" message="Eliminar abono?" onConfirm={() => remove(row.id)}>Eliminar</ConfirmButton>
								</div>
							)
						},
					]}
					rows={abonos}
					pagination
				/>
			</Card>
			<Modal
				open={modal}
				title={form.id ? 'Editar abono' : 'Nuevo abono'}
				onClose={() => setModal(false)}
				footer={<><Button variant="secondary" onClick={() => setModal(false)}>Cerrar</Button><Button onClick={save}>Guardar</Button></>}
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
			<Modal open={clientsModal.open} title={`Clientes con ${clientsModal.abono?.name || ''}`} size="lg" onClose={() => setClientsModal({ open: false, abono: null, clients: [] })}>
				<DataTable
					columns={[
						{ name: 'name', text: 'Cliente' },
						{ name: 'address', text: 'Direccion' },
						{ name: 'dealerName', text: 'Repartidor' },
						{ name: 'debt', text: 'Deuda', render: Formatters.formatCurrency },
					]}
					rows={clientsModal.clients}
					infinite
				/>
			</Modal>
		</>
	);
};

export default AbonosList;
