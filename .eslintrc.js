module.exports = {
  root: true,
  extends: ["expo", "eslint:recommended", "prettier"],
  plugins: ["prefer-arrow-functions"],
  parser: "@typescript-eslint/parser",
  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
      },
    },
  },
  rules: {
    "prefer-arrow-functions/prefer-arrow-functions": ["error"],
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "prop-types",
            message: "Use the TypeScript type system instead.",
          },
          {
            name: "react",
            importNames: ["default"],
            message:
              "Don't default import React. It is unnecessary since React 17.",
          },
        ],
        patterns: [
          {
            group: ["**/tailwind.config", "**/tailwind.config.js"],
            message:
              "Don't import tailwind.config.js at runtime. Use className with NativeWind or tokens (e.g. '@/theme/colors').",
          },
          {
            group: ["./", "../"],
            message:
              "Use absolute imports instead (e.g. '@/components/Button').",
          },
        ],
      },
    ],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "variable",
        format: ["strictCamelCase", "UPPER_CASE", "StrictPascalCase"],
      },
      {
        selector: "typeLike",
        format: ["StrictPascalCase"],
      },
      {
        selector: "enumMember",
        format: ["UPPER_CASE"],
      },
    ],
  },
  env: {
    browser: true,
  },
};
