import { useEffect, useMemo, useState } from 'react';
import { API, DateHelper, Formatters, Helpers } from '@app';
import { Button, Card, ConfirmButton, DataTable, Input, Modal, PageHeader, Select } from '@components';
import { buildExpenseRequest, emptyExpense, expenseFiltersRequest } from './Expenses.helpers.js';
import { toast } from 'react-toastify';

const ExpensesList = () => {
	const [expenses, setExpenses] = useState([]);
	const [dealers, setDealers] = useState([]);
	const [filters, setFilters] = useState({ dateFrom: DateHelper.monthStart(), dateTo: DateHelper.monthEnd(), userId: '' });
	const [form, setForm] = useState(emptyExpense);
	const [modal, setModal] = useState(false);

	const dealerItems = useMemo(() => Helpers.dealerComboItems(dealers), [dealers]);

	const load = () => API.endpoints.expenses.getAll(expenseFiltersRequest(filters)).then((rs) => setExpenses(rs.data.items || []));

	useEffect(() => {
		API.endpoints.dealers.getAll().then((rs) => setDealers(rs.data.items || []));
		load();
	}, []);

	const open = (expense = emptyExpense) => {
		setForm(expense);
		setModal(true);
	};

	const save = () => {
		const action = form.id ? API.endpoints.expenses.update : API.endpoints.expenses.create;
		action(buildExpenseRequest(form)).then((rs) => {
			toast.success(rs.message);
			setModal(false);
			load();
		});
	};

	const remove = (id) => API.endpoints.expenses.delete({ id }).then((rs) => { toast.success(rs.message); load(); });

	return (
		<>
			<PageHeader title="Gastos" breadcrumbs={['Inicio', 'Gastos']} actions={<Button onClick={() => open()}>Nuevo gasto</Button>} />
			<Card title="Listado">
				<div className="mb-4 grid gap-3 md:grid-cols-[180px_180px_1fr_auto] md:items-end">
					<Input label="Desde" type="date" value={filters.dateFrom} onChange={(value) => setFilters((f) => ({ ...f, dateFrom: value }))} />
					<Input label="Hasta" type="date" value={filters.dateTo} onChange={(value) => setFilters((f) => ({ ...f, dateTo: value }))} />
					<Select label="Repartidor" clearable items={dealerItems} value={filters.userId} onChange={(value) => setFilters((f) => ({ ...f, userId: value || '' }))} />
					<Button variant="secondary" onClick={load}>Buscar</Button>
				</div>
				<DataTable
					columns={[
						{ name: 'createdAt', text: 'Fecha', render: Formatters.formatDate },
						{ name: 'dealerName', text: 'Repartidor' },
						{ name: 'description', text: 'Descripcion' },
						{ name: 'amount', text: 'Monto', render: Formatters.formatCurrency },
						{ name: 'actions', text: 'Acciones', render: (_, row) => (
							<div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
								<Button size="sm" variant="secondary" onClick={() => open(row)}>Editar</Button>
								<ConfirmButton size="sm" variant="danger" message="Eliminar gasto?" onConfirm={() => remove(row.id)}>Eliminar</ConfirmButton>
							</div>
						) },
					]}
					rows={expenses}
					pagination
				/>
			</Card>
			<Modal open={modal} title={form.id ? 'Editar gasto' : 'Nuevo gasto'} onClose={() => setModal(false)} footer={<><Button variant="secondary" onClick={() => setModal(false)}>Cerrar</Button><Button onClick={save}>Guardar</Button></>}>
				<div className="grid gap-3">
					<Select label="Repartidor" items={dealerItems} value={form.userId} onChange={(value) => setForm((f) => ({ ...f, userId: value }))} />
					<Input label="Descripcion" disabled={!!form.id} value={form.description} onChange={(value) => setForm((f) => ({ ...f, description: value }))} />
					{form.id && <p className="text-xs text-text-muted">El sistema legado no actualiza la descripcion al editar gastos; se conserva esa regla del backend.</p>}
					<Input label="Monto" type="number" min={0} value={form.amount} onChange={(value) => setForm((f) => ({ ...f, amount: value }))} />
				</div>
			</Modal>
		</>
	);
};

export default ExpensesList;
