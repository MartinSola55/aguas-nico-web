import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { LogOut, Menu, UserRound } from 'lucide-react';
import { API, App, Helpers, LocalStorage } from '@app';
import { Button, ThemeToggle } from '@components';
import { toast } from 'react-toastify';

export const TopBar = ({ onMobileMenuClick = () => { } }) => {
	const navigate = useNavigate();
	const [showUser, setShowUser] = useState(false);
	const userMenuRef = useRef(null);

	const userName = LocalStorage.getUserName();
	const userEmail = LocalStorage.getUserEmail();
	const truckNumber = LocalStorage.getTruckNumber();
	const isDealer = App.isDealer();
	const roleName = Helpers.getRoleName(LocalStorage.getUserRole());

	const logout = () => {
		toast.dismiss();
		API.endpoints.auth.logout()
			.catch(() => null)
			.finally(() => {
				LocalStorage.clearSessionData();
				navigate('/login');
			});
	};

	const goToProfile = () => {
		setShowUser(false);
		navigate('/mi-perfil');
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (userMenuRef.current && !userMenuRef.current.contains(event.target))
				setShowUser(false);
		};

		if (showUser) document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [showUser]);

	return (
		<header className="sticky top-0 z-[var(--z-sticky)] flex h-16 items-center justify-between border-b border-border-subtle bg-bg-secondary px-4 shadow-sm">
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={onMobileMenuClick}
					className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary md:hidden"
					title="Abrir menú"
				>
					<Menu size={20} />
				</button>
				<button
					type="button"
					className="flex items-center gap-3"
					onClick={() => navigate('/')}
				>
					<span className="grid h-10 w-10 place-items-center rounded-[var(--radius-md)] bg-linear-to-br from-[color-mix(in_srgb,var(--color-accent-primary),white_22%)]/85 to-[color-mix(in_srgb,var(--color-accent-primary),black_22%)]/85 text-lg font-bold text-text-inverse shadow-[inset_0_1px_0_0_color-mix(in_srgb,white,transparent_55%),var(--shadow-sm)]">AN</span>
					<span className="hidden text-base font-semibold text-text-primary sm:inline">Aguas Nico</span>
				</button>
			</div>
			<div className="flex items-center gap-3">
				<ThemeToggle />
				<div className="relative" ref={userMenuRef}>
					<button
						type="button"
						onClick={() => setShowUser((current) => !current)}
						title="Mi perfil"
						className={`flex items-center gap-3 rounded-full p-1 pr-2 transition-colors ${showUser ? 'bg-bg-tertiary' : 'hover:bg-bg-tertiary'}`}
					>
						<div className="grid h-9 w-9 place-items-center rounded-full bg-accent-primary-muted text-accent-primary">
							<UserRound size={18} />
						</div>
						<div className="hidden text-left sm:block">
							<div className="text-sm font-medium text-text-primary">{userName}</div>
							<div className="text-xs text-text-muted">
								{roleName}{isDealer && truckNumber ? ` · Camión ${truckNumber}` : ''}
							</div>
						</div>
					</button>
					<div
						className={`absolute right-0 top-[calc(100%+0.5rem)] z-[var(--z-dropdown)] w-72 origin-top-right rounded-[var(--radius-md)] border border-border-subtle bg-bg-secondary shadow-lg transition-all duration-200 ease-out
							${showUser ? 'visible translate-y-0 scale-100 opacity-100' : 'invisible -translate-y-1 scale-[0.98] opacity-0'}
						`}
					>
						<div className="flex items-center gap-3 border-b border-border-subtle p-4">
							<div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent-primary-muted text-accent-primary">
								<UserRound size={22} />
							</div>
							<div className="min-w-0">
								<div className="truncate text-sm font-semibold text-text-primary">{userName}</div>
								{userEmail && <div className="truncate text-xs text-text-muted">{userEmail}</div>}
								<span className="mt-1.5 inline-block rounded-full bg-accent-primary-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-primary">
									{roleName}{isDealer && truckNumber ? ` · Camión ${truckNumber}` : ''}
								</span>
							</div>
						</div>
						<div className="flex flex-col gap-2 p-3">
							<Button variant="secondary" className="w-full" onClick={goToProfile}>
								<UserRound size={16} />
								Mi perfil
							</Button>
							<Button variant="ghost" className="w-full" onClick={logout}>
								<LogOut size={16} />
								Cerrar sesión
							</Button>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};
