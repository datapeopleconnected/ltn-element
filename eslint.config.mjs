import openWc from '@open-wc/eslint-config';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**', 'storybook-static/**'],
  },
  ...openWc,
  {
    rules: {
      'import-x/no-unresolved': 'off',
      'arrow-parens': ['error', 'always'],
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'import-x/extensions': ['error', 'always', { ignorePackages: true }],
    },
  },
];