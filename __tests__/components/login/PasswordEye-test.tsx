import renderer from "react-test-renderer";
import PasswordEye from "../../../components/General/Forms/PasswordEye";

const mockFunction = jest.fn();

test("Ensure that the field is rendered correctly without props", async () => {
  let passwordEye;
  await renderer.act(() => {
    passwordEye = renderer.create(<PasswordEye />);
  });
  let tree = passwordEye.toJSON();
  expect(tree).toMatchSnapshot();
});

test("Ensure that the field props are rendered correctly with props", async () => {
  let passwordEye;
  await renderer.act(() => {
    passwordEye = renderer.create(
      <PasswordEye name="eye" size={24} color="gray" onPress={mockFunction} />,
    );
  });
  expect(passwordEye.root.props.name).toBe("eye");
  expect(passwordEye.root.props.size).toBe(24);
  expect(passwordEye.root.props.color).toBe("gray");
  expect(passwordEye.root.props.onPress).toBe(mockFunction);
});
