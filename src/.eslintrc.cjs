module.exports = {
    env: {
      browser: true,
      es2021: true,
      jest: true
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaFeatures: { jsx: true },
      ecmaVersion: 2021,
      sourceType: "module"
    },
    plugins: ["react", "react-hooks", "@typescript-eslint", "jsx-a11y", "import"],
    extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "plugin:jsx-a11y/recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:import/recommended",
      "plugin:import/typescript",
      "prettier"
    ],
    settings: {
      react: { version: "detect" }
    },
    rules: {}
  };