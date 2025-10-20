import { ESLintUtils } from "@typescript-eslint/utils";
import type { TSESTree } from "@typescript-eslint/types";
import { extractClassString } from "@/utils/base";
import { tailwindTextSizeSuffixes } from "@/utils/constants";

export interface Docs {
  description: string;
  recommended?: boolean;
  requiresTypeChecking?: boolean;
}

type MessageIds =
  | "invalidClass"
  | "legacyFontClass"
  | "tailwindTypographyClass";

type Options = [
  {
    allowedTextStyles: string[];
  },
];

const createRule = ESLintUtils.RuleCreator<Docs>(
  (name) => `eslint-plugin-educado/${name}`,
);

const tailwindFontSizeRegex = new RegExp(
  `^text-(${tailwindTextSizeSuffixes.join("|")}|\\[[a-z0-9]+]$)`,
);

const tailwindTypographyPatterns = [
  // Font family
  /\bfont-(sans|serif|mono)\b/,

  // Font size
  tailwindFontSizeRegex,

  // Font style
  /\b(italic|not-italic)\b/,

  // Font weight
  /\bfont-(thin|extralight|light|normal|medium|semibold|bold|extrabold)\b/,

  // Line height
  /\bleading-([0-9]+|none|tight|snug|normal|relaxed|loose)\b/,

  // Text color
  /\btext-(inherit|current|transparent)\b/,

  // Text transform
  /\b(uppercase|lowercase|capitalize|normal-case)\b/,
];

export const noDisallowedTypographyClasses = createRule<Options, MessageIds>({
  create: (context, options) => {
    const allowedTextStyles = new Set(options[0].allowedTextStyles);

    return {
      JSXAttribute: (node: TSESTree.JSXAttribute) => {
        if (
          !["className", "class", "fontStyle"].includes(
            typeof node.name.name === "string" ? node.name.name : "",
          )
        ) {
          return;
        }

        const classString = extractClassString(node);

        if (!classString) {
          return;
        }

        const classes = classString.split(/\s+/).filter(Boolean);

        classes.forEach((className) => {
          if (!className) {
            return;
          }

          if (allowedTextStyles.has(className)) {
            return;
          }

          if (
            /\bfont-(montserrat|montserrat-bold|montserrat-semi-bold|sans-bold|bold|semibold|medium)\b/.test(
              className,
            )
          ) {
            context.report({
              node,
              messageId: "legacyFontClass",
              data: {
                className,
              },
            });

            return;
          }

          if (/\btext-(body)\b/.test(className)) {
            context.report({
              node,
              messageId: "invalidClass",
              data: {
                className,
              },
            });

            return;
          }

          for (const pattern of tailwindTypographyPatterns) {
            if (pattern.test(className)) {
              context.report({
                node,
                messageId: "tailwindTypographyClass",
                data: {
                  className,
                },
              });

              return;
            }
          }
        });
      },
    };
  },
  name: "no-disallowed-typography-classes",
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce using canonical text-* presets instead of individual typography classes",
      recommended: true,
      requiresTypeChecking: false,
    },
    messages: {
      legacyFontClass:
        "Legacy font class `{{ className }}` is deprecated. Use a canonical `text-*` preset (e.g., `text-body-regular`, `text-h1-sm-bold`) from `theme/typography.tokens.json` instead",
      tailwindTypographyClass:
        "Tailwind typography class `{{ className }}` is not allowed. Use a canonical `text-*` preset (e.g., `text-body-regular`, `text-h1-sm-bold`) from `theme/typography.tokens.json` instead",
      invalidClass:
        "Typography class `{{ className }}` is not allowed. Use a canonical `text-*` preset (e.g., `text-body-regular`, `text-h1-sm-bold`) from `theme/typography.tokens.json` instead",
    },
    schema: [
      {
        type: "object",
        properties: {
          allowedTextStyles: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        required: ["allowedTextStyles"],
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [
    {
      allowedTextStyles: [],
    },
  ],
});
