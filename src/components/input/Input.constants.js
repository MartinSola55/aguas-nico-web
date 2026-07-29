const CONTROL_CLASS = [
	'w-full rounded-[var(--radius-md)] border border-border-default bg-bg-elevated px-3 py-2 text-sm text-text-primary',
	'placeholder:text-text-muted focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20',
	'disabled:bg-bg-tertiary disabled:text-text-muted',
].join(' ');

// Deja lugar a la derecha para que el texto no quede debajo del ojo.
const PG_CONTROL_CLASS = 'pr-10';

const PG_TOGGLE_CLASS = [
	'absolute right-1 inline-flex cursor-pointer items-center justify-center rounded-[var(--radius-sm)] p-1.5 text-text-muted',
	'transition-colors hover:bg-bg-tertiary hover:text-text-primary',
	'focus-visible:outline-2 focus-visible:outline-accent-primary focus-visible:outline-offset-2',
	'disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-transparent disabled:hover:text-text-muted',
].join(' ');

export { CONTROL_CLASS, PG_CONTROL_CLASS, PG_TOGGLE_CLASS };
