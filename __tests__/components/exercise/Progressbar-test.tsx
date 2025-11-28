import { render } from "@testing-library/react-native";
import { CustomProgressBar } from "@/components/Exercise/CustomProgressBar";
import { describe, it, expect } from "@jest/globals";

describe("<CustomProgressBar />", () => {
  it("Displays 50% (5/10)", () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { getByText, getByTestId } = render(
      <CustomProgressBar progress={[50, 5, 10]} width={100} height={10} />,
    );
    // label render
    expect(getByText("5/10")).toBeTruthy();
    // progress bar mock exposes accessibilityValue. the current progress (0-1)
    const pb = getByTestId("CustomProgressBar.ProgressBar");
    expect(pb.props.accessibilityValue.now).toBeCloseTo(0.5);
  });

  it("Displays 25% (2/8)", () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { getByText, getByTestId } = render(
      <CustomProgressBar progress={[25, 2, 8]} width={100} height={10} />,
    );
    expect(getByText("2/8")).toBeTruthy();
    const pb = getByTestId("CustomProgressBar.ProgressBar");
    expect(pb.props.accessibilityValue.now).toBeCloseTo(0.25);
  });

  it("Displays 0% for no progress (0/10)", () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { getByText, getByTestId } = render(
      <CustomProgressBar progress={[0, 0, 10]} width={100} height={10} />,
    );
    expect(getByText("0/10")).toBeTruthy();
    const pb = getByTestId("CustomProgressBar.ProgressBar");
    expect(pb.props.accessibilityValue.now).toBeCloseTo(0);
  });

  it("Displays 100% for full progress (10/10)", () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { getByText, getByTestId } = render(
      <CustomProgressBar progress={[100, 10, 10]} width={100} height={10} />,
    );
    expect(getByText("10/10")).toBeTruthy();
    const pb = getByTestId("CustomProgressBar.ProgressBar");
    expect(pb.props.accessibilityValue.now).toBeCloseTo(1);
  });

  it("Limits display to 0% for negative progress (-2/10)", () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { getByText, getByTestId } = render(
      <CustomProgressBar progress={[-50, -2, 10]} width={100} height={10} />,
    );
    expect(getByText("-2/10")).toBeTruthy();
    const pb = getByTestId("CustomProgressBar.ProgressBar");
    expect(pb.props.accessibilityValue.now).toBeCloseTo(0);
  });

  it("Limits display to 100% for excess progress (15/10)", () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { getByText, getByTestId } = render(
      <CustomProgressBar progress={[150, 15, 10]} width={100} height={10} />,
    );
    expect(getByText("15/10")).toBeTruthy();
    const pb = getByTestId("CustomProgressBar.ProgressBar");
    expect(pb.props.accessibilityValue.now).toBeCloseTo(1);
  });
});
