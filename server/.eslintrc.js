module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  env: {
    node: true,
    es6: true,
    jest: true
  },
  plugins: ['complexity', 'sonarjs'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': 'off',

    // Complexity Analysis Rules
    'complexity': ['error', 12], // Cyclomatic complexity limit (higher for backend)
    'sonarjs/cognitive-complexity': ['error', 18], // Cognitive complexity limit
    'sonarjs/no-identical-functions': 'error', // Detect duplicate functions
    'sonarjs/no-duplicate-string': ['error', 5], // Detect duplicate strings
    'sonarjs/no-nested-template-literals': 'error', // Avoid nested template literals
    'sonarjs/prefer-immediate-return': 'error', // Prefer immediate returns
    'sonarjs/no-inverted-boolean-check': 'error', // Avoid inverted boolean checks
    'sonarjs/no-redundant-boolean': 'error', // Avoid redundant boolean expressions
    'sonarjs/no-unused-collection': 'error', // Detect unused collections
    'sonarjs/no-collapsible-if': 'error', // Detect collapsible if statements

    // Function complexity limits
    'max-lines-per-function': ['error', 60], // Max lines per function (higher for backend)
    'max-params': ['error', 5], // Max parameters per function
    'max-depth': ['error', 4], // Max nesting depth
    'max-nested-callbacks': ['error', 3], // Max nested callbacks

    // Maintainability rules
    'sonarjs/function-return-type': 'error', // Require return type annotations
    'sonarjs/no-misleading-array-reverse': 'error', // Avoid misleading array.reverse()
  },
  ignorePatterns: ['dist/', 'node_modules/', '*.js']
};