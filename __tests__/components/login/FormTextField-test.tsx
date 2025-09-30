import renderer from "react-test-renderer";
import FormTextField from "../../../components/General/Forms/FormTextField";

test("Ensure that the text field is rendered correctly", async () => {
  let textField;
  await renderer.act(() => {
    textField = renderer.create(<FormTextField />);
  });
  let tree = textField.toJSON();
  expect(tree).toMatchSnapshot();
});

test("Ensure that the field props are rendered correctly", async () => {
  let textField;
  await renderer.act(async () => {
    textField = renderer.create(
      <FormTextField
        placeholder="Test"
        keyboardType="default"
        secureTextEntry={false}
        onChangeText={() => {
          return;
        }}
        value="Test"
      />,
    );
  });
  expect(textField.root.props.placeholder).toBe("Test");
  expect(textField.root.props.keyboardType).toBe("default");
  expect(textField.root.props.secureTextEntry).toBe(false);
  expect(textField.root.props.onChangeText).toBeDefined();
  expect(textField.root.props.value).toBe("Test");
});
