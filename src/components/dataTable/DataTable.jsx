import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, EmptyState, Loader, Select } from '@components';
import { DEFAULT_PAGE_SIZE } from './DataTable.constants';

export const DataTable = ({
	columns = [],
	rows = [],
	loading = false,
	empty = 'No hay datos para mostrar',
	onRowClick,
	pagination = false,
	infinite = false,
	pageSize = DEFAULT_PAGE_SIZE,
	pageSizeOptions = [],
	scrollHeight = '24rem',
}) => {
	const [page, setPage] = useState(1);
	const [selectedPageSize, setSelectedPageSize] = useState(pageSize);
	const [visibleCount, setVisibleCount] = useState(pageSize);
	const scrollRef = useRef(null);
	const normalizedPageSize = Math.max(Number(selectedPageSize) || DEFAULT_PAGE_SIZE, 1);
	const canChangePageSize = pagination && pageSizeOptions.length > 1;
	const isPaginated = pagination && rows.length > normalizedPageSize;
	const isInfinite = !isPaginated && infinite && rows.length > normalizedPageSize;
	const totalPages = Math.max(Math.ceil(rows.length / normalizedPageSize), 1);
	const pageStart = isPaginated ? (page - 1) * normalizedPageSize : 0;
	const pageEnd = isPaginated ? pageStart + normalizedPageSize : rows.length;
	const displayRows = useMemo(() => {
		if (isPaginated) return rows.slice(pageStart, pageEnd);
		if (isInfinite) return rows.slice(0, visibleCount);
		return rows;
	}, [isInfinite, isPaginated, pageEnd, pageStart, rows, visibleCount]);

	useEffect(() => {
		setSelectedPageSize(pageSize);
	}, [pageSize]);

	useEffect(() => {
		setPage(1);
		setVisibleCount(normalizedPageSize);
		scrollRef.current?.scrollTo({ top: 0 });
	}, [rows.length, normalizedPageSize, pagination, infinite]);

	useEffect(() => {
		if (page > totalPages) setPage(totalPages);
	}, [page, totalPages]);

	const handleScroll = (event) => {
		if (!isInfinite) return;
		const element = event.currentTarget;
		if (element.scrollTop + element.clientHeight >= element.scrollHeight - 24) {
			setVisibleCount((current) => Math.min(current + normalizedPageSize, rows.length));
		}
	};

	const rangeStart = rows.length === 0 ? 0 : pageStart + 1;
	const rangeEnd = isPaginated ? Math.min(pageEnd, rows.length) : displayRows.length;

	return (
		<div className="min-w-0 overflow-hidden rounded-[var(--radius-lg)] border border-border-subtle bg-bg-secondary shadow-sm">
			<div
				ref={scrollRef}
				onScroll={handleScroll}
				className={isInfinite ? 'overflow-auto' : 'overflow-x-auto'}
				style={isInfinite ? { maxHeight: scrollHeight } : undefined}
			>
				<table className="w-full border-collapse text-sm">
					<thead>
						<tr>
							{columns.map((column) => (
								<th
									key={column.name || column.text}
									className={`sticky top-0 z-10 bg-bg-tertiary px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary shadow-[inset_0_-1px_0_0_var(--color-border-default)] ${column.className || ''}`}
								>
									{column.text}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{loading && (
							<tr>
								<td colSpan={columns.length} className="px-4 py-6 text-center">
									<Loader />
								</td>
							</tr>
						)}
						{!loading && displayRows.map((row, rowIndex) => {
							const absoluteIndex = isPaginated ? pageStart + rowIndex : rowIndex;
							return (
								<tr
									key={row.id ?? absoluteIndex}
									className={`border-b border-border-subtle transition-colors last:border-0 even:bg-[color-mix(in_srgb,var(--color-bg-tertiary),transparent_65%)] ${onRowClick ? 'cursor-pointer hover:bg-accent-primary-muted' : 'hover:bg-bg-tertiary/60'} ${row.isActive === false ? 'text-text-muted' : ''}`}
									onClick={() => onRowClick?.(row)}
								>
									{columns.map((column) => (
										<td key={column.name || column.text} className={`px-4 py-2.5 align-top ${column.bodyClassName || ''}`}>
											{column.render ? column.render(row[column.name], row, absoluteIndex) : row[column.name]}
										</td>
									))}
								</tr>
							);
						})}
						{!loading && rows.length === 0 && (
							<tr>
								<td colSpan={columns.length} className="px-4 py-8">
									<EmptyState text={empty} />
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			{/* La barra sigue visible aunque entre todo en una página: si no, al elegir un tamaño grande
			    desaparecería el selector y no habría forma de volver a uno chico. */}
			{!loading && (isPaginated || (canChangePageSize && rows.length > 0)) && (
				<div className="flex flex-col gap-3 border-t border-border-subtle bg-bg-secondary px-4 py-2.5 text-sm text-text-secondary sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-2">
						<span>Mostrando {rangeStart}-{rangeEnd} de {rows.length}</span>
						{canChangePageSize && (
							<div className="w-20">
								<Select
									size="sm"
									value={normalizedPageSize}
									items={pageSizeOptions.map((option) => ({ value: option, label: String(option) }))}
									onChange={(value) => setSelectedPageSize(value)} />
							</div>
						)}
						{canChangePageSize && <span>por pagina</span>}
					</div>
					<div className="flex items-center gap-2">
						<Button size="sm" variant="secondary" disabled={page === 1} onClick={() => setPage((current) => Math.max(current - 1, 1))}>
							<ChevronLeft size={14} />Anterior
						</Button>
						<span className="min-w-20 text-center">Pagina {page} de {totalPages}</span>
						<Button size="sm" variant="secondary" disabled={page === totalPages} onClick={() => setPage((current) => Math.min(current + 1, totalPages))}>
							Siguiente<ChevronRight size={14} />
						</Button>
					</div>
				</div>
			)}
			{!loading && isInfinite && (
				<div className="border-t border-border-subtle bg-bg-secondary px-4 py-2.5 text-sm text-text-secondary">
					Mostrando {rangeEnd} de {rows.length}
				</div>
			)}
		</div>
	);
};
