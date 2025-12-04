import { View, ViewProps } from "react-native";

type ProgressBarProps = ViewProps & {
  progress?: number;
  testID?: string;
};

/**
 * Minimal TypeScript mock for `react-native-paper`'s ProgressBar used in tests.
 * It renders a simple View and exposes the numeric `progress` value under
 * `accessibilityValue.now` so tests can make deterministic assertions.
 */
export const ProgressBar = ({
  progress = 0,
  testID = "CustomProgressBar.ProgressBar",
  ...props
}: ProgressBarProps) => {
  return (
    <View testID={testID} accessibilityValue={{ now: progress }} {...props} />
  );
};
