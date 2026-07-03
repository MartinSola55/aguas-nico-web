/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loader } from '@components';
import { LayoutShell } from './LayoutShell.jsx';
import { AdminRoute } from './routeGuards/AdminRoute.jsx';
import { PrivateRoute } from './routeGuards/PrivateRoute.jsx';

const lazyScreen = (loader, name) => lazy(() => loader().then((module) => ({ default: module[name] })));

export const Login = lazyScreen(() => import('../screens/public/Login.jsx'), 'Login');
export const NotFound = lazyScreen(() => import('../screens/public/NotFound.jsx'), 'NotFound');
export const NotAllowed = lazyScreen(() => import('../screens/public/NotAllowed.jsx'), 'NotAllowed');
export const Home = lazyScreen(() => import('../screens/main/Home.jsx'), 'Home');
export const ClientsList = lazyScreen(() => import('../screens/clients/ClientsList.jsx'), 'ClientsList');
export const ClientsUnassigned = lazyScreen(() => import('../screens/clients/ClientsUnassigned.jsx'), 'ClientsUnassigned');
export const ClientForm = lazyScreen(() => import('../screens/clients/ClientForm.jsx'), 'ClientForm');
export const ClientDetails = lazyScreen(() => import('../screens/clients/ClientDetails.jsx'), 'ClientDetails');
export const ProductsList = lazyScreen(() => import('../screens/products/ProductsList.jsx'), 'ProductsList');
export const ProductStats = lazyScreen(() => import('../screens/products/ProductStats.jsx'), 'ProductStats');
export const AbonosList = lazyScreen(() => import('../screens/abonos/AbonosList.jsx'), 'AbonosList');
export const RoutesList = lazyScreen(() => import('../screens/routes/RoutesList.jsx'), 'RoutesList');
export const RouteDetails = lazyScreen(() => import('../screens/routes/RouteDetails.jsx'), 'RouteDetails');
export const RouteEdit = lazyScreen(() => import('../screens/routes/RouteEdit.jsx'), 'RouteEdit');
export const ManualCart = lazyScreen(() => import('../screens/routes/carts/ManualCart.jsx'), 'ManualCart');
export const CartEdit = lazyScreen(() => import('../screens/routes/carts/CartEdit.jsx'), 'CartEdit');
export const DealersList = lazyScreen(() => import('../screens/dealers/DealersList.jsx'), 'DealersList');
export const DealerDetails = lazyScreen(() => import('../screens/dealers/DealerDetails.jsx'), 'DealerDetails');
export const DealerSheets = lazyScreen(() => import('../screens/dealers/DealerSheets.jsx'), 'DealerSheets');
export const ExpensesList = lazyScreen(() => import('../screens/expenses/ExpensesList.jsx'), 'ExpensesList');
export const TransfersList = lazyScreen(() => import('../screens/transfers/TransfersList.jsx'), 'TransfersList');
export const Invoices = lazyScreen(() => import('../screens/invoices/Invoices.jsx'), 'Invoices');
export const Stats = lazyScreen(() => import('../screens/stats/Stats.jsx'), 'Stats');
export const TercerosList = lazyScreen(() => import('../screens/terceros/TercerosList.jsx'), 'TercerosList');

export const AppRoutes = () => (
	<>
		<ToastContainer position="top-right" theme="light" />
		<Suspense fallback={<div className="grid min-h-screen place-items-center"><Loader /></div>}>
			<Routes>
				<Route element={<PrivateRoute />}>
					<Route path="/" element={<LayoutShell><Home /></LayoutShell>} />
					<Route path="/planillas" element={<LayoutShell><RoutesList /></LayoutShell>} />
					<Route path="/planillas/:id" element={<LayoutShell><RouteDetails /></LayoutShell>} />
					<Route path="/planillas/:id/manual" element={<LayoutShell><ManualCart /></LayoutShell>} />
					<Route path="/bajadas/:id/editar" element={<LayoutShell><CartEdit /></LayoutShell>} />
					<Route path="/clientes/nuevo" element={<LayoutShell><ClientForm /></LayoutShell>} />
					<Route element={<AdminRoute />}>
						<Route path="/clientes" element={<LayoutShell><ClientsList /></LayoutShell>} />
						<Route path="/clientes/sin-asignar" element={<LayoutShell><ClientsUnassigned /></LayoutShell>} />
						<Route path="/clientes/:id" element={<LayoutShell><ClientDetails /></LayoutShell>} />
						<Route path="/productos" element={<LayoutShell><ProductsList /></LayoutShell>} />
						<Route path="/productos/:id/estadisticas" element={<LayoutShell><ProductStats /></LayoutShell>} />
						<Route path="/abonos" element={<LayoutShell><AbonosList /></LayoutShell>} />
						<Route path="/planillas/nueva" element={<LayoutShell><RoutesList showCreate /></LayoutShell>} />
						<Route path="/planillas/:id/editar" element={<LayoutShell><RouteEdit /></LayoutShell>} />
						<Route path="/repartidores" element={<LayoutShell><DealersList /></LayoutShell>} />
						<Route path="/repartidores/:id" element={<LayoutShell><DealerDetails /></LayoutShell>} />
						<Route path="/repartidores/:id/planillas" element={<LayoutShell><DealerSheets /></LayoutShell>} />
						<Route path="/gastos" element={<LayoutShell><ExpensesList /></LayoutShell>} />
						<Route path="/transferencias" element={<LayoutShell><TransfersList /></LayoutShell>} />
						<Route path="/facturas" element={<LayoutShell><Invoices /></LayoutShell>} />
						<Route path="/estadisticas" element={<LayoutShell><Stats /></LayoutShell>} />
						<Route path="/terceros" element={<LayoutShell><TercerosList /></LayoutShell>} />
					</Route>
				</Route>
				<Route path="/login" element={<Login />} />
				<Route path="/notAllowed" element={<NotAllowed />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Suspense>
	</>
);
