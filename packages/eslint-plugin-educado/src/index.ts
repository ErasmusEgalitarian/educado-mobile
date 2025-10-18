import fs from "node:fs";
import { noDisallowedColorClasses } from "@/rules/no-disallowed-color-classes";
import { noDisallowedTypographyClasses } from "@/rules/no-disallowed-typography-classes";

const { name, version } = JSON.parse(
  fs.readFileSync(new URL("../package.json", import.meta.url), "utf-8"),
) as { name: string; version: string };

const eslintPluginEducado = {
  meta: {
    name,
    version,
  },
  rules: {
    "no-disallowed-color-classes": noDisallowedColorClasses,
    "no-disallowed-typography-classes": noDisallowedTypographyClasses,
  },
  configs: {
    get recommended() {
      return recommended;
    },
  },
} as const;

const recommended = [
  {
    plugins: {
      "eslint-plugin-educado": eslintPluginEducado,
    },
    rules: {
      "eslint-plugin-educado/no-disallowed-color-classes": "error",
      "eslint-plugin-educado/no-disallowed-typography-classes": "error",
    },
  },
];

export type { Docs as NoDisallowedColorClassesDocs } from "@/rules/no-disallowed-color-classes";
export type { Docs as NoDisallowedTypographyClassesDocs } from "@/rules/no-disallowed-typography-classes";

export default eslintPluginEducado;
