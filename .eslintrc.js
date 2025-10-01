module.exports = {
  extends: ["expo", "eslint:recommended", "prettier"],
  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
      },
    },
  },
  env: {
    browser: true,
  },
};
