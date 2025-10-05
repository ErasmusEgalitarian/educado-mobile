import { render } from "@testing-library/react-native";
import CustomProgressBar from "../../../components/Exercise/CustomProgressBar";
import renderer from "react-test-renderer";

describe("<CustomProgressBar />", () => {
  it("Displays 50%", () => {
    const component = renderer.create(
      <CustomProgressBar progress={50} width={100} height={10} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Displays 25%", () => {
    const component = renderer.create(
      <CustomProgressBar progress={25} width={100} height={10} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Displays 0% for no progress", () => {
    const component = renderer.create(
      <CustomProgressBar progress={0} width={100} height={10} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Displays 100% for full progress", () => {
    const component = renderer.create(
      <CustomProgressBar progress={100} width={100} height={10} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Limits display to 0% for negative progress", () => {
    const component = renderer.create(
      <CustomProgressBar progress={-50} width={100} height={10} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Limits display to 100% for excess progress", () => {
    const component = renderer.create(
      <CustomProgressBar progress={150} width={100} height={10} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
