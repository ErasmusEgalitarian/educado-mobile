import renderer from "react-test-renderer";
import LoginForm from "../../../components/Login/LoginForm";
import AsyncStorage from "@react-native-async-storage/async-storage";

let loginForm;
const LOGIN_TOKEN = "@loginToken";
const USER_INFO = "@userInfo";
const testJwt = "token";

const testUserInfo = {
  id: "123",
  firstName: "Is",
  lastName: "User",
  email: "is@user.com",
};

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.useRealTimers("legacy");

jest.mock("../../../api/user-api", () => ({
  loginUser: jest.fn(async ({ email, password }) => {
    if (email === testUserInfo.email && password === "password123") {
      return Promise.resolve({ accessToken: testJwt, userInfo: testUserInfo });
    } else if (email !== testUserInfo.email) {
      return Promise.reject({ error: { code: "E0004" } });
    } else if (password !== "password123") {
      return Promise.reject({ error: { code: "E0105" } });
    }
  }),
}));

beforeEach(async () => {
  await renderer.act(async () => {
    loginForm = renderer.create(<LoginForm />);
  });
});

afterEach(() => {
  loginForm = null;
});

describe("login", () => {
  test("Check LoginForm renders correctly", async () => {
    const tree = loginForm.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("Login function when the login button is pressed", async () => {
    // Import the loginUser function from the mocked userApi module
    const loginUser = require("../../../api/user-api").loginUser;

    // Mock the loginUser function to resolve with a dummy response
    //loginUser.mockResolvedValue({ accessToken: "dummyToken" });

    const emailInput = loginForm.root.findByProps({ testId: "emailInput" });
    const passwordInput = loginForm.root.findByProps({
      testId: "passwordInput",
    });
    const loginButton = loginForm.root.findByProps({ testId: "loginButton" });

    // Fill in email and password and press the login button
    await renderer.act(async () => {
      emailInput.props.onChangeText("test@example.com");
      passwordInput.props.onChangeText("password123");
    });

    await renderer.act(async () => {
      loginButton.props.onPress();
    });

    // Ensure login api function was called with the correct arguments
    expect(loginUser).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });
});

describe("Form behaviour", () => {
  test("Check that password visibility is toggled correctly", async () => {
    const passwordEye = loginForm.root.findByProps({ testId: "passwordEye" });
    const passwordInput = loginForm.root.findByProps({
      testId: "passwordInput",
    });
    expect(passwordEye.props.showPasswordIcon).toBe(false);
    expect(passwordInput.props.secureTextEntry).toBe(true);
    await renderer.act(async () => {
      passwordEye.props.toggleShowPassword();
    });
    expect(passwordEye.props.showPasswordIcon).toBe(true);
    expect(passwordInput.props.secureTextEntry).toBe(false);
    await renderer.act(async () => {
      passwordEye.props.toggleShowPassword();
    });
    expect(passwordEye.props.showPasswordIcon).toBe(false);
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  test("Check that login button is disabled when email or password is empty", async () => {
    const emailInput = loginForm.root.findByProps({ testId: "emailInput" });
    const passwordInput = loginForm.root.findByProps({
      testId: "passwordInput",
    });
    const loginButton = loginForm.root.findByProps({ testId: "loginButton" });

    // Button disabled when fields are empty
    expect(loginButton.props.disabled).toBe(true);

    // Button not disabled when fields are filled
    await renderer.act(async () => {
      emailInput.props.onChangeText("thej.dk");
      passwordInput.props.onChangeText("testing123");
    });
    expect(loginButton.props.disabled).toBe(false);

    // Button disabled when email is empty
    await renderer.act(async () => {
      emailInput.props.onChangeText("");
      passwordInput.props.onChangeText("testing123");
    });
    expect(loginButton.props.disabled).toBe(true);

    // Button not disabled when fields are filled
    await renderer.act(async () => {
      emailInput.props.onChangeText("thej.dk");
      passwordInput.props.onChangeText("testing123");
    });
    expect(loginButton.props.disabled).toBe(false);

    // Button disabled when password is empty
    await renderer.act(async () => {
      emailInput.props.onChangeText("thej.dk");
      passwordInput.props.onChangeText("");
    });
    expect(loginButton.props.disabled).toBe(true);
  });

  test("Password field filters out emojis", async () => {
    const passwordInput = loginForm.root.findByProps({
      testId: "passwordInput",
    });
    await renderer.act(async () => {
      passwordInput.props.onChangeText("testing123");
    });
    expect().toBeFalsy();
    await renderer.act(async () => {
      passwordInput.props.onChangeText("testing123🤔");
    });
    expect(passwordInput.props.value).toBe("testing123");
  });

  test("Check that modal opens when clicking on 'forgot password'", async () => {
    const resetPasswordModal = loginForm.root.findByProps({
      testId: "resetPasswordModal",
    });
    expect(resetPasswordModal.props.className).toBe("hidden");
  });

  test("Test email alert", async () => {
    const emailInput = loginForm.root.findByProps({ testId: "emailInput" });
    const passwordInput = loginForm.root.findByProps({
      testId: "passwordInput",
    });
    const emailAlert = loginForm.root.findByProps({ testId: "emailAlert" });
    const loginButton = loginForm.root.findByProps({ testId: "loginButton" });

    await renderer
      .act(async () => {
        await emailInput.props.onChangeText("not@user.com");
        await passwordInput.props.onChangeText("testpassword123");
        loginButton.props.onPress();
      })
      .then(() => {
        expect(emailAlert.props.label).not.toBe("");
        //expect(emailAlert.props.label).not.toBe((""));
      });
  });

  test("Test password alert", async () => {
    const emailInput = loginForm.root.findByProps({ testId: "emailInput" });
    const passwordInput = loginForm.root.findByProps({
      testId: "passwordInput",
    });
    const passwordAlert = loginForm.root.findByProps({
      testId: "passwordAlert",
    });
    const loginButton = loginForm.root.findByProps({ testId: "loginButton" });

    await renderer
      .act(async () => {
        await emailInput.props.onChangeText("is@user.com");
        await passwordInput.props.onChangeText("wrongpassword");
        loginButton.props.onPress();
      })
      .then(() => {
        expect(passwordAlert.props.label).not.toBe("");
      });
  });
});

describe("localstorage", () => {
  it("should save jwt in localstorage", async () => {
    await renderer
      .act(async () => {
        await emailInput.props.onChangeText(testUserInfo.email);
        await passwordInput.props.onChangeText("password123");
        loginButton.props.onPress();
      })
      .then(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(LOGIN_TOKEN, testJwt);
      });
  });

  it("should save userInfo in localstorage", async () => {
    await renderer
      .act(async () => {
        await emailInput.props.onChangeText(testUserInfo.email);
        await passwordInput.props.onChangeText("password123");
        loginButton.props.onPress();
      })
      .then(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          USER_INFO,
          testUserInfo,
        );
      });
  });
});
