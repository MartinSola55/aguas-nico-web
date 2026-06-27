import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { BarChart3, Plus } from 'lucide-react';
import { API, Formatters, useCatalog } from '@app';
import { Button, Card, ConfirmButton, DataTable, Input, Modal, PageHeader, Select } from '@components';
import { buildProductRequest, emptyProduct } from './Products.helpers.js';
import { toast } from 'react-toastify';

const ProductsList = () => {
	const { combos } = useCatalog();
	const [products, setProducts] = useState([]);
	const [modal, setModal] = useState(false);
	const [clientsModal, setClientsModal] = useState({ open: false, product: null, clients: [] });
	const [form, setForm] = useState(emptyProduct);
	const [loading, setLoading] = useState(false);

	const load = () => {
		setLoading(true);
		API.endpoints.products.getAll({ activeOnly: false })
			.then((rs) => setProducts(rs.data.items || []))
			.finally(() => setLoading(false));
	};

	useEffect(load, []);

	const openForm = (product = emptyProduct) => {
		setForm(product);
		setModal(true);
	};

	const save = () => {
		const action = form.id ? API.endpoints.products.update : API.endpoints.products.create;
		action(buildProductRequest(form)).then((rs) => {
			toast.success(rs.message);
			setModal(false);
			load();
		});
	};

	const remove = (id) => {
		API.endpoints.products.delete({ id }).then((rs) => {
			toast.success(rs.message);
			load();
		});
	};

	const showClients = (product) => {
		API.endpoints.products.getClients({ productId: product.id }).then((rs) => {
			setClientsModal({ open: true, product, clients: rs.data.items || [] });
		});
	};

	return (
		<>
			<PageHeader title="Productos" breadcrumbs={['Inicio', 'Productos']} actions={<Button onClick={() => openForm()}><Plus size={16} />Nuevo producto</Button>} />
			<Card title="Listado">
				<DataTable
					loading={loading}
					columns={[
						{ name: 'name', text: 'Nombre' },
						{ name: 'typeName', text: 'Tipo' },
						{ name: 'price', text: 'Precio', render: Formatters.formatCurrency },
						{ name: 'sortOrder', text: 'Orden' },
						{ name: 'isActive', text: 'Activo', render: (value) => value ? 'Si' : 'No' },
						{
							name: 'actions', text: 'Acciones', render: (_, row) => (
								<div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
									<Button size="sm" variant="secondary" onClick={() => openForm(row)}>Editar</Button>
									<Button size="sm" variant="secondary" onClick={() => showClients(row)}>Clientes</Button>
									<Link to={`/productos/${row.id}/estadisticas`}><Button size="sm" variant="info"><BarChart3 size={14} /></Button></Link>
									{row.isActive && <ConfirmButton size="sm" variant="danger" message="Eliminar producto?" onConfirm={() => remove(row.id)}>Eliminar</ConfirmButton>}
								</div>
							)
						},
					]}
					rows={products}
					pagination
				/>
			</Card>
			<Modal
				open={modal}
				title={form.id ? 'Editar producto' : 'Nuevo producto'}
				onClose={() => setModal(false)}
				footer={<><Button variant="secondary" onClick={() => setModal(false)}>Cerrar</Button><Button onClick={save}>Guardar</Button></>}
			>
				<div className="grid gap-3">
					<Input label="Nombre" value={form.name} onChange={(value) => setForm((f) => ({ ...f, name: value }))} />
					<Input label="Precio" type="number" min={0} value={form.price} onChange={(value) => setForm((f) => ({ ...f, price: value }))} />
					<Select label="Tipo" items={combos.productTypes} value={form.type} onChange={(value) => setForm((f) => ({ ...f, type: value }))} />
					<Input label="Orden" type="number" min={0} value={form.sortOrder} onChange={(value) => setForm((f) => ({ ...f, sortOrder: value }))} />
				</div>
			</Modal>
			<Modal
				open={clientsModal.open}
				title={`Clientes con ${clientsModal.product?.name || ''}`}
				size="lg"
				onClose={() => setClientsModal({ open: false, product: null, clients: [] })}
			>
				<DataTable
					columns={[
						{ name: 'name', text: 'Cliente' },
						{ name: 'address', text: 'Direccion' },
						{ name: 'dealerName', text: 'Reparto', render: (_, row) => `${row.dealerName || 'Sin repartidor'} - ${row.deliveryDay ? Formatters.dayName(row.deliveryDay) : 'Sin dia de reparto'}` },
						{ name: 'debt', text: 'Deuda', render: Formatters.formatCurrency },
					]}
					rows={clientsModal.clients}
					infinite
				/>
			</Modal>
		</>
	);
};

export default ProductsList;
