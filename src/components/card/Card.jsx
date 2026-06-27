const Card = ({ title, subtitle, actions, children, className = '', bodyClassName = '' }) => (
	<section className={`rounded-[var(--radius-md)] border border-border-subtle bg-bg-secondary shadow-sm ${className}`}>
		{(title || actions) && (
			<header className="flex flex-col gap-3 border-b border-border-subtle px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					{title && <h2 className="m-0 text-base font-semibold text-text-primary">{title}</h2>}
					{subtitle && <p className="m-0 mt-1 text-sm text-text-muted">{subtitle}</p>}
				</div>
				{actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
			</header>
		)}
		<div className={`p-4 ${bodyClassName}`}>{children}</div>
	</section>
);

export default Card;
