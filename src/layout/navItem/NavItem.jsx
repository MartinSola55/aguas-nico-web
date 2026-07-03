import { Link } from 'react-router';

export const NavItem = ({ to, label, icon: Icon, expanded, active, onNavigate }) => (
	<li className="group relative">
		<Link
			to={to}
			onClick={onNavigate}
			className={`flex items-center whitespace-nowrap rounded-[var(--radius-md)] border-l-[3px] py-2.5 pl-4 pr-3 text-sm font-medium transition-colors ${active
				? 'border-accent-primary bg-accent-primary-muted text-accent-primary'
				: 'border-transparent text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
				}`}
		>
			<Icon size={18} className="shrink-0" />
			<span
				className="ml-3"
				style={{
					clipPath: expanded ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
					opacity: expanded ? 1 : 0,
					transition: 'clip-path 400ms ease-in-out, opacity 400ms ease-in-out',
				}}
			>
				{label}
			</span>
		</Link>
		{!expanded && (
			<div className="invisible absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-[var(--radius-md)] border border-border-subtle bg-bg-elevated px-2.5 py-1.5 text-xs font-medium text-text-primary opacity-0 shadow-md transition-all duration-[var(--transition-fast)] group-hover:visible group-hover:opacity-100 max-md:hidden">
				{label}
			</div>
		)}
	</li>
);

