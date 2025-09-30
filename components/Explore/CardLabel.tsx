import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import PropTypes from "prop-types";

/**
 * This component is used to display a label in a course card.
 * @param title - The text of the label.
 * @param icon - The icon of the label.
 * @param color - The color of the label and icon.
 * @param time - Boolean value to determine to render the time label.
 * @returns {JSX.Element} - Returns a JSX element.
 */
const CardLabel = ({ title, icon, color = "gray" }) => {
  return (
    <View className="flex-row items-center justify-start">
      <MaterialCommunityIcons name={icon} size={13} color={color} />
      <Text className="pl-1 text-sm" style={{ color: color }}>
        {title}
      </Text>
    </View>
  );
};

CardLabel.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.string,
};

export default CardLabel;
