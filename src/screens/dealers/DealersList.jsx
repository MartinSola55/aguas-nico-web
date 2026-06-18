import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { API } from '@app';
import { Card, DataTable, PageHeader } from '@components';

const DealersList = () => {
	const navigate = useNavigate();
	const [dealers, setDealers] = useState([]);

	useEffect(() => {
		API.endpoints.dealers.getAll().then((rs) => setDealers(rs.data.items || []));
	}, []);

	return (
		<>
			<PageHeader title="Repartidores" breadcrumbs={['Inicio', 'Repartidores']} />
			<Card title="Listado">
				<DataTable
					columns={[
						{ name: 'name', text: 'Nombre' },
						{ name: 'truckNumber', text: 'Camion', render: (value) => value || '-' },
						{ name: 'email', text: 'Email' },
					]}
					rows={dealers}
					pagination
					onRowClick={(row) => navigate(`/repartidores/${row.id}`)}
				/>
			</Card>
		</>
	);
};

export default DealersList;
