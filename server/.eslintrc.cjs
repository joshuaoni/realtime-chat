module.exports = {
    env: {
      node: true,
      es2021: true,
      jest: true
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: "module"
    },
    plugins: ["@typescript-eslint", "import", "promise", "node"],
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:import/recommended",
      "plugin:import/typescript",
      "plugin:node/recommended",
      "plugin:promise/recommended",
      "prettier"
    ],
    rules: {
      "node/no-unsupported-features/es-syntax": "off",
      "node/no-missing-import": "off"
    }
  };