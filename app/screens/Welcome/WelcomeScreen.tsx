import { View, Image, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackgroundLinearGradient } from "@/constants/BackgroundLinearGradient";
import WelcomeSlider from "@/components/Welcome/WelcomeSlider";
import { useNavigation } from "@react-navigation/native";
import { FormButton } from "@/components/General/Forms/FormButton";
import logo from "@/assets/images/logo.png";

/**
 * This is the welcome screen shown when the user opens the app for the first time. It is a slider that explains the app
 * and its features. It also has a button to login and a button to register. When the user clicks on the login-button,
 * it is redirected to the login screen. When the user clicks on the register button, it is redirected to the register
 * screen.
 */
const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <BackgroundLinearGradient>
      <SafeAreaView>
        <View className="flex flex-col items-center justify-center">
          <View className="mb-[20%] flex pt-[30%]">
            <Image source={logo} className="h-[25.54] w-[175.88]" />
          </View>

          <View className="mb-[15%] flex w-screen flex-row items-center justify-center">
            <WelcomeSlider />
          </View>

          <View className="justify-around">
            <View className="w-screen px-6">
              <FormButton
                onPress={() => {
                  navigation.navigate(
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    "LoginStack",
                    { screen: "Login" },
                    { previousScreen: "Welcome" },
                  );
                }}
              >
                Entrar
              </FormButton>
            </View>

            <View className="flex-row justify-center">
              <Text
                className={
                  "text-textSubtitleGrayscale underline text-h4-sm-bold"
                }
                onPress={() => {
                  navigation.navigate(
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    "LoginStack",
                    { screen: "Register" },
                    { previousScreen: "Welcome" },
                  );
                }}
              >
                {/* Register */}
                Cadastrar
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </BackgroundLinearGradient>
  );
};

export default WelcomeScreen;
