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
