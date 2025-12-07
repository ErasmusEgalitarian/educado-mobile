import { useState } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FormTextField } from "@/components/General/Forms/FormTextField";
import { FormButton } from "@/components/General/Forms/FormButton";
import { ResetPassword } from "@/components/Login/ResetPassword";
import { FormFieldAlert } from "@/components/General/Forms/FormFieldAlert";
import { removeEmojis } from "@/components/General/validation";
import ShowAlert from "@/components/General/ShowAlert";
import { isAxiosError } from "axios";
import { toApiError } from "@/api/legacy-api";
import { useLoginStrapi } from "@/hooks/query";
import { t } from "@/i18n";

/**
 * Login form component for the login screen containing email and password input fields and a login button.
 */
const LoginForm = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordAlert, setPasswordAlert] = useState("");
  const [emailAlert, setEmailAlert] = useState("");

  const strapiLoginQuery = useLoginStrapi();

  const login = async () => {
    setEmailAlert("");
    setPasswordAlert("");

    try {
      await strapiLoginQuery.mutateAsync({ email, password });
    } catch (error) {
      if (!isAxiosError(error)) {
        throw error;
      }

      const apiError = toApiError(error);

      switch (apiError.code) {
        case "E0004":
          setEmailAlert(t("login.enter-valid-email"));
          break;
        case "E0105":
          setPasswordAlert(t("login.incorrect-password"));
          break;
        case "E0003":
          // Error connecting to server
          ShowAlert(t("general.error-server"));
          break;
        default:
          // TODO: What error should we give here instead? Unknown error?
          ShowAlert(t("general.error-unknown"));
      }

      return;
    }

    // @ts-expect-error This will be fixed when we move to Expo Router
    navigation.navigate("HomeStack");
  };

  // Function to close the reset password modal
  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View>
      <View className="mb-1">
        <FormTextField
          placeholder={t("login.enter-email")}
          onChangeText={(email: string) => {
            setEmail(email);
          }}
          label={t("general.email")}
          required={false}
          keyboardType="email-address"
          bordered={true}
          error={emailAlert !== ""}
        />
        <FormFieldAlert success={emailAlert === ""} label={emailAlert} />
      </View>

      <View className="relative mb-5">
        <FormTextField
          placeholder={t("login.enter-password")}
          value={password}
          onChangeText={(inputPassword) => {
            setPassword(removeEmojis(inputPassword));
          }}
          label={t("general.password")}
          required={false}
          bordered={true}
          error={passwordAlert !== ""}
          showPasswordEye={true}
        />
        <FormFieldAlert success={passwordAlert === ""} label={passwordAlert} />
      </View>

      <View className="mb-20 flex-row justify-end">
        <Text
          className="text-textSubtitleGrayscale underline text-h4-sm-regular"
          onPress={() => {
            setModalVisible(true);
          }}
        >
          {t("login.reset-password")}
        </Text>
      </View>
      <FormButton
        onPress={() => {
          void login();
        }}
        disabled={!(password.length > 0 && email.length > 0)}
      >
        {t("general.enter")}
      </FormButton>
      <View className="">
        <ResetPassword modalVisible={modalVisible} onModalClose={closeModal} />
      </View>
    </View>
  );
};

export default LoginForm;
