import { Pressable, View } from "react-native";
import EducadoLogo from "../Images/EducadoLogo";
import PropTypes from "prop-types";
import { useNavigation } from "@react-navigation/native";
import LeaveButton from "@/components/Exercise/LeaveButton";

/**
 * Component that includes, logo, title and backbutton, used in login and register screens
 * @returns {React.Element} Header/logo/back button component

 * @param navigationPlace - string
 */
export const LogoBackButton = ({ navigationPlace }: { navigationPlace?: string }) => {
  const navigation = useNavigation();
  return (
    <Pressable
      className="mt-4 w-full flex-row items-center justify-center"
      onPress={() => {
        navigationPlace
          ? navigation.navigate(navigationPlace)
          : navigation.navigate("Home");
      }}
    >
      {/* TODO: Implement with general back button instead */}
      <View className="absolute left-0 z-50"></View>
      {/* Educado logo */}
      <View className="w-full items-center justify-center">
        <EducadoLogo />
      </View>
    </Pressable>
  );
}
