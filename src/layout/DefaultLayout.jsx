import { useCallback, useEffect, useState } from 'react';
import { LocalStorage } from '@app';
import { BreakpointCode } from '@constants';
import { useBreakpoint } from '@hooks';
import NavBar from './NavBar.jsx';
import TopBar from './TopBar.jsx';
import Footer from './Footer.jsx';
import { SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_EXPANDED_WIDTH } from './Layout.constants.js';

const DefaultLayout = ({ children }) => {
	const [navExpanded, setNavExpanded] = useState(() => Boolean(LocalStorage.getSidebarExpanded()));
	const [mobileNavOpen, setMobileNavOpen] = useState(false);
	const isMobile = useBreakpoint(BreakpointCode.MD);

	useEffect(() => {
		LocalStorage.setSidebarExpanded(navExpanded);
	}, [navExpanded]);

	useEffect(() => {
		if (!isMobile && mobileNavOpen) setMobileNavOpen(false);
	}, [isMobile, mobileNavOpen]);

	const handleToggleNav = useCallback(() => setNavExpanded((current) => !current), []);
	const handleOpenMobileNav = useCallback(() => setMobileNavOpen(true), []);
	const handleCloseMobileNav = useCallback(() => setMobileNavOpen(false), []);

	const marginLeft = navExpanded ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH;

	return (
		<div className="min-h-screen bg-bg-primary">
			<TopBar onMobileMenuClick={handleOpenMobileNav} />
			<NavBar
				expanded={navExpanded}
				isMobile={isMobile}
				mobileOpen={mobileNavOpen}
				onToggle={handleToggleNav}
				onMobileClose={handleCloseMobileNav}
			/>
			<main
				className="ml-0 flex min-h-[calc(100vh-64px)] flex-col px-4 py-5 [transition:margin-left_400ms_ease-in-out] sm:px-6 lg:px-8 md:ml-[var(--sidebar-width)]"
				style={{ '--sidebar-width': `${marginLeft}px` }}
			>
				<div className="flex-1">
					{children}
				</div>
				<Footer />
			</main>
		</div>
	);
};

export default DefaultLayout;
