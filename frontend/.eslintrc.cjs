// .eslintrc.cjs
module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@tanstack/eslint-plugin-query/recommended",
    "prettier",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "@tanstack/query"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react-hooks/exhaustive-deps": "off",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  },
};