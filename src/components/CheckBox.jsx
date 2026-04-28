const CheckBox = ({ label, checked = false, disabled = false, onChange, className = '' }) => (
	<label className={`inline-flex items-center gap-2 text-sm text-text-secondary ${className}`}>
		<input
			type="checkbox"
			checked={!!checked}
			disabled={disabled}
			onChange={(e) => onChange?.(e.target.checked)}
			className="h-4 w-4 rounded border-border-default accent-accent-primary"
		/>
		<span>{label}</span>
	</label>
);

export default CheckBox;
