module.exports = {
	env: {
		node: true,
	},
	parser: '@typescript-eslint/parser',
	extends: [
		'plugin:import/recommended',
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
	],

	plugins: ['@typescript-eslint', 'import'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2022,
	},
	rules: {
		// https://typescript-eslint.io/rules/
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/ban-types': 'warn',
		'@typescript-eslint/no-unused-vars': [
			'warn',
			{ varsIgnorePattern: '^_', argsIgnorePattern: '^_', ignoreRestSiblings: true },
		],
		'import/no-dynamic-require': 'error',
		'import/no-self-import': 'error',
		'import/no-useless-path-segments': 'warn',
		'import/order': [
			'warn',
			{
				groups: [['external', 'builtin'], 'internal', 'index', 'sibling', 'parent', 'object', 'type'],
				'newlines-between': 'always',
			},
		],
	},
};
