import ReactSelect from 'react-select';

const styles = {
	control: (base, state) => ({
		...base,
		minHeight: 38,
		borderRadius: 'var(--radius-md)',
		borderColor: state.isFocused ? 'var(--color-accent-primary)' : 'var(--color-border-primary)',
		boxShadow: state.isFocused ? '0 0 0 2px rgba(15,118,110,.18)' : 'none',
		backgroundColor: 'var(--color-bg-elevated)',
		':hover': { borderColor: 'var(--color-border-accent)' },
	}),
	menu: (base) => ({ ...base, zIndex: 1000 }),
	option: (base, state) => ({
		...base,
		backgroundColor: state.isSelected ? 'var(--color-accent-primary)' : state.isFocused ? 'var(--color-bg-tertiary)' : 'white',
		color: state.isSelected ? 'white' : 'var(--color-text-primary)',
	}),
};

const Select = ({
	label,
	items = [],
	value,
	isMulti = false,
	required = false,
	disabled = false,
	clearable = false,
	placeholder = 'Seleccione',
	onChange,
}) => {
	const selected = isMulti
		? items.filter((item) => (value || []).includes(item.value))
		: items.find((item) => item.value === value) || null;

	const handleChange = (item) => {
		if (isMulti) onChange?.((item || []).map((x) => x.value), item || []);
		else onChange?.(item?.value ?? null, item);
	};

	return (
		<label className="block">
			{label && (
				<span className={`mb-1 block text-xs font-medium text-text-secondary ${required ? "after:ml-0.5 after:text-status-danger after:content-['*']" : ''}`}>
					{label}
				</span>
			)}
			<ReactSelect
				classNamePrefix="react-select"
				options={items}
				value={selected}
				isMulti={isMulti}
				isDisabled={disabled}
				isClearable={clearable}
				placeholder={placeholder}
				noOptionsMessage={() => 'Sin resultados'}
				styles={styles}
				onChange={handleChange}
			/>
		</label>
	);
};

export default Select;
