import renderer from "react-test-renderer";
import ProfileComponent from "../../../screens/Profile/Profile";
import AsyncStorage from "@react-native-async-storage/async-storage";

let navigated = false;

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(() => {
      navigated = true;
    }),
    addListener: jest.fn((event, callback) => {
      if (event === "focus") callback(); // Immediately trigger the callback for testing purposes
    }),
  }),
  useFocusEffect: jest.fn(),
}));

jest.mock("../../../hooks/NetworkStatusObserver", () => ({
  __esModule: true,
  default: ({ setIsOnline }) => {
    setIsOnline(true);
    return null;
  },
}));

describe("Profile screen", () => {
  let profileScreen;

  beforeEach(() => {
    navigated = false;
    AsyncStorage.clear();
    profileScreen = renderer.create(<ProfileComponent />);
    isOnline = true;
  });

  it("Pressing edit profile, navigates to the edit profile page", async () => {
    const testInstance = profileScreen.root;

    const editProfileNav = testInstance.findAllByProps({
      testId: "editProfileNav",
    })[0];

    await renderer.act(() => {
      editProfileNav.props.onPress();
    });
    expect(navigated).toBe(true);
  });
});
