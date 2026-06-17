import { lazy, Suspense } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { App } from '@app';
import { Loader } from '@components';
import DefaultLayout from './DefaultLayout.jsx';

const Login = lazy(() => import('../screens/public/Login.jsx'));
const NotFound = lazy(() => import('../screens/public/NotFound.jsx'));
const NotAllowed = lazy(() => import('../screens/public/NotAllowed.jsx'));
const Home = lazy(() => import('../screens/main/Home.jsx'));
const ClientsList = lazy(() => import('../screens/clients/ClientsList.jsx'));
const ClientForm = lazy(() => import('../screens/clients/ClientForm.jsx'));
const ClientDetails = lazy(() => import('../screens/clients/ClientDetails.jsx'));
const ProductsList = lazy(() => import('../screens/products/ProductsList.jsx'));
const ProductStats = lazy(() => import('../screens/products/ProductStats.jsx'));
const AbonosList = lazy(() => import('../screens/abonos/AbonosList.jsx'));
const RoutesList = lazy(() => import('../screens/routes/RoutesList.jsx'));
const RouteDetails = lazy(() => import('../screens/routes/RouteDetails.jsx'));
const RouteEdit = lazy(() => import('../screens/routes/RouteEdit.jsx'));
const ManualCart = lazy(() => import('../screens/routes/ManualCart.jsx'));
const CartEdit = lazy(() => import('../screens/routes/CartEdit.jsx'));
const DealersList = lazy(() => import('../screens/dealers/DealersList.jsx'));
const DealerDetails = lazy(() => import('../screens/dealers/DealerDetails.jsx'));
const DealerSheets = lazy(() => import('../screens/dealers/DealerSheets.jsx'));
const ExpensesList = lazy(() => import('../screens/expenses/ExpensesList.jsx'));
const TransfersList = lazy(() => import('../screens/transfers/TransfersList.jsx'));
const Invoices = lazy(() => import('../screens/invoices/Invoices.jsx'));
const Stats = lazy(() => import('../screens/stats/Stats.jsx'));
const TercerosList = lazy(() => import('../screens/terceros/TercerosList.jsx'));

const PrivateRoute = () => (App.isLoggedIn() ? <Outlet /> : <Navigate to="/login" replace />);
const AdminRoute = () => (App.isAdmin() ? <Outlet /> : <Navigate to="/notAllowed" replace />);
const Shell = ({ children }) => <DefaultLayout>{children}</DefaultLayout>;

export const AppRoutes = () => (
	<>
		<ToastContainer position="top-right" theme="light" />
		<Suspense fallback={<div className="grid min-h-screen place-items-center"><Loader /></div>}>
			<Routes>
				<Route element={<PrivateRoute />}>
					<Route path="/" element={<Shell><Home /></Shell>} />
					<Route path="/planillas" element={<Shell><RoutesList /></Shell>} />
					<Route path="/planillas/:id" element={<Shell><RouteDetails /></Shell>} />
					<Route path="/planillas/:id/manual" element={<Shell><ManualCart /></Shell>} />
					<Route path="/bajadas/:id/editar" element={<Shell><CartEdit /></Shell>} />
					<Route element={<AdminRoute />}>
						<Route path="/clientes" element={<Shell><ClientsList /></Shell>} />
						<Route path="/clientes/nuevo" element={<Shell><ClientForm /></Shell>} />
						<Route path="/clientes/:id" element={<Shell><ClientDetails /></Shell>} />
						<Route path="/productos" element={<Shell><ProductsList /></Shell>} />
						<Route path="/productos/:id/estadisticas" element={<Shell><ProductStats /></Shell>} />
						<Route path="/abonos" element={<Shell><AbonosList /></Shell>} />
						<Route path="/planillas/nueva" element={<Shell><RoutesList showCreate /></Shell>} />
						<Route path="/planillas/:id/editar" element={<Shell><RouteEdit /></Shell>} />
						<Route path="/repartidores" element={<Shell><DealersList /></Shell>} />
						<Route path="/repartidores/:id" element={<Shell><DealerDetails /></Shell>} />
						<Route path="/repartidores/:id/planillas" element={<Shell><DealerSheets /></Shell>} />
						<Route path="/gastos" element={<Shell><ExpensesList /></Shell>} />
						<Route path="/transferencias" element={<Shell><TransfersList /></Shell>} />
						<Route path="/facturas" element={<Shell><Invoices /></Shell>} />
						<Route path="/estadisticas" element={<Shell><Stats /></Shell>} />
						<Route path="/terceros" element={<Shell><TercerosList /></Shell>} />
					</Route>
				</Route>
				<Route path="/login" element={<Login />} />
				<Route path="/notAllowed" element={<NotAllowed />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Suspense>
	</>
);
