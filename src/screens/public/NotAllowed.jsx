import { Link } from 'react-router';

const NotAllowed = () => (
	<div className="grid min-h-screen place-items-center bg-bg-primary p-6 text-center">
		<div>
			<h1 className="text-3xl font-semibold">Sin permisos</h1>
			<p className="text-text-muted">Tu usuario no puede acceder a esta seccion.</p>
			<Link to="/" className="mt-3 inline-block">Volver al inicio</Link>
		</div>
	</div>
);

export default NotAllowed;
