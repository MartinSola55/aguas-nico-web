import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { API, Formatters, Helpers } from '@app';
import { useCatalog } from '@app/useCatalog';
import { Button, Card, CheckBox, ConfirmButton, DataTable, Field, Input, PageHeader, Select } from '@components';
import { buildClientRequest } from './Clients.helpers.js';
import { toast } from 'react-toastify';

const ClientDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { combos } = useCatalog();
	const [client, setClient] = useState(null);
	const [dealers, setDealers] = useState([]);
	const [editingClient, setEditingClient] = useState(false);
	const [editingProducts, setEditingProducts] = useState(false);
	const [editingAbonos, setEditingAbonos] = useState(false);
	const [editingInvoice, setEditingInvoice] = useState(false);

	const dealerItems = Helpers.dealerComboItems(dealers);

	const load = () => {
		Promise.all([
			API.endpoints.clients.getOne({ id, includeDetails: true }).then((rs) => setClient(rs.data)),
			API.endpoints.dealers.getAll().then((rs) => setDealers(rs.data.items || [])),
		]);
	};

	useEffect(() => {
		load();
	}, [id]);

	if (!client) return <PageHeader title="Cliente" breadcrumbs={['Inicio', 'Clientes']} />;

	const update = (key, value) => setClient((current) => ({ ...current, [key]: value }));

	const saveClient = () => {
		API.endpoints.clients.update({ id: client.id, ...buildClientRequest(client) }).then((rs) => {
			toast.success(rs.message);
			setEditingClient(false);
			load();
		});
	};

	const saveInvoice = () => {
		API.endpoints.clients.updateInvoiceData({
			id: client.id,
			invoiceType: Number(client.invoiceType || 0),
			taxCondition: Number(client.taxCondition || 0),
			cuit: client.cuit || '',
		}).then((rs) => {
			toast.success(rs.message);
			setEditingInvoice(false);
			load();
		});
	};

	const saveProducts = () => {
		const products = (client.products || [])
			.filter((item) => item.assigned)
			.map((item) => ({ productId: item.productId, stock: Helpers.numberOrZero(item.stock) }));
		API.endpoints.clients.updateProducts({ clientId: client.id, products }).then((rs) => {
			toast.success(rs.message);
			setEditingProducts(false);
			load();
		});
	};

	const saveAbonos = () => {
		const abonoIds = (client.abonos || []).filter((item) => item.assigned).map((item) => item.abonoId);
		API.endpoints.clients.updateAbonos({ clientId: client.id, abonoIds }).then((rs) => {
			toast.success(rs.message);
			setEditingAbonos(false);
			load();
		});
	};

	const deleteClient = () => {
		API.endpoints.clients.delete({ id: client.id }).then((rs) => {
			toast.success(rs.message);
			navigate('/clientes');
		});
	};

	const updateProduct = (productId, changes) => {
		setClient((current) => ({
			...current,
			products: current.products.map((item) => item.productId === productId ? { ...item, ...changes } : item),
		}));
	};

	const updateAbono = (abonoId, assigned) => {
		setClient((current) => ({
			...current,
			abonos: current.abonos.map((item) => item.abonoId === abonoId ? { ...item, assigned } : item),
		}));
	};

	return (
		<>
			<PageHeader
				title={client.name}
				breadcrumbs={['Inicio', 'Clientes', 'Detalles']}
				actions={<ConfirmButton variant="danger" message="Eliminar cliente?" onConfirm={deleteClient}>Eliminar</ConfirmButton>}
			/>
			<div className="grid gap-4 xl:grid-cols-[1fr_420px]">
				<div className="space-y-4">
					<Card title="Historial de bajadas y transferencias">
						<DataTable
							columns={[
								{ name: 'date', text: 'Fecha', render: Formatters.formatDate },
								{ name: 'type', text: 'Movimiento', render: (_, row) => {
									if (row.transferAmount) return `Transferencia - ${Formatters.formatCurrency(row.transferAmount)}`;
									if (row.abonoName) return `${row.abonoName} - ${Formatters.formatCurrency(row.abonoPrice)}`;
									if (row.cartState !== 1) return Formatters.stateName(row.cartState);
									const products = [...(row.products || []), ...(row.abonoProducts || []).map((p) => ({ ...p, typeName: `${p.typeName} (abono)` }))];
									return products.length ? products.map((p) => `${p.typeName} x ${p.quantity}`).join(', ') : '-';
								} },
								{ name: 'paymentMethods', text: 'Pago', render: (items = []) => items.length ? items.map((m) => `${m.paymentMethodName}: ${Formatters.formatCurrency(m.amount)}`).join(', ') : '-' },
							]}
							rows={client.cartsTransfersHistory || []}
							infinite
						/>
					</Card>
					<Card title="Historial de envases">
						<DataTable
							columns={[
								{ name: 'productTypeName', text: 'Producto' },
								{ name: 'actionTypeName', text: 'Tipo' },
								{ name: 'quantity', text: 'Cantidad' },
								{ name: 'date', text: 'Fecha', render: Formatters.formatDate },
							]}
							rows={client.productsHistory || []}
							infinite
						/>
					</Card>
					<div className="grid gap-4 lg:grid-cols-2">
						<Card title="Productos asociados" actions={editingProducts ? <Button size="sm" onClick={saveProducts}>Guardar</Button> : <Button size="sm" variant="secondary" onClick={() => setEditingProducts(true)}>Editar</Button>}>
							<DataTable
								columns={[
									{ name: 'productName', text: 'Producto' },
									{ name: 'price', text: 'Precio', render: Formatters.formatCurrency },
									{ name: 'assigned', text: 'Asociar', render: (_, row) => <CheckBox disabled={!editingProducts} checked={row.assigned} onChange={(checked) => updateProduct(row.productId, { assigned: checked, stock: checked && row.stock < 0 ? 0 : row.stock })} /> },
									{ name: 'stock', text: 'Stock', render: (_, row) => <Input type="number" min={0} disabled={!editingProducts || !row.assigned} value={row.assigned ? row.stock : ''} onChange={(value) => updateProduct(row.productId, { stock: value })} /> },
								]}
								rows={client.products || []}
								infinite
							/>
						</Card>
						<Card title="Abonos asociados" actions={editingAbonos ? <Button size="sm" onClick={saveAbonos}>Guardar</Button> : <Button size="sm" variant="secondary" onClick={() => setEditingAbonos(true)}>Editar</Button>}>
							<DataTable
								columns={[
									{ name: 'abonoName', text: 'Abono' },
									{ name: 'price', text: 'Precio', render: Formatters.formatCurrency },
									{ name: 'assigned', text: 'Asociar', render: (_, row) => <CheckBox disabled={!editingAbonos} checked={row.assigned} onChange={(checked) => updateAbono(row.abonoId, checked)} /> },
								]}
								rows={client.abonos || []}
								infinite
							/>
						</Card>
					</div>
				</div>
				<div className="space-y-4">
					<Card title="Cliente" actions={editingClient ? <Button size="sm" onClick={saveClient}>Guardar</Button> : <Button size="sm" variant="secondary" onClick={() => setEditingClient(true)}>Editar</Button>}>
						<div className="grid gap-3">
							{editingClient ? (
								<>
									<Input label="Nombre" value={client.name} onChange={(value) => update('name', value)} />
									<Input label="Direccion" value={client.address} onChange={(value) => update('address', value)} />
									<Input label="Telefono" value={client.phone} onChange={(value) => update('phone', value)} />
									<Input label="Email" value={client.email} onChange={(value) => update('email', value)} />
									<Select label="Repartidor" clearable items={dealerItems} value={client.dealerId} onChange={(value) => update('dealerId', value || '')} />
									<Select label="Dia" clearable items={combos.days} value={client.deliveryDay} onChange={(value) => update('deliveryDay', value)} />
									<Input label="Deuda" type="number" value={client.debt} onChange={(value) => update('debt', value)} />
									<CheckBox label="Factura" checked={client.hasInvoice} onChange={(value) => update('hasInvoice', value)} />
									<CheckBox label="Solo abonos" checked={client.onlyAbonos} onChange={(value) => update('onlyAbonos', value)} />
									<Input as="textarea" label="Observaciones" value={client.observations} onChange={(value) => update('observations', value)} />
									<Input as="textarea" label="Notas" value={client.notes} onChange={(value) => update('notes', value)} />
								</>
							) : (
								<>
									<Field label="Direccion" value={client.address} />
									<Field label="Telefono" value={client.phone} />
									<Field label="Email" value={client.email || '-'} />
									<Field label="Repartidor" value={client.dealerName || '-'} />
									<Field label="Dia" value={Formatters.dayName(client.deliveryDay)} />
									<Field label="Deuda" value={Formatters.debtLabel(client.debt)} />
									<Field label="Alta" value={Formatters.formatDateTime(client.createdAt)} />
									<Field label="Observaciones" value={client.observations || '-'} />
									<Field label="Notas" value={client.notes || '-'} />
								</>
							)}
						</div>
					</Card>
					{client.hasInvoice && (
						<Card title="Datos de facturacion" actions={editingInvoice ? <Button size="sm" onClick={saveInvoice}>Guardar</Button> : <Button size="sm" variant="secondary" onClick={() => setEditingInvoice(true)}>Editar</Button>}>
							<div className="grid gap-3">
								<Select label="Tipo de factura" disabled={!editingInvoice} items={combos.invoiceTypes} value={client.invoiceType} onChange={(value) => update('invoiceType', value)} />
								<Select label="Condicion IVA" disabled={!editingInvoice} items={combos.taxConditions} value={client.taxCondition} onChange={(value) => update('taxCondition', value)} />
								<Input label="CUIT" disabled={!editingInvoice} value={client.cuit} onChange={(value) => update('cuit', value)} />
							</div>
						</Card>
					)}
				</div>
			</div>
		</>
	);
};

export default ClientDetails;
