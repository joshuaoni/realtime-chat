module.exports = {
    root: true,
    env: {
      es2021: true,
      node: true,
      browser: false
    },
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: "module"
    },
    extends: ["eslint:recommended", "prettier"],
    rules: {}
  };