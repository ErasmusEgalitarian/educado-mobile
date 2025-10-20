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
  | "invalidColorClass"
  | "legacyColorClass"
  | "tailwindColorClass"
  | "arbitraryColorClass";

type Options = [
  {
    allowedColors: string[];
    disallowedColors: string[];
    ignoredTextClasses?: string[];
  },
];

const createRule = ESLintUtils.RuleCreator<Docs>(
  (name) => `eslint-plugin-educado/${name}`,
);

/**
 * Built-in colors.
 */
export const tailwindColors = [
  "black",
  "white",
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
] as const;

/**
 * Tailwind utilities that accept color values.
 */
const tailwindColorUtils = [
  "bg",
  "text",
  "border",
  "divide",
  "fill",
  "stroke",
  "ring",
  "outline",
  "accent",
  "caret",
  "from",
  "via",
  "to",
] as const;

/**
 * Non-color infixes that we should ignore.
 */
const nonColorInfixes = [
  "gradient",
  "clip",
  "origin",
  "repeat",
  "no-repeat",
  "fixed",
  "local",
  "scroll",
  "cover",
  "contain",
  "auto",
  "center",
  "bottom",
  "left",
  "right",
  "top",
  "none",
  "blend",
  "size",
  "opacity",
  "base",
  "b$",
  "\\[[a-z0-9]+\\]",
] as const;

const utils = new Set(tailwindColorUtils as readonly string[]);

/**
 * orange<-500>
 */
const tailwindColorRegex = new RegExp(
  `^(?:${tailwindColors.join("|")})(?:-[0-9]{2,3})?$`,
);

/**
 * text-lg
 * text-[15px]
 */
const tailwindFontSizeRegex = new RegExp(
  `^${tailwindTextSizeSuffixes.join("|")}|\\[[a-z0-9]+]$`,
);

/**
 * bg-gradient-to-r
 */
const isBgNonColorValue = new RegExp(
  `^${nonColorInfixes.join("|")}(-[a-z-]+)?$`,
);

/**
 * <variants:>*(util)-(value)[/(opacity)]
 */
const colorRegex = new RegExp(
  `^(?:[a-z-]+:)*(?<util>${tailwindColorUtils.join("|")})-(?<value>\\[[^\\]]+]|[A-Za-z][\\w-]*)(?:\\/(?<opacity>[\\w.[\\]-]+))?$`,
);

export const noDisallowedColorClasses = createRule<Options, MessageIds>({
  create: (context, [options]) => {
    const allowedColors = new Set(options.allowedColors);
    const disallowedColors = new Set(options.disallowedColors);
    const ignoredTextClasses = new Set(options.ignoredTextClasses ?? []);

    const report = (className: string, node: TSESTree.JSXAttribute) => {
      const match = colorRegex.exec(className);

      if (!match?.groups) {
        return;
      }

      const util = match.groups.util;
      const value = match.groups.value;

      if (!utils.has(util)) {
        return;
      }

      if (util === "text" && ignoredTextClasses.has(className)) {
        return;
      }

      if (isBgNonColorValue.test(value)) {
        return;
      }

      if (value.startsWith("[#")) {
        context.report({
          node,
          messageId: "arbitraryColorClass",
          data: {
            className,
          },
        });

        return;
      }

      if (allowedColors.has(value)) {
        return;
      }

      if (disallowedColors.has(value)) {
        context.report({
          node,
          messageId: "legacyColorClass",
          data: {
            className,
          },
        });

        return;
      }

      if (tailwindFontSizeRegex.test(value)) {
        return;
      }

      if (tailwindColorRegex.test(value)) {
        context.report({
          node,
          messageId: "tailwindColorClass",
          data: {
            className,
          },
        });

        return;
      }

      context.report({
        node,
        messageId: "invalidColorClass",
        data: {
          className,
        },
      });
    };

    return {
      JSXAttribute: (node: TSESTree.JSXAttribute) => {
        if (node.name.name !== "className" && node.name.name !== "class") {
          return;
        }

        const classString = extractClassString(node);

        if (!classString) {
          return;
        }

        const classes = classString.split(/\s+/).filter(Boolean);

        classes.forEach((className) => {
          report(className, node);
        });
      },
    };
  },
  name: "no-disallowed-color-classes",
  meta: {
    type: "problem",
    docs: {
      description:
        "Allow only `new-colors` tokens in Tailwind color utilities. Ban legacy/built-in/arbitrary colors",
      recommended: true,
      requiresTypeChecking: false,
    },
    messages: {
      invalidColorClass:
        "Invalid color class `{{ className }}`. Replace with a token from `colors` (e.g., `text-textTitleGrayscale`) in `theme/color.tokens.json`",
      legacyColorClass:
        "Legacy color class `{{ className }}` is deprecated. Replace with a token from `colors` (e.g., `text-textTitleGrayscale`) in `theme/color.tokens.json`",
      tailwindColorClass:
        "Tailwind color class `{{ className }}` is not allowed. Replace with a token from `colors` (e.g., `text-textTitleGrayscale`) in `theme/color.tokens.json`",
      arbitraryColorClass:
        "Arbitrary color class `{{ className }}` is not allowed. Replace with a token from `colors` (e.g., `text-textTitleGrayscale`) in `theme/color.tokens.json`",
    },
    schema: [
      {
        type: "object",
        properties: {
          allowedColors: {
            type: "array",
            items: {
              type: "string",
            },
          },
          disallowedColors: {
            type: "array",
            items: {
              type: "string",
            },
          },
          ignoredTextClasses: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        required: ["allowedColors", "disallowedColors"],
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [
    {
      allowedColors: [],
      disallowedColors: [],
      ignoredTextClasses: [],
    },
  ],
});
