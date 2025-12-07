import { View, Image, Text } from "react-native";
import { BackgroundLinearGradient } from "@/constants/BackgroundLinearGradient";
import { WelcomeSlider } from "@/components/Welcome/WelcomeSlider";
import { useNavigation } from "@react-navigation/native";
import { FormButton } from "@/components/General/Forms/FormButton";
import logo from "@/assets/images/logo.png";
import { t } from "@/i18n";

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
      <View>
        <View className="flex-col items-center pt-40">
          <Image source={logo} className="h-[25.54] w-[175.88]" />

          <View className="flex-row items-center pt-28">
            <WelcomeSlider />
          </View>

          <View className="w-screen px-6 pt-12">
            <FormButton
              onPress={() => {
                navigation.navigate(
                  // @ts-expect-error incorrect type 'never'
                  "LoginStack",
                  { screen: "Login" },
                  { previousScreen: "Welcome" },
                );
              }}
            >
              {t("general.enter")}
            </FormButton>

            <Text
              className={
                "self-center pt-6 text-textSubtitleGrayscale underline text-h4-sm-bold"
              }
              onPress={() => {
                navigation.navigate(
                  // @ts-expect-error incorrect type 'never'
                  "LoginStack",
                  { screen: "Register" },
                  { previousScreen: "Welcome" },
                );
              }}
            >
              {t("general.register")}
            </Text>
          </View>
        </View>
      </View>
    </BackgroundLinearGradient>
  );
};

export default WelcomeScreen;
