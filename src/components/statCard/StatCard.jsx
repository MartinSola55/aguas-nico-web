import { tones } from './StatCard.constants';

const StatCard = ({ label, value, icon, tone = 'primary' }) => (
	<div className="rounded-[var(--radius-md)] border border-border-subtle bg-bg-secondary p-4 shadow-sm">
		<div className="flex items-center gap-3">
			{icon && <div className={`rounded-[var(--radius-md)] p-2 ${tones[tone] || tones.primary}`}>{icon}</div>}
			<div>
				<div className="text-sm text-text-muted">{label}</div>
				<div className="mt-1 text-xl font-semibold text-text-primary">{value}</div>
			</div>
		</div>
	</div>
);

export default StatCard;
