import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable } from "react-native";

interface PasswordEyeProps {
  showPasswordIcon: boolean;
  toggleShowPassword: () => void;
}

/**
 * Icon component for the eye besides passwords to toggle if the user can see text.
 *
 * @param showPasswordIcon - Whether the password eye is open or closed.
 * @param toggleShowPassword - Toggles the password visibility.
 */
export const PasswordEye = ({
  showPasswordIcon,
  toggleShowPassword,
}: PasswordEyeProps) => {
  return (
    <Pressable onPress={toggleShowPassword}>
      <Ionicons
        name={showPasswordIcon ? "eye-off" : "eye"}
        size={24}
        color="gray"
      />
    </Pressable>
  );
};

export default PasswordEye;
