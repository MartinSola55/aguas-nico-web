import { Link } from 'react-router';

const NotFound = () => (
	<div className="grid min-h-screen place-items-center bg-bg-primary p-6 text-center">
		<div>
			<h1 className="text-3xl font-semibold">Pagina no encontrada</h1>
			<Link to="/" className="mt-3 inline-block">Volver al inicio</Link>
		</div>
	</div>
);

export default NotFound;
