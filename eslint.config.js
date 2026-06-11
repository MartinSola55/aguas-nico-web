import { defineConfig } from 'eslint/config';
import eslintUnsupported from 'eslint/use-at-your-own-risk';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier/flat';

const { builtinRules } = eslintUnsupported;

const eslintRecommendedRules = Object.fromEntries(
	[...builtinRules]
		.filter(([, rule]) => rule.meta?.docs?.recommended)
		.map(([ruleName]) => [ruleName, 'error'])
);

const browserGlobals = {
	AbortController: 'readonly',
	Blob: 'readonly',
	File: 'readonly',
	FormData: 'readonly',
	URL: 'readonly',
	URLSearchParams: 'readonly',
	atob: 'readonly',
	cancelAnimationFrame: 'readonly',
	clearInterval: 'readonly',
	clearTimeout: 'readonly',
	console: 'readonly',
	document: 'readonly',
	fetch: 'readonly',
	localStorage: 'readonly',
	navigator: 'readonly',
	requestAnimationFrame: 'readonly',
	setInterval: 'readonly',
	setTimeout: 'readonly',
	window: 'readonly',
};

const nodeGlobals = {
	__dirname: 'readonly',
	module: 'readonly',
	process: 'readonly',
	require: 'readonly',
};

export default defineConfig([
	{
		ignores: ['dist/**', 'node_modules/**'],
	},
	{
		files: ['**/*.{js,jsx,cjs,mjs}'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: {
				...browserGlobals,
				...nodeGlobals,
			},
		},
		settings: {
			react: {
				version: '19.2.6',
			},
		},
		plugins: {
			prettier,
			react,
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
		},
		rules: {
			...eslintRecommendedRules,
			...react.configs.flat.recommended.rules,
			...react.configs.flat['jsx-runtime'].rules,
			...prettierConfig.rules,
			'react/jsx-no-target-blank': 'off',
			'react-refresh/only-export-components': [
				'warn',
				{ allowConstantExport: true },
			],
			'no-console': 'warn',
			'no-debugger': 'warn',
			'no-unused-vars': 'warn',
			'react/prop-types': 'off',
			'prettier/prettier': [
				'off',
				{
					endOfLine: 'auto',
				},
			],
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',
			'react/display-name': 'off',
		},
	},
]);
