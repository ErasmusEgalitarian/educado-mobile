import { View, Text, Dimensions, type DimensionValue } from "react-native";
import { ProgressBar } from "react-native-paper";
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

  // Ensure progress is between 0 and 100
  progress[0] = Math.min(100, Math.max(0, progress[0]));
  if (isNaN(progress[0])) {
    progress[0] = 0;
  }

  const barWidth = ScreenWidth * (width / 100);

  return (
    <View className="flex-row items-center">
      <ProgressBar
        progress={progress[0] / 100}
        color={colors.surfaceDarker}
        // eslint-disable-next-line
        style={{
          /*
            It is not good practice to use eslint-disable, but it is required here, because of the ProgressBar from react-native-paper
            Since the height and width are calculated dynamically, it can't be rendered by passing it to className
            The border radius can't be passed by className either, as it will be overlooked because of the style={}
          */
          backgroundColor: colors.surfaceLighterCyan,
          width: barWidth,
          height: 9,
          borderRadius: 10,
        }}
      />
      {displayLabel && (
        <Text className="px-6 text-center text-textBodyGrayscale text-caption-sm-regular">
          {progress[1]}/{progress[2]}
        </Text>
      )}
    </View>
  );
};
