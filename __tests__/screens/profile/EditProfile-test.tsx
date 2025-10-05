import renderer from "react-test-renderer";
import EditProfileScreen from "../../../screens/Profile/EditProfileScreen";

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
  useFocusEffect: jest.fn(),
}));

let editProfileScreen;

beforeEach(async () => {
  await renderer.act(() => {
    editProfileScreen = renderer.create(<EditProfileScreen />);
  });
});

describe("Edit profile", () => {
  it("Should not display alerts when information is valid, and button should be enabled", async () => {
    const firstName = editProfileScreen.root.findByProps({
      testId: "firstName",
    });
    const firstNameAlert = editProfileScreen.root.findByProps({
      testId: "firstNameAlert",
    });
    const lastName = editProfileScreen.root.findByProps({ testId: "lastName" });
    const lastNameAlert = editProfileScreen.root.findByProps({
      testId: "lastNameAlert",
    });
    const email = editProfileScreen.root.findByProps({ testId: "email" });
    const emailAlert = editProfileScreen.root.findByProps({
      testId: "emailAlert",
    });
    await renderer.act(async () => {
      firstName.props.onChangeText("Mantis");
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(firstNameAlert.props.label).toBe("");
    });
    await renderer.act(async () => {
      lastName.props.onChangeText("Toboggan");
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(lastNameAlert.props.label).toBe("");
    });
    await renderer.act(async () => {
      email.props.onChangeText("man@tis.com");
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(emailAlert.props.label).toBe("");
    });
  });

  it("Should display alerts when information is invalid, and button should be disabled", async () => {
    const firstName = editProfileScreen.root.findByProps({
      testId: "firstName",
    });
    const firstNameAlert = editProfileScreen.root.findByProps({
      testId: "firstNameAlert",
    });
    const lastName = editProfileScreen.root.findByProps({ testId: "lastName" });
    const lastNameAlert = editProfileScreen.root.findByProps({
      testId: "lastNameAlert",
    });
    const email = editProfileScreen.root.findByProps({ testId: "email" });
    const emailAlert = editProfileScreen.root.findByProps({
      testId: "emailAlert",
    });
    await renderer.act(() => {
      firstName.props.onChangeText("Mantis1");
      expect(firstNameAlert.props.label).not.toBe("");
      lastName.props.onChangeText("Toboggan2");
      expect(lastNameAlert.props.label).not.toBe("");
      email.props.onChangeText("man@tis.m");
      expect(emailAlert.props.label).not.toBe("");
    });
  });
});
