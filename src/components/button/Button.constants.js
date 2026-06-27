// Each variant uses a same-hue diagonal gradient (lighter top-left -> darker
// bottom-right) for a modern, non-flat look. The stops are slightly translucent
// (/85) so the button reads as glassy/luminous rather than a solid block, and an
// inset top highlight adds a soft light reflection. A colored glow appears on
// hover. Classes are written out in full so Tailwind can detect and generate them.
const variants = {
	primary: 'bg-linear-to-br from-[color-mix(in_srgb,var(--color-accent-primary),white_22%)]/85 to-[color-mix(in_srgb,var(--color-accent-primary),black_22%)]/85 text-text-inverse shadow-[inset_0_1px_0_0_color-mix(in_srgb,white,transparent_55%),var(--shadow-sm)] hover:shadow-[inset_0_1px_0_0_color-mix(in_srgb,white,transparent_45%),0_8px_22px_-6px_color-mix(in_srgb,var(--color-accent-primary),transparent_40%)]',
	secondary: 'bg-bg-secondary text-text-primary border border-border-default shadow-sm hover:bg-bg-tertiary hover:border-border-accent hover:shadow-md',
	success: 'bg-linear-to-br from-[color-mix(in_srgb,var(--color-status-success),white_22%)]/85 to-[color-mix(in_srgb,var(--color-status-success),black_22%)]/85 text-white shadow-[inset_0_1px_0_0_color-mix(in_srgb,white,transparent_55%),var(--shadow-sm)] hover:shadow-[inset_0_1px_0_0_color-mix(in_srgb,white,transparent_45%),0_8px_22px_-6px_color-mix(in_srgb,var(--color-status-success),transparent_40%)]',
	danger: 'bg-linear-to-br from-[color-mix(in_srgb,var(--color-status-danger),white_22%)]/85 to-[color-mix(in_srgb,var(--color-status-danger),black_22%)]/85 text-white shadow-[inset_0_1px_0_0_color-mix(in_srgb,white,transparent_55%),var(--shadow-sm)] hover:shadow-[inset_0_1px_0_0_color-mix(in_srgb,white,transparent_45%),0_8px_22px_-6px_color-mix(in_srgb,var(--color-status-danger),transparent_40%)]',
	warning: 'bg-linear-to-br from-[color-mix(in_srgb,var(--color-status-warning),white_22%)]/85 to-[color-mix(in_srgb,var(--color-status-warning),black_22%)]/85 text-text-inverse shadow-[inset_0_1px_0_0_color-mix(in_srgb,white,transparent_55%),var(--shadow-sm)] hover:shadow-[inset_0_1px_0_0_color-mix(in_srgb,white,transparent_45%),0_8px_22px_-6px_color-mix(in_srgb,var(--color-status-warning),transparent_40%)]',
	info: 'bg-linear-to-br from-[color-mix(in_srgb,var(--color-status-info),white_22%)]/85 to-[color-mix(in_srgb,var(--color-status-info),black_22%)]/85 text-white shadow-[inset_0_1px_0_0_color-mix(in_srgb,white,transparent_55%),var(--shadow-sm)] hover:shadow-[inset_0_1px_0_0_color-mix(in_srgb,white,transparent_45%),0_8px_22px_-6px_color-mix(in_srgb,var(--color-status-info),transparent_40%)]',
	ghost: 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary',
};

const sizes = {
	sm: 'px-3.5 py-1.5 text-xs',
	md: 'px-5 py-2 text-sm',
	lg: 'px-6 py-2.5 text-base',
	icon: 'h-9 w-9 p-0',
};

export { sizes, variants };
