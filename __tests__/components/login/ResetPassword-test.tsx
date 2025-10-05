import renderer from "react-test-renderer";
import ResetPassword from "../../../components/Login/ResetPassword";

jest.mock("../../../api/user-api", () => ({
  sendResetPasswordEmail: jest.fn(async ({ email }) => {
    if (email !== "test@test.dk") {
      return Promise.reject({ error: { code: "E0401" } }); // No user exists with this email!
    } else if (email !== "resend@test.dk") {
      return Promise.reject({ error: { code: "E0406" } }); // Too many resend attempts!
    } else {
      return Promise.resolve({ data: "Email sent" });
    }
  }),
  validateResetPasswordCode: jest.fn(async ({ email, token }) => {
    if (email !== "test@test.dk" && email !== "expired@test.dk") {
      return Promise.reject({ error: { code: "E0401" } }); // No user exists with this email!
    } else if (email === "test@test.dk" && token !== "1234") {
      return Promise.reject({ error: { code: "E0405" } }); // Invalid token!
    } else if (email === "expired@test.dk") {
      return Promise.reject({ error: { code: "E0404" } }); // Code expired!
    } else {
      return Promise.resolve({ data: "Code validated" });
    }
  }),
}));

describe("ResetPassword", () => {
  describe("Test modal open and close", () => {
    let resetPassword;

    it("Ensure that the reset password page is rendered correctly when not visible", async () => {
      await renderer.act(() => {
        resetPassword = renderer.create(
          <ResetPassword modalVisible={false} onModalClose={() => {}} />,
        );
      });
      let tree = resetPassword.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("Ensure that the reset password page is rendered correctly when visible", async () => {
      await renderer.act(() => {
        resetPassword = renderer.create(
          <ResetPassword modalVisible={true} onModalClose={() => {}} />,
        );
      });
      let tree = resetPassword.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe("Test errors and validation", () => {
    let resetPassword;
    let emailInput;
    let resetPasswordButton;
    let emailAlert;
    let tokenInput;
    let validateCodeBtn;
    let tokenAlert;

    // Function used to initialize tokenInput and validateCodeBtn
    // this should be called after rendering new page, by pressing resetPasswordButton
    function initTokenComponents() {
      tokenInput = resetPassword.root.findByProps({ testId: "tokenInput" });
      validateCodeBtn = resetPassword.root.findByProps({
        testId: "validateCodeBtn",
      });
      tokenAlert = resetPassword.root.findByProps({ testId: "tokenAlert" });
    }

    beforeAll(async () => {
      await renderer
        .act(async () => {
          resetPassword = renderer.create(<ResetPassword />);
        })
        .then(() => {
          emailInput = resetPassword.root.findByProps({ testId: "emailInput" });
          resetPasswordButton = resetPassword.root.findByProps({
            testId: "resetPasswordButton",
          });
          emailAlert = resetPassword.root.findByProps({ testId: "emailAlert" });
        });
    });

    it("Error if email does not exist", async () => {
      // Ensure emailAlert is properly initialized

      await renderer
        .act(async () => {
          await emailInput.props.onChangeText("test@test.com");
          await resetPasswordButton.props.onPress();
        })
        .then(() => {
          // Initialize emailAlert here after the component has rendered
          emailAlert = resetPassword.root.findByProps({ testId: "emailAlert" });

          expect(emailAlert.props.label).not.toBe("");
        });
    });

    it("Error if invalid email, no error if valid", async () => {
      emailInput = resetPassword.root.findByProps({ testId: "emailInput" });
      await renderer.act(() => {
        emailInput.props.onChangeText("test.com");
      });
      expect(emailAlert.props.label).not.toBe("");

      await renderer.act(() => {
        emailInput.props.onChangeText("test@test.c");
      });
      expect(emailAlert.props.label).not.toBe("");

      await renderer.act(() => {
        emailInput.props.onChangeText("test@test");
      });
      expect(emailAlert.props.label).not.toBe("");

      await renderer.act(() => {
        emailInput.props.onChangeText("test@test.com");
      });
      expect(emailAlert.props.label).toBe("");
    });

    it("Error message with too many attempts", async () => {
      await renderer
        .act(async () => {
          await emailInput.props.onChangeText("resend@test.dk");
          await resetPasswordButton.props.onPress();
        })
        .then(() => {
          expect(emailAlert.props.label).not.toBe("");
        });
    });

    it("Error message with invalid token", async () => {
      await renderer
        .act(async () => {
          await emailInput.props.onChangeText("test@test.dk");
          await resetPasswordButton.props.onPress();

          initTokenComponents();
          await tokenInput.props.onChangeText("1337");
          await validateCodeBtn.props.onPress();
        })
        .then(() => {
          expect(tokenAlert.props.label).not.toBe("");
        });
    });

    it("Error message with expired token", async () => {
      await renderer
        .act(async () => {
          await emailInput.props.onChangeText("expired@test.dk");
          await resetPasswordButton.props.onPress();

          // initialize after rendering new page, by pressing resetPasswordButton
          initTokenComponents();
          await tokenInput.props.onChangeText("1337");
          await validateCodeBtn.props.onPress();
        })
        .then(() => {
          expect(tokenAlert.props.label).not.toBe("");
        });
    });
  });
});
