import { useEffect } from "react";
import { View, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import RegisterForm from "../../components/Login/RegisterForm";
import { SafeAreaView } from "react-native-safe-area-context";
import LogoBackButton from "../../components/Login/LogoBackButton";
import Text from "../../components/General/Text";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as StorageService from "../../services/storage-service";

export default function RegistrationScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const previousScreen = route.params?.previousScreen || "WelcomeStack";

  const checkLoginToken = async () => {
    try {
      const isValid = await StorageService.isLoginTokenValid();
      if (isValid) {
        navigation.navigate("HomeStack");
      }
    } catch (error) {
      console.log("Failed to fetch the login token from storage");
    }
  };

  useEffect(() => {
    checkLoginToken();
  }, []);

  return (
    <SafeAreaView className="flex-1 justify-start bg-secondary">
      <KeyboardAwareScrollView
        className="flex-1"
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <View className="mt-10">
              <LogoBackButton navigationPlace={previousScreen} />
            </View>
            <View className="mx-6">
              <View className="mt-8">
                <RegisterForm />
              </View>
              <View className="flex-row items-end justify-center">
                <Text className="text-lg leading-5 text-projectBlack">
                  {/* Already have an account? */}
                  Já possui conta?
                </Text>
                <Text
                  testId={"loginNav"}
                  className={
                    "left-1 text-lg leading-5 text-profileCircle underline"
                  }
                  onPress={() =>
                    navigation.navigate("Login", { previousScreen: "Register" })
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
}
