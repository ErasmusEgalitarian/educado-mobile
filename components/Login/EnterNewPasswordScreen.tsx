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

  let isPasswordsEmpty;
  let passwordRequirements;

  const checkIfPasswordsMatch = (password: string, confirmPassword: string) => {
    if (password === confirmPassword) {
      setConfirmPasswordAlert("");
    } else {
      // The passwords do not match
      setConfirmPasswordAlert("Senhas não coincidem");
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

  // password input alerts
  useEffect(() => {
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
      DialogNotification("success", "A senha foi alterada.");
      setTimeout(() => {
        hideModal();
        resetState();
      }, 2500);
    } catch (error) {
      if (isAxiosError(error)) {
        throw error.response?.data;
      }

      const apiError = error as ApiError;
      switch (apiError.error.code) {
        case "E0401":
          // No user exists with this email!
          setPasswordAlert("Não existe nenhum usuário com este email!");
          break;

        case "E0404":
          // Code expired!
          setPasswordAlert("Código expirado!");
          break;

        case "E0405":
          // Incorrect code!
          setPasswordAlert("Código incorreto!");
          break;

        default:
          // Errors not currently handled with specific alerts
          ShowAlert("Erro desconhecido!");
          console.log(error);
          break;
      }
    }
  };

  // Function to validate the input
  const validateInput = () => {
    // Check if passwords are empty
    isPasswordsEmpty = newPassword === "" && confirmPassword === "";
    // Check if password contains a letter and is at least 8 characters long
    passwordRequirements = passwordContainsLetter && passwordLengthValid;
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
          label="Nova senha"
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
              ? " text-projectGray"
              : passwordLengthValid
                ? " text-success"
                : " text-error")
          }
        >
          {/** Minimum 8 characters */}
          Mínimo 8 caracteres
        </Text>

        <View className="-translate-y-1 flex-row items-center">
          {passwordLengthValid ? (
            <MaterialCommunityIcons name="check" size={20} color="#4AA04A" />
          ) : null}
        </View>
      </View>
      <View className="h-6 flex-row justify-start">
        <Text
          className={
            "text-sm" +
            (newPassword === ""
              ? " text-projectGray"
              : passwordContainsLetter
                ? " text-success"
                : " text-error")
          }
        >
          {/* Must contain at least one letter */}
          Conter pelo menos uma letra
        </Text>
        <View className="-translate-y-1 flex-row items-center">
          {passwordContainsLetter ? (
            <MaterialCommunityIcons name="check" size={20} color="#4AA04A" />
          ) : null}
        </View>
      </View>
      <FormFieldAlert label={passwordAlert} success={passwordAlert === ""} />
      <View className="mt-[24px]">
        <FormTextField
          placeholder="••••••••" // Confirm your password
          bordered={true}
          onChangeText={(confirmPassword) => {
            setConfirmPassword(removeEmojis(confirmPassword));
          }}
          label="Confirmar nova senha" // Confirm new password
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

      {/* Enter button */}
      <FormButton
        onPress={() => {
          void changePassword(email, token, newPassword);
        }}
        disabled={!validateInput()}
      >
        Entrar
      </FormButton>
    </View>
  );
};

export default EnterNewPasswordScreen;
