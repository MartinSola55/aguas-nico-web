import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { API, DateHelper, Formatters } from '@app';
import { Button, Card, ConfirmButton, DataTable, Input, PageHeader } from '@components';
import { DealerCombo } from '@screens/shared';
import { buildExpenseRequest, expenseFiltersRequest } from './Expenses.helpers.js';
import { ExpenseFormModal } from './ExpenseFormModal.jsx';

export const ExpensesList = () => {
	const [expenses, setExpenses] = useState([]);
	const [dealers, setDealers] = useState([]);
	const [filters, setFilters] = useState({ dateFrom: DateHelper.monthStart(), dateTo: DateHelper.monthEnd(), userId: '' });
	const formModalRef = useRef(null);


	const load = () => API.endpoints.expenses.getAll(expenseFiltersRequest(filters)).then((rs) => setExpenses(rs.data.items || []));

	useEffect(() => {
		API.endpoints.dealers.getAll().then((rs) => setDealers(rs.data.items || []));
		load();
	}, []);

	const save = (form, onSaved) => {
		const action = form.id ? API.endpoints.expenses.update : API.endpoints.expenses.create;
		action(buildExpenseRequest(form)).then((rs) => {
			toast.success(rs.message);
			onSaved?.();
			load();
		});
	};

	const remove = (id) => API.endpoints.expenses.delete({ id }).then((rs) => { toast.success(rs.message); load(); });

	return (
		<>
			<ExpenseFormModal ref={formModalRef} dealers={dealers} onSave={save} />
			<PageHeader title="Gastos" breadcrumbs={['Inicio', 'Gastos']} actions={<Button onClick={() => formModalRef.current?.open()}>Nuevo gasto</Button>} />
			<Card title="Listado">
				<div className="mb-4 grid gap-3 md:grid-cols-[180px_180px_1fr_auto] md:items-end">
					<Input label="Desde" type="date" value={filters.dateFrom} onChange={(value) => setFilters((f) => ({ ...f, dateFrom: value }))} />
					<Input label="Hasta" type="date" value={filters.dateTo} onChange={(value) => setFilters((f) => ({ ...f, dateTo: value }))} />
					<DealerCombo label="Repartidor" clearable dealers={dealers} value={filters.userId} onChange={(value) => setFilters((f) => ({ ...f, userId: value || '' }))} />
					<Button variant="secondary" className="justify-self-start" onClick={load}>Buscar</Button>
				</div>
				<DataTable
					columns={[
						{ name: 'createdAt', text: 'Fecha', render: Formatters.formatDate },
						{ name: 'dealerName', text: 'Repartidor' },
						{ name: 'description', text: 'Descripcion' },
						{ name: 'amount', text: 'Monto', render: Formatters.formatCurrency },
						{ name: 'actions', text: 'Acciones', render: (_, row) => (
							<div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
								<Button size="sm" variant="secondary" onClick={() => formModalRef.current?.open(row)}>Editar</Button>
								<ConfirmButton size="sm" variant="danger" message="Eliminar gasto?" onConfirm={() => remove(row.id)}>Eliminar</ConfirmButton>
							</div>
						) },
					]}
					rows={expenses}
					pagination
				/>
			</Card>
		</>
	);
};
