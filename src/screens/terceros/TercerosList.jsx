import { useEffect, useState } from 'react';
import { API, DateHelper, Formatters, Helpers } from '@app';
import { Button, Card, ConfirmButton, DataTable, Input, Modal, PageHeader } from '@components';
import { toast } from 'react-toastify';

const emptyTercero = { id: 0, name: '', sodaQuantity: '', sodaAmount: '', b12lQuantity: '', b12lAmount: '', b20lQuantity: '', b20lAmount: '' };

const TercerosList = () => {
	const [date, setDate] = useState(DateHelper.toInputDate());
	const [terceros, setTerceros] = useState([]);
	const [form, setForm] = useState(emptyTercero);
	const [modal, setModal] = useState(false);

	const load = () => API.endpoints.terceros.getByDate({ date: DateHelper.toApiDate(date) }).then((rs) => setTerceros(rs.data.items || []));

	useEffect(() => { load(); }, []);

	const open = (tercero = emptyTercero) => {
		setForm(tercero);
		setModal(true);
	};

	const save = () => {
		const payload = {
			name: form.name,
			sodaQuantity: Helpers.numberOrZero(form.sodaQuantity),
			sodaAmount: Helpers.numberOrZero(form.sodaAmount),
			b12lQuantity: Helpers.numberOrZero(form.b12lQuantity),
			b12lAmount: Helpers.numberOrZero(form.b12lAmount),
			b20lQuantity: Helpers.numberOrZero(form.b20lQuantity),
			b20lAmount: Helpers.numberOrZero(form.b20lAmount),
		};
		const action = form.id
			? API.endpoints.terceros.update({ id: form.id, ...payload })
			: API.endpoints.terceros.create({ date: DateHelper.toApiDate(date), ...payload });
		action.then((rs) => {
			toast.success(rs.message);
			setModal(false);
			load();
		});
	};

	const remove = (id) => API.endpoints.terceros.delete({ id }).then((rs) => { toast.success(rs.message); load(); });

	return (
		<>
			<PageHeader title="Terceros" breadcrumbs={['Inicio', 'Terceros']} actions={<Button onClick={() => open()}>Nuevo tercero</Button>} />
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
						{ name: 'actions', text: 'Acciones', render: (_, row) => (
							<div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
								<Button size="sm" variant="secondary" onClick={() => open(row)}>Editar</Button>
								<ConfirmButton size="sm" variant="danger" message="Eliminar tercero?" onConfirm={() => remove(row.id)}>Eliminar</ConfirmButton>
							</div>
						) },
					]}
					rows={terceros}
					pagination
				/>
			</Card>
			<Modal open={modal} title={form.id ? 'Editar tercero' : 'Nuevo tercero'} onClose={() => setModal(false)} footer={<><Button variant="secondary" onClick={() => setModal(false)}>Cerrar</Button><Button onClick={save}>Guardar</Button></>}>
				<div className="grid gap-3">
					<Input label="Distribuidora" value={form.name} onChange={(value) => setForm((f) => ({ ...f, name: value }))} />
					<div className="grid grid-cols-2 gap-3">
						<Input label="Soda cantidad" type="number" min={0} value={form.sodaQuantity} onChange={(value) => setForm((f) => ({ ...f, sodaQuantity: value }))} />
						<Input label="Soda importe" type="number" min={0} value={form.sodaAmount} onChange={(value) => setForm((f) => ({ ...f, sodaAmount: value }))} />
						<Input label="Bidón 12L cantidad" type="number" min={0} value={form.b12lQuantity} onChange={(value) => setForm((f) => ({ ...f, b12lQuantity: value }))} />
						<Input label="Bidón 12L importe" type="number" min={0} value={form.b12lAmount} onChange={(value) => setForm((f) => ({ ...f, b12lAmount: value }))} />
						<Input label="Bidón 20L cantidad" type="number" min={0} value={form.b20lQuantity} onChange={(value) => setForm((f) => ({ ...f, b20lQuantity: value }))} />
						<Input label="Bidón 20L importe" type="number" min={0} value={form.b20lAmount} onChange={(value) => setForm((f) => ({ ...f, b20lAmount: value }))} />
					</div>
				</div>
			</Modal>
		</>
	);
};

export default TercerosList;
