const PageHeader = ({ title, breadcrumbs = [], actions }) => (
	<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<h1 className="m-0 text-2xl font-semibold text-text-primary">{title}</h1>
			{breadcrumbs.length > 0 && (
				<div className="mt-1 flex flex-wrap gap-1 text-sm text-text-muted">
					{breadcrumbs.map((item, index) => (
						<span key={`${item}-${index}`}>{index > 0 ? '/ ' : ''}{item}</span>
					))}
				</div>
			)}
		</div>
		{actions && <div className="flex flex-wrap gap-2">{actions}</div>}
	</div>
);

export default PageHeader;
