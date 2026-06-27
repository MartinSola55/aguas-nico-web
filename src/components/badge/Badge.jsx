import { variants } from './Badge.constants';

const Badge = ({ children, variant = 'neutral' }) => (
	<span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${variants[variant] || variants.neutral}`}>
		{children}
	</span>
);

export default Badge;
