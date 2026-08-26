import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig([
	{
		ignores: ['node_modules/**', 'tmp/**', 'media/**', 'data/**', 'sessions/**', 'backup/**', 'recordings/**'],
	},
	{
		files: ['**/*.js'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.node,
			},
		},
		extends: [js.configs.recommended],
		rules: {
			'no-undef': 'off',
			'no-empty': 'off',
			'no-throw-literal': 'off',
			'no-unused-vars': [
				'warn',
				{
					varsIgnorePattern: '^_',
					argsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
			'prefer-const': 'warn',
			'no-var': 'warn',
			eqeqeq: ['warn', 'smart'],
			'no-async-promise-executor': 'warn',
			'no-prototype-builtins': 'warn',
		},
	},
	eslintPluginPrettierRecommended,
]);
