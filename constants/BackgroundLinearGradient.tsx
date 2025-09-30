import { LinearGradient } from "expo-linear-gradient";
import PropTypes from "prop-types";

export function BackgroundLinearGradient({ children }) {
  const tailwindConfig = require("../tailwind.config.js");
  const projectColors = tailwindConfig.theme.colors;

  const gradientColors = [projectColors.bgPrimary, projectColors.projectWhite];

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 1, y: 0.2 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      {children}
    </LinearGradient>
  );
}

BackgroundLinearGradient.propTypes = {
  children: PropTypes.object.isRequired,
};
