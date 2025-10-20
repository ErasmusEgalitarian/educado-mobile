// Prettier fails when an absolute path is used
// eslint-disable-next-line no-restricted-imports
import colorTokensJson from "./color.tokens.json";

const oldColors = colorTokensJson["old-colors"];
const newColors = colorTokensJson.colors;

export type OldColorNames = keyof typeof oldColors;

export type NewColorNames = keyof typeof newColors;

/**
 * All available colors.
 */
export const colors = { ...oldColors, ...newColors } as const;

/**
 * Get a color hex value by name.
 *
 * @param name
 */
export const color = (name: OldColorNames | NewColorNames) => colors[name];
