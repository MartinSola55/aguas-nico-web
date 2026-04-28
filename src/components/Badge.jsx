const variants = {
	success: 'bg-status-success-bg text-status-success',
	warning: 'bg-status-warning-bg text-status-warning',
	danger: 'bg-status-danger-bg text-status-danger',
	info: 'bg-status-info-bg text-status-info',
	neutral: 'bg-bg-tertiary text-text-secondary',
};

const Badge = ({ children, variant = 'neutral' }) => (
	<span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${variants[variant] || variants.neutral}`}>
		{children}
	</span>
);

export default Badge;
