/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    // Remember to edit theme/colors.ts as well!

    // **********************
    // ***** Gray Scale *****
    // **********************
    // Surface
    surfaceSubtleGrayscale: "#FDFEFF",
    surfaceDefaultGrayscale: "#EBF0F2",
    surfaceDisabledGrayscale: "#C1CFD7",

    // Border
    borderDefaultGrayscale: "#809CAD",
    borderDisabledGrayscale: "#9FB4C1",
    borderDarkerGrayscale: "#3A4E5A",

    // Text
    textTitleGrayscale: "#141B1F",
    textBodyGrayscale: "#28363E",
    textSubtitleGrayscale: "#4E6879",
    textCaptionGrayscale: "#628397",
    textNegativeGrayscale: "#FDFEFF",
    textDisabledGrayscale: "#C1CFD7",

    // ******************
    // ***** Cyan *******
    // ******************
    // Surface
    surfaceSubtleCyan: "#FAFEFF",
    surfaceLighterCyan: "#D8EFF3",
    surfaceDefaultCyan: "#35A1B1",
    surfaceDarkerCyan: "#35A1B1",
    // Border
    borderSubtleCyan: "#D8EFF3",
    borderLighterCyan: "#D8EFF3",
    borderDefaultCyan: "#D8EFF3",
    borderDarkerCyan: "#246670",

    // Text
    textLabelCyan: "#246670",

    // ******************
    // ***** green ******
    // ******************
    // Surface
    surfaceSubtleGreen: "#E6FAC8",
    surfaceLighterGreen: "#C6F27E",
    surfaceDefaultGreen: "#70A31F",
    surfaceDarkerGreen: "#3A5313",

    // Border
    borderSubtleGreen: "#E6FAC8",
    borderLighterGreen: "#C6F27E",
    borderDefaultGreen: "#70A31F",
    borderDarkerGreen: "#3A5313",

    // Text
    textLabelGreen: "#3A5313",

    // ******************
    // ***** Red ********
    // ******************
    // Surface
    surfaceSubtleRed: "#FFDECC",
    surfaceLighterRed: "#F28985",
    surfaceDefaultRed: "#D62B25",
    surfaceDarkerRed: "#600000",

    // Border
    borderSubtleRed: "#FFDECC",
    borderLighterRed: "#F28985",
    borderDefaultRed: "#D62B25",
    borderDarkerRed: "#600000",

    // Text
    textLabelRed: "#600000",

    // ******************
    // ***** Purple *****
    // ******************
    // Surface
    surfaceSubtlePurple: "#E4CCFF",
    surfaceLighterPurple: "#C091F2",
    surfaceDefaultPurple: "#8956BF",
    surfaceDarkerPurple: "#2F0E53",

    // Border
    borderSubtlePurple: "#E4CCFF",
    borderLighterPurple: "#C091F2",
    borderDefaultPurple: "#8956BF",
    borderDarkerPurple: "#2F0E53",

    // Text
    textLabelPurple: "#2F0E53",

    // *******************
    // ***** Magenta *****
    // *******************
    // Surface
    surfaceSubtleMagenta: "#FFFAFE",
    surfaceLighterMagenta: "#F3D8ED",
    surfaceDefaultMagenta: "#BD3DA2",
    surfaceDarkerMagenta: "#70245F",

    // Border
    borderSubtleMagenta: "#F3D8ED",
    borderLighterMagenta: "#D887C7",
    borderDefaultMagenta: "#BD3DA2",
    borderDarkerMagenta: "#70245F",

    // Text
    textLabelMagenta: "#70245F",

    // ******************
    // ***** Others *****
    // ******************
    surfaceYellow: "#F1CC4F",

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
