import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginImport from 'eslint-plugin-import'

export default tseslint.config(
  {
    ignores: [
      // === shared config ===
      '**/build',
      '**/dist',

      // === packages ===
      'packages/fs-router-vite-plugin/tests/generator/**',

      'packages/tuono/bin/**',
    ],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  eslint.configs.recommended,
  eslintPluginImport.flatConfigs.recommended,
  eslintPluginImport.flatConfigs.typescript,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: true,
      },
      react: {
        version: 'detect',
      },
    },
    rules: {
      '@typescript-eslint/array-type': 'error',
      '@typescript-eslint/no-wrapper-object-types': 'error',
      '@typescript-eslint/no-empty-object-type': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/consistent-type-definitions': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/method-signature-style': ['error', 'property'],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'typeParameter',
          format: ['PascalCase'],
          leadingUnderscore: 'forbid',
          trailingUnderscore: 'forbid',
          custom: {
            regex: '^(T|T[A-Z][A-Za-z]+)$',
            match: true,
          },
        },
      ],
      '@typescript-eslint/no-deprecated': 'error',
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-empty-interface': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-inferrable-types': [
        'error',
        { ignoreParameters: true },
      ],
      'import/default': 'error',
      'import/export': 'error',
      'import/namespace': 'error',
      'import/newline-after-import': 'error',
      'import/no-cycle': 'error',
      'import/no-duplicates': 'off',
      'import/no-named-as-default-member': 'error',
      'import/no-unused-modules': 'error',
      'import/order': [
        'off',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
        },
      ],
      'no-case-declarations': 'error',
      'no-empty': 'error',
      'no-prototype-builtins': 'error',
      'no-redeclare': 'error',
      'no-shadow': 'error',
      'no-undef': 'off',
      'sort-imports': 'off',
    },
  },
)
