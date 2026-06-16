import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { Plus } from 'lucide-react';
import { API, App, Formatters, Helpers, useCatalog } from '@app';
import { Button, Card, ConfirmButton, DataTable, Modal, PageHeader, Select } from '@components';
import { routeRequest } from './Routes.helpers.js';

const RoutesList = () => {
	const navigate = useNavigate();
	const { combos } = useCatalog();
	const [routes, setRoutes] = useState([]);
	const [dealers, setDealers] = useState([]);
	const [day, setDay] = useState(() => {
		const today = new Date().getDay();
		return today >= 1 && today <= 5 ? today : '';
	});
	const [userId, setUserId] = useState('');
	const [modal, setModal] = useState(false);
	const [form, setForm] = useState({ userId: '', dayOfWeek: '' });

	const dealerItems = useMemo(() => Helpers.dealerComboItems(dealers), [dealers]);

	const load = () => {
		API.endpoints.routes.getAll({ day: day || 0, userId: userId || '' }).then((rs) => setRoutes(rs.data.routes || []));
	};

	useEffect(() => {
		if (App.isAdmin()) API.endpoints.dealers.getAll().then((rs) => setDealers(rs.data.items || []));
		load();
	}, []);

	const create = () => {
		API.endpoints.routes.create(routeRequest(form)).then((rs) => {
			toast.success(rs.message);
			setModal(false);
			load();
			navigate(`/planillas/${rs.data.id}`);
		});
	};

	const renewAll = () => API.endpoints.abonos.renewAll().then((rs) => toast.success(rs.message));

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
			<PageHeader
				title="Planillas"
				breadcrumbs={['Inicio', 'Planillas']}
				actions={App.isAdmin() && <><ConfirmButton variant="secondary" message="Renovar todos los abonos?" onConfirm={renewAll}>Renovar abonos</ConfirmButton><Button onClick={() => setModal(true)}><Plus size={16} />Nueva planilla</Button></>}
			/>
			<Card title="Planillas">
				{App.isAdmin() && (
					<div className="mb-4 grid gap-3 md:grid-cols-3">
						<Select label="Dia" clearable items={combos.days} value={day} onChange={(value) => setDay(value || '')} />
						<Select label="Repartidor" clearable items={dealerItems} value={userId} onChange={(value) => setUserId(value || '')} />
						<div className="flex items-end gap-2">
							<Button variant="secondary" onClick={load}>Buscar</Button>
						</div>
					</div>
				)}
				<DataTable
					columns={[
						{ name: 'dealerName', text: 'Reparto' },
						{ name: 'truckNumber', text: 'Camion', render: (value) => value || '-' },
						{ name: 'dayOfWeek', text: 'Dia', render: Formatters.dayName },
						{ name: 'totalCarts', text: 'Envios a realizar' },
						{ name: 'createdAt', text: 'Fecha', render: Formatters.formatDate },
					]}
					rows={routes}
					pagination
					onRowClick={openRoute}
				/>
			</Card>
			<Modal
				open={modal}
				title="Nueva planilla"
				onClose={() => setModal(false)}
				footer={<><Button variant="secondary" onClick={() => setModal(false)}>Cerrar</Button><Button onClick={create}>Crear</Button></>}
			>
				<div className="grid gap-3">
					<Select label="Repartidor" items={dealerItems} value={form.userId} onChange={(value) => setForm((f) => ({ ...f, userId: value }))} />
					<Select label="Dia" items={combos.days} value={form.dayOfWeek} onChange={(value) => setForm((f) => ({ ...f, dayOfWeek: value }))} />
				</div>
			</Modal>
		</>
	);
};

export default RoutesList;
