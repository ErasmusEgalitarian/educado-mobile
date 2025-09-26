/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    colors: {
      bgPrimary: '#C9E5EC',
      primary: '#246670',
      secondary: '#FAFEFF',
      projectWhite: '#FFFFFF',
      projectBlack: '#383838',
      projectGray: '#A1ACB2',
      lightGray: '#f505b9ff',
      grayMedium: '#A1ACB2',
      error: '#FF4949',
      success: '#4AA04A',
      disable: '#DDD',
      disabled: '#E4F2F5',
      projectRed: '#FFE4E4',
      projectGreen: '#E4F1E4',
      projectLightGray: '#F1F9FB',
      cyanBlue: '#65D4EE',
      limeGreen: '#9DE89C',
      yellow: '#FAC12F',
      babyBlue: '#CFE9EF',
      limeGreenDarker: '#8DD08C',
      correctAnswer: '#00897B',
      wrongAnswer: '#CF6679',
      profileCircle: '#166276',
      pointsText: '#C1A146',
      pointsCoin: '#AD872D',
      progressBar: '#5ECCDD',
      progressBarUnFilled: '#E4F2F5',
      badgesGreen: '#8CC43B',
      badgesPurple: '#C383F7',
      badgesBlue: '#54ADF1',
      emptyProgressBar: '#D8EFF3',
      graytext: '#628397',
    },
    fontFamily: {
      montserrat: ['Montserrat-Regular'],
      'montserrat-bold': ['Montserrat-Bold'],
      'montserrat-semi-bold': ['Montserrat-SemiBold'],
      sans: ['"Montserrat-Regular"'],
      "sans-bold": ["'Montserrat-Bold'"],
      "sans-semi-bold": ["'Montserrat-SemiBold'"],
      bold: ['Montserrat-Bold'],
    },
    extend: {
      fontSize: {
        heading: 32,
        subheading: 24,
        body: 16,
        'caption-medium': 12,
        'caption-small': 10,
      },
      borderRadius: {
        small: 4,
        medium: 8,
        large: 16,
      }
    },
  },
  exports: {
    tailwind: './tailwind.config.js'
  },
  corePlugins: {
    aspectRatio: false,
  },

  plugins: [require('@tailwindcss/aspect-ratio')],
};

