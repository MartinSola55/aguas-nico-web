import { LocalStorage } from '@app';
import { Roles } from '@constants';

export const isLoggedIn = () => {
	if (!LocalStorage.getToken() || !LocalStorage.getUserId()) return false;
	const expiration = LocalStorage.getSessionExpiration();
	if (!expiration) return false;
	if (new Date() > new Date(expiration)) {
		LocalStorage.clearSessionData();
		return false;
	}
	return true;
};

export const isSuperadmin = () => LocalStorage.getUserRole() === Roles.Superadmin;
export const isAdmin = () => isSuperadmin() || LocalStorage.getUserRole() === Roles.Admin;
export const isDealer = () => LocalStorage.getUserRole() === Roles.Dealer;

// Datos sensibles (deuda del cliente, etc.): sólo los edita el superadministrador. El resto de los
// administradores los ve pero no los puede modificar. La validación real vive en el backend.
export const canEditSensitiveData = () => isSuperadmin();
