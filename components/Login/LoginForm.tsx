import { useState } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { loginUser } from "@/api/user-api";
import FormTextField from "@/components/General/Forms/FormTextField";
import FormButton from "@/components/General/Forms/FormButton";
import PasswordEye from "@/components/General/Forms/PasswordEye";
import ResetPassword from "@/components/Login/ResetPassword";
import FormFieldAlert from "@/components/General/Forms/FormFieldAlert";
import { removeEmojis } from "@/components/General/validation";
import ShowAlert from "@/components/General/ShowAlert";
import { UserInfo } from "@/types/user";

// Services
import { setUserInfo, setJWT } from "@/services/storage-service";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ApiError {
  error: {
    code: string;
    message?: string;
  };
}
/**
 * Login form component for login screen containing email and password input fields and a login button.
 */
const LoginForm = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordAlert, setPasswordAlert] = useState("");
  const [emailAlert, setEmailAlert] = useState("");
  // State variable to track password visibility
  const [showPassword, setShowPassword] = useState(false);

  const login = async (email: string, password: string): Promise<void> => {
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
      .then(async (response: {accessToken: string, userInfo: UserInfo}) => {
        // Set login token in AsyncStorage and navigate to home screen
        await setJWT(response.accessToken);
        await setUserInfo({ ...response.userInfo });
        await AsyncStorage.setItem("loggedIn", "true");
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        navigation.navigate("HomeStack");
      })
      .catch((error: unknown) => {
        const objectError = typeof error === "object" && error !== null && "error" in error;
        if (!(objectError)) {
          return;
        }
        const apiError = error as ApiError;
        switch (apiError.error.code) {
          case "E0004": //E0004
            // No user exists with this email!
            setEmailAlert("Insira um E-mail válido");
            break;

          case "E0105": //E0105
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
  };

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
          placeholder="Insira sua e-mail"
          onChangeText={(email: string) => {
            setEmail(email);
          }}
          label="E-mail"
          required={false}
          keyboardType="email-address"
          bordered={true}
          error={emailAlert !== ""}
        />
        <FormFieldAlert success={emailAlert === ""} label={emailAlert} />
      </View>

      <View className="relative">
        <FormTextField
          placeholder="Insira sua senha" // Type your password
          value={password}
          onChangeText={(inputPassword) => {
            setPassword(removeEmojis(inputPassword));
          }}
          label="Senha" // Password
          required={false}
          secureTextEntry={!showPassword}
          bordered={true}
          error={passwordAlert !== ""}
        />
        <PasswordEye
          showPasswordIcon={showPassword}
          toggleShowPassword={toggleShowPassword}
        />
        <FormFieldAlert success={passwordAlert === ""} label={passwordAlert} />
      </View>

      <View>
        <Text
          className={"text-textSubtitleGrayscale mb-20 text-right text-h4-sm-regular underline"}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          {/* reset your password? */}
          Esqueceu a senha?
        </Text>
      </View>
      {/* Enter */}
      <FormButton
        onPress={() => {
          void login(email, password);
        }}
        disabled={!(password.length > 0 && email.length > 0)}
      >
        Entrar
      </FormButton>
      <View className="">
        <ResetPassword
          modalVisible={modalVisible}
          onModalClose={closeModal}
          // Reset password
          title={"Redefinir senha"}
        />
      </View>
    </View>
  );
};

export default LoginForm;
