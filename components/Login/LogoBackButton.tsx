import { Pressable, View } from "react-native";
import EducadoLogo from "@/components/Images/EducadoLogo";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";

/**
 * Component that includes, logo, title and backbutton, used in login and register screens
 * @returns {React.Element} Header/logo/back button component
 * @param navigationPlace - string
 */

export const LogoBackButton = ({
  navigationPlace,
}: {
  navigationPlace?: string;
}) => {
  const navigation = useNavigation();
  return (
    <Pressable
      className="mt-4 w-full flex-row items-center justify-center pl-4"
      onPress={() => {
        if (navigationPlace) {
          // @ts-expect-error incorrect type 'never'
          navigation.navigate(navigationPlace);
        } else {
          // @ts-expect-error incorrect type 'never'
          navigation.navigate("Home");
        }
      }}
    >
      <View className="absolute left-4">
        <MaterialCommunityIcons
          name="chevron-left"
          size={24}
          color={colors.textTitleGrayscale}
        />
      </View>
      <View className="w-full items-center">
        <EducadoLogo />
      </View>
    </Pressable>
  );
};
