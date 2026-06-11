import ReactSelect from 'react-select';
import { getSelectStyles } from './Select.constants';

const Select = ({
	label,
	value,
	options = [],
	placeholder = 'Seleccione una opción',
	size = 'md',
	isMulti = false,
	isClearable = false,
	isDisabled = false,
	required = false,
	onChange,
}) => {
	const selectedValue = isMulti
		? options.filter((option) => Array.isArray(value) && value.includes(option.value))
		: options.find((option) => option.value === value) || null;

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
				options={options}
				placeholder={placeholder}
				isMulti={isMulti}
				isClearable={isClearable}
				isDisabled={isDisabled}
				noOptionsMessage={() => 'Sin resultados'}
				styles={getSelectStyles(size)}
				onChange={handleChange}
			/>
		</label>
	);
};

export default Select;
