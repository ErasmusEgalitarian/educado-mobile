import { Pressable, View } from "react-native";
import EducadoLogo from "../Images/EducadoLogo";
import PropTypes from "prop-types";
import { useNavigation } from "@react-navigation/native";

/**
 * Component that includes, logo, title and backbutton, used in login and register screens
 * @param {Object} props Should contain the following properties:
 * - navigationPlace: String
 * @returns {React.Element} Header/logo/back button component

 */
export default function LogoBackButton(props) {
  const navigation = useNavigation();
  return (
    <Pressable
      className="mt-4 w-full flex-row items-center justify-center"
      onPress={() => {
        props.navigationPlace
          ? navigation.navigate(props.navigationPlace)
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

LogoBackButton.propTypes = {
  navigationPlace: PropTypes.string,
};
