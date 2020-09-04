module.exports = {
  env: {
    es2020: true,
    node: true
  },
  extends: [
    'standard',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsdoc/recommended',
    'plugin:unicorn/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12
  },
  plugins: [
    '@typescript-eslint',
    'sort-class-members',
    'jsdoc',
    'unicorn'
  ],
  rules: {
    'max-len': ['error', { code: 100 }],
    'object-shorthand': ['error'],

    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

    indent: 'off',
    '@typescript-eslint/indent': ['error', 2],

    'brace-style': 'off',
    '@typescript-eslint/brace-style': ['error'],

    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/explicit-member-accessibility': ['error'],
    '@typescript-eslint/ban-types': ['error', {
      types: {
        '{}': false
      },
      extendDefaults: true
    }],
    '@typescript-eslint/ban-ts-comment': ['error', {
      'ts-ignore': true,
      'ts-expect-error': false
    }],

    'sort-class-members/sort-class-members': ['error', {
      order: [
        '[static-properties]',
        '[static-methods]',
        '[properties]',
        'constructor',
        '[getters]',
        '[methods]'
      ],
      groups: {
        getters: { type: 'method', kind: 'get' }
      },
      accessorPairPositioning: 'getThenSet'
    }],

    // unnecessary because of typescript
    'jsdoc/require-param': 'off',
    'jsdoc/require-returns': 'off',

    'jsdoc/require-jsdoc': ['warn', { publicOnly: true }],
    'jsdoc/check-examples': 'warn',

    'unicorn/prevent-abbreviations': ['error', {
      replacements: {
        param: false,
        params: false
      }
    }]
  }
}
