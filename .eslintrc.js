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
            message:
              "Don't use prop-types. Use the TypeScript type system instead",
          },
          {
            name: "react",
            importNames: ["default"],
            message:
              "Don't default import React. It is unnecessary since React 17",
          },
          {
            name: "react",
            importNames: ["useCallback", "useMemo"],
            message:
              "Don't use useCallback/useMemo. Rely on React Compiler (19+). Use useCallback/useMemo only with a documented reason",
          },
        ],
        patterns: [
          {
            group: ["**/tailwind.config", "**/tailwind.config.js"],
            message:
              "Don't import tailwind.config.js at runtime. Use className with NativeWind or tokens (e.g. '@/theme/colors')",
          },
          {
            group: ["./", "../"],
            message:
              "Don't use relative imports. Use absolute imports instead (e.g. '@/components/Button')",
          },
        ],
      },
    ],
    "no-restricted-syntax": [
      "error",
      {
        selector:
          "JSXAttribute[name.name='className'] Literal[value=/\\bfont-(bold|medium|semibold|montserrat(?:-bold|-semi-bold)?|sans-bold)\\b/]",
        message:
          "Use the components/General/Text.tsx component with textStyle, tone and align props",
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
    "@typescript-eslint/no-explicit-any": "error",
  },
  env: {
    browser: true,
    node: true,
  },
};
