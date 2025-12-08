import { View, Text, Dimensions, type DimensionValue } from "react-native";
import { colors } from "@/theme/colors";

interface CustomProgressBarProps {
  progress: number[];
  width: number;
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
  displayLabel = true,
}: CustomProgressBarProps) => {
  const { width: ScreenWidth } = Dimensions.get("window");
  const barWidth = ScreenWidth * (width / 100);

  // Ensure progress is between 0 and 100
  progress[0] = Math.min(100, Math.max(0, progress[0]));
  if (isNaN(progress[0])) {
    progress[0] = 0;
  }

  const progressBarStyle = {
    width: `${String(progress[0])}%` as DimensionValue,
    backgroundColor: colors.surfaceDefaultCyan,
  };

  return (
    <View className="flex-row items-center">
      <View
        className="h-[9] overflow-hidden rounded-full bg-surfaceLighterCyan"
        style={{ width: barWidth }}
      >
        <View className="h-full rounded-full" style={progressBarStyle} />
      </View>
      {displayLabel && (
        <Text className="px-2 text-center text-textBodyGrayscale text-caption-sm-regular">
          {progress[1]}/{progress[2]}
        </Text>
      )}
    </View>
  );
};
