import { useEffect, useState } from 'react';
import { Moon, Monitor, Sun } from 'lucide-react';
import { Theme } from '@app';
import { Theme as ThemeConstants } from '@constants';

const icons = {
	[ThemeConstants.Light]: Sun,
	[ThemeConstants.Dark]: Moon,
	[ThemeConstants.System]: Monitor,
};

const ThemeToggle = () => {
	const [theme, setTheme] = useState(Theme.getTheme());

	useEffect(() => {
		Theme.applyTheme(theme);
	}, [theme]);

	const handleChange = () => {
		const values = [ThemeConstants.Light, ThemeConstants.Dark, ThemeConstants.System];
		const next = values[(values.indexOf(theme) + 1) % values.length];
		Theme.setTheme(next);
		setTheme(next);
	};

	const Icon = icons[theme] || Monitor;
	const label = ThemeConstants.Options.find((option) => option.value === theme)?.label || 'Sistema';

	return (
		<button
			type="button"
			className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
			title={`Tema: ${label}`}
			onClick={handleChange}
		>
			<Icon size={18} />
		</button>
	);
};

export default ThemeToggle;
