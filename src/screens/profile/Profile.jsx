import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { API, App, Helpers, LocalStorage } from '@app';
import { Button, Card, Input, PageHeader } from '@components';
import { Roles } from '@constants';

const isStrongPassword = (value = '') => [
	value.length >= 8,
	/[A-Z]/.test(value),
	/[a-z]/.test(value),
	/[0-9]/.test(value),
].every(Boolean);

export const Profile = () => {
	const { id } = useParams();
	const isAdmin = App.isAdmin();
	const ownId = LocalStorage.getUserId();
	const targetId = id || ownId;
	const isSelf = !id || String(id) === String(ownId);

	const [profile, setProfile] = useState(null);
	const [truckNumber, setTruckNumber] = useState('');
	const [savingTruck, setSavingTruck] = useState(false);
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [savingPassword, setSavingPassword] = useState(false);

	const load = () => {
		API.endpoints.user.getProfile(id ? { id } : {}).then((rs) => {
			setProfile(rs.data);
			setTruckNumber(rs.data?.truckNumber ? String(rs.data.truckNumber) : '');
		});
	};

	useEffect(load, [id]);

	const isDealer = profile?.role === Roles.Dealer;
	const canEditTruck = isAdmin && isDealer;
	const title = useMemo(() => (isSelf ? 'Mi perfil' : profile?.name || 'Perfil'), [isSelf, profile]);

	const saveTruck = () => {
		const value = Number(truckNumber);
		if (!Number.isInteger(value) || value <= 0) {
			toast.error('Ingresa un número de camión válido.');
			return;
		}
		setSavingTruck(true);
		API.endpoints.user.updateTruckNumber({ id: targetId, truckNumber: value })
			.then((rs) => {
				toast.success(rs.message);
				load();
			})
			.finally(() => setSavingTruck(false));
	};

	const savePassword = () => {
		if (!isStrongPassword(password)) {
			toast.error('La contraseña necesita 8 caracteres, una mayúscula, una minúscula y un número.');
			return;
		}
		if (password !== confirmPassword) {
			toast.error('Las contraseñas no coinciden.');
			return;
		}
		setSavingPassword(true);
		API.endpoints.user.updatePassword({ id: targetId, password })
			.then((rs) => {
				toast.success(rs.message);
				setPassword('');
				setConfirmPassword('');
			})
			.finally(() => setSavingPassword(false));
	};

	const breadcrumbs = isSelf ? ['Inicio', 'Mi perfil'] : ['Inicio', 'Repartidores', 'Perfil'];

	return (
		<>
			<PageHeader title={title} breadcrumbs={breadcrumbs} />
			<div className="grid gap-4 xl:grid-cols-2">
				<Card title="Datos">
					<div className="grid gap-3">
						<Input label="Nombre" value={profile?.name || ''} disabled />
						<Input label="Email" value={profile?.email || ''} disabled />
						<Input label="Rol" value={Helpers.getRoleName(profile?.role)} disabled />
						{isDealer && (
							<Input
								label="Número de camión"
								type="number"
								min={1}
								value={truckNumber}
								disabled={!canEditTruck}
								onChange={setTruckNumber}
							/>
						)}
						{canEditTruck && (
							<div className="flex justify-end">
								<Button onClick={saveTruck} disabled={savingTruck}>
									{savingTruck ? 'Guardando...' : 'Guardar camión'}
								</Button>
							</div>
						)}
					</div>
				</Card>
				<Card title="Cambiar contraseña">
					<div className="grid gap-3">
						<Input label="Nueva contraseña" type="password" value={password} onChange={setPassword} />
						<Input label="Confirmar contraseña" type="password" value={confirmPassword} onChange={setConfirmPassword} />
						<p className="m-0 text-xs text-text-muted">
							Mínimo 8 caracteres, con mayúscula, minúscula y número.
						</p>
						<div className="flex justify-end">
							<Button onClick={savePassword} disabled={savingPassword}>
								{savingPassword ? 'Guardando...' : 'Guardar contraseña'}
							</Button>
						</div>
					</div>
				</Card>
			</div>
		</>
	);
};
