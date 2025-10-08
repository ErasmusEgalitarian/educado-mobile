import { View } from "react-native";
import { useState, useEffect } from "react";
import FormTextField from "../General/Forms/FormTextField";
import FormButton from "../General/Forms/FormButton";
import EducadoModal from "../General/EducadoModal";
import EnterNewPasswordScreen from "./EnterNewPasswordScreen";
import Text from "../General/Text";
import {
  sendResetPasswordEmail,
  validateResetPasswordCode,
} from "../../api/user-api";
import FormFieldAlert from "../General/Forms/FormFieldAlert";
import { validateEmail } from "../General/validation";
import ToastNotification from "../General/ToastNotification";
import ShowAlert from "../General/ShowAlert";
import PropTypes from "prop-types";

interface ResetPasswordProps {
  modalVisible: boolean,
  onModalClose:  () => void;
}

/**
 * Component to create modal (popup) that prompts user for
 * email and code from email to reset password
 * @param {Object} props Should contain the following properties
 * - modalVisible: Boolean to show if modal should be visible
 * - onModalClose: Function to do when modal closes
 */
export default function ResetPassword(props: ResetPasswordProps) {
  const emailAlertMessage = "Não existe nenhum usuário com este email!";
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [codeEntered, setCodeEntered] = useState(false);
  const [passwordResetAlert, setPasswordResetAlert] = useState("");
  const [tokenAlert, setTokenAlert] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  /**
   * Function to display an alert to the user
   * @param {String} message Message to display in alert
   * @param {Boolean} status Displays if alert is success or error (green if true or red if false)
   */
  function displayErrorAlert(message: string, status: boolean) {
    setPasswordResetAlert(message);
    setIsSuccess(status);
  }

  useEffect(() => {
    if (email === "") {
      displayErrorAlert("", false);
      return;
    }

    const validationError = validateEmail(email);
    displayErrorAlert(validationError, false);
  }, [email]);

  /**
   * Function to send mail to user with code to reset password
   * @param {String} email
   */
  async function sendEmail(email: string) {
    const obj = {
      email,
    };

    setButtonLoading(true);
    await sendResetPasswordEmail(obj)
      .then(async () => {
        setEmailSent(true);
        ToastNotification("success", "E-mail enviado!"); //email sent!
      })
      .catch((error) => {
        switch (error?.error?.code) {
          case "E0401":
            // No user exists with this email!
            displayErrorAlert(emailAlertMessage, false);
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
      });
    setButtonLoading(false);
  }

  /**
   * Function to validate the code entered by the user
   * @param {String} email
   * @param {String} token
   */

  async function validateCode(email: string, token: string) {
    const obj = {
      email,
      token,
    };

    await validateResetPasswordCode(obj)
      .then(async () => {
        setCodeEntered(true);
      })
      .catch((error) => {
        switch (error?.error?.code) {
          case "E0401":
            // No user exists with this email!
            displayErrorAlert(emailAlertMessage, false);
            break;

          case "E0404":
            // Code expired!
            setTokenAlert("Código expirado!");
            break;

          case "E0405":
            // Incorrect code!
            setTokenAlert("Código incorreto!");
            break;

          default:
            // Errors not currently handled with specific alerts
            ShowAlert("Erro desconhecido!");
            console.log(error);
        }
      });
  }

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
      modalVisible={props.modalVisible}
      closeModal={props.onModalClose}
      id="EducadoModal"
      title="Redefinição de senha"
    >
      <View className="my-16 px-10">
        {!codeEntered ? (
          <View>
            <FormTextField
              bordered={true}
              placeholder="Insira sua e-mail"
              label="E-mail"
              required={true}
              onChangeText={(email) => setEmail(email)}
              keyboardType="email-address"
              testId="emailInput"
              value={email}
            />
            <FormFieldAlert
              testId="emailAlert"
              label={passwordResetAlert}
              success={isSuccess}
            />
            <View className="mt-[40px]">
              {emailSent ? (
                <View>
                  <Text className="mb-[10px] text-left">
                    {/* We have sent a code to your mail to reset your password,
                     please enter the code you have received below: */}
                    Enviamos para o seu email um código de redefinição de senha.
                    Insira o código abaixo.
                  </Text>
                  <FormTextField
                    bordered={true}
                    placeholder="X X X X"
                    onChangeText={(token) => setToken(token)}
                    testId="tokenInput"
                    value={token}
                  />
                  <FormFieldAlert testId="tokenAlert" label={tokenAlert} />
                  {/* Continue button */}
                  <View className="mb-[24px] mt-[40px]">
                    <FormButton
                      // Continue
                      label={
                        buttonLoading ? "Validando código..." : "Continuar"
                      }
                      onPress={() => validateCode(email, token)}
                      testId="validateCodeBtn"
                      disabled={!codeInputValid(token)}
                    >
                      {buttonLoading ? "Validando código..." : "Continuar"}
                    </FormButton>
                  </View>
                  <View className="mx-10 flex-row justify-center">
                    {/* Did not receieve the code? */}
                    <Text>O código não chegou?</Text>
                    {/* Resend code*/}
                    <Text
                      className="ml-1 underline"
                      onPress={() => sendEmail(email)}
                    >
                      Reenviar código
                    </Text>
                  </View>
                </View>
              ) : (
                <FormButton
                  // Send code
                  onPress={() => sendEmail(email)}
                  testId="resetPasswordButton"
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
            hideModal={props.onModalClose}
            resetState={resetState}
          />
        )}
      </View>
    </EducadoModal>
  );
}

ResetPassword.propTypes = {
  modalVisible: PropTypes.bool,
  onModalClose: PropTypes.func,
};
