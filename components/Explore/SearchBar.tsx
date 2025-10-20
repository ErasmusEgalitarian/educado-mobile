import { TextInput, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { t } from "@/i18n";

export interface SearchBarProps {
  searchText?: string;
  onSearchChange?: (text: string) => void;
  placeholder?: string;
}

/**
 * This component is used to display a search bar.
 * @param onSearchChange - Callback function called when the search text changes. It receives the updated search text as an argument.
 * @param placeholder - The placeholder text for the search bar.
 * @returns {JSX.Element} - Returns a JSX element.
 */
export const SearchBar = ({
  onSearchChange,
  placeholder = t("search-course"),
}: SearchBarProps) => {
  return (
    <View className="relative mb-2.5 flex-row items-center rounded-medium border-[1px] border-surfaceLighterCyan bg-surfaceSubtleGrayscale px-4">
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.textCaptionGrayscale}
        onChangeText={onSearchChange}
        className="pr-35 flex-1 py-1 text-textCaptionGrayscale text-label-sm-semibold"
      />
      <MaterialCommunityIcons
        name="magnify"
        size={20}
        color={colors.textSubtitleGrayscale}
      />
    </View>
  );
};
