import { useImperativeHandle, useState } from 'react';
import { Roles } from '@constants';
import { App } from '@app';
import { Button, CheckBox, Input, Modal } from '@components';
import { RoleCombo } from '@screens/shared';
import { emptyUser } from './Users.constants.js';

export const UserFormModal = ({ roles = [], onSave, loading = false, ref }) => {
	const [open, setOpen] = useState(false);
	const [form, setForm] = useState(emptyUser);

	const close = () => setOpen(false);
	const isNew = !form.id;
	const roleName = roles.find((role) => role.id === form.roleId)?.description;
	const isDealer = roleName === Roles.Dealer;
	const isAdmin = roleName === Roles.Admin;

	useImperativeHandle(ref, () => ({
		open: (user = emptyUser) => {
			setForm({ ...emptyUser, ...user, truckNumber: user.truckNumber ?? '', canEditSensitiveData: !!user.canEditSensitiveData, password: '' });
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
					<RoleCombo label="Rol" required roles={roles} value={form.roleId} onChange={(value) => setForm((f) => ({ ...f, roleId: value }))} />
					{isDealer && (
						<Input label="Número de camión" type="number" min={1} required value={form.truckNumber} onChange={(value) => setForm((f) => ({ ...f, truckNumber: value }))} />
					)}
				</div>
				{isAdmin && (
					<div>
						<CheckBox
							label="Puede editar datos sensibles"
							disabled={!App.canEditSensitiveData()}
							checked={form.canEditSensitiveData}
							onChange={(value) => setForm((f) => ({ ...f, canEditSensitiveData: value }))} />
						<p className="mt-1 text-xs text-text-muted">
							{App.canEditSensitiveData()
								? 'Habilita modificar la deuda de un cliente y el resto de los datos sensibles. El resto de los administradores los ve, pero no los edita.'
								: 'Solo un usuario que ya tenga este permiso puede otorgarlo o quitarlo.'}
						</p>
					</div>
				)}
				<Input
					label={isNew ? 'Contraseña' : 'Nueva contraseña (opcional)'}
					type="password"
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
