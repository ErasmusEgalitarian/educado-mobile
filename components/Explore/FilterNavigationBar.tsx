import { useState } from "react";
import SearchBar from "@/components/Explore/SearchBar";
import { View, Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { categories } from "@/components/Explore/categories";
import colors from "@/theme/colors";
import Text from "@/components/General/Text";

/**
 * FilterNavBar component displays a search bar and a list of categories.
 * @param onChangeText - Callback function called when the text in the search bar changes.
 * @param onCategoryChange - Callback function called when a category is selected.
 * @returns {JSX.Element} - Rendered component
 */
type FilterNavigationBarProps = {
  onChangeText?: (text: string) => void;
  onCategoryChange?: (category: string) => void;
  searchPlaceholder?: string;
};

const FilterNavigationBar = ({
  onChangeText = () => {},
  onCategoryChange = () => {},
  searchPlaceholder,
}: FilterNavigationBarProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>("");

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  const handleSearchInputChange = (text: string) => {
    setSearchText(text);
    onChangeText(text);
  };

  const getCatagoryItemStyle = (isSelected: boolean) => ({
    backgroundColor: isSelected
      ? colors.borderDarkerCyan
      : colors.surfaceSubtleCyan,
    borderColor: isSelected
      ? colors.borderDarkerCyan
      : colors.borderDefaultGrayscale,
  });

  const getCategoryTextStyle = (isSelected: boolean) => ({
    color: isSelected
      ? colors.textNegativeGrayscale
      : colors.textCaptionGrayscale,
  });

  return (
    <View>
      <View className="z-10 p-2">
        <SearchBar
          searchText={searchText}
          onSearchChange={handleSearchInputChange}
          placeholder={searchPlaceholder}
        />
      </View>

      <View className="z-10 pb-4 pl-2 pr-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex items-center p-2">
            <View className="flex-row overflow-x-auto">
              {categories.map((category) => {
                const isSelected = selectedCategory === category.label;
                return (
                  <Pressable
                    key={category.label}
                    onPress={() => handleCategorySelect(category.label)}
                    className="mr-2 items-center justify-center rounded-lg border-[1px] border-projectGray px-2 py-2"
                    style={{ ...getCatagoryItemStyle(isSelected) }}
                  >
                    <Text
                      style={{ ...getCategoryTextStyle(isSelected) }}
                      className="font-sans-bold text-sm"
                    >
                      {category.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default FilterNavigationBar;
