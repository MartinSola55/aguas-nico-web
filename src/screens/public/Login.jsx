import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Droplets } from 'lucide-react';
import { API, LocalStorage } from '@app';
import { Button, Input } from '@components';
import { toast } from 'react-toastify';

const Login = () => {
	const navigate = useNavigate();
	const [form, setForm] = useState({ email: '', password: '' });
	const [loading, setLoading] = useState(false);

	const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

	const submit = (e) => {
		e.preventDefault();
		setLoading(true);
		API.endpoints.auth.login(form)
			.then((rs) => {
				const { token, sessionExpiration, user } = rs.data;
				LocalStorage.setToken(token);
				LocalStorage.setSessionExpiration(sessionExpiration);
				LocalStorage.setUserId(user.id);
				LocalStorage.setUserRole(user.role);
				LocalStorage.setUserName(user.name);
				LocalStorage.setUserEmail(user.email);
				LocalStorage.setTruckNumber(user.truckNumber);
				navigate('/');
			})
			.catch((error) => {
				if (!error?.toastShown) toast.error(error.error?.message || error.message);
			})
			.finally(() => setLoading(false));
	};

	return (
		<div className="grid min-h-screen place-items-center bg-bg-primary p-4">
			<form onSubmit={submit} className="w-full max-w-md rounded-[var(--radius-md)] border border-border-subtle bg-bg-secondary p-6 shadow-md">
				<div className="mb-6 flex items-center gap-3">
					<div className="grid h-12 w-12 place-items-center rounded-[var(--radius-md)] bg-linear-to-br from-[color-mix(in_srgb,var(--color-accent-primary),white_22%)]/85 to-[color-mix(in_srgb,var(--color-accent-primary),black_22%)]/85 text-text-inverse shadow-[inset_0_1px_0_0_color-mix(in_srgb,white,transparent_55%),var(--shadow-sm)]">
						<Droplets size={26} />
					</div>
					<div>
						<h1 className="m-0 text-xl font-semibold">Aguas Nico</h1>
						<p className="m-0 text-sm text-text-muted">Gestion de repartos</p>
					</div>
				</div>
				<div className="space-y-4">
					<Input label="Email" type="email" required value={form.email} onChange={(value) => update('email', value)} />
					<Input label="Password" type="password" required value={form.password} onChange={(value) => update('password', value)} />
					<Button type="submit" className="w-full" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</Button>
				</div>
			</form>
		</div>
	);
};

export default Login;
