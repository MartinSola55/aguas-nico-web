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
		onChange: (e) => onChange?.(type === 'number' ? e.target.value : e.target.value),
		className: [
			'w-full rounded-[var(--radius-md)] border border-border-default bg-bg-elevated px-3 py-2 text-sm text-text-primary',
			'placeholder:text-text-muted focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20',
			'disabled:bg-bg-tertiary disabled:text-text-muted',
			className,
		].join(' '),
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
