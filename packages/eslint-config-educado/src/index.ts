import eslintPluginEducado from "@educado/eslint-plugin-educado";
import eslintPluginReactNative from "eslint-plugin-react-native";

const recommended = {
  name: "educado/recommended",
  plugins: {
    "eslint-plugin-educado": eslintPluginEducado,
    "eslint-plugin-react-native": eslintPluginReactNative,
  },
  rules: {
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
          {
            name: "@/components/General/Text",
            message:
              "Don't use @/components/General/Text. Use Text from react-native instead",
          },
          {
            name: "react-test-renderer",
            message:
              "Don't use react-test-renderer. Use @testing-library/react-native",
          },
        ],
        patterns: [
          {
            group: ["**/tailwind.config", "**/tailwind.config.js"],
            message:
              "Don't import tailwind.config at runtime. Use className with NativeWind or tokens (e.g., '@/theme/colors')",
          },
          {
            group: ["./", "../"],
            message:
              "Don't use relative imports. Use absolute imports instead (e.g., '@/components/Button')",
          },
        ],
      },
    ],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "variable",
        format: ["camelCase", "UPPER_CASE", "PascalCase"],
      },
      {
        selector: "typeLike",
        format: ["StrictPascalCase"],
      },
      {
        selector: "enumMember",
        format: ["UPPER_CASE"],
      },
      {
        selector: "parameter",
        format: ["strictCamelCase"],
      },
    ],
    "eslint-plugin-react-native/no-inline-styles": "error",
  },
};

export default {
  configs: {
    recommended: [recommended],
  },
};
