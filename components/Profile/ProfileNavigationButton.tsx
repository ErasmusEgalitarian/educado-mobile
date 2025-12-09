import { View, TouchableOpacity, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";

export interface Props {
  label: string;
  onPress: () => void;
}

/**
 * Component for profile navigation buttons on profile page
 * @param {Object} props should contain the following properties:
 * - label: String
 * - onPress: Function
 * @returns {React.Element} JSX element
 */
export default function ProfileNavigationButton(props: Props) {
  return (
    <View>
      <TouchableOpacity
        className="w-full border-b border-textDisabledGrayscale py-7"
        onPress={props.onPress}
      >
        <View className="flex flex-row">
          <Text className="mt-0.5 flex-1 items-start text-body-regular">
            {props.label}
          </Text>
          <View className="items-end">
            <MaterialCommunityIcons
              size={25}
              name="chevron-right"
              color={colors.textTitleGrayscale}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
