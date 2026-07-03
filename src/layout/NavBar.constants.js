import {
	Banknote,
	BarChart3,
	Boxes,
	ClipboardList,
	FileSpreadsheet,
	Handshake,
	Home,
	Package,
	Route,
	Truck,
	Users,
} from 'lucide-react';

export const navItems = [
	{ to: '/', label: 'Inicio', icon: Home },
	{ to: '/clientes', label: 'Clientes', icon: Users, admin: true },
	{ to: '/clientes/nuevo', label: 'Agregar cliente', icon: Users, dealer: true },
	{ to: '/productos', label: 'Productos', icon: Package, admin: true },
	{ to: '/abonos', label: 'Abonos', icon: Boxes, admin: true },
	{ to: '/planillas', label: 'Planillas', icon: ClipboardList },
	{ to: '/repartidores', label: 'Repartidores', icon: Truck, admin: true },
	{ to: '/gastos', label: 'Gastos', icon: Banknote, admin: true },
	{ to: '/transferencias', label: 'Transferencias', icon: Route, admin: true },
	{ to: '/facturas', label: 'Facturas', icon: FileSpreadsheet, admin: true },
	{ to: '/terceros', label: 'Terceros', icon: Handshake, admin: true },
	{ to: '/estadisticas', label: 'Estadisticas', icon: BarChart3, admin: true },
];
