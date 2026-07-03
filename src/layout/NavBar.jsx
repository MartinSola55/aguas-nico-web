import { useRef } from 'react';
import { useLocation } from 'react-router';
import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { App } from '@app';
import { useClickOutside } from '@hooks';
import { navItems } from './NavBar.constants.js';
import { NavItem } from './navItem/NavItem.jsx';

export const NavBar = ({
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

	const visibleItems = navItems.filter((item) => {
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
						{visibleItems.map((item) => (
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

