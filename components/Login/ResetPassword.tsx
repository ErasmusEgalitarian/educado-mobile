import { View, Text } from "react-native";
import { useState } from "react";
import FormTextField from "@/components/General/Forms/FormTextField";
import FormButton from "@/components/General/Forms/FormButton";
import EducadoModal from "@/components/General/EducadoModal";
import EnterNewPasswordScreen from "@/components/Login/EnterNewPasswordScreen";
import {
  sendResetPasswordEmail,
  validateResetPasswordCode,
} from "@/api/user-api";
import FormFieldAlert from "@/components/General/Forms/FormFieldAlert";
import { validateEmail } from "@/components/General/validation";
import ToastNotification from "@/components/General/ToastNotification";
import ShowAlert from "@/components/General/ShowAlert";

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
const ResetPassword = (props: ResetPasswordProps) => {
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
      displayErrorAlert(validationError, false);
      setEmailError(true);
      return;
    }

    setEmailError(false);

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
      });
    setButtonLoading(false);
  };

  /**
   * Function to validate the code entered by the user
   * @param {String} email
   * @param {String} token
   */

  const validateCode = async (email: string, token: string) => {
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
      });
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
      modalVisible={props.modalVisible}
      closeModal={props.onModalClose}
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
                testId="emailInput"
                value={email}
                error={emailError}
                />
                <FormFieldAlert
                testId="emailAlert"
                label={passwordResetAlert}
                success={isSuccess}
                />
              </View>
            )}


            <View className="mt-[40px]">
              {emailSent ? (
                <View>
                  <Text className="mb-[10px] text-center text-lg">
                    {/* We have sent a code to your mail to reset your password,
                     please enter the code you have received below: */}
                    Enviamos um código para o seu email de redefinição de senha, por favor, insira o mesmo abaixo
                  </Text>
                  <FormTextField
                    bordered={true}
                    placeholder="XXXX"
                    onChangeText={(token) => setToken(token)}
                    testId="tokenInput"
                    value={token}
                    error={tokenAlert !== ""}
                  />
                  <FormFieldAlert testId="tokenAlert" label={tokenAlert} />
                  {/* Continue button */}
                  <View className="mb-[24px] mt-[40px]">
                    <FormButton
                      onPress={() => validateCode(email, token)}
                      testId="validateCodeBtn"
                      disabled={!codeInputValid(token)}
                    >
                      {buttonLoading ? "Validando código..." : "Verificar Codigo"}
                    </FormButton>
                  </View>
                  <View className="mx-10 flex-column items-center justify-center ">
                    {/* Did not receieve the code? */}
                    <Text>O código não chegou?</Text>
                    {/* Resend code*/}
                    <Text
                      className="underline"
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
};

export default ResetPassword;
