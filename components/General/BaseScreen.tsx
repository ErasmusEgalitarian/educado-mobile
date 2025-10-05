import { View } from "react-native";
import { AlertNotificationRoot } from "react-native-alert-notification";
import PropTypes from "prop-types";

/**
 * Reusable screen component to provide consistent layout and styling.
 * @param {JSX.Element} children - The child components to render inside the screen.
 * @returns {JSX.Element} The BaseScreen component.
 */
export default function BaseScreen({ children }) {
  BaseScreen.propTypes = {
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  };

  return (
    <AlertNotificationRoot>
      <View className="flex-1 bg-secondary">{children}</View>
    </AlertNotificationRoot>
  );
}
