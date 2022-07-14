import { defineConfig } from 'vitest/config';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
	plugins: [solidPlugin()],
	test: {
		globals: true,
		environment: 'happy-dom',
	},
	server: { port: 3003 },
});
