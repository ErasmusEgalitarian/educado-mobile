import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
// eslint-disable-next-line no-restricted-imports
import { colors } from "./theme/colors";
// eslint-disable-next-line no-restricted-imports
import { typographyPlugin } from "./theme/typography";

export default {
  content: [
    "./App.tsx",
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./screens/**/*.{ts,tsx}",
  ],
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  presets: [require("nativewind/preset")],
  theme: {
    colors,
    extend: {
      fontFamily: {
        sans: ["Montserrat_400Regular"],
        "mont-400": ["Montserrat_400Regular"],
        "mont-400-italic": ["Montserrat_400Regular_Italic"],
        "mont-500": ["Montserrat_500Medium"],
        "mont-600": ["Montserrat_600SemiBold"],
        "mont-600-italic": ["Montserrat_600SemiBold_Italic"],
        "mont-700": ["Montserrat_700Bold"],
        "mont-700-italic": ["Montserrat_700Bold_Italic"],
        "mont-800": ["Montserrat_800ExtraBold"],
      },
      fontSize: {
        heading: "32px",
        subheading: "24px",
        "body-large": "18px",
        body: "16px",
        "body-small": "14px",
        "caption-medium": "12px",
        "caption-small": "10px",
      },
      borderRadius: {
        small: "4px",
        medium: "8px",
        large: "16px",
      },
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    plugin((pluginApi) => {
      pluginApi.addUtilities({
        ".text-top": {
          textAlignVertical: "top",
        },
      });
    }),
    typographyPlugin,
  ],
} satisfies Config;
