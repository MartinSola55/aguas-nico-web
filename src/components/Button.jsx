const variants = {
	primary: 'bg-accent-primary text-text-inverse hover:bg-accent-primary-hover',
	secondary: 'border border-border-default text-text-primary hover:bg-bg-tertiary',
	success: 'bg-status-success text-white hover:opacity-90',
	danger: 'bg-status-danger text-white hover:opacity-90',
	warning: 'bg-status-warning text-white hover:opacity-90',
	info: 'bg-status-info text-white hover:opacity-90',
	ghost: 'text-text-secondary hover:bg-bg-tertiary',
};

const sizes = {
	sm: 'px-3 py-1.5 text-xs',
	md: 'px-4 py-2 text-sm',
	lg: 'px-5 py-2.5 text-base',
};

const Button = ({
	type = 'button',
	variant = 'primary',
	size = 'md',
	className = '',
	disabled = false,
	children,
	onClick,
}) => (
	<button
		type={type}
		disabled={disabled}
		onClick={onClick}
		className={[
			'inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-medium transition-all duration-[var(--transition-fast)]',
			'focus:outline-none focus:ring-2 focus:ring-accent-primary/30',
			disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
			variants[variant] || variants.primary,
			sizes[size] || sizes.md,
			className,
		].join(' ')}
	>
		{children}
	</button>
);

export default Button;
