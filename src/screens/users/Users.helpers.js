export const userFormRequest = (form, isDealer) => ({
	name: (form.name || '').trim(),
	email: (form.email || '').trim(),
	roleId: form.roleId,
	truckNumber: isDealer ? Number(form.truckNumber) || 0 : null,
	canEditSensitiveData: !isDealer && !!form.canEditSensitiveData,
});

export const validateUserForm = (form, isDealer, isNew) => {
	if (!form.name?.trim()) return 'Debes ingresar el nombre.';
	if (!form.email?.trim()) return 'Debes ingresar el email.';
	if (!form.roleId) return 'Debes seleccionar un rol.';
	if (isDealer && !(Number(form.truckNumber) > 0)) return 'Debes ingresar el número de camión del repartidor.';
	if (isNew && !form.password) return 'Debes ingresar una contraseña.';
	return null;
};
