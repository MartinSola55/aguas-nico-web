import { useImperativeHandle, useMemo, useState } from 'react';
import { Roles } from '@constants';
import { App } from '@app';
import { Button, Input, Modal } from '@components';
import { RoleCombo } from '@screens/shared';
import { emptyUser } from './Users.constants.js';

export const UserFormModal = ({ roles = [], onSave, loading = false, ref }) => {
	const [open, setOpen] = useState(false);
	const [form, setForm] = useState(emptyUser);

	const close = () => setOpen(false);
	const isNew = !form.id;
	const roleName = roles.find((role) => role.id === form.roleId)?.description;
	const isDealer = roleName === Roles.Dealer;

	const selectableRoles = useMemo(
		() => (App.isSuperadmin() ? roles : roles.filter((role) => role.description !== Roles.Superadmin)),
		[roles]
	);

	useImperativeHandle(ref, () => ({
		open: (user = emptyUser) => {
			setForm({ ...emptyUser, ...user, truckNumber: user.truckNumber ?? '', password: '' });
			setOpen(true);
		},
		close,
	}));

	const save = () => onSave?.(form, isDealer, close);

	return (
		<Modal
			open={open}
			title={isNew ? 'Nuevo usuario' : 'Editar usuario'}
			onClose={close}
			footer={<><Button variant="secondary" onClick={close}>Cerrar</Button><Button loading={loading} onClick={save}>Guardar</Button></>}>
			<div className="grid gap-3">
				<Input label="Nombre" required value={form.name} onChange={(value) => setForm((f) => ({ ...f, name: value }))} />
				<Input label="Email" type="email" required value={form.email} onChange={(value) => setForm((f) => ({ ...f, email: value }))} />
				<div className="grid gap-3 sm:grid-cols-2">
					<RoleCombo label="Rol" required autoComplete="new-password" roles={selectableRoles} value={form.roleId} onChange={(value) => setForm((f) => ({ ...f, roleId: value }))} />
					{isDealer && (
						<Input label="Número de camión" type="number" min={1} required value={form.truckNumber} onChange={(value) => setForm((f) => ({ ...f, truckNumber: value }))} />
					)}
				</div>
				<Input
					label={isNew ? 'Contraseña' : 'Nueva contraseña (opcional)'}
					type="password"
					autoComplete="new-password"
					required={isNew}
					value={form.password}
					onChange={(value) => setForm((f) => ({ ...f, password: value }))} />
				<p className="text-xs text-text-muted">
					{isNew
						? 'Debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.'
						: 'Dejala vacía para mantener la contraseña actual.'}
				</p>
			</div>
		</Modal>
	);
};
