import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import complexity from 'eslint-plugin-complexity'
import sonarjs from 'eslint-plugin-sonarjs'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      complexity,
      sonarjs
    },
    rules: {
      // Complexity Analysis Rules (Relaxed for Baseline Establishment)
      'complexity': ['error', 20], // Cyclomatic complexity limit (relaxed from 10)
      'sonarjs/cognitive-complexity': ['error', 25], // Cognitive complexity limit (relaxed from 15)
      'sonarjs/no-identical-functions': 'error', // Detect duplicate functions
      'sonarjs/no-duplicate-string': ['error', { threshold: 5 }], // Detect duplicate strings
      'sonarjs/no-nested-template-literals': 'error', // Avoid nested template literals
      'sonarjs/prefer-immediate-return': 'error', // Prefer immediate returns
      'sonarjs/no-inverted-boolean-check': 'error', // Avoid inverted boolean checks
      'sonarjs/no-redundant-boolean': 'error', // Avoid redundant boolean expressions
      'sonarjs/no-unused-collection': 'error', // Detect unused collections
      'sonarjs/no-collapsible-if': 'error', // Detect collapsible if statements

      // Function complexity limits (Relaxed)
      'max-lines-per-function': ['error', 100], // Max lines per function (relaxed from 50)
      'max-params': ['error', 6], // Max parameters per function (relaxed from 4)
      'max-depth': ['error', 5], // Max nesting depth (relaxed from 4)
      'max-nested-callbacks': ['error', 4], // Max nested callbacks (relaxed from 3)

      // Maintainability rules
      'sonarjs/function-return-type': 'error', // Require return type annotations
      'sonarjs/no-misleading-array-reverse': 'error', // Avoid misleading array.reverse()
    }
  },
])
