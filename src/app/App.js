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

export const isAdmin = () => LocalStorage.getUserRole() === Roles.Admin;
export const isDealer = () => LocalStorage.getUserRole() === Roles.Dealer;

// Permiso preferencial: habilita editar datos sensibles (deuda del cliente, etc.). El resto de los
// administradores los ve pero no los puede modificar. La validación real vive en el backend.
export const canEditSensitiveData = () => isAdmin() && LocalStorage.getCanEditSensitiveData() === true;
