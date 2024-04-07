// vite.config.js
import path from 'node:path';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	base: './',
	server: {
		port: 3003,
	},
});
