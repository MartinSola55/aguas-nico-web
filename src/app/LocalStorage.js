import secureLocalStorage from 'react-secure-storage';
import { StorageKey } from '@constants';

const secureStorage = secureLocalStorage.default || secureLocalStorage;

const set = (key, value) => {
	return secureStorage.setItem(key, JSON.stringify(value));
};

const get = (key) => {
	const value = secureStorage.getItem(key);
	return value ? JSON.parse(value) : null;
};

const remove = (key) => secureStorage.removeItem(key);

export const setToken = (value) => set(StorageKey.TOKEN, value);
export const getToken = () => get(StorageKey.TOKEN);

export const setUserId = (value) => set(StorageKey.USER_ID, value);
export const getUserId = () => get(StorageKey.USER_ID);

export const setUserRole = (value) => set(StorageKey.USER_ROLE, value);
export const getUserRole = () => get(StorageKey.USER_ROLE);

export const setUserName = (value) => set(StorageKey.USER_NAME, value);
export const getUserName = () => get(StorageKey.USER_NAME);

export const setUserEmail = (value) => set(StorageKey.USER_EMAIL, value);
export const getUserEmail = () => get(StorageKey.USER_EMAIL);

export const setSessionExpiration = (value) => set(StorageKey.SESSION_EXPIRATION, value);
export const getSessionExpiration = () => get(StorageKey.SESSION_EXPIRATION);

export const setTruckNumber = (value) => set(StorageKey.TRUCK_NUMBER, value);
export const getTruckNumber = () => get(StorageKey.TRUCK_NUMBER);

export const setTheme = (value) => set(StorageKey.THEME, value);
export const getTheme = () => get(StorageKey.THEME);

export const setSidebarExpanded = (value) => set(StorageKey.SIDEBAR_EXPANDED, value);
export const getSidebarExpanded = () => get(StorageKey.SIDEBAR_EXPANDED);

export const clearSessionData = () => {
	remove(StorageKey.TOKEN);
	remove(StorageKey.USER_ID);
	remove(StorageKey.USER_ROLE);
	remove(StorageKey.USER_NAME);
	remove(StorageKey.USER_EMAIL);
	remove(StorageKey.SESSION_EXPIRATION);
	remove(StorageKey.TRUCK_NUMBER);
};
