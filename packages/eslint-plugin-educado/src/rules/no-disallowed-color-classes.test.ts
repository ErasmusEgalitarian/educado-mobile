import * as vitest from "vitest";
import { RuleTester } from "@typescript-eslint/rule-tester";
import { noDisallowedColorClasses } from "@/rules/no-disallowed-color-classes";

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

const allowedColors = ["surfaceSubtleGrayscale", "surfaceDefaultGrayscale"];
const disallowedColors = ["pointsCoin"];
const ignoredTextClasses = ["text-subtitle-regular"];

ruleTester.run("no-disallowed-color-classes", noDisallowedColorClasses, {
  valid: [
    {
      code: '<Text className="text-surfaceSubtleGrayscale" />',
      options: [{ allowedColors, disallowedColors, ignoredTextClasses }],
    },
    {
      code: '<Text className="text-center" />',
      options: [{ allowedColors, disallowedColors, ignoredTextClasses }],
    },
    {
      code: '<Text className="border-surfaceDefaultGrayscale" />',
      options: [{ allowedColors, disallowedColors, ignoredTextClasses }],
    },
    {
      code: '<Text className="bg-gradient-to-r from-surfaceSubtleGrayscale to-surfaceSubtleGrayscale" />',
      options: [{ allowedColors, disallowedColors, ignoredTextClasses }],
    },
    {
      code: '<Text className="text-base" />',
      options: [{ allowedColors, disallowedColors, ignoredTextClasses }],
    },
    {
      code: '<View className="mt-1 w-[40%] border-b" />',
      options: [{ allowedColors, disallowedColors, ignoredTextClasses }],
    },
    {
      code: '<View className="relative m-2 flex max-h-[33%] min-h-[260px] items-center rounded-lg border-[3px]" />',
      options: [{ allowedColors, disallowedColors, ignoredTextClasses }],
    },
    {
      code: '<Text className="text-lg" />',
      options: [{ allowedColors, disallowedColors, ignoredTextClasses }],
    },
    {
      code: '<Text className="text-subtitle-regular" />',
      options: [{ allowedColors, disallowedColors, ignoredTextClasses }],
    },
  ],
  invalid: [
    {
      code: '<Text className="bg-black" />',
      errors: [
        {
          messageId: "tailwindColorClass",
          data: {
            className: "bg-black",
          },
        },
      ],
      options: [{ allowedColors, disallowedColors, ignoredTextClasses }],
    },
    {
      code: '<View className="bg-red-500/50" />',
      errors: [
        {
          messageId: "tailwindColorClass",
          data: {
            className: "bg-red-500/50",
          },
        },
      ],
      options: [{ allowedColors, disallowedColors, ignoredTextClasses }],
    },
    {
      code: '<Text className="text-pointsCoin" />',
      errors: [
        {
          messageId: "legacyColorClass",
          data: {
            className: "text-pointsCoin",
          },
        },
      ],
      options: [{ allowedColors, disallowedColors, ignoredTextClasses }],
    },
    {
      code: '<Text className="bg-[#fff]" />',
      errors: [
        {
          messageId: "arbitraryColorClass",
          data: {
            className: "bg-[#fff]",
          },
        },
      ],
      options: [{ allowedColors, disallowedColors, ignoredTextClasses }],
    },
    {
      code: '<View className="bg-notAColor" />',
      errors: [
        {
          messageId: "invalidColorClass",
          data: {
            className: "bg-notAColor",
          },
        },
      ],
      options: [{ allowedColors, disallowedColors, ignoredTextClasses }],
    },
    {
      code: '<Text className="text-gray-600 pt-4" />',
      errors: [
        {
          messageId: "tailwindColorClass",
          data: {
            className: "text-gray-600",
          },
        },
      ],
      options: [{ allowedColors, disallowedColors, ignoredTextClasses }],
    },
  ],
});
