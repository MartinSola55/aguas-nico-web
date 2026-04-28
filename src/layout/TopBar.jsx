import { useNavigate } from 'react-router';
import { LogOut, UserRound } from 'lucide-react';
import { API, Helpers, LocalStorage } from '@app';
import { Button } from '@components';
import { toast } from 'react-toastify';

const TopBar = () => {
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
			<button
				type="button"
				className="flex items-center gap-3"
				onClick={() => navigate('/')}
			>
				<span className="grid h-10 w-10 place-items-center rounded-[var(--radius-md)] bg-accent-primary text-lg font-bold text-white">AN</span>
				<span className="hidden text-base font-semibold text-text-primary sm:inline">Aguas Nico</span>
			</button>
			<div className="flex items-center gap-3">
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
