import renderer from "react-test-renderer";
import FormFieldAlert from "../../../components/General/Forms/FormFieldAlert";

test("Ensure that the alert is rendered correctly", async () => {
  let formAlert;
  await renderer.act(() => {
    formAlert = renderer.create(<FormFieldAlert />);
  });
  let tree = formAlert.toJSON();
  expect(tree).toMatchSnapshot();
});
