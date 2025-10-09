import { useState } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { loginUser } from "../../api/user-api";
import FormTextField from "../General/Forms/FormTextField";
import FormButton from "../General/Forms/FormButton";
import PasswordEye from "../General/Forms/PasswordEye";
import ResetPassword from "./ResetPassword";
import FormFieldAlert from "../General/Forms/FormFieldAlert";
import { removeEmojis } from "../General/validation";
import Text from "../General/Text";
import ShowAlert from "../General/ShowAlert";

// Services
import { setUserInfo, setJWT } from "../../services/storage-service";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Login form component for login screen containing email and password input fields and a login button.
 * @returns {React.Element} Component for logging in (login screen)
 */
export default function LoginForm() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordAlert, setPasswordAlert] = useState("");
  const [emailAlert, setEmailAlert] = useState("");
  // State variable to track password visibility
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Logs user in with the entered credentials
   * @param {String} email Email user tries to login with
   * @param {String} password Password user tries to login with
   */
  async function login(email, password) {
    //Reset alerts
    setEmailAlert("");
    setPasswordAlert("");

    //The Object must be hashed before it is sent to backend (before loginUser() is called)
    //The Input must be conditioned (at least one capital letter, minimum 8 letters and a number etc.)
    const obj = {
      email: email,
      password: password,
    };

    // Await the response from the backend API for login
    await loginUser(obj)
      .then(async (response) => {
        // Set login token in AsyncStorage and navigate to home screen
        await setJWT(response.accessToken);
        await setUserInfo({ ...response.userInfo });
        await AsyncStorage.setItem("loggedIn", "true");
        navigation.navigate("HomeStack");
      })
      .catch((error) => {
        switch (error?.error?.code) {
          case "E0004":
            // No user exists with this email!
            setEmailAlert("Insira um E-mail válido");
            break;

          case "E0105":
            // Password is incorrect!
            setPasswordAlert("Senha incorreta. Por favor, tente novamente");
            break;

          case "E0003":
            // Error connecting to server!
            ShowAlert("Erro de conexão com o servidor!");
            break;

          // TODO: What error should we give here instead? Unknown error?
          default: // Errors not currently handled with specific alerts
            ShowAlert("Erro desconhecido!");
        }
      });
  }

  // Function to close the reset password modal
  const closeModal = () => {
    setModalVisible(false);
  };

  // Function to toggle the password visibility state
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View>
      <View className="mb-1">
        <FormTextField
          testId="emailInput"
          placeholder="Insira sua e-mail"
          onChangeText={(email) => setEmail(email)}
          label="E-mail"
          required={false}
          keyboardType="email-address"
          bordered={true}
          error={false}
        />
        <FormFieldAlert testId="emailAlert" label={emailAlert} />
      </View>

      <View className="relative">
        <FormTextField
          testId="passwordInput"
          placeholder="Insira sua senha" // Type your password
          value={password}
          onChangeText={(inputPassword) => {
            setPassword(removeEmojis(inputPassword, password));
          }}
          label="Senha" // Password
          required={false}
          secureTextEntry={!showPassword}
          bordered={true}
          error={false}
        />
        <PasswordEye
          testId="passwordEye"
          showPasswordIcon={showPassword}
          toggleShowPassword={toggleShowPassword}
        />
        <FormFieldAlert testId="passwordAlert" label={passwordAlert} />
      </View>

      <View>
        {/* TODO: tilføj onPress til nedenstående; reset password */}
        <Text
          className={"mb-20 text-right text-lg text-textGrey underline"}
          onPress={() => setModalVisible(true)}
        >
          {/* reset your password? */}
          Esqueceu a senha?
        </Text>
      </View>
      {/* Enter */}
      <FormButton
        testId="loginButton"
        onPress={() => login(email, password)}
        disabled={!(password.length > 0 && email.length > 0)}
        className="mt-4"
      >
        Entrar
      </FormButton>
      <View className="">
        <ResetPassword
          className={!modalVisible ? "hidden" : ""}
          modalVisible={modalVisible}
          onModalClose={closeModal}
          testId="resetPasswordModal"
          // Reset password
          title="Redefinir senha"
        />
      </View>
    </View>
  );
}
