import { useState } from "react";
import { View, Keyboard, Text, TouchableWithoutFeedback } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import LoginForm from "@/components/Login/LoginForm";
import LogoBackButton from "@/components/Login/LogoBackButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LoadingScreen from "@/components/Loading/LoadingScreen";
import * as StorageService from "@/services/storage-service";

/**
 * Login screen component containing a login form and possibilities of resetting password or registering a new user.
 */
const Login = () => {
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  /**
   * TODO: Refactor error to use new error handling system
   * Function for checking if a login token is stored in async local storage (i.e. if the user is already logged in)
   * If a token is found, the user is redirected to the home screen.
   */
  const checkLoginToken = async () => {
    try {
      const isValid = await StorageService.isLoginTokenValid();
      if (isValid) {
        await StorageService.updateStoredCourses();
        await AsyncStorage.setItem("loggedIn", "true");
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        navigation.navigate("HomeStack");
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useFocusEffect(() => {
    void checkLoginToken();
  });

  return (
    <SafeAreaView className="flex-1 justify-start bg-surfaceSubtleCyan">
      {loading ? (
        <LoadingScreen />
      ) : (
        <KeyboardAwareScrollView
          className="flex-1"
          resetScrollToCoords={{ x: 0, y: 0 }}
          scrollEnabled={true}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <View className="mt-10">
                <LogoBackButton navigationPlace={"WelcomeStack"} />
              </View>
              <View className="mx-6">
                {/* Login form */}
                <View className="my-8">
                  <LoginForm />
                </View>
                {/* Register button */}
                <View className="flex-col items-center">
                  <Text className="mr-1 text-textSubtitleGrayscale text-h4-sm-regular">
                    {/* Dont have an account yet? */}
                    Ainda não tem conta?
                  </Text>
                  <Text
                    className={
                      "left-1 text-textTitleGrayscale underline text-h4-sm-regular"
                    }
                    onPress={() => {
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      navigation.navigate("Register", {
                        previousScreen: "Login",
                      });
                    }}
                  >
                    {/* Sign up now */}
                    Cadastre-se agora
                  </Text>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
      )}
    </SafeAreaView>
  );
};

export default Login;
