import { Link, useLocation } from 'react-router';
import {
	Banknote,
	BarChart3,
	Boxes,
	ClipboardList,
	FileSpreadsheet,
	Home,
	Map,
	Package,
	Route,
	Truck,
	Users,
} from 'lucide-react';
import { App } from '@app';

const items = [
	{ to: '/', label: 'Inicio', icon: Home },
	{ to: '/clientes', label: 'Clientes', icon: Users, admin: true },
	{ to: '/productos', label: 'Productos', icon: Package, admin: true },
	{ to: '/abonos', label: 'Abonos', icon: Boxes, admin: true },
	{ to: '/planillas', label: 'Planillas', icon: ClipboardList },
	{ to: '/repartidores', label: 'Repartidores', icon: Truck, admin: true },
	{ to: '/gastos', label: 'Gastos', icon: Banknote, admin: true },
	{ to: '/transferencias', label: 'Transferencias', icon: Route, admin: true },
	{ to: '/facturas', label: 'Facturas', icon: FileSpreadsheet, admin: true },
	{ to: '/estadisticas', label: 'Estadisticas', icon: BarChart3, admin: true },
];

const NavBar = () => {
	const { pathname } = useLocation();
	const navItems = items.filter((item) => !item.admin || App.isAdmin());
	return (
		<aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-60 shrink-0 overflow-y-auto border-r border-border-subtle bg-bg-secondary p-3 md:block">
			<nav className="flex flex-col gap-1">
				{navItems.map(({ to, label, icon: Icon }) => {
					const active = to === '/' ? pathname === '/' : pathname.startsWith(to);
					return (
						<Link
							key={to}
							to={to}
							className={`flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors ${
								active
									? 'bg-accent-primary-muted text-accent-primary'
									: 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
							}`}
						>
							<Icon size={18} />
							{label}
						</Link>
					);
				})}
			</nav>
		</aside>
	);
};

export default NavBar;
