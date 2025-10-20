import { useEffect } from "react";
import { View, TouchableWithoutFeedback, Keyboard, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import RegisterForm from "@/components/Login/RegisterForm";
import { SafeAreaView } from "react-native-safe-area-context";
import LogoBackButton from "@/components/Login/LogoBackButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as StorageService from "@/services/storage-service";

const RegistrationScreen = () => {
  const navigation = useNavigation();


  const checkLoginToken = async () => {
    try {
      const isValid = await StorageService.isLoginTokenValid();
      if (isValid) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        navigation.navigate("HomeStack");
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
  }, []);


  return (
    <SafeAreaView className="flex-1 justify-start bg-surfaceSubtleCyan">
      <KeyboardAwareScrollView
        className="flex-1"
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <View className="mt-10">
              <LogoBackButton navigationPlace={"WelcomeScreen"} />
            </View>
            <View className="mx-6">
              <View className="mt-8">
                <RegisterForm />
              </View>
              <View className="flex-row items-end justify-center">
                <Text className="text-h4-sm-regular text-textBodyGrayscale">
                  {/* Already have an account? */}
                  Já possui conta?
                </Text>
                <Text
                  className={
                    "left-1 text-h4-sm-regular text-textCaptionGrayscale underline"
                  }
                  onPress={() => {
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      navigation.navigate("Login", { previousScreen: "Register", });
                    }
                  }
                >
                  {/* Log in now */}
                  Entre agora
                </Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default RegistrationScreen;
