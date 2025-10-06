import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),
  {
    // This is your existing configuration for React files
    files: ['**/*.{js,jsx}'],
    ignores: ['server.js'], // <-- Add this line to ignore server.js from this config
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser, // This is for browser files
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  
  // --- ADD THIS NEW SECTION FOR YOUR SERVER FILE ---
  {
    files: ['server.js'], // <-- This rule only applies to server.js
    languageOptions: {
      globals: {
        ...globals.node, // <-- This adds all Node.js globals like 'process'
      },
    },
  },
]);