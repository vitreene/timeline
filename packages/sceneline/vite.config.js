import * as path from 'path';

import { defineConfig } from 'vite';

export default defineConfig({
	base: './',
	resolve: {
		alias: [
			{ find: '@', replacement: path.resolve(__dirname, 'src') },
			{ find: '@types', replacement: path.resolve(__dirname, 'src/types') },
		],
	},

	// build: {
	// 	sourcemap: true,
	// 	lib: {
	// 		entry: path.resolve(__dirname, './src/main.ts'),
	// 		// types: path.resolve(__dirname, './src/types/index.ts'),
	// 		name: 'sceneline',
	// 		fileName: `sceneline`,
	// 	},
	// },
});
