import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { API, Formatters, Helpers } from '@app';
import { Roles } from '@constants';
import { Badge, Button, Card, ConfirmButton, DataTable, PageHeader } from '@components';
import { UserFormModal } from './UserFormModal.jsx';
import { userFormRequest, validateUserForm } from './Users.helpers.js';

export const UsersList = () => {
	const [users, setUsers] = useState([]);
	const [roles, setRoles] = useState([]);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const formModalRef = useRef(null);

	const load = () => API.endpoints.users.getAll().then((rs) => setUsers(rs.data.items || []));

	useEffect(() => {
		load();
		API.endpoints.users.getRolesCombo().then((rs) => setRoles(rs.data.items || []));
	}, []);

	const save = (form, isDealer, onSaved) => {
		const error = validateUserForm(form, isDealer, !form.id);
		if (error) {
			toast.error(error);
			return;
		}

		const payload = userFormRequest(form, isDealer);
		setSaving(true);
		const action = form.id
			? API.endpoints.users.update({ id: form.id, ...payload, password: form.password || null })
			: API.endpoints.users.create({ ...payload, password: form.password });
		action.then((rs) => {
			toast.success(rs.message);
			onSaved?.();
			load();
		}).finally(() => setSaving(false));
	};

	const remove = (id) => {
		setLoading(true);
		API.endpoints.users.delete({ id })
			.then((rs) => {
				toast.success(rs.message);
				load();
			})
			.finally(() => setLoading(false));
	};

	return (
		<>
			<UserFormModal ref={formModalRef} roles={roles} onSave={save} loading={saving} />
			<PageHeader
				title="Usuarios"
				breadcrumbs={['Inicio', 'Usuarios']}
				actions={<Button onClick={() => formModalRef.current?.open()}>Nuevo usuario</Button>} />
			<Card title="Usuarios del sistema">
				<DataTable
					columns={[
						{ name: 'name', text: 'Nombre' },
						{ name: 'email', text: 'Email' },
						{ name: 'role', text: 'Rol', render: (value) => <Badge variant={value === Roles.Admin ? 'success' : 'neutral'}>{Helpers.getRoleName(value)}</Badge> },
						{ name: 'truckNumber', text: 'Camión', render: (value) => value ?? '-' },
						{ name: 'canEditSensitiveData', text: 'Datos sensibles', render: (value) => <Badge variant={value ? 'success' : 'neutral'}>{value ? 'Puede editar' : 'Solo lectura'}</Badge> },
						{ name: 'createdAt', text: 'Alta', render: Formatters.formatDate },
						{
							name: 'actions', text: 'Acciones', render: (_, row) => (
								<div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
									<Button size="sm" variant="secondary" onClick={() => formModalRef.current?.open(row)}>Editar</Button>
									<ConfirmButton size="sm" variant="danger" loading={loading} message="Eliminar usuario?" onConfirm={() => remove(row.id)}>Eliminar</ConfirmButton>
								</div>
							)
						},
					]}
					rows={users}
					pagination
				/>
			</Card>
		</>
	);
};
