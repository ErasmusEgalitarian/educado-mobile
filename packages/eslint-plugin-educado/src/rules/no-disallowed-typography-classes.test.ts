import * as vitest from "vitest";
import { RuleTester } from "@typescript-eslint/rule-tester";
import { noDisallowedTypographyClasses } from "@/rules/no-disallowed-typography-classes";

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

const allowedTextStyles = ["text-body-bold"];

ruleTester.run(
  "no-disallowed-typography-classes",
  noDisallowedTypographyClasses,
  {
    valid: [
      {
        code: '<Text className="text-body-bold" />',
        options: [{ allowedTextStyles }],
      },
      {
        code: '<Text className="text-black" />',
        options: [{ allowedTextStyles }],
      },
    ],
    invalid: [
      {
        code: '<Text className="text-base" />',
        errors: [
          {
            messageId: "tailwindTypographyClass",
            data: {
              className: "text-base",
            },
          },
        ],
        options: [{ allowedTextStyles }],
      },
      {
        code: '<Text className="text-xs" />',
        errors: [
          {
            messageId: "tailwindTypographyClass",
            data: {
              className: "text-xs",
            },
          },
        ],
        options: [{ allowedTextStyles }],
      },
      {
        code: '<Text className="text-body" />',
        errors: [
          {
            messageId: "invalidClass",
            data: {
              className: "text-body",
            },
          },
        ],
        options: [{ allowedTextStyles }],
      },
      {
        code: '<Text className="font-montserrat-semi-bold" />',
        errors: [
          {
            messageId: "legacyFontClass",
            data: {
              className: "font-montserrat-semi-bold",
            },
          },
        ],
        options: [{ allowedTextStyles }],
      },
      {
        code: '<AnimatedNumbers animateToNumber={coursePoints} animationDuration={500} fontStyle={"font-sans-bold text-center"} />',
        errors: [
          {
            messageId: "legacyFontClass",
            data: {
              className: "font-sans-bold",
            },
          },
        ],
        options: [{ allowedTextStyles }],
      },
      {
        code: '<Text className={`font-sans-bold text-sm ${isCorrectAnswer === true ? "text-correctAnswer" : "text-wrongAnswer"}`}>{randomPhrase}</Text>',
        errors: [
          {
            messageId: "legacyFontClass",
            data: {
              className: "font-sans-bold",
            },
          },
          {
            messageId: "tailwindTypographyClass",
            data: {
              className: "text-sm",
            },
          },
        ],
        options: [{ allowedTextStyles }],
      },
      {
        code: '<Text className="text-center text-[24px]" />',
        errors: [
          {
            messageId: "tailwindTypographyClass",
            data: {
              className: "text-[24px]",
            },
          },
        ],
        options: [{ allowedTextStyles }],
      },
      {
        code: '<Text className="text-base/7" />',
        errors: [
          {
            messageId: "tailwindTypographyClass",
            data: {
              className: "text-base/7",
            },
          },
        ],
        options: [{ allowedTextStyles }],
      },
    ],
  },
);
