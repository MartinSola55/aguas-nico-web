import { useRef } from 'react';
import { Link, useLocation } from 'react-router';
import {
	Banknote,
	BarChart3,
	Boxes,
	ClipboardList,
	FileSpreadsheet,
	Handshake,
	Home,
	Package,
	PanelLeftClose,
	PanelLeftOpen,
	Route,
	Truck,
	Users,
	X,
} from 'lucide-react';
import { App } from '@app';
import { useClickOutside } from '@hooks';

const items = [
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

const NavItem = ({ to, label, icon: Icon, expanded, active, onNavigate }) => (
	<li className="group relative">
		<Link
			to={to}
			onClick={onNavigate}
			className={`flex items-center whitespace-nowrap rounded-[var(--radius-md)] border-l-[3px] py-2.5 pl-4 pr-3 text-sm font-medium transition-colors ${active
				? 'border-accent-primary bg-accent-primary-muted text-accent-primary'
				: 'border-transparent text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
				}`}
		>
			<Icon size={18} className="shrink-0" />
			<span
				className="ml-3"
				style={{
					clipPath: expanded ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
					opacity: expanded ? 1 : 0,
					transition: 'clip-path 400ms ease-in-out, opacity 400ms ease-in-out',
				}}
			>
				{label}
			</span>
		</Link>
		{!expanded && (
			<div className="invisible absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-[var(--radius-md)] border border-border-subtle bg-bg-elevated px-2.5 py-1.5 text-xs font-medium text-text-primary opacity-0 shadow-md transition-all duration-[var(--transition-fast)] group-hover:visible group-hover:opacity-100 max-md:hidden">
				{label}
			</div>
		)}
	</li>
);

const NavBar = ({
	expanded = false,
	isMobile = false,
	mobileOpen = false,
	onToggle = () => { },
	onMobileClose = () => { },
}) => {
	const navRef = useRef(null);
	const { pathname } = useLocation();
	const showLabels = isMobile ? mobileOpen : expanded;
	const ToggleIcon = expanded ? PanelLeftClose : PanelLeftOpen;

	useClickOutside(navRef, onMobileClose, isMobile && mobileOpen);

	const navItems = items.filter((item) => {
		if (item.admin) return App.isAdmin();
		if (item.dealer) return App.isDealer();
		return true;
	});

	const isActive = (to) => (to === '/' ? pathname === '/' : pathname.startsWith(to));

	return (
		<>
			<div
				className={`fixed inset-0 z-[calc(var(--z-sticky)-1)] bg-black/50 transition-opacity duration-[var(--transition-base)] md:hidden ${mobileOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
				onClick={onMobileClose}
			/>
			<aside
				ref={navRef}
				className={`fixed bottom-0 left-0 top-16 z-[var(--z-sticky)] flex flex-col overflow-hidden border-r border-border-subtle bg-bg-secondary [transition:width_400ms_ease-in-out,transform_400ms_ease-in-out] ${expanded ? 'w-[240px]' : 'w-[64px]'} max-md:top-0 max-md:w-[280px] ${mobileOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'}`}
			>
				<div className="flex h-16 shrink-0 items-center justify-between border-b border-border-subtle px-4 md:hidden">
					<span className="text-base font-semibold text-text-primary">Menú</span>
					<button
						type="button"
						onClick={onMobileClose}
						className="rounded-[var(--radius-md)] p-1.5 text-text-muted transition-colors hover:bg-bg-tertiary hover:text-text-primary"
					>
						<X size={20} />
					</button>
				</div>
				<nav className={`flex-1 overflow-y-auto overflow-x-hidden [transition:padding_400ms_ease-in-out] ${expanded ? 'p-3' : 'p-2 max-md:p-3'}`}>
					<ul className="m-0 flex list-none flex-col gap-1 p-0">
						{navItems.map((item) => (
							<NavItem
								key={item.to}
								{...item}
								expanded={showLabels}
								active={isActive(item.to)}
								onNavigate={isMobile ? onMobileClose : undefined}
							/>
						))}
					</ul>
				</nav>
				<button
					type="button"
					onClick={onToggle}
					title={expanded ? 'Colapsar menú' : 'Expandir menú'}
					className="hidden shrink-0 items-center whitespace-nowrap border-t border-border-subtle py-3 pl-5 pr-4 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary md:flex"
				>
					<ToggleIcon size={20} className="shrink-0" />
					<span
						className="ml-3"
						style={{
							clipPath: expanded ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
							opacity: expanded ? 1 : 0,
							transition: 'clip-path 400ms ease-in-out, opacity 400ms ease-in-out',
						}}
					>
						Colapsar
					</span>
				</button>
			</aside>
		</>
	);
};

export default NavBar;
