const getSelectStyles = (size = 'md') => {
	const isSmall = size === 'sm';

	return {
		control: (base, state) => ({
			...base,
			minHeight: isSmall ? 36 : 40,
			backgroundColor: state.isDisabled ? 'var(--color-bg-canvas)' : state.isFocused ? 'var(--color-bg-elevated)' : 'var(--color-bg-secondary)',
			borderColor: state.isFocused ? 'var(--color-accent-primary)' : 'var(--color-border-subtle)',
			borderRadius: 'var(--radius-md)',
			boxShadow: state.isFocused ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
			cursor: state.isDisabled ? 'not-allowed' : 'pointer',
			opacity: state.isDisabled ? 0.72 : 1,
			transition: 'background-color var(--transition-base), border-color var(--transition-base), box-shadow var(--transition-base)',
			':hover': {
				backgroundColor: state.isDisabled ? 'var(--color-bg-canvas)' : 'var(--color-bg-elevated)',
				borderColor: 'var(--color-border-accent)',
			},
		}),
		valueContainer: (base) => ({
			...base,
			padding: isSmall ? '1px 8px' : '2px 10px',
			gap: isSmall ? 3 : 4,
		}),
		input: (base) => ({
			...base,
			color: 'var(--color-text-primary)',
			margin: 0,
			padding: 0,
			fontSize: isSmall ? 12 : 14,
		}),
		indicatorsContainer: (base) => ({
			...base,
			paddingRight: isSmall ? 3 : 4,
		}),
		indicatorSeparator: () => ({
			display: 'none',
		}),
		dropdownIndicator: (base, state) => ({
			...base,
			color: state.isFocused ? 'var(--color-accent-primary)' : 'var(--color-text-muted)',
			padding: isSmall ? 5 : 6,
			transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
			transition: 'color var(--transition-fast), transform var(--transition-fast)',
			':hover': {
				color: 'var(--color-accent-primary)',
			},
		}),
		clearIndicator: (base) => ({
			...base,
			color: 'var(--color-text-muted)',
			padding: isSmall ? 5 : 6,
			transition: 'color var(--transition-fast)',
			':hover': {
				color: 'var(--color-status-danger)',
			},
		}),
		menu: (base) => ({
			...base,
			marginTop: 6,
			backgroundColor: 'var(--color-bg-elevated)',
			border: '1px solid var(--color-border-subtle)',
			borderRadius: 'var(--radius-md)',
			boxShadow: 'var(--shadow-lg)',
			overflow: 'hidden',
			zIndex: 'var(--z-dropdown)',
		}),
		menuList: (base) => ({
			...base,
			padding: 4,
		}),
		option: (base, state) => ({
			...base,
			backgroundColor: state.isSelected
				? 'var(--color-accent-primary)'
				: state.isFocused
					? 'var(--color-accent-primary-muted)'
					: 'transparent',
			color: state.isSelected ? 'var(--color-text-inverse)' : 'var(--color-text-primary)',
			borderRadius: 'var(--radius-sm)',
			cursor: 'pointer',
			margin: '1px 0',
			fontSize: isSmall ? 12 : 14,
			padding: isSmall ? '7px 9px' : '9px 10px',
			transition: 'background-color var(--transition-fast), color var(--transition-fast)',
			':active': {
				backgroundColor: state.isSelected ? 'var(--color-accent-primary)' : 'var(--color-bg-tertiary)',
			},
		}),
		singleValue: (base) => ({
			...base,
			color: 'var(--color-text-primary)',
			fontSize: isSmall ? 12 : 14,
		}),
		multiValue: (base) => ({
			...base,
			backgroundColor: 'var(--color-accent-primary-muted)',
			border: '1px solid var(--color-border-accent)',
			borderRadius: 'var(--radius-md)',
			margin: isSmall ? 1 : 2,
			overflow: 'hidden',
		}),
		multiValueLabel: (base) => ({
			...base,
			color: 'var(--color-accent-primary)',
			fontSize: isSmall ? 12 : 14,
			fontWeight: 600,
			padding: isSmall ? '1px 5px' : '2px 6px',
		}),
		multiValueRemove: (base) => ({
			...base,
			color: 'var(--color-accent-primary)',
			paddingLeft: 4,
			paddingRight: 4,
			':hover': {
				backgroundColor: 'var(--color-status-danger-bg)',
				color: 'var(--color-status-danger)',
			},
		}),
		placeholder: (base) => ({
			...base,
			color: 'var(--color-text-muted)',
			fontSize: isSmall ? 12 : 14,
		}),
		noOptionsMessage: (base) => ({
			...base,
			color: 'var(--color-text-muted)',
			fontSize: isSmall ? 12 : 14,
			padding: isSmall ? '8px 10px' : '10px 12px',
		}),
	};
};

export { getSelectStyles };
