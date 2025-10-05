import { View } from "react-native";
import LeaveButton from "../Exercise/LeaveButton";
import EducadoLogo from "../Images/EducadoLogo";
import PropTypes from "prop-types";

/**
 * Component that includes, logo, title and backbutton, used in login and register screens
 * @param {Object} props Should contain the following properties:
 * - navigationPlace: String
 * @returns {React.Element} Header/logo/back button component

 */
export default function LogoBackButton(props) {
  return (
    <View className="mt-4 w-full flex-row items-center justify-center">
      {/* TODO: Implement with general back button instead */}
      <View className="absolute left-0 z-50">
        <LeaveButton
          navigationPlace={
            props.navigationPlace ? props.navigationPlace : "Home"
          }
        />
      </View>
      {/* Educado logo */}
      <View className="w-full items-center justify-center">
        <EducadoLogo />
      </View>
    </View>
  );
}

LogoBackButton.propTypes = {
  navigationPlace: PropTypes.string,
};
