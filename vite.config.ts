import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
	plugins: [solidPlugin({ extensions: ['ts', 'tsx'] })],
	test: {
		globals: true,
		environment: 'happy-dom',
	},
	server: { port: 3003 },
});
