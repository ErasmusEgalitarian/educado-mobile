/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    // Remember to edit theme/colors.ts as well!
    colors: {
      bgprimary_custom: "#166276",
      bgPrimary: "#C9E5EC",
      primary_custom: "#166276",
      secondary: "#F1F9FB",
      projectWhite: "#FFFFFF",
      projectBlack: "#383838",
      projectGray: "#A1ACB2",
      lightGray: "#E4E4E4",
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
      progressBarUnFilled: "#E4E4E4", // This stands more out from the background, but Figma = #E4F2F5
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
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    ({ addUtilities }) => {
      addUtilities({
        ".text-top": {
          textAlignVertical: "top",
        },
      });
    },
  ],
};
