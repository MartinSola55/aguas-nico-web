import { Roles } from '@constants';

const emptyUser = { id: '', name: '', lastName: '', email: '', roleId: '', truckNumber: '', password: '' };

const roleLabels = {
	[Roles.Admin]: 'Administrador',
	[Roles.Dealer]: 'Repartidor',
};

export { emptyUser, roleLabels };
