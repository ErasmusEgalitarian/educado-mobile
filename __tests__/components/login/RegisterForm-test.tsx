import renderer from "react-test-renderer";
import RegisterForm from "../../../components/Login/RegisterForm";

let registerForm;

jest.useRealTimers("legacy");

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
  useRoute: jest.fn().mockReturnValue({
    params: {
      previousScreen: "Home",
    },
  }),
}));

beforeEach(async () => {
  await renderer.act(() => {
    registerForm = renderer.create(<RegisterForm />);
  });
});

test("Ensure that the RegisterForm component renders correctly", () => {
  const tree = registerForm.toJSON();
  expect(tree).toMatchSnapshot();
});

test("Check that password visibility is toggled correctly", async () => {
  const passwordEye = registerForm.root.findByProps({ testId: "passwordEye" });
  expect(passwordEye.props.showPasswordIcon).toBe(false);
  await renderer.act(() => {
    passwordEye.props.toggleShowPassword();
  });
  expect(passwordEye.props.showPasswordIcon).toBe(true);
  await renderer.act(() => {
    passwordEye.props.toggleShowPassword();
  });
  expect(passwordEye.props.showPasswordIcon).toBe(false);
});

test("Test of email validation", async () => {
  const emailInput = registerForm.root.findByProps({
    testId: "emailInput",
  });
  const emailAlert = registerForm.root.findByProps({
    testId: "emailAlert",
  });

  await renderer.act(() => {
    emailInput.props.onChangeText("letters@letters.end").then(() => {
      expect(emailAlert.props.label).toBe("");
    });
    emailInput.props.onChangeText("user.name@dev.letters.end").then(() => {
      expect(emailAlert.props.label).toBe("");
    });
    emailInput.props.onChangeText("user-name@dev.letters.end").then(() => {
      expect(emailAlert.props.label).toBe("");
    });
    emailInput.props
      .onChangeText("unusual----.++email+adress@dev.letters.end")
      .then(() => {
        expect(emailAlert.props.label).toBe("");
      });
  });

  await renderer.act(() => {
    emailInput.props.onChangeText("invalid email").then(() => {
      // No @, ., and illegal spaces
      expect(emailAlert.props.label).toBe(not(""));
    });
    emailInput.props.onChangeText("slightly@invalid.d").then(() => {
      // Domain too short
      expect(emailAlert.props.label).toBe(not(""));
    });
    emailInput.props.onChangeText("also.invalid.com").then(() => {
      // No @
      expect(emailAlert.props.label).toBe(not(""));
    });
    emailInput.props.onChangeText("").then(() => {
      // Empty
      expect(emailAlert.props.label).toBe(not(""));
    });
    emailInput.props.onChangeText("user.name.@domain.dom").then(() => {
      // Dot at end of local part
      expect(emailAlert.props.label).toBe(not(""));
    });
    emailInput.props.onChangeText("username@domain-name.com").then(() => {
      // Dash in domain name
      expect(emailAlert.props.label).toBe(not(""));
    });
    emailInput.props.onChangeText("username@domain?name.com").then(() => {
      // ? in domain name
      expect(emailAlert.props.label).toBe(not(""));
    });
    emailInput.props.onChangeText("@domain.com").then(() => {
      // No local part
      expect(emailAlert.props.label).toBe(not(""));
    });
    emailInput.props.onChangeText("name@email").then(() => {
      // No domain ending
      expect(emailAlert.props.label).toBe(not(""));
    });
  });
});

test("Check that confirm password visibility is toggled correctly", async () => {
  expect(
    registerForm.root.findByProps({ testId: "confirmPasswordEye" }).props
      .showPasswordIcon,
  ).toBe(false);
  await renderer.act(() => {
    registerForm.root
      .findByProps({ testId: "confirmPasswordEye" })
      .props.toggleShowPassword();
  });
  expect(
    registerForm.root.findByProps({ testId: "confirmPasswordEye" }).props
      .showPasswordIcon,
  ).toBe(true);
  await renderer.act(() => {
    registerForm.root
      .findByProps({ testId: "confirmPasswordEye" })
      .props.toggleShowPassword();
  });
  expect(
    registerForm.root.findByProps({ testId: "confirmPasswordEye" }).props
      .showPasswordIcon,
  ).toBe(false);
});

