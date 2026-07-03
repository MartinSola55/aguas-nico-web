import { Navigate, Outlet } from 'react-router';
import { App } from '@app';

export const AdminRoute = () => (App.isAdmin() ? <Outlet /> : <Navigate to="/notAllowed" replace />);
