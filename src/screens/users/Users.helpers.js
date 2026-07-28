import { roleLabels } from './Users.constants.js';

export const roleName = (role) => roleLabels[role] ?? role ?? '-';

export const roleComboItems = (items = []) =>
	items.map((item) => ({
		value: item.id,
		label: item.description,
		raw: item,
	}));

export const userFormRequest = (form, isDealer) => ({
	name: (form.name || '').trim(),
	lastName: (form.lastName || '').trim(),
	email: (form.email || '').trim(),
	roleId: form.roleId,
	truckNumber: isDealer ? Number(form.truckNumber) || 0 : null,
});

export const validateUserForm = (form, isDealer, isNew) => {
	if (!form.name?.trim()) return 'Debes ingresar el nombre.';
	if (!form.lastName?.trim()) return 'Debes ingresar el apellido.';
	if (!form.email?.trim()) return 'Debes ingresar el email.';
	if (!form.roleId) return 'Debes seleccionar un rol.';
	if (isDealer && !(Number(form.truckNumber) > 0)) return 'Debes ingresar el número de camión del repartidor.';
	if (isNew && !form.password) return 'Debes ingresar una contraseña.';
	return null;
};
