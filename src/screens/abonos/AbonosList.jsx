import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { API, Formatters } from '@app';
import { Button, Card, ConfirmButton, DataTable, PageHeader } from '@components';
import { ClientsSummaryModal } from '@screens/shared';
import { AbonoFormModal } from './AbonoFormModal.jsx';
import { buildAbonoRequest } from './Abonos.helpers.js';

export const AbonosList = () => {
	const [abonos, setAbonos] = useState([]);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const formModalRef = useRef(null);
	const clientsModalRef = useRef(null);

	const load = () => {
		API.endpoints.abonos.getAll().then((rs) => setAbonos(rs.data.items || []));
	};

	useEffect(load, []);

	const save = (form, onSaved) => {
		setSaving(true);
		const action = form.id ? API.endpoints.abonos.update : API.endpoints.abonos.create;
		action(buildAbonoRequest(form))
			.then((rs) => {
				toast.success(rs.message);
				onSaved?.();
				load();
			})
			.finally(() => setSaving(false));
	};

	const remove = (id) => {
		setLoading(true);
		API.endpoints.abonos.delete({ id })
			.then((rs) => {
				toast.success(rs.message);
				load();
			})
			.finally(() => setLoading(false));
	};

	const renewAll = () => {
		setLoading(true);
		API.endpoints.abonos.renewAll()
			.then((rs) => toast.success(rs.message))
			.finally(() => setLoading(false));
	};

	const showClients = (abono) => {
		API.endpoints.abonos.getClients({ abonoId: abono.id }).then((rs) => {
			clientsModalRef.current?.open({ title: `Clientes con ${abono?.name || ''}`, clients: rs.data.items || [] });
		});
	};

	return (
		<>
			<AbonoFormModal ref={formModalRef} onSave={save} loading={saving} />
			<ClientsSummaryModal ref={clientsModalRef} />
			<PageHeader
				title="Abonos"
				breadcrumbs={['Inicio', 'Abonos']}
				actions={<><ConfirmButton variant="secondary" loading={loading} message="Renovar todos los abonos?" onConfirm={renewAll}>Renovar todos</ConfirmButton><Button onClick={() => formModalRef.current?.openCreate()}>Nuevo abono</Button></>}
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
									<Button size="sm" variant="secondary" onClick={() => formModalRef.current?.openEdit(row)}>Editar</Button>
									<Button size="sm" variant="secondary" onClick={() => showClients(row)}>Clientes</Button>
									<ConfirmButton size="sm" variant="danger" loading={loading} message="Eliminar abono?" onConfirm={() => remove(row.id)}>Eliminar</ConfirmButton>
								</div>
							)
						},
					]}
					rows={abonos}
					pagination
				/>
			</Card>
		</>
	);
};
