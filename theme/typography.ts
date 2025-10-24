import plugin from "tailwindcss/plugin";
import { CSSRuleObject } from "tailwindcss/types/config";
// Prettier fails when an absolute path is used
// eslint-disable-next-line no-restricted-imports
import typographyTokensJson from "./typography.tokens.json";

/**
 * Font family keys taken from tailwind.config.ts.
 */
export type FontFamilyKey =
  | "mont-400"
  | "mont-400-italic"
  | "mont-500"
  | "mont-600"
  | "mont-600-italic"
  | "mont-700"
  | "mont-700-italic"
  | "mont-800";

interface TypoToken {
  fontFamilyKey: FontFamilyKey;
  fontSize: number;
  lineHeight: number;
  caps?: boolean;
}

const textStyles = typographyTokensJson[
  "text-styles"
] as unknown as TypoToken[];

type TextPreset = Extract<
  keyof (typeof typographyTokensJson)["text-styles"],
  string
>;
export type TextClass = `text-${TextPreset}`;

export type TextStyleName = keyof typeof typographyTokensJson;

export type TextStyle = (typeof typographyTokensJson)[TextStyleName];

export const typographyPlugin = plugin((pluginApi) => {
  const fontFamilies = pluginApi.theme("fontFamily");

  if (!fontFamilies) {
    throw new Error("Font families not found in theme");
  }

  const utilities = Object.entries(textStyles).reduce<
    Record<string, CSSRuleObject>
  >((acc, [name, styles]) => {
    const fontStack = (fontFamilies[styles.fontFamilyKey] as string[]).join(
      ", ",
    );

    acc[`.text-${name}`] = {
      fontFamily: fontStack,
      fontSize: `${String(styles.fontSize)}px`,
      lineHeight: `${String(styles.lineHeight)}px`,
      ...(styles.caps ? { textTransform: "uppercase" } : {}),
    };

    return acc;
  }, {});

  pluginApi.addUtilities(utilities);
});
