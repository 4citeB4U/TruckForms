// eslint.config.js for Next.js v13+/TypeScript/React
import js from '@eslint/js';
import next from 'eslint-config-next';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  js.config({
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    extends: [],
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  }),
  next,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/prefer-as-const': 'warn',
    },
  },
];
