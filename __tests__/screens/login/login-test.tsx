import renderer from "react-test-renderer";
import LoginScreen from "../../../screens/Login/LoginScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

let navigated = false;

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(() => {
        navigated = true;
      }),
    }),
    useRoute: jest.fn().mockReturnValue({
      params: {
        previousScreen: "Home",
      },
    }),
    useFocusEffect: jest.fn(),
  };
});

describe("Login screen", () => {
  let loginScreen;

  beforeEach(async () => {
    navigated = false;
    await AsyncStorage.clear();
    renderer.act(() => {
      loginScreen = renderer.create(<LoginScreen />);
    });
  });

  it("Login screen renders", () => {
    expect(loginScreen.toJSON()).toMatchSnapshot();
  });
});
/* TODO: Fix tests with new login set-up */ /*
  it('Pressing register new user navigates to the register page', async () => {
    const registerNav = loginScreen.root.findByProps({ testId: 'registerNav' });
    await renderer.act(() => {
      registerNav.props.onPress();
    });
    expect(navigated).toBe(true);
  });

  it('Check login when no valid token is stored', async () => {
    await renderer.act(() => {
      renderer.create(<Login />);
    });
    expect(navigated).toBe(false);
  });

  it('Check login when valid token stored', async () => {
    AsyncStorage.setItem('@loginToken', 'testToken');
    await renderer.act(() => {
      renderer.create(<Login />);
    });
    expect(navigated).toBe(true);
  });


  it('Check screen is scrollable with keyboard active', async () => {
    // No direct dependency on react-native-keyboard-aware-scroll-view:
    // look for a ScrollView in the rendered tree instead.
    const scrollView = loginScreen.root.findByType(ScrollView);
    expect(scrollView.props.scrollEnabled).toBeTruthy();
  });
});
/*

/* TODO: Fix tests with AsyncStorage */ /*
test('Check login when valid token stored', async () => {
  const mockToken = "testToken";
  AsyncStorage.setItem("@loginToken", mockToken).then(async () => {
    await AsyncStorage.getItem("@loginToken");
    renderer.create(<Login />);
    expect(useNavigation().navigate).toHaveBeenCalledTimes(1);
  });

})*/
