import { View, TouchableOpacity, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { t } from "@/i18n";

export interface ContinueSectionButtonProps {
  onPress: () => void;
}

/**
 * Renders a button component for continuing a section.
 *
 * @param {Function} onPress - The function to be called when the button is pressed.
 */
export const ContinueSectionButton = ({
  onPress,
}: ContinueSectionButtonProps) => {
  return (
    <View className="h-[70] w-[100%] self-center">
      <TouchableOpacity
        className="flex w-[100%] bg-bgprimary_custom"
        style={{ borderRadius: 15 }}
        onPress={onPress}
      >
        <View className="flex-row items-center justify-center p-4">
          <Text className="mr-2 text-projectWhite text-body-bold">
            {t("course.start")}
          </Text>
          <MaterialCommunityIcons
            testID="play-circle-outline"
            name="play-circle-outline"
            size={20}
            color="white"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};
