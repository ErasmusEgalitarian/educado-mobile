import { useEffect } from "react";
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RegisterForm } from "@/components/Login/RegisterForm";
import { SafeAreaView } from "react-native-safe-area-context";
import { LogoBackButton } from "@/components/Login/LogoBackButton";
import * as StorageService from "@/services/storage-service";
import { t } from "@/i18n";

const RegistrationScreen = () => {
  const navigation = useNavigation();

  const checkLoginToken = async () => {
    try {
      const isValid = await StorageService.isLoginTokenValid();
      if (isValid) {
        // @ts-expect-error incorrect type 'never'
        navigation.navigate("Login");
      }
    } catch (error: unknown) {
      const tokenError: string = error as string;
      console.log(
        "Failed to fetch the login token from storage\n" + tokenError,
      );
    }
  };

  useEffect(() => {
    void checkLoginToken();
    // eslint-disable-next-line
  }, []);

  return (
    <SafeAreaView className="flex-1 justify-start bg-surfaceSubtleCyan">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        className="flex-1"
      >
        <ScrollView keyboardShouldPersistTaps="handled" className="flex-1">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <View className="mt-10">
                <LogoBackButton navigationPlace={"Login"} />
              </View>
              <View className="mx-6">
                <View className="mt-8">
                  <RegisterForm />
                </View>
                <View className="mt-2 flex-row items-end justify-center">
                  <Text className="text-textBodyGrayscale text-h4-sm-regular">
                    {t("login.existing-account")}
                  </Text>
                  <Text
                    className={
                      "left-1 text-textCaptionGrayscale underline text-h4-sm-regular"
                    }
                    onPress={() => {
                      // @ts-expect-error incorrect type 'never'
                      navigation.navigate("Login", {
                        previousScreen: "Register",
                      });
                    }}
                  >
                    {t("login.login-now")}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegistrationScreen;
