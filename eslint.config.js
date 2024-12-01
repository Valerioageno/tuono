import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
// @ts-expect-error no types are available for this plugin
import eslintPluginImport from 'eslint-plugin-import'

export default tseslint.config(
  {
    ignores: [
      // #region shared
      '**/build',
      '**/dist',
      '**/.tuono',
      '**/vite.config.ts.timestamp**',
      // #endregion shared

      // #region package-specific
      'packages/fs-router-vite-plugin/tests/generator/**',

      'packages/tuono/bin/**',
      // #endregion package-specific
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
      // #region @typescript-eslint
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
      // #endregion @typescript-eslint

      // #region import
      'import/default': 'error',
      'import/export': 'error',
      'import/namespace': 'error',
      'import/newline-after-import': 'error',
      'import/no-cycle': 'error',
      'import/no-duplicates': 'error',
      'import/no-named-as-default-member': 'error',
      'import/no-unused-modules': 'error',
      'import/order': [
        'error',
        {
          'newlines-between': 'always-and-inside-groups',
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
          ],
        },
      ],
      // #endregion import

      // #region misc
      /**
       * @todo some of this might be removed.
       *       They are handled by other plugin and / or typescript
       */
      'no-case-declarations': 'error',
      'no-empty': 'error',
      'no-prototype-builtins': 'error',
      'no-redeclare': 'error',
      'no-shadow': 'error',
      'no-undef': 'off',
      'sort-imports': 'off',
    },
  },
  {
    files: ['apps/documentation/**'],
    settings: {
      'import/resolver': {
        typescript: 'apps/documentation/tsconfig.json',
      },
    },
  },
)
