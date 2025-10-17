import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import colors from "@/theme/colors";
import Text from "@/components/General/Text";

interface CardLabelProps {
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color?: string;
}

/**
 * This component is used to display a label in a course card.
 * @param title - The text of the label.
 * @param icon - The icon of the label.
 * @param color - The color of the label and icon.
 * @returns {TSX.Element} - Returns a JSX element.
 */

export const CardLabel = ({
  title,
  icon,
  color = colors.textCaptionGrayscale,
}: CardLabelProps) => {
  return (
    <View className="flex-row items-center justify-start">
      <MaterialCommunityIcons name={icon} size={12} color={color} />
      <Text className="pl-1 font-sans-bold text-s" style={{ color: color }}>
        {title}
      </Text>
    </View>
  );
};
