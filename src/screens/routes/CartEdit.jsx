import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { API } from '@app';
import { PageHeader } from '@components';
import CartEditor from './CartEditor.jsx';
import { updateCartRequest } from './Routes.helpers.js';
import { toast } from 'react-toastify';

const CartEdit = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [cart, setCart] = useState(null);

	useEffect(() => {
		API.endpoints.carts.getForEdit({ id }).then((rs) => setCart(rs.data));
	}, [id]);

	const save = (payload) => {
		API.endpoints.carts.update(updateCartRequest(cart, payload)).then((rs) => {
			toast.success(rs.message);
			navigate(`/planillas/${cart.routeId}`);
		});
	};

	return (
		<>
			<PageHeader title="Editar bajada" breadcrumbs={['Inicio', 'Planillas', 'Bajada']} />
			{cart && (
				<CartEditor
					title={`Bajada de ${cart.clientName}`}
					products={cart.products || []}
					abonoProducts={cart.abonoProducts || []}
					returnedProducts={cart.returnedProducts || []}
					paymentMethods={cart.paymentMethods || []}
					showReturned
					allowReturnedOnly
					submitText="Guardar"
					onSubmit={save}
				/>
			)}
		</>
	);
};

export default CartEdit;
