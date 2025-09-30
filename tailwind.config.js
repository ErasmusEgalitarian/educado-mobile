/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      bgprimary_custom: "#166276",
      bgPrimary: "#C9E5EC",
      primary_custom: "#166276",
      secondary: "#F1F9FB",
      projectWhite: "#FFFFFF",
      projectBlack: "#383838",
      projectGray: "#A1ACB2",
      lightGray: "#E4E4E4", // Now aligned with Figma, but used to be #E5E5E5
      error: "#FF4949",
      success: "#4AA04A",
      disable: "#DDD",
      disabled: "#E4F2F5",
      projectRed: "#FFE4E4",
      projectGreen: "#E4F1E4",
      projectLightGray: "#F1F9FB",
      cyanBlue: "#166276",
      limeGreen: "#9DE89C",
      yellow: "#FAC12F",
      babyBlue: "#166276",
      limeGreenDarker: "#8DD08C",
      correctAnswer: "#00897B",
      wrongAnswer: "#CF6679",
      profileCircle: "#166276",
      pointsText: "#C1A146",
      pointsCoin: "#AD872D",
      progressBar: "#166276",
      progressBarUnFilled: "#E4E4E4", // <- This stands more out from background, but Figma = #E4F2F5
      badgesGreen: "#8CC43B",
      badgesPurple: "#C383F7",
      badgesBlue: "#54ADF1",
      unselectedStar: "#CBCAB8",
    },
    fontFamily: {
      montserrat: ["Montserrat-Regular"],
      "montserrat-bold": ["Montserrat-Bold"],
      "montserrat-semi-bold": ["Montserrat-SemiBold"],
      sans: ['"Montserrat-Regular"'],
      "sans-bold": ["'Montserrat-Bold'"],
      "sans-semi-bold": ["'Montserrat-SemiBold'"],
      bold: ["Montserrat-Bold"],
    },
    extend: {
      fontSize: {
        heading: 32,
        subheading: 24,
        "body-large": 18,
        body: 16,
        "body-small": 14,
        "caption-medium": 12,
        "caption-small": 10,
      },
      borderRadius: {
        small: 4,
        medium: 8,
        large: 16,
      },
    },
  },
  exports: {
    tailwind: "./tailwind.config.js",
  },
  corePlugins: {
    aspectRatio: false,
  },

  plugins: [
    require("@tailwindcss/aspect-ratio"),
    function ({ addUtilities }) {
      addUtilities({
        ".text-top": {
          textAlignVertical: "top",
        },
      });
    },
  ],
};
