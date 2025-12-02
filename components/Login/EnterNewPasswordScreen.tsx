import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { FormTextField } from "@/components/General/Forms/FormTextField";
import { FormButton } from "@/components/General/Forms/FormButton";
import { enterNewPassword } from "@/api/user-api";
import { FormFieldAlert } from "@/components/General/Forms/FormFieldAlert";
import {
  removeEmojis,
  validatePasswordContainsLetter,
  validatePasswordLength,
} from "@/components/General/validation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DialogNotification from "@/components/General/DialogNotification";
import { isAxiosError } from "axios";
import ShowAlert from "@/components/General/ShowAlert";
import { ApiError } from "@/api/legacy-api";
import { colors } from "@/theme/colors";
import { t } from "@/i18n";

interface EnterNewPasswordScreenProps {
  hideModal: () => void;
  resetState: () => void;
  email: string;
  token: string;
}

/**
 * Component for entering a new password in the resetPassword modal.
 *
 * @param hideModal - Function to hide the modal.
 * @param resetState - Function to reset the state.
 * @param email - Email of the user.
 * @param token - Token for the reset password.
 */
const EnterNewPasswordScreen = ({
  hideModal,
  resetState,
  email,
  token,
}: EnterNewPasswordScreenProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password constraint variables
  const [passwordContainsLetter, setPasswordContainsLetter] = useState(false);
  const [passwordLengthValid, setPasswordLengthValid] = useState(false);

  // password input alerts
  const [confirmPasswordAlert, setConfirmPasswordAlert] = useState("");
  const [passwordAlert, setPasswordAlert] = useState("");

  const checkIfPasswordsMatch = (password: string, confirmPassword: string) => {
    if (password === confirmPassword) {
      setConfirmPasswordAlert("");
    } else {
      // The passwords do not match
      setConfirmPasswordAlert(t("login.no-match"));
    }
  };

  // password input alerts
  useEffect(() => {
    const containsLetter = validatePasswordContainsLetter(newPassword);
    setPasswordContainsLetter(containsLetter);
    const lengthValid = validatePasswordLength(newPassword);
    setPasswordLengthValid(lengthValid);
    checkIfPasswordsMatch(newPassword, confirmPassword);
  }, [confirmPassword, newPassword]);

  /**
   * Function for changing the password
   * @param {String} email
   * @param {String} token
   * @param {String} newPassword
   * @returns
   */
  const changePassword = async (
    email: string,
    token: string,
    newPassword: string,
  ) => {
    if (!validateInput()) {
      return;
    }

    const obj = {
      email,
      token,
      newPassword,
    };

    try {
      await enterNewPassword(obj);
      DialogNotification("success", t("login.password-changed"));
      setTimeout(() => {
        hideModal();
        resetState();
      }, 2500);
    } catch (error) {
      if (isAxiosError(error)) {
        throw error.response?.data;
      }

      const apiError = error as ApiError;
      switch (apiError.code) {
        case "E0401":
          // No user exists with this email!
          setPasswordAlert(t("login.no-user"));
          break;

        case "E0404":
          // Code expired!
          setPasswordAlert(t("login.code-expired"));
          break;

        case "E0405":
          // Incorrect code!
          setPasswordAlert(t("login.code-incorrect"));
          break;

        default:
          // Errors not currently handled with specific alerts
          ShowAlert(t("general.error-unknown"));
          console.log(error);
          break;
      }
    }
  };

  // Function to validate the input
  const validateInput = () => {
    // Check if passwords are empty
    const isPasswordsEmpty = newPassword === "" && confirmPassword === "";
    // Check if password contains a letter and is at least 8 characters long
    const passwordRequirements = passwordContainsLetter && passwordLengthValid;
    // Check if passwords match
    return (
      !isPasswordsEmpty && passwordRequirements && confirmPasswordAlert === ""
    );
  };

  return (
    <View>
      <View>
        <FormTextField
          placeholder="••••••••"
          onChangeText={(password) => {
            setNewPassword(removeEmojis(password));
          }}
          label={t("login.new-password")}
          required={true}
          bordered={true}
          value={newPassword}
          error={
            newPassword !== "" &&
            !(passwordContainsLetter && passwordLengthValid)
          }
          showPasswordEye={true}
        />
      </View>
      <View className="mt-1 h-6 flex-row justify-start">
        <Text
          className={
            "text-sm" +
            (newPassword === ""
              ? " text-textCaptionGrayscale text-footnote-regular-caps"
              : passwordLengthValid
                ? " text-surfaceDefaultGreen text-footnote-regular-caps"
                : " text-textLabelRed text-footnote-regular-caps")
          }
        >
          {t("login.requirement-length")}
        </Text>

        <View className="-translate-y-1 flex-row items-center pl-1">
          {passwordLengthValid ? (
            <MaterialCommunityIcons
              name="check"
              size={12}
              color={colors.surfaceDefaultGreen}
            />
          ) : null}
        </View>
      </View>
      <View className="h-6 flex-row justify-start">
        <Text
          className={
            "text-sm" +
            (newPassword === ""
              ? " text-textCaptionGrayscale text-footnote-regular-caps"
              : passwordContainsLetter
                ? " text-surfaceDefaultGreen text-footnote-regular-caps"
                : " text-textLabelRed text-footnote-regular-caps")
          }
        >
          {t("login.requirement-letter")}
        </Text>
        <View className="-translate-y-1 flex-row items-center pl-1">
          {passwordContainsLetter ? (
            <MaterialCommunityIcons
              name="check"
              size={12}
              color={colors.surfaceDefaultGreen}
            />
          ) : null}
        </View>
      </View>
      <FormFieldAlert label={passwordAlert} success={passwordAlert === ""} />
      <View className="mt-[24px]">
        <FormTextField
          placeholder="••••••••"
          bordered={true}
          onChangeText={(confirmPassword) => {
            setConfirmPassword(removeEmojis(confirmPassword));
          }}
          label={t("login.confirm-new-password")}
          required={true}
          value={confirmPassword}
          error={confirmPasswordAlert !== ""}
          showPasswordEye={true}
        />
      </View>
      <View className="mb-10">
        <FormFieldAlert
          label={confirmPasswordAlert}
          success={confirmPasswordAlert === ""}
        />
      </View>

      <FormButton
        onPress={() => {
          void changePassword(email, token, newPassword);
        }}
        disabled={!validateInput()}
      >
        {t("general.enter")}
      </FormButton>
    </View>
  );
};

export default EnterNewPasswordScreen;
