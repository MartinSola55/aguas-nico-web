import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { BarChart3, Check, Plus, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { API, Formatters } from '@app';
import { Button, Card, ConfirmButton, DataTable, PageHeader, Switch } from '@components';
import { ClientsSummaryModal } from '@screens/shared';
import { ProductFormModal } from './ProductFormModal.jsx';
import { buildProductRequest } from './Products.helpers.js';

export const ProductsList = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [activeOnly, setActiveOnly] = useState(true);
	const formModalRef = useRef(null);
	const clientsModalRef = useRef(null);

	const visibleProducts = activeOnly ? products.filter((p) => p.isActive) : products;

	const load = () => {
		setLoading(true);
		API.endpoints.products.getAll({ activeOnly: false })
			.then((rs) => setProducts(rs.data.items || []))
			.finally(() => setLoading(false));
	};

	useEffect(load, []);

	const save = (form, onSaved) => {
		const action = form.id ? API.endpoints.products.update : API.endpoints.products.create;
		action(buildProductRequest(form)).then((rs) => {
			toast.success(rs.message);
			onSaved?.();
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
			clientsModalRef.current?.open({ title: `Clientes con ${product?.name || ''}`, clients: rs.data.items || [] });
		});
	};

	return (
		<>
			<ProductFormModal ref={formModalRef} onSave={save} />
			<ClientsSummaryModal ref={clientsModalRef} />
			<PageHeader title="Productos" breadcrumbs={['Inicio', 'Productos']} actions={<Button onClick={() => formModalRef.current?.open()}><Plus size={16} />Nuevo producto</Button>} />
			<Card title="Listado">
				<div className="mb-3 flex justify-start">
					<Switch label="Mostrar solo activos" checked={activeOnly} onChange={setActiveOnly} />
				</div>
				<DataTable
					loading={loading}
					columns={[
						{ name: 'name', text: 'Nombre' },
						{ name: 'typeName', text: 'Tipo' },
						{ name: 'price', text: 'Precio', render: Formatters.formatCurrency },
						{ name: 'sortOrder', text: 'Orden' },
						{
							name: 'isActive', text: 'Activo', render: (value) => value
								? <Check size={18} className="text-status-success" />
								: <X size={18} className="text-status-danger" />
						},
						{
							name: 'actions', text: 'Acciones', render: (_, row) => (
								<div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
									<Button size="sm" variant="secondary" onClick={() => formModalRef.current?.open(row)}>Editar</Button>
									<Button size="sm" variant="secondary" onClick={() => showClients(row)}>Clientes</Button>
									<Link to={`/productos/${row.id}/estadisticas`}><Button size="sm" variant="info"><BarChart3 size={14} /></Button></Link>
									{row.isActive && <ConfirmButton size="sm" variant="danger" message="Eliminar producto?" onConfirm={() => remove(row.id)}>Eliminar</ConfirmButton>}
								</div>
							)
						},
					]}
					rows={visibleProducts}
					pagination
				/>
			</Card>
		</>
	);
};
