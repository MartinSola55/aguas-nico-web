import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { API, App, Helpers, useCatalog } from '@app';
import { Button, Card, CheckBox, DataTable, Input, PageHeader, Select } from '@components';
import { buildClientRequest, emptyClient } from './Clients.helpers.js';
import { toast } from 'react-toastify';

const ClientForm = () => {
	const navigate = useNavigate();
	const { combos } = useCatalog();
	const [client, setClient] = useState(emptyClient);
	const [products, setProducts] = useState([]);
	const [abonos, setAbonos] = useState([]);
	const [dealers, setDealers] = useState([]);

	const dealerItems = useMemo(() => Helpers.dealerComboItems(dealers), [dealers]);

	useEffect(() => {
		Promise.all([
			API.endpoints.products.getAll({ activeOnly: true }).then((rs) => setProducts(rs.data.items || [])),
			API.endpoints.abonos.getAll().then((rs) => setAbonos(rs.data.items || [])),
			API.endpoints.dealers.getAll().then((rs) => setDealers(rs.data.items || [])),
		]);
	}, []);

	const update = (key, value) => setClient((current) => ({ ...current, [key]: value }));

	const productRows = products.map((product) => {
		const selected = client.products.find((item) => item.productId === product.id);
		return { ...product, assigned: !!selected, stock: selected?.stock ?? '' };
	});

	const setProduct = (productId, stock) => {
		setClient((current) => {
			const rest = current.products.filter((item) => item.productId !== productId);
			if (stock === '' || stock === null || Number(stock) < 0) return { ...current, products: rest };
			return { ...current, products: [...rest, { productId, stock: Number(stock), assigned: true }] };
		});
	};

	const toggleAbono = (abonoId, checked) => {
		setClient((current) => ({
			...current,
			abonoIds: checked ? [...new Set([...current.abonoIds, abonoId])] : current.abonoIds.filter((id) => id !== abonoId),
		}));
	};

	const submit = (e) => {
		e.preventDefault();
		API.endpoints.clients.create(buildClientRequest(client)).then((rs) => {
			toast.success(rs.message);
			navigate(App.isAdmin() ? `/clientes/${rs.data.id}` : '/');
		});
	};

	return (
		<>
			<PageHeader title="Nuevo cliente" breadcrumbs={['Inicio', 'Clientes', 'Nuevo']} />
			<form onSubmit={submit} className="grid gap-4 xl:grid-cols-[1fr_420px]">
				<Card title="Datos del cliente">
					<div className="grid gap-3 md:grid-cols-2">
						<Input label="Nombre" required value={client.name} onChange={(value) => update('name', value)} />
						<Input label="Direccion" required value={client.address} onChange={(value) => update('address', value)} />
						<Input label="Telefono" required value={client.phone} onChange={(value) => update('phone', value)} />
						<Input label="Email" type="email" value={client.email} onChange={(value) => update('email', value)} />
						{App.isAdmin() && <Select label="Repartidor" clearable items={dealerItems} value={client.dealerId} onChange={(value) => update('dealerId', value || '')} />}
						{App.isAdmin() && <Select label="Dia de reparto" clearable items={combos.days} value={client.deliveryDay} onChange={(value) => update('deliveryDay', value)} />}
						<Input label="Deuda inicial" type="number" value={client.debt} onChange={(value) => update('debt', value)} />
						<div className="flex flex-col justify-end gap-2">
							<CheckBox label="Factura" checked={client.hasInvoice} onChange={(value) => update('hasInvoice', value)} />
							<CheckBox label="Solo abonos" checked={client.onlyAbonos} onChange={(value) => update('onlyAbonos', value)} />
						</div>
						<Input as="textarea" label="Observaciones" value={client.observations} onChange={(value) => update('observations', value)} />
						<Input as="textarea" label="Notas" value={client.notes} onChange={(value) => update('notes', value)} />
					</div>
					{client.hasInvoice && (
						<div className="mt-4 grid gap-3 md:grid-cols-3">
							<Select label="Tipo de factura" items={combos.invoiceTypes} value={client.invoiceType} onChange={(value) => update('invoiceType', value)} />
							<Select label="Condicion IVA" items={combos.taxConditions} value={client.taxCondition} onChange={(value) => update('taxCondition', value)} />
							<Input label="CUIT" max={11} value={client.cuit} onChange={(value) => update('cuit', value)} />
						</div>
					)}
					<div className="mt-4 flex justify-end">
						<Button type="submit">Guardar cliente</Button>
					</div>
				</Card>
				<div className="space-y-4">
					<Card title="Productos asociados">
						<DataTable
							columns={[
								{ name: 'name', text: 'Producto' },
								{ name: 'price', text: 'Precio', render: (value) => Helpers.numberOrZero(value).toLocaleString('es-AR') },
								{ name: 'stock', text: 'Stock', render: (_, row) => <Input type="number" min={0} value={row.stock} onChange={(value) => setProduct(row.id, value)} /> },
							]}
							rows={productRows}
						/>
					</Card>
					<Card title="Abonos asociados">
						<DataTable
							columns={[
								{ name: 'name', text: 'Abono' },
								{ name: 'price', text: 'Precio', render: (value) => Helpers.numberOrZero(value).toLocaleString('es-AR') },
								{ name: 'assigned', text: 'Asociar', render: (_, row) => <CheckBox checked={client.abonoIds.includes(row.id)} onChange={(checked) => toggleAbono(row.id, checked)} /> },
							]}
							rows={abonos}
						/>
					</Card>
				</div>
			</form>
		</>
	);
};

export default ClientForm;
