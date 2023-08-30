// vite.config.js
import path from 'node:path';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: {
		alias: [{ find: '~', replacement: path.resolve(__dirname, 'lib') }],
	},
	base: './',
	server: {
		port: 3004,
	},
	build: {
		lib: {
			// Could also be a dictionary or array of multiple entry points
			entry: resolve(__dirname, 'lib/main.ts'),
			name: 'VitreenePlayer',
			// the proper extensions will be added
			fileName: 'player',
		},
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled
			// into your library
			external: ['three'],
			output: {
				// Provide global variables to use in the UMD build
				// for externalized deps
				globals: {
					three: 'THREE',
				},
			},
		},
	},
});
