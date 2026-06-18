import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { API, Formatters } from '@app';
import { Card, DataTable, PageHeader } from '@components';

const ClientsUnassigned = () => {
	const navigate = useNavigate();
	const [clients, setClients] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		API.endpoints.clients.getUnassigned()
			.then((rs) => setClients(rs.data.items || []))
			.finally(() => setLoading(false));
	}, []);

	return (
		<>
			<PageHeader title="Clientes sin asignar" breadcrumbs={['Inicio', 'Clientes', 'Sin asignar']} />
			<Card title="Clientes sin repartidor ni dia">
				<DataTable
					loading={loading}
					columns={[
						{ name: 'id', text: 'Codigo', render: (value) => `#${value}` },
						{ name: 'name', text: 'Nombre' },
						{ name: 'address', text: 'Direccion' },
						{ name: 'phone', text: 'Telefono' },
						{ name: 'debt', text: 'Deuda', render: Formatters.debtLabel },
					]}
					rows={clients}
					empty="No hay clientes sin asignar"
					pagination
					onRowClick={(row) => navigate(`/clientes/${row.id}`)}
				/>
			</Card>
		</>
	);
};

export default ClientsUnassigned;
