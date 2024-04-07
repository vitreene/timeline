import { defineConfig } from 'vitest/config.js';

export default defineConfig({
	test: {
		deps: {
			inline: [/vite-test-utils/],
		},
	},
	server: {
		port: 3303,
	},
});
