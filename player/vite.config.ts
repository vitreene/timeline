import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [],
	test: {
		globals: true,
		environment: 'happy-dom',
	},
	server: { port: 3003 },
});
