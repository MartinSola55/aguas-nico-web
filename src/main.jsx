import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { Theme } from '@app';
import { AppRoutes } from './layout/Routes.jsx';
import './index.css';

Theme.initializeTheme();

createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<AppRoutes />
	</BrowserRouter>
);
