import renderer from "react-test-renderer";
import FormButton from "../../../components/General/Forms/FormButton";

test("Ensure that the button is rendered correctly", async () => {
  let formButton;
  await renderer.act(() => {
    formButton = renderer.create(<FormButton />);
  });
  let tree = formButton.toJSON();
  expect(tree).toMatchSnapshot();
});
