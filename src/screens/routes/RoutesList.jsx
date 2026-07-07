import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { Plus, Printer } from 'lucide-react';
import { API, App, DateHelper, Formatters } from '@app';
import { Button, Card, ConfirmButton, DataTable, PageHeader } from '@components';
import { DayCombo, DealerCombo } from '@screens/shared';
import { CreateRouteModal } from './CreateRouteModal.jsx';
import { routeRequest } from './Routes.helpers.js';
import { printRouteSheet } from './PrintSheet.js';

export const RoutesList = () => {
	const navigate = useNavigate();
	const [routes, setRoutes] = useState([]);
	const [dealers, setDealers] = useState([]);
	const [day, setDay] = useState(DateHelper.toDay(new Date()));
	const [userId, setUserId] = useState('');
	const createRouteModalRef = useRef(null);

	const load = () => {
		API.endpoints.routes.getAll({ day: day || 0, userId: userId || '' }).then((rs) => setRoutes(rs.data.routes || []));
	};

	useEffect(() => {
		if (App.isAdmin()) API.endpoints.dealers.getAll().then((rs) => setDealers(rs.data.items || []));
		load();
	}, []);

	const create = (form, onCreated) => {
		API.endpoints.routes.create(routeRequest(form)).then((rs) => {
			toast.success(rs.message);
			onCreated?.();
			load();
			navigate(`/planillas/${rs.data.id}`);
		});
	};

	const renewAll = () => API.endpoints.abonos.renewAll().then((rs) => toast.success(rs.message));

	const printSheet = (event, route) => {
		event.stopPropagation();
		API.endpoints.dealers.getSheets({ dealerId: route.userId }).then((rs) => {
			const sheets = (rs.data.sheets || []).filter((sheet) => Number(sheet.day) === Number(route.dayOfWeek));
			printRouteSheet({ dealerName: route.dealerName, day: route.dayOfWeek, sheets });
		});
	};

	const openRoute = (route) => {
		if (App.isDealer()) {
			if (window.confirm('Comenzar planilla?')) {
				API.endpoints.routes.createByDealer({ routeId: route.id }).then((rs) => {
					toast.success(rs.message);
					navigate(`/planillas/${rs.data.id}`);
				});
			}
			return;
		}
		navigate(`/planillas/${route.id}`);
	};

	return (
		<>
			<CreateRouteModal ref={createRouteModalRef} dealers={dealers} onCreate={create} />
			<PageHeader
				title="Planillas"
				breadcrumbs={['Inicio', 'Planillas']}
				actions={App.isAdmin() && <><ConfirmButton variant="secondary" message="Renovar todos los abonos?" onConfirm={renewAll}>Renovar abonos</ConfirmButton><Button onClick={() => createRouteModalRef.current?.open()}><Plus size={16} />Nueva planilla</Button></>}
			/>
			<Card title="Planillas">
				{App.isAdmin() && (
					<div className="mb-4 grid gap-3 md:grid-cols-3">
						<DayCombo label="Dia" clearable value={day} onChange={(value) => setDay(value || '')} />
						<DealerCombo label="Repartidor" clearable dealers={dealers} value={userId} onChange={(value) => setUserId(value || '')} />
						<div className="flex items-end gap-2">
							<Button variant="secondary" onClick={load}>Buscar</Button>
						</div>
					</div>
				)}
				<DataTable
					columns={[
						...(App.isAdmin() ? [{ name: 'dealerName', text: 'Reparto' }] : []),
						{ name: 'dayOfWeek', text: 'Dia', render: Formatters.dayName },
						...(App.isAdmin() ? [{ name: 'truckNumber', text: 'Camion', render: (value) => value || '-' }] : []),
						{ name: 'totalCarts', text: 'Envios a realizar' },
						...(App.isAdmin() ? [{ name: 'print', text: 'Planilla', render: (value, route) => <Button size="sm" variant="secondary" onClick={(event) => printSheet(event, route)}><Printer size={16} />Imprimir</Button> }] : []),
					]}
					rows={routes}
					pagination
					onRowClick={openRoute}
				/>
			</Card>
		</>
	);
};
