module.exports = {
  extends: ["expo", "eslint:recommended", "prettier"],
  plugins: ["prefer-arrow-functions"],
  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
      },
    },
  },
  rules: {
    "prefer-arrow-functions/prefer-arrow-functions": ["error"],
  },
  env: {
    browser: true,
  },
};
