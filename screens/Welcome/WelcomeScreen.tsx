import { View, TouchableOpacity, Image, SafeAreaView } from "react-native";
import { BackgroundLinearGradient } from "../../constants/BackgroundLinearGradient";
import WelcomeSlider from "../../components/Welcome/WelcomeSlider";
import Text from "../../components/General/Text";
import { useNavigation } from "@react-navigation/native";

/* 
Description: 	This is the welcome screen that is shown when the user opens the app for the first time.
				It is a slider that explains the app and its features. It also has a button to login and a button to register.
				When the user clicks on the login button, it is redirected to the login screen.
				When the user clicks on the register button, it is redirected to the register screen.
*/

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <BackgroundLinearGradient>
      <SafeAreaView>
        <View className="flex flex-col items-center justify-center">
          <View className="mb-[20%] flex pt-[30%]">
            <Image
              source={require("../../assets/images/logo.png")}
              className="h-[25.54] w-[175.88]"
            />
          </View>

          <View className="mb-[15%] flex w-screen flex-row items-center justify-center">
            <WelcomeSlider />
          </View>

          <View className="justify-around">
            <View className="w-screen px-6">
              {/* Replace with standard button */}
              <TouchableOpacity
                className="rounded-medium bg-primary_custom px-10 py-4"
                onPress={() => {
                  navigation.navigate(
                    "LoginStack",
                    { screen: "Register" },
                    { previousScreen: "Welcome" },
                  );
                }}
              >
                <Text className="font-sans-bold text-center text-body text-projectWhite">
                  Cadastrer
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-center">
              <Text className="mr-1 text-base text-projectGray">
                {/* Already have an account? */}
                Já tem uma conta?
              </Text>
              <Text
                testId="loginNav"
                className={"text-base text-projectBlack underline"}
                onPress={() =>
                  navigation.navigate("LoginStack", {
                    previousScreen: "Welcome",
                  })
                }
              >
                {/* Login now */}
                Entrar agora
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </BackgroundLinearGradient>
  );
}
