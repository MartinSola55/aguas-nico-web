const Field = ({ label, value, children }) => (
	<div>
		<div className="text-xs font-medium uppercase tracking-wide text-text-muted">{label}</div>
		<div className="mt-1 text-sm text-text-primary">{children || value || '-'}</div>
	</div>
);

export default Field;
