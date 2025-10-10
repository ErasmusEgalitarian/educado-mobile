import * as React from "react";
import { View, Text } from "react-native";
import * as Progress from "react-native-progress";
import PropTypes from "prop-types";
import { ScreenWidth, ScreenHeight } from "@rneui/base";
import tailwindConfig from "../../tailwind.config.js";

const projectColors = tailwindConfig.theme.colors;

/**
 * A custom progress bar component.
 * @param {Object} props - The props object.
 * @param {number} props.progress - The progress value (0-100).
 * @param {number} props.width - The width of the progress bar (in percentage).
 * @param {number} props.height - The height of the progress bar (in percentage).
 * @param {boolean} [props.displayLabel=true] - Whether to display the bottom text component.
 * @returns {JSX.Element} - A JSX element representing the custom progress bar.
 */
const CustomProgressBar = ({
  progress,
  width,
  height,
  displayLabel = true,
}) => {
  CustomProgressBar.propTypes = {
    progress: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    displayLabel: PropTypes.bool,
  };

  // Ensure progress is between 0 and 100
  progress = Math.min(100, Math.max(0, progress));
  if (isNaN(progress)) {
    progress = 0;
  }

  return (
    <View className="flex-row items-center justify-around">
      <Progress.Bar
        progress={progress / 100}
        width={ScreenWidth * (width / 100)}
        height={ScreenHeight * (height / 100)}
        color={projectColors.progressBar}
        unfilledColor={projectColors.progressBarUnFilled}
        borderWidth={0}
        borderRadius={8}
      ></Progress.Bar>
      {displayLabel && (
        <Text className="font-montserrat-bold px-5 text-center text-caption-medium text-projectBlack">
          {progress}%
        </Text>
      )}
    </View>
  );
};

export default CustomProgressBar;
