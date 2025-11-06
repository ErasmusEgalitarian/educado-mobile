import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import { colors, NewColorNames } from "@/theme/colors";
import { TextClass } from "@/theme/typography";
import type { Icon } from "@/types";

export interface CardLabelProps {
  title: string;
  icon: Icon;
  color?: NewColorNames;
  font?: TextClass;
}

/**
 * This component is used to display a label in a course card.
 * @param title - The text of the label.
 * @param icon - The icon of the label.
 * @param color - The color of the label and icon.
 * @param font - Styling of font, such as size and weight.
 * @returns A JSX element.
 */
export const CardLabel = ({
  title,
  icon,
  color = "textCaptionGrayscale",
  font = "text-caption-sm-regular",
}: CardLabelProps) => {
  return (
    <View className="flex-row items-center justify-start">
      <MaterialCommunityIcons name={icon} size={12} color={colors[color]} />
      <Text className={`pl-1 ${font} text-${color}`}>{title}</Text>
    </View>
  );
};

//For legacy purposes in CertificateOverlay and CertificateCard
export default CardLabel;
