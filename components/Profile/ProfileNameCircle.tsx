import { View } from "react-native";
import Text from "../General/Text";
import PropTypes from "prop-types";

/**
 * Component for showing an alert below a form field
 * @param {Object} props should contain the following properties:
 * - firstName: String
 * - lastName: String
 * @returns {React.Element} JSX element for showing alerts
 */
export default function ProfileNameCircle(props) {
  ProfileNameCircle.propTypes = {
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  };

  return (
    <View className="aspect-square grid h-24 w-24 items-center justify-center rounded-full bg-profileCircle">
      <Text className="bg-white mt-2 text-center text-5xl font-bold text-projectWhite">
        {props.firstName.charAt(0).toUpperCase()}
        {props.lastName.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}
