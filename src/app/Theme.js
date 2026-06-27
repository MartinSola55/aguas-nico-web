import { Theme as ThemeConstants } from '@constants';
import * as LocalStorage from './LocalStorage.js';

const mediaQuery = '(prefers-color-scheme: dark)';

const getSystemTheme = () => {
	if (typeof window === 'undefined') return ThemeConstants.Light;
	return window.matchMedia(mediaQuery).matches ? ThemeConstants.Dark : ThemeConstants.Light;
};

const resolveTheme = (theme) =>
	theme === ThemeConstants.System ? getSystemTheme() : theme || ThemeConstants.Light;

export const applyTheme = (theme) => {
	const resolved = resolveTheme(theme);
	document.documentElement.dataset.theme = resolved;
	document.documentElement.style.colorScheme = resolved;
};

export const getTheme = () => LocalStorage.getTheme() || ThemeConstants.System;

export const setTheme = (theme) => {
	LocalStorage.setTheme(theme);
	applyTheme(theme);
};

export const initializeTheme = () => {
	applyTheme(getTheme());

	if (typeof window === 'undefined') return;
	window.matchMedia(mediaQuery).addEventListener('change', () => {
		if (getTheme() === ThemeConstants.System) applyTheme(ThemeConstants.System);
	});
};
