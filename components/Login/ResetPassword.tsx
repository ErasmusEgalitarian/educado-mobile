import { View, Text } from "react-native";
import { useState } from "react";
import { FormTextField } from "@/components/General/Forms/FormTextField";
import { FormButton } from "@/components/General/Forms/FormButton";
import { EducadoModal } from "@/components/General/EducadoModal";
import EnterNewPasswordScreen from "@/components/Login/EnterNewPasswordScreen";
import {
  sendResetPasswordEmail,
  validateResetPasswordCode,
} from "@/api/user-api";
import { FormFieldAlert } from "@/components/General/Forms/FormFieldAlert";
import { validateEmail } from "@/components/General/validation";
import ToastNotification from "@/components/General/ToastNotification";
import ShowAlert from "@/components/General/ShowAlert";
import { isAxiosError } from "axios";
import { ApiError } from "@/api/legacy-api";

interface ResetPasswordProps {
  modalVisible: boolean;
  onModalClose: () => void;
}

/**
 * Component to create a modal (popup) that prompts the user for email and code from email to reset password.
 *
 * @param modalVisible - Boolean to show if modal should be visible.
 * @param onModalClose - Function to do when modal closes.
 */
export const ResetPassword = ({
  modalVisible,
  onModalClose,
}: ResetPasswordProps) => {
  const emailAlertMessage = "Email não localizado";
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [codeEntered, setCodeEntered] = useState(false);
  const [passwordResetAlert, setPasswordResetAlert] = useState("");
  const [tokenAlert, setTokenAlert] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);

  /**
   * Function to display an alert to the user
   * @param {String} message Message to display in alert
   * @param {Boolean} status Displays if alert is success or error (green if true or red if false)
   */
  const displayErrorAlert = (message: string, status: boolean) => {
    setPasswordResetAlert(message);
    setIsSuccess(status);
  };

  /**
   * Function to send mail to user with code to reset password
   * @param {String} email
   */
  const sendEmail = async (email: string) => {
    const validationError = validateEmail(email);
    if (validationError) {
      displayErrorAlert(emailAlertMessage, false);
      setEmailError(true);
      return;
    }

    setEmailError(false);

    setButtonLoading(true);

    try {
      await sendResetPasswordEmail({ email });
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        throw error.response?.data;
      }
      const apiError = error as ApiError;
      switch (apiError.error.code) {
        case "E0401":
          // No user exists with this email!
          displayErrorAlert(emailAlertMessage, false);
          setEmailError(true);
          break;

        case "E0406":
          // Too many resend attempts!
          displayErrorAlert(
            "Muitas tentativas de reenvio! Espere 5 minutos...",
            false,
          );
          break;

        case "E0004":
          // User not found!
          displayErrorAlert("Usuário não encontrado!", false);
          break;

        // TODO: What error should we give here instead? Unknown error?
        default:
          // Errors not currently handled with specific alerts
          displayErrorAlert("Erro desconhecido!", false);
      }
    } finally {
      setEmailSent(true);
      ToastNotification("success", "E-mail enviado!"); //email sent!
    }
    setButtonLoading(false);
  };

  /**
   * Function to validate the code entered by the user
   * @param {String} email
   * @param {String} token
   */

  const validateCode = async (email: string, token: string): Promise<void> => {
    const obj = {
      email,
      token,
    };

    try {
      await validateResetPasswordCode(obj);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        throw error.response?.data;
      }

      const apiError = error as ApiError;
      switch (apiError.error.code) {
        case "E0401":
          // No user exists with this email!
          displayErrorAlert(emailAlertMessage, false);
          setEmailError(true);
          break;

        case "E0404":
          // Code expired!
          setTokenAlert("Código expirado!");
          break;

        case "E0405":
          // Incorrect code!
          setTokenAlert("Código inválido");
          break;

        default:
          // Errors not currently handled with specific alerts
          ShowAlert("Erro desconhecido!");
          console.log(error);
      }
    } finally {
      setCodeEntered(true);
    }
  };

  //resets the state of the reset password modal
  const resetState = () => {
    setEmailSent(false);
    setCodeEntered(false);
    displayErrorAlert("", false);
    setTokenAlert("");
    setToken("");
  };

  //checks if the 4-digit code entered is valid
  const codeInputValid = (code: string) => {
    return /^\d+$/.test(code) && code.length === 4;
  };

  return (
    <EducadoModal
      modalVisible={modalVisible}
      closeModal={onModalClose}
      title="Redefinição de senha"
    >
      <View className="my-8 px-10">
        {!codeEntered ? (
          <View>
            {!emailSent && (
              <View>
                <FormTextField
                  bordered={true}
                  placeholder="useremail@gmail.com"
                  label="E-mail"
                  required={true}
                  onChangeText={(email) => {
                    setEmail(email);
                    setEmailError(false);
                    displayErrorAlert("", false);
                  }}
                  keyboardType="email-address"
                  value={email}
                  error={emailError}
                />
                <FormFieldAlert
                  label={passwordResetAlert}
                  success={isSuccess}
                />
              </View>
            )}

            <View className="mt-[40px]">
              {emailSent ? (
                <View>
                  <Text className="mb-[10px] text-center text-h4-sm-regular">
                    {/* We have sent a code to your mail to reset your password,
                     please enter the code you have received below: */}
                    Enviamos um código para o seu email de redefinição de senha,
                    por favor, insira o mesmo abaixo
                  </Text>
                  <FormTextField
                    bordered={true}
                    placeholder="XXXX"
                    onChangeText={(token) => {
                      setToken(token);
                    }}
                    value={token}
                    error={tokenAlert !== ""}
                  />
                  <FormFieldAlert
                    success={tokenAlert === ""}
                    label={tokenAlert}
                  />
                  {/* Continue button */}
                  <View className="mb-[24px] mt-[40px]">
                    <FormButton
                      onPress={() => {
                        void validateCode(email, token);
                      }}
                      disabled={!codeInputValid(token)}
                    >
                      {buttonLoading
                        ? "Validando código..."
                        : "Verificar Codigo"}
                    </FormButton>
                  </View>
                  <View className="flex-column mx-10 items-center justify-center">
                    {/* Did not receieve the code? */}
                    <Text>O código não chegou?</Text>
                    {/* Resend code*/}
                    <Text
                      className="underline"
                      onPress={() => {
                        void sendEmail(email);
                      }}
                    >
                      Reenviar código
                    </Text>
                  </View>
                </View>
              ) : (
                <FormButton
                  // Send code
                  onPress={() => {
                    void sendEmail(email);
                  }}
                  disabled={
                    passwordResetAlert !== "" || email === "" || buttonLoading
                  }
                >
                  {buttonLoading ? "Enviando e-mail..." : "Entrar"}
                </FormButton>
              )}
            </View>
          </View>
        ) : (
          <EnterNewPasswordScreen
            email={email}
            token={token}
            hideModal={onModalClose}
            resetState={resetState}
          />
        )}
      </View>
    </EducadoModal>
  );
};
