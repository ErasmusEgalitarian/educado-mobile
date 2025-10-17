import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import { colors } from "@/theme/colors";

interface CardLabelProps {
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color?: string;
  font?: string;
}

/**
 * This component is used to display a label in a course card.
 * @param title - The text of the label.
 * @param icon - The icon of the label.
 * @param color - The color of the label and icon.
 * @param font - Styling of font, such as size and weight.
 * @returns {JSX.Element} - Returns a JSX element.
 */
export const CardLabel = ({
  title,
  icon,
  color = colors.textCaptionGrayscale,
  font = "font-semibold text-s",
}: CardLabelProps) => {
  return (
    <View className="flex-row items-center justify-start">
      <MaterialCommunityIcons name={icon} size={12} color={color} />
      <Text className={`pl-1 ${font}`} style={{ color: color }}>
        {title}
      </Text>
    </View>
  );
};
