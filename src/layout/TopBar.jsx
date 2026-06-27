import { useNavigate } from 'react-router';
import { LogOut, Menu, UserRound } from 'lucide-react';
import { API, Helpers, LocalStorage } from '@app';
import { Button, ThemeToggle } from '@components';
import { toast } from 'react-toastify';

const TopBar = ({ onMobileMenuClick = () => { } }) => {
	const navigate = useNavigate();

	const logout = () => {
		API.endpoints.auth.logout()
			.catch(() => null)
			.finally(() => {
				LocalStorage.clearSessionData();
				navigate('/login');
			});
	};

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
				<div className="hidden text-right sm:block">
					<div className="text-sm font-medium text-text-primary">{LocalStorage.getUserName()}</div>
					<div className="text-xs text-text-muted">{Helpers.getRoleName(LocalStorage.getUserRole())}</div>
				</div>
				<div className="grid h-9 w-9 place-items-center rounded-full bg-accent-primary-muted text-accent-primary">
					<UserRound size={18} />
				</div>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => {
						toast.dismiss();
						logout();
					}}
				>
					<LogOut size={16} />
					<span className="hidden sm:inline">Salir</span>
				</Button>
			</div>
		</header>
	);
};

export default TopBar;
