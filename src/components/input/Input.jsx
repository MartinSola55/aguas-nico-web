import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { CONTROL_CLASS, PG_CONTROL_CLASS, PG_TOGGLE_CLASS } from './Input.constants';

export const Input = ({
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
	const [revealed, setRevealed] = useState(false);
	const isPassword = as === 'input' && type === 'password';

	const shared = {
		value: value ?? '',
		required,
		disabled,
		placeholder,
		min,
		max,
		step,
		onChange: (e) => onChange?.(e.target.value),
		className: `${CONTROL_CLASS} ${isPassword ? PG_CONTROL_CLASS : ''} ${className}`,
	};

	return (
		<label className="block">
			{label && (
				<span className={`mb-1 block text-xs font-medium text-text-secondary ${required ? "after:ml-0.5 after:text-status-danger after:content-['*']" : ''}`}>
					{label}
				</span>
			)}
			{as === 'textarea' && <textarea {...shared} rows={rows} />}
			{as !== 'textarea' && !isPassword && <input {...shared} type={type} />}
			{isPassword && (
				<span className="relative flex items-center">
					<input {...shared} type={revealed ? 'text' : 'password'} />
					<button
						type="button"
						disabled={disabled}
						onClick={() => setRevealed((current) => !current)}
						title={revealed ? 'Ocultar contraseña' : 'Mostrar contraseña'}
						aria-label={revealed ? 'Ocultar contraseña' : 'Mostrar contraseña'}
						className={PG_TOGGLE_CLASS}
					>
						{revealed ? <EyeOff size={16} /> : <Eye size={16} />}
					</button>
				</span>
			)}
		</label>
	);
};
