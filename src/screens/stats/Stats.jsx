import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { API, DateHelper, Formatters } from '@app';
import { Card, DataTable, Input, PageHeader, StatCard } from '@components';

const Stats = () => {
	const [years, setYears] = useState([]);
	const [year, setYear] = useState(DateHelper.currentYear());
	const [month, setMonth] = useState(DateHelper.currentMonth());
	const [annual, setAnnual] = useState([]);
	const [monthly, setMonthly] = useState(null);
	const [products, setProducts] = useState([]);
	const [balanceDate, setBalanceDate] = useState(DateHelper.toInputDate());
	const [balance, setBalance] = useState(null);

	const load = () => {
		API.endpoints.stats.getAnnualProfits({ year }).then((rs) => setAnnual(rs.data.items || []));
		API.endpoints.stats.getMonthlyProfits({ year, month }).then((rs) => setMonthly(rs.data));
		API.endpoints.stats.getProductsSold({ year, month }).then((rs) => setProducts(rs.data.items || []));
		API.endpoints.stats.getBalanceByDate({ date: DateHelper.toApiDate(balanceDate) }).then((rs) => setBalance(rs.data));
	};

	useEffect(() => {
		API.endpoints.stats.getYears().then((rs) => setYears(rs.data.years || []));
		load();
	}, []);

	return (
		<>
			<PageHeader title="Estadisticas" breadcrumbs={['Inicio', 'Estadisticas']} />
			<Card title="Filtros">
				<div className="grid gap-3 md:grid-cols-[160px_160px_180px_auto] md:items-end">
					<Input label="Anio" type="number" value={year} onChange={setYear} />
					<Input label="Mes" type="number" min={1} max={12} value={month} onChange={setMonth} />
					<Input label="Balance al dia" type="date" value={balanceDate} onChange={setBalanceDate} />
					<button type="button" className="rounded-[var(--radius-md)] bg-accent-primary px-4 py-2 text-sm font-medium text-white" onClick={load}>Actualizar</button>
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
						options={{ chart: { toolbar: { show: false } }, xaxis: { categories: annual.map((item) => item.period) } }}
						series={[{ name: 'Vendido', data: annual.map((item) => item.sold) }]}
					/>
				</Card>
				<Card title="Ganancias mensuales">
					<Chart
						type="line"
						height={300}
						options={{ chart: { toolbar: { show: false } }, xaxis: { categories: (monthly?.daily || []).map((item) => item.period.slice(-2)) } }}
						series={[{ name: 'Vendido', data: (monthly?.daily || []).map((item) => item.sold) }]}
					/>
				</Card>
			</div>
			<Card className="mt-4" title="Productos vendidos">
				<DataTable columns={[{ name: 'type', text: 'Producto' }, { name: 'quantity', text: 'Cantidad' }]} rows={products} infinite />
			</Card>
		</>
	);
};

export default Stats;
