import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { API, Formatters } from '@app';
import { Card, DataTable, PageHeader } from '@components';

const DealerSheets = () => {
	const { id } = useParams();
	const [sheets, setSheets] = useState([]);

	useEffect(() => {
		API.endpoints.dealers.getSheets({ dealerId: id }).then((rs) => setSheets(rs.data.sheets || []));
	}, [id]);

	return (
		<>
			<PageHeader title="Planillas del repartidor" breadcrumbs={['Inicio', 'Repartidores', 'Planillas']} />
			<div className="space-y-4">
				{sheets.map((sheet) => (
					<Card key={`${sheet.day}-${sheet.clientId}`} title={`${Formatters.dayName(sheet.day)} - ${sheet.clientName}`} subtitle={`${sheet.clientAddress} - ${sheet.clientPhone}`}>
						<div className="mb-3 text-sm text-text-muted">
							Deuda: {Formatters.formatCurrency(sheet.clientDebt)} {sheet.clientObservations ? `- ${sheet.clientObservations}` : ''}
						</div>
						<div className="grid gap-4 md:grid-cols-3">
							<DataTable columns={[{ name: 'typeName', text: 'Producto' }, { name: 'stock', text: 'Stock' }, { name: 'price', text: 'Precio', render: Formatters.formatCurrency }]} rows={sheet.products || []} infinite />
							<DataTable columns={[{ name: 'name', text: 'Abono' }, { name: 'price', text: 'Precio', render: Formatters.formatCurrency }]} rows={sheet.abonos || []} infinite />
							<DataTable columns={[{ name: 'typeName', text: 'Producto abono' }, { name: 'available', text: 'Disponible' }, { name: 'stock', text: 'Stock' }]} rows={sheet.abonoProducts || []} infinite />
						</div>
					</Card>
				))}
			</div>
		</>
	);
};

export default DealerSheets;