describe("password validation", () => {
  registerForm = renderer.create(<RegisterForm />);
  const passwordInput = registerForm.root.findByProps({
    testId: "passwordInput",
  });
  const passwordLengthAlert = registerForm.root.findByProps({
    testId: "passwordLengthAlert",
  });

  const passwordLetterAlert = registerForm.root.findByProps({
    testId: "passwordLetterAlert",
  });

  const changePassword = async (password) => {
    await renderer.act(() => {
      passwordInput.props.onChangeText(password);
    });
  };

  const expectClass = (element, className) => {
    expect(element.props.className).toBe(className);
  };

  test("Test password length validation", async () => {
    await renderer.act(() => {
      changePassword("12345678a").then(() => {
        expectClass(passwordLengthAlert, "text-sm font-montserrat text-gray");
      });
    });

    await renderer.act(() => {
      changePassword("1278a").then(() => {
        expectClass(passwordLengthAlert, "text-sm font-montserrat text-error");
      });
    });
  });

  test("Test password letter inclusion validation", async () => {
    await renderer.act(() => {
      changePassword("testPassword").then(() => {
        expectClass(passwordLetterAlert, "text-sm font-montserrat text-gray");
      });
    });

    await renderer.act(() => {
      changePassword("12783290189").then(() => {
        expectClass(passwordLengthAlert, "text-sm font-montserrat text-error");
      });
    });
  });
});

test("Test that the password input works correctly", async () => {
  const passwordInput = registerForm.root.findByProps({
    testId: "passwordInput",
  });
  renderer
    .act(() => {
      passwordInput.props.onChangeText("12345678a");
    })
    .then(() => {
      expect(passwordInput.props.value).toBe("12345678a");
    });
});

test("Check that register button is disabled when fields are empty", async () => {
  const firstNameInput = registerForm.root.findByProps({
    testId: "firstNameInput",
  });
  const lastNameInput = registerForm.root.findByProps({
    testId: "lastNameInput",
  });
  const emailInput = registerForm.root.findByProps({ testId: "emailInput" });
  const passwordInput = registerForm.root.findByProps({
    testId: "passwordInput",
  });
  const confirmPasswordInput = registerForm.root.findByProps({
    testId: "confirmPasswordInput",
  });
  const registerButton = registerForm.root.findByProps({
    testId: "registerButton",
  });

  // Check that register button is disabled when all fields are empty
  await renderer.act(() => {
    firstNameInput.props.onChangeText("");
    lastNameInput.props.onChangeText("");
    emailInput.props.onChangeText("");
    passwordInput.props.onChangeText("");
    confirmPasswordInput.props.onChangeText("");
  });
  expect(registerButton.props.disabled).toBe(true);
});

function testRegisterButtonDisable() {
  const firstNameInput = registerForm.root.findByProps({
    testId: "firstNameInput",
  });
  const lastNameInput = registerForm.root.findByProps({
    testId: "lastNameInput",
  });
  const emailInput = registerForm.root.findByProps({ testId: "emailInput" });
  const passwordInput = registerForm.root.findByProps({
    testId: "passwordInput",
  });
  const confirmPasswordInput = registerForm.root.findByProps({
    testId: "confirmPasswordInput",
  });
  const registerButton = registerForm.root.findByProps({
    testId: "registerButton",
  });

  test("Check that register button is not disabled when fields are filled correctly", async () => {
    // Check that the button is disabled when only the name field is filled
    await renderer.act(async () => {
      firstNameInput.props.onChangeText("testFirstName");
      lastNameInput.props.onChangeText("testLastName");
      emailInput.props.onChangeText("test@test.dk");
      await passwordInput.props.onChangeText("passwordTest");
      await confirmPasswordInput.props.onChangeText("passwordTest");
    });
    expect(registerButton.props.disabled).toBe(false);
  });

  test("Check that register button is disabled when password and confirm password is not the same", async () => {
    // Test that the register button is disabled when the password and confirm password fields are not equal
    await renderer.act(() => {
      firstNameInput.props.onChangeText("firstname");
      lastNameInput.props.onChangeText("lastname");
      emailInput.props.onChangeText("test@test.dk");
      passwordInput.props.onChangeText("testing123");
      confirmPasswordInput.props.onChangeText("not the same password");
    });
    expect(registerButton.props.disabled).toBe(true);
  });
}

test("Password field filters out emojis", async () => {
  const passwordInput = registerForm.root.findByProps({
    testId: "passwordInput",
  });
  const confirmPasswordInput = registerForm.root.findByProps({
    testId: "confirmPasswordInput",
  });

  // reset text value before test
  await renderer.act(() => {
    passwordInput.props.onChangeText("");
    confirmPasswordInput.props.onChangeText("");
  });

  await renderer.act(() => {
    passwordInput.props.onChangeText("testing123");
    confirmPasswordInput.props.onChangeText("testing123");
  });
  expect(passwordInput.props.value).toBe("testing123");
  expect(confirmPasswordInput.props.value).toBe("testing123");

  await renderer.act(() => {
    passwordInput.props.onChangeText("testing123🤔");
    confirmPasswordInput.props.onChangeText("testing123🤔");
  });
  expect(passwordInput.props.value).toBe("testing123");
  expect(confirmPasswordInput.props.value).toBe("testing123");
});

testRegisterButtonDisable();
