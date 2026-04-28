import { useEffect, useMemo, useState } from 'react';
import { API, DateHelper, Formatters, Helpers } from '@app';
import { useCatalog } from '@app/useCatalog';
import { Button, Card, DataTable, Input, PageHeader, Select } from '@components';

const Invoices = () => {
	const { combos } = useCatalog();
	const [dealers, setDealers] = useState([]);
	const [filters, setFilters] = useState({
		startDate: DateHelper.monthStart(),
		endDate: DateHelper.monthEnd(),
		invoiceDay: '',
		invoiceDealer: '',
	});
	const [items, setItems] = useState([]);
	const [csvRows, setCsvRows] = useState([]);

	const dealerItems = useMemo(() => Helpers.dealerComboItems(dealers), [dealers]);
	const dayItems = useMemo(() => [{ value: '', label: 'Todos los dias' }, ...(combos.days || [])], [combos.days]);

	useEffect(() => {
		API.endpoints.dealers.getAll().then((rs) => setDealers(rs.data.items || []));
	}, []);

	const request = () => ({
		startDate: DateHelper.toApiDate(filters.startDate),
		endDate: DateHelper.toApiDate(filters.endDate),
		invoiceDay: filters.invoiceDay ? Number(filters.invoiceDay) : null,
		invoiceDealer: filters.invoiceDealer || '',
	});

	const search = () => {
		API.endpoints.invoices.getInvoices(request()).then((rs) => setItems(rs.data.items || []));
		API.endpoints.invoices.getCsvRows(request()).then((rs) => setCsvRows(rs.data.rows || []));
	};

	const download = () => API.endpoints.invoices.downloadCsv(request());

	return (
		<>
			<PageHeader title="Facturas" breadcrumbs={['Inicio', 'Facturas']} actions={<Button disabled={!csvRows.length} onClick={download}>Descargar CSV</Button>} />
			<Card title="Filtros">
				<div className="grid gap-3 md:grid-cols-[180px_180px_1fr_1fr_auto] md:items-end">
					<Input label="Desde" type="date" value={filters.startDate} onChange={(value) => setFilters((f) => ({ ...f, startDate: value }))} />
					<Input label="Hasta" type="date" value={filters.endDate} onChange={(value) => setFilters((f) => ({ ...f, endDate: value }))} />
					<Select label="Dia" items={dayItems} value={filters.invoiceDay} onChange={(value) => setFilters((f) => ({ ...f, invoiceDay: value || '' }))} />
					<Select label="Repartidor" items={dealerItems} value={filters.invoiceDealer} onChange={(value) => setFilters((f) => ({ ...f, invoiceDealer: value }))} />
					<Button variant="secondary" onClick={search}>Buscar</Button>
				</div>
			</Card>
			<Card className="mt-4" title="Facturas">
				<DataTable
					columns={[
						{ name: 'clientName', text: 'Cliente' },
						{ name: 'clientAddress', text: 'Direccion' },
						{ name: 'clientCuit', text: 'CUIT' },
						{ name: 'products', text: 'Productos', render: (products = []) => products.map((p) => `${p.type} x ${p.quantity} (${Formatters.formatCurrency(p.total)})`).join(', ') },
					]}
					rows={items}
					pagination
				/>
			</Card>
			<Card className="mt-4" title="Vista previa CSV">
				<DataTable
					columns={[
						{ name: 'externalId', text: 'External ID' },
						{ name: 'clientCuit', text: 'CUIT' },
						{ name: 'invoiceTypeId', text: 'Tipo' },
						{ name: 'neto', text: 'Neto', render: Formatters.formatCurrency },
						{ name: 'total', text: 'Total', render: Formatters.formatCurrency },
						{ name: 'taxConditionTypeId', text: 'IVA' },
						{ name: 'clientName', text: 'Cliente' },
						{ name: 'clientAddress', text: 'Direccion' },
						{ name: 'description', text: 'Descripcion' },
						{ name: 'email', text: 'Email' },
					]}
					rows={csvRows}
					infinite
				/>
			</Card>
		</>
	);
};

export default Invoices;
