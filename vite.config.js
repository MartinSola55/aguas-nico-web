import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import eslintPlugin from 'vite-plugin-eslint';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [
			react(),
			tailwindcss(),
			eslintPlugin({ exclude: [/virtual:/, /node_modules/] }),
		],
		resolve: {
			tsconfigPaths: true,
		},
		server: {
			port: 3000,
		},
		define: {
			'process.env': {
				VITE_SECURE_LOCAL_STORAGE_HASH_KEY: env.VITE_SECURE_LOCAL_STORAGE_HASH_KEY,
				VITE_SECURE_LOCAL_STORAGE_PREFIX: env.VITE_SECURE_LOCAL_STORAGE_PREFIX,
			},
		},
		test: {
			globals: true,
			environment: 'jsdom',
			coverage: {
				all: false,
				include: ['src/*.{js,jsx,ts,tsx}', 'src/**/*.test.jsx'],
			},
		},
	};
});
