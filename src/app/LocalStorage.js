import secureLocalStorage from 'react-secure-storage';
import { StorageKey } from '@constants';

const set = (key, value) => secureLocalStorage.setItem(key, JSON.stringify(value));
const get = (key) => {
	const value = secureLocalStorage.getItem(key);
	return value ? JSON.parse(value) : null;
};
const remove = (key) => secureLocalStorage.removeItem(key);

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
export const setTruckNumber = (value) => set(StorageKey.TRUCK_NUMBER, value);
export const getTruckNumber = () => get(StorageKey.TRUCK_NUMBER);
export const setSessionExpiration = (value) => set(StorageKey.SESSION_EXPIRATION, value);
export const getSessionExpiration = () => get(StorageKey.SESSION_EXPIRATION);

export const clearSessionData = () => {
	Object.values(StorageKey).forEach(remove);
};
