import AsyncStorage from "@react-native-async-storage/async-storage";
import renderer from "react-test-renderer";
import Profile from "../../../screens/Profile/Profile";
const { fireEvent, render } = require("@testing-library/react-native");
import LogOutButton from "../../../components/Profile/LogOutButton";

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

describe("LogOutButton render", () => {
  it("should render correctly", () => {
    const logoutButton = renderer.create(<LogOutButton />);
    expect(logoutButton).toMatchSnapshot();
  });
});

describe("Logout", () => {
  it("should delete token when logging out", async () => {
    let profile;

    const mockToken = "testToken";
    // Set token
    AsyncStorage.setItem("@loginToken", mockToken).then(async () => {
      // Check if token is set
      await AsyncStorage.getItem("@loginToken").expect(mockToken);
      profile = render(<Profile />);

      // Check if token is deleted when logout button pressed
      const LogOutButton = profile.root.findByProps({ testID: "logoutBtn" });

      fireEvent.press(LogOutButton);

      // Check if token is null after logout
      const updatedToken = await AsyncStorage.getItem("@loginToken");
      expect(updatedToken).toBeNull();
    });
  });

  it("should delete userInfo when logging out", async () => {
    let profile;

    const mockUserInfo = {
      id: "123",
      firstName: "Is",
      lastName: "User",
      email: "is@user.com",
    };

    // Set user info
    AsyncStorage.setItem("@userInfo", mockUserInfo).then(async () => {
      // Check if user info is set
      await AsyncStorage.getItem("@userInfo").expect(mockUserInfo);
      profile = render(<Profile />);

      // Press logout button
      const LogOutButton = profile.root.findByProps({ testID: "logoutBtn" });

      fireEvent.press(LogOutButton);

      // Check if user info is null after logout
      const updatedUserInfo = await AsyncStorage.getItem("@userInfo");
      expect(updatedUserInfo).toBeNull();
    });
  });

  it("should navigate to login screen when logging out", () => {
    let profile;

    const mockToken = "testToken";
    // Set token
    AsyncStorage.setItem("@loginToken", mockToken).then(async () => {
      // Check if token is set
      await AsyncStorage.getItem("@loginToken").expect(mockToken);
      profile = render(<Profile />);

      const LogOutButton = profile.root.findByProps({ testID: "logoutBtn" });

      fireEvent.press(LogOutButton);

      // Check if navigation is called after logout
      expect(useNavigation().navigate).toHaveBeenCalled();
    });
  });
});
