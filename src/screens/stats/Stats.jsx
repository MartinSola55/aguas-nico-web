import { useEffect, useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import { API, DateHelper, Formatters, Helpers, useIsDarkMode } from '@app';
import { Button, Card, DataTable, Input, PageHeader, Select, StatCard } from '@components';

const chartPalette = (isDark) => ({
	accent: isDark ? '#2dd4bf' : '#0f766e',
	axis: isDark ? '#b3c0d4' : '#4b5563',
	grid: isDark ? '#3a4658' : '#e7edf4',
});

// Shared ApexCharts options: theme-aware axes/grid/tooltip (so the popup stays
// readable in dark mode) and no overflowing data labels (values live in the
// tooltip and y-axis instead).
const baseChartOptions = (isDark, categories) => {
	const c = chartPalette(isDark);
	return {
		chart: {
			toolbar: { show: false },
			zoom: { enabled: false },
			background: 'transparent',
			fontFamily: 'Inter, "Segoe UI", Arial, sans-serif',
		},
		theme: { mode: isDark ? 'dark' : 'light' },
		colors: [c.accent],
		dataLabels: { enabled: false },
		grid: { borderColor: c.grid, strokeDashArray: 4 },
		xaxis: {
			categories,
			labels: { style: { colors: c.axis } },
			axisBorder: { color: c.grid },
			axisTicks: { color: c.grid },
		},
		yaxis: {
			labels: { style: { colors: c.axis }, formatter: (value) => Formatters.formatCurrency(value) },
		},
		tooltip: {
			theme: isDark ? 'dark' : 'light',
			y: { formatter: (value) => Formatters.formatCurrency(value) },
		},
		legend: { labels: { colors: c.axis } },
	};
};

const Stats = () => {
	const [years, setYears] = useState([]);
	const [year, setYear] = useState(DateHelper.currentYear());
	const [month, setMonth] = useState(DateHelper.currentMonth());
	const [annual, setAnnual] = useState([]);
	const [monthly, setMonthly] = useState(null);
	const [products, setProducts] = useState([]);
	const [balanceDate, setBalanceDate] = useState(DateHelper.toInputDate());
	const [balance, setBalance] = useState(null);
	const [dealers, setDealers] = useState([]);
	const [dealerFilters, setDealerFilters] = useState({ startDate: DateHelper.monthStart(), endDate: DateHelper.monthEnd(), dealerId: '' });
	const [dealerProducts, setDealerProducts] = useState([]);

	const dealerOptions = useMemo(() => [{ value: '', label: 'Todos los repartos' }, ...Helpers.dealerComboItems(dealers)], [dealers]);

	const isDark = useIsDarkMode();
	const annualOptions = useMemo(() => ({
		...baseChartOptions(isDark, annual.map((item) => item.period)),
		plotOptions: { bar: { borderRadius: 6, borderRadiusApplication: 'end', columnWidth: '55%' } },
	}), [isDark, annual]);
	const monthlyOptions = useMemo(() => ({
		...baseChartOptions(isDark, (monthly?.daily || []).map((item) => item.period.slice(-2))),
		stroke: { curve: 'smooth', width: 3 },
		markers: { size: 0, hover: { size: 5 } },
		fill: { type: 'gradient', gradient: { shadeIntensity: 0.3, opacityFrom: 0.35, opacityTo: 0.05, stops: [0, 100] } },
	}), [isDark, monthly]);

	const load = () => {
		API.endpoints.stats.getAnnualProfits({ year }).then((rs) => setAnnual(rs.data.items || []));
		API.endpoints.stats.getMonthlyProfits({ year, month }).then((rs) => setMonthly(rs.data));
		API.endpoints.stats.getProductsSold({ year, month }).then((rs) => setProducts(rs.data.items || []));
		API.endpoints.stats.getBalanceByDate({ date: DateHelper.toApiDate(balanceDate) }).then((rs) => setBalance(rs.data));
	};

	const loadDealerProducts = () => {
		API.endpoints.stats.getProductsSoldByDealer({
			startDate: DateHelper.toApiDate(dealerFilters.startDate),
			endDate: DateHelper.toApiDate(dealerFilters.endDate),
			dealerId: dealerFilters.dealerId || '',
		}).then((rs) => setDealerProducts(rs.data.items || []));
	};

	useEffect(() => {
		API.endpoints.stats.getYears().then((rs) => setYears(rs.data.years || []));
		API.endpoints.dealers.getAll().then((rs) => setDealers(rs.data.items || []));
		load();
		loadDealerProducts();
	}, []);

	return (
		<>
			<PageHeader title="Estadisticas" breadcrumbs={['Inicio', 'Estadisticas']} />
			<Card title="Filtros">
				<div className="grid gap-3 md:grid-cols-[200px_200px_220px_200px] md:items-end">
					<Select label="Año" value={year} onChange={setYear} items={years.map((y) => ({ value: y, label: y }))} />
					<Select label="Mes" value={month} onChange={setMonth} items={[
						{ value: 1, label: 'Enero' }, { value: 2, label: 'Febrero' }, { value: 3, label: 'Marzo' },
						{ value: 4, label: 'Abril' }, { value: 5, label: 'Mayo' }, { value: 6, label: 'Junio' },
						{ value: 7, label: 'Julio' }, { value: 8, label: 'Agosto' }, { value: 9, label: 'Septiembre' },
						{ value: 10, label: 'Octubre' }, { value: 11, label: 'Noviembre' }, { value: 12, label: 'Diciembre' },
					]} />
					<Input label="Balance al dia" type="date" value={balanceDate} onChange={setBalanceDate} />
					<Button className="justify-self-start" onClick={load}>Actualizar</Button>
				</div>
			</Card>
			<div className="mt-4 grid gap-3 md:grid-cols-4">
				<StatCard label="Total mensual" value={Formatters.formatCurrency(monthly?.total || 0)} />
				<StatCard label="Balance" value={Formatters.formatCurrency(balance?.total || 0)} tone="info" />
				<StatCard label="Cobros" value={Formatters.formatCurrency(balance?.cartPaymentMethods || 0)} tone="success" />
				<StatCard label="Gastos" value={Formatters.formatCurrency(balance?.expenses || 0)} tone="danger" />
			</div>
			<div className="mt-4 grid gap-4 xl:grid-cols-2">
				<Card title="Ganancias anuales">
					<Chart
						type="bar"
						height={300}
						options={annualOptions}
						series={[{ name: 'Vendido', data: annual.map((item) => item.sold) }]}
					/>
				</Card>
				<Card title="Ganancias mensuales">
					<Chart
						type="line"
						height={300}
						options={monthlyOptions}
						series={[{ name: 'Vendido', data: (monthly?.daily || []).map((item) => item.sold) }]}
					/>
				</Card>
			</div>
			<Card className="mt-4" title="Productos vendidos">
				<DataTable columns={[{ name: 'type', text: 'Producto' }, { name: 'quantity', text: 'Cantidad' }]} rows={products} infinite />
			</Card>
			<Card className="mt-4" title="Productos vendidos por repartidor">
				<div className="mb-4 grid gap-3 md:grid-cols-[200px_200px_220px_auto] md:items-end">
					<Input label="Desde" type="date" value={dealerFilters.startDate} onChange={(value) => setDealerFilters((f) => ({ ...f, startDate: value }))} />
					<Input label="Hasta" type="date" value={dealerFilters.endDate} onChange={(value) => setDealerFilters((f) => ({ ...f, endDate: value }))} />
					<Select label="Repartidor" items={dealerOptions} value={dealerFilters.dealerId} onChange={(value) => setDealerFilters((f) => ({ ...f, dealerId: value || '' }))} />
					<Button variant="secondary" className="justify-self-start" onClick={loadDealerProducts}>Buscar</Button>
				</div>
				<DataTable
					columns={[
						{ name: 'dealerName', text: 'Repartidor' },
						{ name: 'quantity', text: 'Total' },
						{
							name: 'products', text: 'Detalle', render: (products = []) => (
								<div className="flex flex-col gap-0.5">
									{products.map((p) => <span key={p.type}>{p.type}: <strong>{p.quantity}</strong></span>)}
								</div>
							)
						},
					]}
					rows={dealerProducts}
					infinite
				/>
			</Card>
		</>
	);
};

export default Stats;
