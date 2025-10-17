import { TextInput, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { colors } from "@/theme/colors";

interface SearchBarProps {
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
const SearchBar = ({
  onSearchChange = () => {},
  placeholder = "Buscar curso",
}: SearchBarProps) => {
  return (
    <View className="relative mb-2.5 flex-row items-center rounded-medium border-[1px] border-surfaceLighterCyan bg-surfaceSubtleGrayscale px-4">
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.textCaptionGrayscale}
        onChangeText={onSearchChange}
        className="pr-35 flex-1 py-1 font-semibold text-sm text-grayScale"
      />
      <MaterialCommunityIcons
        name="magnify"
        size={20}
        color={colors.textSubtitleGrayscale}
      />
    </View>
  );
};

export default SearchBar;
