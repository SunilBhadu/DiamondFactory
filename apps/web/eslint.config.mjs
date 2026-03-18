import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';
import nextPlugin from '@next/eslint-plugin-next';

export default [
  js.configs.recommended,
  // Next.js core web vitals rules (includes the @next/next plugin + rules)
  nextPlugin.configs['core-web-vitals'],
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        // Browser globals: window, document, navigator, alert, fetch,
        // localStorage, setTimeout, clearTimeout, etc.
        ...globals.browser,
        // Node globals: process, __dirname, Buffer, etc. (needed for
        // process.env.NEXT_PUBLIC_* in client code — webpack replaces it)
        ...globals.node,
        // React is auto-imported by the new JSX transform; ESLint still
        // needs to know it's a valid global for files that reference
        // React.forwardRef / React.ComponentProps without an explicit import.
        React: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      // Empty interfaces (e.g. `interface Props extends HTMLAttributes<>{}`)
      // are idiomatic in shadcn/ui components — downgrade from error to warn.
      '@typescript-eslint/no-empty-object-type': 'warn',
    },
  },
  {
    ignores: ['.next/**', 'node_modules/**', 'dist/**'],
  },
];
