import renderer from "react-test-renderer";
import WelcomeScreen from "../../../screens/Welcome/WelcomeScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWelcomeScreenLogic } from "../../../App"; // Update the import path as needed

let navigated = false;

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(() => {
      navigated = true;
    }),
  }),
  useRoute: jest.fn(),
}));

jest.mock("@react-navigation/bottom-tabs", () => ({
  createBottomTabNavigator: jest.fn(),
}));

jest.mock("@react-navigation/native-stack", () => ({
  createNativeStackNavigator: jest.fn(),
}));

jest.mock("expo-camera", () => ({
  Camera: jest.fn(),
}));

let welcomeScreen;

beforeEach(() => {
  navigated = false;
  AsyncStorage.clear();
  welcomeScreen = renderer.create(<WelcomeScreen />);
});

afterEach(() => {
  welcomeScreen.unmount();
});

describe("WelcomeScreen", () => {
  it("renders welcomeScreen correctly", () => {
    expect(welcomeScreen.toJSON()).toMatchSnapshot();
  });

  it("renders welcomeScreen correctly with default route", () => {
    require("@react-navigation/native").useRoute.mockReturnValue({
      params: { previousScreen: "Home" },
    });

    welcomeScreen = renderer.create(<WelcomeScreen />);
    expect(welcomeScreen.toJSON()).toMatchSnapshot();
  });

  it("renders welcomeScreen correctly with previousScreen as Login", () => {
    // Override the useRoute mock for this specific test case
    require("@react-navigation/native").useRoute.mockReturnValue({
      params: { previousScreen: "Login" },
    });

    welcomeScreen = renderer.create(<WelcomeScreen />);
    expect(welcomeScreen.toJSON()).toMatchSnapshot();
  });

  it("should set initialRoute to LoginStack when hasShownWelcome is true", (done) => {
    jest.spyOn(AsyncStorage, "getItem").mockResolvedValueOnce("true");

    const loadingTime = 1;
    useWelcomeScreenLogic(loadingTime, (initialRoute, isLoading) => {
      expect(initialRoute).toBe("LoginStack");
      expect(isLoading).toBe(false);
      done(); // Finish the test
    });
  });

  it("should set initialRoute to WelcomeStack when hasShownWelcome is false", (done) => {
    jest.spyOn(AsyncStorage, "getItem").mockResolvedValueOnce("false");

    const loadingTime = 1;
    useWelcomeScreenLogic(loadingTime, (initialRoute, isLoading) => {
      expect(initialRoute).toBe("WelcomeStack");
      expect(isLoading).toBe(false);
      done(); // Finish the test
    });
  });
});
