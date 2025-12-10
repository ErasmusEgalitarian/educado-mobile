import { render } from "@testing-library/react-native";
import { CustomProgressBar } from "@/components/Exercise/CustomProgressBar";
import { describe, it, expect } from "@jest/globals";

describe("<CustomProgressBar />", () => {
  const testProgressBar = (
    testName: string,
    progress: [number, number, number],
    expectedLabel: string,
    expectedAccessibilityValue: number,
  ) => {
    it(testName, () => {
      const { getByText, getByTestId } = render(
        <CustomProgressBar progress={progress} width={100} />,
      );
      expect(getByText(expectedLabel)).toBeTruthy();
      const pb = getByTestId("CustomProgressBar.ProgressBar");
      expect((pb.props.accessibilityValue as { now: number }).now).toBeCloseTo(
        expectedAccessibilityValue,
      );
    });
  };

  testProgressBar("Displays 50% (5/10)", [50, 5, 10], "5/10", 0.5);
  testProgressBar("Displays 25% (2/8)", [25, 2, 8], "2/8", 0.25);
  testProgressBar("Displays 0% for no progress (0/10)", [0, 0, 10], "0/10", 0);
  testProgressBar(
    "Displays 100% for full progress (10/10)",
    [100, 10, 10],
    "10/10",
    1,
  );
  testProgressBar(
    "Limits display to 0% for negative progress (-2/10)",
    [-50, -2, 10],
    "-2/10",
    0,
  );
  testProgressBar(
    "Limits display to 100% for excess progress (15/10)",
    [150, 15, 10],
    "15/10",
    1,
  );
});
