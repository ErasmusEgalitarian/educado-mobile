// @ts-check

import eslint from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import expoConfig from "eslint-config-expo/flat.js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import preferArrowFunctions from "eslint-plugin-prefer-arrow-functions";
import eslintConfigEducado from "@educado/eslint-config-educado";
// `eslint.config.mjs` is an ESM file, so we need to use relative imports
// @ts-expect-error This is an ESM file, so we need to use with { type: "json" }
import typographyTokens from "./theme/typography.tokens.json" with { type: "json" }; // eslint-disable-line no-restricted-imports
// `eslint.config.mjs` is an ESM file, so we need to use relative imports
// @ts-expect-error This is an ESM file, so we need to use with { type: "json" }
import colorTokens from "./theme/color.tokens.json" with { type: "json" }; // eslint-disable-line no-restricted-imports
import pluginQuery from "@tanstack/eslint-plugin-query";

const allowedTextStyles = Object.keys(typographyTokens["text-styles"]).map(
  (name) => `text-${name}`,
);

const allowedColors = Object.keys(colorTokens.colors);
const disallowedColors = Object.keys(colorTokens["old-colors"]);

// The config works as it should, but due to some issues with `eslint-plugin-prefer-arrow-functions`, a couple of errors
// are suppressed
export default defineConfig([
  globalIgnores([".expo/*", "**/dist/*", "*.config.js"]),
  expoConfig,
  eslint.configs.recommended,
  // I double-checked that this is the correct way to import the config
  // eslint-disable-next-line import/no-named-as-default-member
  tseslint.configs.strictTypeChecked,
  // I double-checked that this is the correct way to import the config
  // eslint-disable-next-line import/no-named-as-default-member
  tseslint.configs.stylisticTypeChecked,
  // @ts-expect-error The config works, but enabling `eslint-plugin-prefer-arrow-functions` makes tsc throw an error
  eslintConfigEducado.configs.recommended,
  // @ts-expect-error Something is wrong with how the plugin exports, but it works
  preferArrowFunctions.configs.all,
  ...pluginQuery.configs["flat/recommended"],
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "@typescript-eslint/no-deprecated": "off",
      "eslint-plugin-educado/no-disallowed-typography-classes": [
        "error",
        {
          allowedTextStyles,
        },
      ],
      "eslint-plugin-educado/no-disallowed-color-classes": [
        "error",
        {
          allowedColors,
          disallowedColors,
          ignoredTextClasses: allowedTextStyles,
        },
      ],
    },
  },
  {
    basePath: "packages/eslint-config-educado",
    settings: {
      "import/resolver": {
        typescript: {
          project: "packages/eslint-config-educado/tsconfig.json",
          alwaysTryTypes: true,
        },
      },
    },
  },
  {
    basePath: "packages/eslint-plugin-educado",
    settings: {
      "import/resolver": {
        typescript: {
          project: "packages/eslint-plugin-educado/tsconfig.json",
          alwaysTryTypes: true,
        },
      },
    },
  },
  eslintConfigPrettier,
]);
