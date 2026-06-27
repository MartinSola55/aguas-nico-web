// Each variant uses a subtle same-hue gradient (top -> slightly darker bottom)
// and a soft colored glow on hover that matches the button color. Classes are
// written out in full so Tailwind can detect and generate them.
const variants = {
	primary: 'bg-linear-to-b from-[var(--color-accent-primary)] to-[color-mix(in_srgb,var(--color-accent-primary),black_12%)] text-text-inverse shadow-sm hover:shadow-[0_8px_22px_-6px_color-mix(in_srgb,var(--color-accent-primary),transparent_45%)]',
	secondary: 'bg-bg-secondary text-text-primary border border-border-default shadow-sm hover:bg-bg-tertiary hover:border-border-accent hover:shadow-md',
	success: 'bg-linear-to-b from-[var(--color-status-success)] to-[color-mix(in_srgb,var(--color-status-success),black_12%)] text-white shadow-sm hover:shadow-[0_8px_22px_-6px_color-mix(in_srgb,var(--color-status-success),transparent_45%)]',
	danger: 'bg-linear-to-b from-[var(--color-status-danger)] to-[color-mix(in_srgb,var(--color-status-danger),black_12%)] text-white shadow-sm hover:shadow-[0_8px_22px_-6px_color-mix(in_srgb,var(--color-status-danger),transparent_45%)]',
	warning: 'bg-linear-to-b from-[var(--color-status-warning)] to-[color-mix(in_srgb,var(--color-status-warning),black_12%)] text-text-inverse shadow-sm hover:shadow-[0_8px_22px_-6px_color-mix(in_srgb,var(--color-status-warning),transparent_45%)]',
	info: 'bg-linear-to-b from-[var(--color-status-info)] to-[color-mix(in_srgb,var(--color-status-info),black_12%)] text-white shadow-sm hover:shadow-[0_8px_22px_-6px_color-mix(in_srgb,var(--color-status-info),transparent_45%)]',
	ghost: 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary',
};

const sizes = {
	sm: 'px-3.5 py-1.5 text-xs',
	md: 'px-5 py-2 text-sm',
	lg: 'px-6 py-2.5 text-base',
	icon: 'h-9 w-9 p-0',
};

export { sizes, variants };
