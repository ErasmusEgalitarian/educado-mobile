import { View, Text, Dimensions } from "react-native";
import * as Progress from "react-native-progress";
import { colors } from "@/theme/colors";

interface CustomProgressBarProps {
  progress: number[];
  width: number;
  height: number;
  displayLabel?: boolean;
}

/**
 * A custom progress bar component.
 * @param props - The props object.
 * @param progress - The progress value (0-100), the amount done and the total amount.
 * @param width - The width of the progress bar (in percentage).
 * @param height - The height of the progress bar (in percentage).
 * @param {[props.displayLabel=true]} - Whether to display the bottom text component.
 * @returns - A JSX element representing the custom progress bar.
 */
export const CustomProgressBar = ({
  progress,
  width,
  height,
  displayLabel = true,
}: CustomProgressBarProps) => {
  const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");

  // Ensure progress is between 0 and 100
  progress[0] = Math.min(100, Math.max(0, progress[0]));
  if (isNaN(progress[0])) {
    progress[0] = 0;
  }

  return (
    <View className="flex-row items-center justify-around">
      <Progress.Bar
        progress={progress[0] / 100}
        width={ScreenWidth * (width / 100)}
        height={ScreenHeight * (height / 100)}
        color={colors.surfaceDarker}
        unfilledColor={colors.surfaceLighter}
        borderWidth={0}
        borderRadius={8}
      ></Progress.Bar>
      {displayLabel && (
        <Text
          className="caption-sm-regular px-5 text-center text-projectBlack"
          style={{ color: colors.greyscaleTexticonCaption }}
        >
          {progress[1]}/{progress[2]}
        </Text>
      )}
    </View>
  );
};
