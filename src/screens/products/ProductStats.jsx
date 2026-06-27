import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Chart from 'react-apexcharts';
import { API, DateHelper, Formatters } from '@app';
import { Card, PageHeader, Select, StatCard } from '@components';
import { Boxes, CircleDollarSign } from 'lucide-react';

const ProductStats = () => {
	const { id } = useParams();
	const [year, setYear] = useState(DateHelper.currentYear());
	const [years, setYears] = useState([]);
	const [data, setData] = useState(null);

	const load = () => {
		API.endpoints.products.getStats({ id, year }).then((rs) => setData(rs.data));
	};

	useEffect(load, [id, year]);

	useEffect(() => {
		API.endpoints.stats.getYears().then((rs) => setYears(rs.data.years || []));
	}, []);

	return (
		<>
			<PageHeader title={data?.product?.name || 'Producto'} breadcrumbs={['Inicio', 'Productos', 'Estadisticas']} />
			<div className="mb-4 grid gap-3 md:grid-cols-3">
				<Select label="Año" value={year} onChange={setYear} items={years.map((y) => ({ value: y, label: y }))} />
				<StatCard label="Stock en clientes" value={data?.clientStock || 0} icon={<Boxes size={18} />} />
				<StatCard label="Total vendido" value={Formatters.formatCurrency(data?.totalSold || 0)} icon={<CircleDollarSign size={18} />} tone="success" />
			</div>
			<Card title="Ventas anuales">
				<Chart
					type="bar"
					height={320}
					options={{ chart: { toolbar: { show: false } }, xaxis: { categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'] } }}
					series={[{ name: 'Unidades', data: data?.annualSales || [] }]}
				/>
			</Card>
		</>
	);
};

export default ProductStats;
