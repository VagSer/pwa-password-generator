import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';

export default [
  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': typescript
    },
    rules: {
      ...js.configs.recommended.rules,
      ...typescript.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'warn'
    }
  },
  {
    ignores: ['**/*.vue', 'node_modules/', 'dist/', '*.config.js']
  }
];
