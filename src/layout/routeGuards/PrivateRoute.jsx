import { Navigate, Outlet } from 'react-router';
import { App } from '@app';

export const PrivateRoute = () => (App.isLoggedIn() ? <Outlet /> : <Navigate to="/login" replace />);

