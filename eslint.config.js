import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,jsx}"]},
  {languageOptions: { globals: globals.browser }},
  react.configs.flat.recommended,
  {
      plugins: {
        react,
        reactHooks,
      },
      rules: {
        'react/no-unescaped-entities': 'warn',
        'reactHooks/rules-of-hooks': 'warn',
        'reactHooks/exhaustive-deps': 'warn',
      }
  }
];