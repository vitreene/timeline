import { defineConfig } from 'vitest/config';
export default defineConfig({
	plugins: [],
	test: {
		globals: true,
		environment: 'happy-dom',
	},
	server: { host: '127.0.0.1', port: 3003 },
});
