import { App } from '@app';
import { AdminHome } from './AdminHome.jsx';
import { DealerHome } from './DealerHome.jsx';

// Enruta al dashboard segun el rol para no mezclar datos/componentes.
export const Home = () => (App.isDealer() ? <DealerHome /> : <AdminHome />);
