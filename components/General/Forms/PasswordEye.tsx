import { MaterialCommunityIcons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import { Pressable } from "react-native";

/**
 * Icon component for the eye besides passwords to toggle if text can be seen by user
 * @param {Object} props Should contain the following properties
 * - showPasswordIcon: Boolean
 * - toggleShowPassword: Function
 */
export default function PasswordEye(props) {
  return (
    <Pressable
      className="absolute right-0 top-9 p-3"
      onPress={props.toggleShowPassword}
    >
      <MaterialCommunityIcons
        name={props.showPasswordIcon ? "eye-off" : "eye"}
        size={24}
        color="gray"
      />
    </Pressable>
  );
}

PasswordEye.propTypes = {
  showPasswordIcon: PropTypes.bool,
  toggleShowPassword: PropTypes.func,
};
