import { useMemo } from 'react';
import ReactSelect, { components as ReactSelectComponents } from 'react-select';
import { getSelectStyles } from './Select.constants';

export const Select = ({
	label,
	value,
	items = [],
	placeholder = 'Seleccione una opción',
	size = 'md',
	isMulti = false,
	clearable = false,
	disabled = false,
	required = false,
	autoComplete,
	onChange,
}) => {
	// El buscador interno de react-select es un input de texto y el navegador puede autocompletarlo con credenciales guardadas.
	const selectComponents = useMemo(
		() =>
			autoComplete
				? { Input: (inputProps) => <ReactSelectComponents.Input {...inputProps} autoComplete={autoComplete} /> }
				: undefined,
		[autoComplete]
	);

	const selectedValue = isMulti
		? items.filter((item) => Array.isArray(value) && value.includes(item.value))
		: items.find((item) => item.value === value) || null;

	const handleChange = (option) => {
		if (isMulti) {
			onChange?.((option || []).map((item) => item.value), option || []);
			return;
		}
		onChange?.(option?.value ?? null, option || null);
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
				value={selectedValue}
				options={items}
				components={selectComponents}
				placeholder={placeholder}
				isMulti={isMulti}
				isClearable={clearable}
				isDisabled={disabled}
				noOptionsMessage={() => 'Sin resultados'}
				styles={getSelectStyles(size)}
				menuPortalTarget={document.body}
				menuPosition="fixed"
				onChange={handleChange}
			/>
		</label>
	);
};
