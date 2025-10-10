/**
 * Font family keys taken from tailwind.config.js.
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

type TypoToken = {
  fontFamilyKey: FontFamilyKey;
  fontSize: number;
  lineHeight: number;
  caps?: boolean;
};

/**
 * Typography style configuration. All configuration is based on the typography tokens from the Figma design system.
 *
 * Convention: typo-{role}-{size?}-{weight}{-italic?}{-caps?}
 */
export const textStyle = {
  // H1
  "h1-sm-medium": { fontFamilyKey: "mont-500", fontSize: 34, lineHeight: 44.2 },
  "h1-sm-bold": { fontFamilyKey: "mont-700", fontSize: 34, lineHeight: 44.2 },

  // H2
  "h2-sm-regular": {
    fontFamilyKey: "mont-400",
    fontSize: 24,
    lineHeight: 31.2,
  },
  "h2-sm-bold": { fontFamilyKey: "mont-700", fontSize: 24, lineHeight: 31.2 },

  // H3
  "h3-sm-regular": { fontFamilyKey: "mont-400", fontSize: 20, lineHeight: 26 },
  "h3-sm-bold": { fontFamilyKey: "mont-700", fontSize: 20, lineHeight: 26 },

  // H4
  "h4-sm-regular": {
    fontFamilyKey: "mont-400",
    fontSize: 18,
    lineHeight: 23.4,
  },
  "h4-sm-bold": { fontFamilyKey: "mont-700", fontSize: 18, lineHeight: 23.4 },

  // Body
  "body-regular": { fontFamilyKey: "mont-400", fontSize: 18, lineHeight: 23.4 },
  "body-bold": { fontFamilyKey: "mont-700", fontSize: 18, lineHeight: 23.4 },
  "body-regular-italic": {
    fontFamilyKey: "mont-400-italic",
    fontSize: 18,
    lineHeight: 23.4,
  },
  "body-bold-italic": {
    fontFamilyKey: "mont-700-italic",
    fontSize: 18,
    lineHeight: 23.4,
  },

  // Subtitle
  "subtitle-regular": {
    fontFamilyKey: "mont-400",
    fontSize: 16,
    lineHeight: 20.8,
  },
  "subtitle-semibold": {
    fontFamilyKey: "mont-600",
    fontSize: 16,
    lineHeight: 20.8,
  },
  "subtitle-regular-italic": {
    fontFamilyKey: "mont-400-italic",
    fontSize: 16,
    lineHeight: 20.8,
  },
  "subtitle-semibold-italic": {
    fontFamilyKey: "mont-600-italic",
    fontSize: 16,
    lineHeight: 20.8,
  },

  // Caption
  "caption-sm-regular": {
    fontFamilyKey: "mont-400",
    fontSize: 12,
    lineHeight: 15.6,
  },
  "caption-sm-semibold": {
    fontFamilyKey: "mont-600",
    fontSize: 12,
    lineHeight: 20.8,
  },

  // Footnote
  "footnote-regular-caps": {
    fontFamilyKey: "mont-400",
    fontSize: 12,
    lineHeight: 20.8,
    caps: true,
  },
  "footnote-semibold-caps": {
    fontFamilyKey: "mont-600",
    fontSize: 12,
    lineHeight: 20.8,
    caps: true,
  },

  // Alert / hint
  "alert-title-medium": {
    fontFamilyKey: "mont-500",
    fontSize: 10,
    lineHeight: 13,
  },
  "alert-message": { fontFamilyKey: "mont-400", fontSize: 8, lineHeight: 10.4 },
  hint: { fontFamilyKey: "mont-400", fontSize: 8, lineHeight: 10.4 },
} as const satisfies Record<string, TypoToken>;

export type TextStyle = keyof typeof textStyle;

export const textStyleToUtility = (textStyle: TextStyle) =>
  `typo-${textStyle}` as const;

export type Tone =
  | "default"
  | "inverse"
  | "muted"
  | "danger"
  | "success"
  | "link";

export const toneToUtility: Record<Tone, string> = {
  default: "text-projectBlack",
  inverse: "text-projectWhite",
  muted: "text-projectGray",
  danger: "text-error",
  success: "text-success",
  link: "text-cyanBlue underline",
};

export type Align = "left" | "center" | "right";

export const alignToUtility: Record<Align, string> = {
  left: "",
  center: "text-center",
  right: "text-right",
};
