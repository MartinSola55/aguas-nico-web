import { sizes, variants } from './Button.constants';

export const Button = ({
	type = 'button',
	variant = 'primary',
	size = 'md',
	className = '',
	disabled = false,
	loading = false,
	children,
	onClick,
}) => {
	const isDisabled = disabled || loading;

	return (
		<button
			type={type}
			disabled={isDisabled}
			onClick={onClick}
			className={[
				'inline-flex items-center justify-center gap-2 rounded-full font-semibold',
				'transition-all duration-200 ease-out will-change-transform',
				'focus-visible:outline-2 focus-visible:outline-accent-primary focus-visible:outline-offset-2',
				isDisabled
					? 'opacity-50 cursor-not-allowed'
					: 'cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-95 active:duration-75',
				variants[variant] || variants.primary,
				sizes[size] || sizes.md,
				className,
			].join(' ')}
		>
			{children}
			{loading && (
				<span
					className="inline-block h-4 w-4 shrink-0 rounded-full border-2 border-current/30 border-b-current"
					style={{ animation: 'rotation 1s linear infinite' }}
				/>
			)}
		</button>
	);
};
