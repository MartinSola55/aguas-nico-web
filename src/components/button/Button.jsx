import { sizes, variants } from './Button.constants';

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
			'inline-flex items-center justify-center gap-2 rounded-full font-semibold',
			'transition-all duration-200 ease-out will-change-transform',
			'focus-visible:outline-2 focus-visible:outline-accent-primary focus-visible:outline-offset-2',
			disabled
				? 'opacity-50 cursor-not-allowed'
				: 'cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-95 active:duration-75',
			variants[variant] || variants.primary,
			sizes[size] || sizes.md,
			className,
		].join(' ')}
	>
		{children}
	</button>
);

export default Button;
