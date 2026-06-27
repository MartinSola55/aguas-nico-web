import { CONTROL_CLASS } from './Input.constants';

const Input = ({
	label,
	value,
	type = 'text',
	required = false,
	disabled = false,
	placeholder = '',
	min,
	max,
	step,
	rows = 3,
	as = 'input',
	className = '',
	onChange,
}) => {
	const shared = {
		value: value ?? '',
		required,
		disabled,
		placeholder,
		min,
		max,
		step,
		onChange: (e) => onChange?.(e.target.value),
		className: `${CONTROL_CLASS} ${className}`,
	};

	return (
		<label className="block">
			{label && (
				<span className={`mb-1 block text-xs font-medium text-text-secondary ${required ? "after:ml-0.5 after:text-status-danger after:content-['*']" : ''}`}>
					{label}
				</span>
			)}
			{as === 'textarea' ? <textarea {...shared} rows={rows} /> : <input {...shared} type={type} />}
		</label>
	);
};

export default Input;
