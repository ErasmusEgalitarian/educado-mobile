import { useState } from "react";
import { View, Keyboard } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import LoginForm from "@/components/Login/LoginForm";
import LogoBackButton from "@/components/Login/LogoBackButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableWithoutFeedback } from "react-native";
import Text from "@/components/General/Text";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LoadingScreen from "@/components/Loading/LoadingScreen";
import * as StorageService from "@/services/storage-service";
import { useFocusEffect } from "@react-navigation/native";

/**
 * Login screen component containing a login form and possibilities of resetting password or registering a new user.
 */
const Login = () => {
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();

  type LoginScreenRouteParams = {
    previousScreen?: string;
  };

  const route =
    useRoute<RouteProp<{ params: LoginScreenRouteParams }, "params">>();
  const previousScreen = route.params?.previousScreen || "WelcomeStack";

  /**
   * TODO: Refactor error to use new error handling system
   * Function for checking if a login token is stored in async local storage (i.e. if the user is already logged in)
   * If a token is found, the user is redirected to the home screen.
   *
   */
  const checkLoginToken = async () => {
    try {
      const isValid = await StorageService.isLoginTokenValid();
      if (isValid) {
        StorageService.updateStoredCourses();
        await AsyncStorage.setItem("loggedIn", "true");
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
    checkLoginToken();
  });

  return (
    <SafeAreaView className="flex-1 justify-start bg-secondary">
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
                <LogoBackButton navigationPlace={previousScreen} />
              </View>
              <View className="mx-6">
                {/* Login form */}
                <View className="my-8">
                  <LoginForm />
                </View>
                {/* Register button */}
                <View className="flex-col items-center">
                  <Text className="mr-1 text-lg text-textGrey">
                    {/* Dont have an account yet? */}
                    Ainda não tem conta?
                  </Text>
                  <Text
                    testID="registerNav"
                    className={"left-1 text-lg text-projectBlack underline"}
                    onPress={() =>
                      navigation.navigate("Register", {
                        previousScreen: "Login",
                      })
                    }
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
