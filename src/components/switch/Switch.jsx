import { KNOB_CLASS, TRACK_BASE_CLASS, TRACK_OFF_CLASS, TRACK_ON_CLASS } from './Switch.constants';

const Switch = ({ label, checked = false, disabled = false, onChange, className = '' }) => (
	<label className={`inline-flex items-center gap-2 text-sm text-text-secondary ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}>
		<button
			type="button"
			role="switch"
			aria-checked={!!checked}
			disabled={disabled}
			onClick={() => onChange?.(!checked)}
			className={`${TRACK_BASE_CLASS} ${checked ? TRACK_ON_CLASS : TRACK_OFF_CLASS}`}
		>
			<span className={`${KNOB_CLASS} ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
		</button>
		{label && <span>{label}</span>}
	</label>
);

export default Switch;
