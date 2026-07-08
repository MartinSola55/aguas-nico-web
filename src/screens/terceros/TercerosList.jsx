import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { API, DateHelper, Formatters, Helpers } from '@app';
import { Button, Card, ConfirmButton, DataTable, Input, PageHeader } from '@components';
import { TerceroFormModal } from './TerceroFormModal.jsx';

export const TercerosList = () => {
	const [date, setDate] = useState(DateHelper.toInputDate());
	const [terceros, setTerceros] = useState([]);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const formModalRef = useRef(null);

	const load = () => API.endpoints.terceros.getByDate({ date: DateHelper.toApiDate(date) }).then((rs) => setTerceros(rs.data.items || []));

	useEffect(() => { load(); }, []);

	const save = (form, onSaved) => {
		const payload = {
			name: form.name,
			sodaQuantity: Helpers.numberOrZero(form.sodaQuantity),
			sodaAmount: Helpers.numberOrZero(form.sodaAmount),
			b12lQuantity: Helpers.numberOrZero(form.b12lQuantity),
			b12lAmount: Helpers.numberOrZero(form.b12lAmount),
			b20lQuantity: Helpers.numberOrZero(form.b20lQuantity),
			b20lAmount: Helpers.numberOrZero(form.b20lAmount),
		};
		setSaving(true);
		const action = form.id
			? API.endpoints.terceros.update({ id: form.id, ...payload })
			: API.endpoints.terceros.create({ date: DateHelper.toApiDate(date), ...payload });
		action.then((rs) => {
			toast.success(rs.message);
			onSaved?.();
			load();
		}).finally(() => setSaving(false));
	};

	const remove = (id) => {
		setLoading(true);
		API.endpoints.terceros.delete({ id })
			.then((rs) => {
				toast.success(rs.message);
				load();
			})
			.finally(() => setLoading(false));
	};

	return (
		<>
			<TerceroFormModal ref={formModalRef} onSave={save} loading={saving} />
			<PageHeader title="Terceros" breadcrumbs={['Inicio', 'Terceros']} actions={<Button onClick={() => formModalRef.current?.open()}>Nuevo tercero</Button>} />
			<Card title="Distribuidoras (carga manual para el cierre de caja)">
				<div className="mb-4 grid gap-3 md:grid-cols-[220px_auto] md:items-end">
					<Input label="Fecha" type="date" value={date} onChange={setDate} />
					<Button variant="secondary" className="justify-self-start" onClick={load}>Buscar</Button>
				</div>
				<DataTable
					columns={[
						{ name: 'name', text: 'Distribuidora' },
						{ name: 'sodaQuantity', text: 'Soda cant.' },
						{ name: 'sodaAmount', text: 'Soda importe', render: Formatters.formatCurrency },
						{ name: 'b12lQuantity', text: 'Bidón 12L cant.' },
						{ name: 'b12lAmount', text: 'Bidón 12L importe', render: Formatters.formatCurrency },
						{ name: 'b20lQuantity', text: 'Bidón 20L cant.' },
						{ name: 'b20lAmount', text: 'Bidón 20L importe', render: Formatters.formatCurrency },
						{
							name: 'actions', text: 'Acciones', render: (_, row) => (
								<div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
									<Button size="sm" variant="secondary" onClick={() => formModalRef.current?.open(row)}>Editar</Button>
									<ConfirmButton size="sm" variant="danger" loading={loading} message="Eliminar tercero?" onConfirm={() => remove(row.id)}>Eliminar</ConfirmButton>
								</div>
							)
						},
					]}
					rows={terceros}
					pagination
				/>
			</Card>
		</>
	);
};
