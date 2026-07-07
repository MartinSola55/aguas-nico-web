import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { API, DateHelper, Formatters } from '@app';
import { Card, DataTable, PageHeader } from '@components';
import { DayCombo } from '@screens/shared';

export const DealerHome = () => {
	const navigate = useNavigate();
	const [day, setDay] = useState(DateHelper.toDay(new Date()));
	const [routes, setRoutes] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		API.endpoints.home.getDashboard({ day })
			.then((rs) => setRoutes(rs.data.dealerRoutes || []))
			.catch(() => null)
			.finally(() => setLoading(false));
	}, [day]);

	const selectedDayName = Formatters.dayName(day);
	const dayAction = (
		<div className="w-44">
			<DayCombo label="Dia" value={day} onChange={setDay} />
		</div>
	);

	return (
		<>
			<PageHeader title="Inicio" breadcrumbs={['Inicio']} />
			<Card title={`Mis repartos de los ${selectedDayName}`} actions={dayAction}>
				<DataTable
					columns={[
						{ name: 'createdAt', text: 'Fecha', render: Formatters.formatDate },
						{ name: 'completedCarts', text: 'Envios completados', render: (_, row) => `${row.completedCarts}/${row.totalCarts}` },
						{ name: 'isClosed', text: 'Estado', render: (_, row) => row.isClosed ? 'Cerrada' : row.pendingCarts === 0 ? 'Completado' : 'Pendiente' },
					]}
					rows={routes}
					loading={loading}
					empty={`No hay repartos para los ${selectedDayName}`}
					infinite
					onRowClick={(row) => navigate(`/planillas/${row.id}`)}
				/>
			</Card>
		</>
	);
};
