import { useEffect, useState } from 'react';
import { Theme as ThemeConstants } from '@constants';

const getResolvedTheme = () => {
	if (typeof document === 'undefined') return ThemeConstants.Light;
	return document.documentElement.dataset.theme === ThemeConstants.Dark
		? ThemeConstants.Dark
		: ThemeConstants.Light;
};

// Tracks the resolved theme by observing the `data-theme` attribute that
// Theme.applyTheme sets on <html>, so components react to theme changes.
export const useResolvedTheme = () => {
	const [theme, setTheme] = useState(getResolvedTheme);

	useEffect(() => {
		const observer = new window.MutationObserver(() => setTheme(getResolvedTheme()));
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
		return () => observer.disconnect();
	}, []);

	return theme;
};

export const useIsDarkMode = () => useResolvedTheme() === ThemeConstants.Dark;
