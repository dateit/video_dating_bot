const OFF = 'off'
const ERROR = 'error'
const WARN = 'warn'

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 2020
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import', 'lodash'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:node/recommended',
    'plugin:sonarjs/recommended',
    'plugin:unicorn/recommended'
  ],
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'no-console': WARN,
    'no-debugger': WARN,
    'max-len': [
      ERROR,
      120,
      4,
      {
        ignoreComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    'no-implicit-coercion': ERROR,
    'no-else-return': ERROR,
    '@typescript-eslint/no-explicit-any': ERROR,
    '@typescript-eslint/no-unused-vars': [ERROR, {
      vars: 'local', ignoreRestSiblings: false, argsIgnorePattern: '^_'
    }],
    '@typescript-eslint/naming-convention': [
      ERROR,
      {
        'selector': 'interface',
        'format': ['PascalCase'],
        'custom': {
          regex: '^I[A-Z]',
          match: true
        }
      }
    ],
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': true,
        'ts-nocheck': true,
        'ts-check': false,
        minimumDescriptionLength: 5,
      },
    ],
    '@typescript-eslint/prefer-nullish-coalescing': ERROR,
    '@typescript-eslint/prefer-optional-chain': ERROR,
    '@typescript-eslint/no-non-null-assertion': ERROR,
    'lodash/import-scope': [ERROR, 'method'],
    'no-duplicate-imports': [ERROR, { "includeExports": true }],
    'import/named': WARN,
    'import/first': ERROR,
    'import/no-mutable-exports': ERROR,
    'import/no-self-import': ERROR,
    'import/no-named-default': ERROR,
    'import/order': [
      ERROR,
      {
        groups: [
          ['builtin', 'external'],
          'internal',
          'parent', 'sibling', 'type', 'index',
          'object',
        ],
        'newlines-between': 'always',
      },
    ],
    'node/no-unsupported-features/es-syntax': OFF,
    'node/no-missing-import': OFF,
    'node/no-unpublished-import': OFF,
    '@typescript-eslint/no-empty-function': [ERROR, {
      allow: ['arrowFunctions']
    }],
    'sonarjs/no-duplicate-string': OFF,
    'unicorn/prefer-ternary': OFF
  },
};
