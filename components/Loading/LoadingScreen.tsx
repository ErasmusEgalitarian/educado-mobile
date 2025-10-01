import { ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "../General/Text";
import tailwindConfig from "../../tailwind.config.js";

const LoadingScreen = () => {
  const logo = require("../../assets/images/logo.png");

  return (
    <SafeAreaView className="flex-1 items-center justify-center gap-10 bg-secondary px-6 py-10">
      <Image source={logo} />
      <Text className="text-center text-body text-projectBlack">
        Transformando conhecimento em liberdade
      </Text>
      <ActivityIndicator
        size={115}
        color={tailwindConfig.theme.colors.primary_custom}
      />
    </SafeAreaView>
  );
};

export default LoadingScreen;
